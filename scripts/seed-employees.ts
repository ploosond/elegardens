import { getPayload } from 'payload';
import config from '@payload-config';
import { hasFlag, seedBatch } from './seed-utils';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';

import employees from '../data/employees.json';

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
    const mimeType = ext === 'jpg' || ext === 'jpeg' 
      ? 'image/jpeg' 
      : `image/${ext}`;

    // Upload to Payload Media collection using Payload v3 format
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

    // Clear only employee-related media when using --clear
    if (clear) {
      console.log('🗑️  Clearing employee-related media...');
      // Get all existing employees to find their profile picture IDs
      const existingEmployees = await payload.find({ collection: 'employees', limit: 1000 });
      const imageIds = new Set<number>();
      
      for (const employee of existingEmployees.docs) {
        const empData = employee as { profilePicture?: number | null };
        if (empData.profilePicture && typeof empData.profilePicture === 'number') {
          imageIds.add(empData.profilePicture);
        }
      }

      // Delete only media files used by employees
      let deletedCount = 0;
      for (const imageId of imageIds) {
        try {
          await payload.delete({ collection: 'media', id: imageId });
          deletedCount++;
        } catch (error) {
          // Media might already be deleted or not exist
        }
      }
      console.log(`✅ Deleted ${deletedCount} employee-related media entries`);
    }

    type EmployeeSeed = {
      first_name: string;
      last_name: string;
      email?: string | null;
      telephone?: string | null;
      role_en: string;
      role_de: string;
      department_en?: string;
      department_de?: string;
      imagePath?: string;
      [key: string]: unknown;
    };

    const { created, updated } = await seedBatch<EmployeeSeed>({
      payload,
      collection: 'employees',
      items: employees as EmployeeSeed[],
      uniqueField: 'last_name',
      label: (e: EmployeeSeed) =>
        `${e.first_name} ${e.last_name} (${e.role_en})`,
      transform: async (e: EmployeeSeed) => {
        // Upload profile picture if imagePath exists
        const profilePictureId = await uploadImageIfExists(
          payload,
          e.imagePath as string | undefined,
        );

        return {
          ...e,
          email: e.email || undefined,
          telephone: e.telephone || undefined,
          profilePicture: profilePictureId || undefined,
          // Remove imagePath from final data as it's not a field in the collection
          imagePath: undefined,
        };
      },
      clear,
    });

    console.log(
      `\n✅ Employees seeded. Created: ${created}, Updated: ${updated}`,
    );
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
