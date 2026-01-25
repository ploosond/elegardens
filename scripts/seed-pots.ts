import { getPayload } from "payload";
import config from "@payload-config";
import { hasFlag, seedBatch } from "./seed-utils";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

import pots from "../data/pots.json";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, "..");

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
      collection: "media",
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      const mediaId = (existing.docs[0] as { id: string | number }).id;
      const id = typeof mediaId === "number" ? mediaId : Number(mediaId);
      console.log(`   📷 Using existing media: ${filename} (ID: ${id})`);
      return id;
    }

    // Read file buffer
    const fileBuffer = readFileSync(fullPath);
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeType =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "png"
          ? "image/png"
          : `image/${ext}`;

    // Upload to Payload Media collection using Payload v3 format
    const media = await payload.create({
      collection: "media",
      data: {},
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: filename,
        size: fileBuffer.length,
      },
    });

    const mediaId = typeof media.id === "number" ? media.id : Number(media.id);
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

    const clear = hasFlag("clear");

    // Clear only pot-related media when using --clear
    if (clear) {
      console.log("🗑️  Clearing pot-related media...");
      // Get all existing pots to find their image IDs
      const existingPots = await payload.find({ collection: "pots", limit: 1000 });
      const imageIds = new Set<number>();
      
      for (const pot of existingPots.docs) {
        const potData = pot as { images?: number | number[] | null };
        if (potData.images) {
          const ids = Array.isArray(potData.images) ? potData.images : [potData.images];
          ids.forEach((id) => {
            if (typeof id === "number") imageIds.add(id);
          });
        }
      }

      // Delete only media files used by pots
      let deletedCount = 0;
      for (const imageId of imageIds) {
        try {
          await payload.delete({ collection: "media", id: imageId });
          deletedCount++;
        } catch (error) {
          // Media might already be deleted or not exist
        }
      }
      console.log(`✅ Deleted ${deletedCount} pot-related media entries`);
    }

    type PotSeed = {
      potId: string;
      name: string;
      availability?: "available" | "out-of-stock";
      imagePath?: string;
      [key: string]: unknown;
    };

    const { created, updated } = await seedBatch<PotSeed>({
      payload,
      collection: "pots",
      items: pots as PotSeed[],
      uniqueField: "potId",
      label: (p: PotSeed) => `${p.name} (${p.potId})`,
      transform: async (p: PotSeed) => {
        // Upload image if imagePath exists
        const imageId = await uploadImageIfExists(
          payload,
          p.imagePath as string | undefined,
        );

        return {
          ...p,
          // Use availability from JSON file, default to "available" if not specified
          availability: p.availability || "available",
          // Add image to images array (pots now support multiple images)
          images: imageId ? [imageId] : undefined,
          // Remove imagePath from final data as it's not a field in the collection
          imagePath: undefined,
        };
      },
      clear,
    });

    console.log(`\n✅ Pots seeded. Created: ${created}, Updated: ${updated}`);
  } catch (error: unknown) {
    console.error("Error details:");
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
