import { getPayload } from 'payload';
import config from '@payload-config';
import { hasFlag } from './seed-utils';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';

// Import exported global data
import announcementBannerData from '../data/globals-announcement-banner.json';
import aboutData from '../data/globals-about.json';
import privacyPolicyData from '../data/globals-privacy-policy.json';
import imprintData from '../data/imprint.json';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');

async function uploadImageIfExists(
  payload: Awaited<ReturnType<typeof getPayload>>,
  imagePath: string | undefined,
): Promise<number | undefined> {
  if (!imagePath) return undefined;

  // Resolve the image path relative to project root
  const fullPath = path.isAbsolute(imagePath)
    ? imagePath
    : path.join(projectRoot, imagePath);

  if (!existsSync(fullPath)) {
    console.warn(`⚠️  Image not found: ${fullPath}`);
    return undefined;
  }

  try {
    // Check if media already exists with this filename
    const filename = path.basename(fullPath);
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      const mediaId = (existing.docs[0] as { id: string | number }).id;
      const id = typeof mediaId === 'number' ? mediaId : Number(mediaId);
      console.log(`   📷 Using existing media: ${filename} (ID: ${id})`);
      return id;
    }

    // Read file buffer
    const fileBuffer = readFileSync(fullPath);
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeType =
      ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'png'
          ? 'image/png'
          : `image/${ext}`;

    // Upload to Payload media collection
    const media = await payload.create({
      collection: 'media',
      data: {},
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: filename,
        size: fileBuffer.length,
      },
    });

    const mediaId = typeof media.id === 'number' ? media.id : Number(media.id);
    console.log(`   📷 Uploaded image: ${filename} (ID: ${mediaId})`);
    return mediaId;
  } catch (error) {
    console.error(`   ❌ Failed to upload image ${fullPath}:`, error);
    return undefined;
  }
}

async function run() {
  try {
    const payload = await getPayload({ config });

    const clear = hasFlag('clear');

    // Clear only global-related media when using --clear (About global images)
    if (clear) {
      console.log('🗑️  Clearing global-related media...');
      // Get the About global to find image IDs
      try {
        const aboutGlobal = await payload.findGlobal({ slug: 'about' });
        const imageIds = new Set<number>();

        const aboutData = aboutGlobal as {
          milestones?: Array<{ image?: number | null }>;
          ceo_image?: number | null;
        };

        // Collect milestone image IDs
        if (aboutData.milestones) {
          for (const milestone of aboutData.milestones) {
            if (milestone.image && typeof milestone.image === 'number') {
              imageIds.add(milestone.image);
            }
          }
        }

        // Collect CEO image ID
        if (aboutData.ceo_image && typeof aboutData.ceo_image === 'number') {
          imageIds.add(aboutData.ceo_image);
        }

        // Delete only media files used by globals
        let deletedCount = 0;
        for (const imageId of imageIds) {
          try {
            await payload.delete({ collection: 'media', id: imageId });
            deletedCount++;
          } catch (error) {
            // Media might already be deleted or not exist
          }
        }
        console.log(`✅ Deleted ${deletedCount} global-related media entries`);
      } catch (error) {
        // Global might not exist yet
        console.log('   ℹ️  No existing global data found to clear');
      }
    }

    console.log('\n🌱 Seeding globals...\n');

    // Seed AnnouncementBanner
    try {
      // Remove IDs from announcements (they're database IDs, not needed for seeding)
      const announcements = announcementBannerData.announcements.map(
        ({ id, ...rest }) => rest,
      );

      await payload.updateGlobal({
        slug: 'announcement-banner',
        data: {
          enabled: announcementBannerData.enabled,
          announcements,
          backgroundColor: announcementBannerData.backgroundColor,
          textColor: announcementBannerData.textColor,
          fontWeight: announcementBannerData.fontWeight as
            | 'semibold'
            | 'bold'
            | 'extrabold',
          showOnDesktop: announcementBannerData.showOnDesktop,
          showOnMobile: announcementBannerData.showOnMobile,
          speed: announcementBannerData.speed as 'slow' | 'medium' | 'fast',
        } as Record<string, unknown>,
      });
      console.log('✅ Updated: Announcement Banner');
    } catch (error) {
      console.error('❌ Failed to seed Announcement Banner:', error);
    }

    // Seed About
    try {
      console.log('   Uploading milestone images...');
      // Upload images for milestones using imagePath from JSON
      const milestonesWithImages = await Promise.all(
        aboutData.milestones.map(async (milestone) => {
          const milestoneWithPath = milestone as typeof milestone & {
            imagePath?: string;
          };
          const imageId = await uploadImageIfExists(
            payload,
            milestoneWithPath.imagePath,
          );

          // Remove ID and imagePath (database ID and seed-only field)
          const { id, imagePath, ...rest } = milestoneWithPath;
          return {
            ...rest,
            image: imageId || undefined,
          };
        }),
      );

      console.log('   Uploading CEO image...');
      const aboutDataWithImagePath = aboutData as typeof aboutData & {
        ceo_imagePath?: string;
      };
      const ceoImageId = await uploadImageIfExists(
        payload,
        aboutDataWithImagePath.ceo_imagePath,
      );

      await payload.updateGlobal({
        slug: 'about',
        data: {
          roots_title_en: aboutData.roots_title_en,
          roots_title_de: aboutData.roots_title_de,
          roots_intro_en: aboutData.roots_intro_en,
          roots_intro_de: aboutData.roots_intro_de,
          roots_signature_en: aboutData.roots_signature_en,
          roots_signature_de: aboutData.roots_signature_de,
          milestones_title_en: aboutData.milestones_title_en,
          milestones_title_de: aboutData.milestones_title_de,
          milestones: milestonesWithImages,
          our_story_title_en: aboutData.our_story_title_en,
          our_story_title_de: aboutData.our_story_title_de,
          ceo_title_en: aboutData.ceo_title_en,
          ceo_title_de: aboutData.ceo_title_de,
          ceo_desc_en: aboutData.ceo_desc_en,
          ceo_desc_de: aboutData.ceo_desc_de,
          ceo_image: ceoImageId || undefined,
          mission_title_en: aboutData.mission_title_en,
          mission_title_de: aboutData.mission_title_de,
          mission_desc_en: aboutData.mission_desc_en,
          mission_desc_de: aboutData.mission_desc_de,
          vision_title_en: aboutData.vision_title_en,
          vision_title_de: aboutData.vision_title_de,
          vision_desc_en: aboutData.vision_desc_en,
          vision_desc_de: aboutData.vision_desc_de,
          values_title_en: aboutData.values_title_en,
          values_title_de: aboutData.values_title_de,
          values_desc_en: aboutData.values_desc_en,
          values_desc_de: aboutData.values_desc_de,
        } as Record<string, unknown>,
      });
      console.log('✅ Updated: About Page');
    } catch (error) {
      console.error('❌ Failed to seed About Page:', error);
    }

    // Seed PrivacyPolicy
    try {
      // Remove IDs from sections (they're database IDs, not needed for seeding)
      // Rich text content is preserved as-is (Lexical format)
      const sections = privacyPolicyData.sections.map(
        ({ id, ...rest }) => rest,
      );

      await payload.updateGlobal({
        slug: 'privacy-policy',
        data: {
          sections: sections as Record<string, unknown>[],
        },
      });
      console.log('✅ Updated: Privacy Policy');
    } catch (error) {
      console.error('❌ Failed to seed Privacy Policy:', error);
    }

    // Seed Imprint (Impressum)
    try {
      const sections = (
        imprintData.sections as Array<Record<string, unknown>>
      ).map((section) => {
        const { id, ...rest } = section;
        return rest;
      });

      await payload.updateGlobal({
        slug: 'imprint',
        data: {
          sections: sections as Record<string, unknown>[],
        },
      });
      console.log('✅ Updated: Imprint (Impressum)');
    } catch (error) {
      console.error('❌ Failed to seed Imprint (Impressum):', error);
    }

    console.log('\n✅ Globals seeded successfully!');
    console.log('📝 All globals have been seeded with your current content.');
  } catch (error: unknown) {
    console.error('Error details:');
    try {
      console.error(JSON.stringify(error, null, 2));
    } catch {
      console.error(String(error));
    }
    process.exit(1);
  }

  process.exit(0);
}

await run();
