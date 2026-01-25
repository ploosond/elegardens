import { getPayload } from "payload";
import config from "@payload-config";
import { hasFlag, seedBatch } from "./seed-utils";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";

import products from "../data/products.json";

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
    return undefined; // Silently skip if image doesn't exist
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
    return mediaId;
  } catch (error) {
    console.error(`   ❌ Failed to upload image ${fullPath}:`, error);
    return undefined;
  }
}

function findImagePathForSlug(slug: string): string | undefined {
  const basePath = path.join(projectRoot, "public/seed-images/products");
  
  // Try different extensions (jpg, JPG, png, PNG)
  const extensions = [".jpg", ".JPG", ".png", ".PNG"];
  
  for (const ext of extensions) {
    const imagePath = path.join(basePath, `${slug}${ext}`);
    if (existsSync(imagePath)) {
      // Return relative path from project root
      return `public/seed-images/products/${slug}${ext}`;
    }
  }
  
  return undefined;
}

async function run() {
  try {
    const payload = await getPayload({ config });

    const clear = hasFlag("clear");

    // Clear only product-related media when using --clear
    if (clear) {
      console.log("🗑️  Clearing product-related media...");
      // Get all existing products to find their image IDs
      const existingProducts = await payload.find({ collection: "products", limit: 1000 });
      const imageIds = new Set<number>();
      
      for (const product of existingProducts.docs) {
        const prodData = product as { images?: number | number[] | null };
        if (prodData.images) {
          const ids = Array.isArray(prodData.images) ? prodData.images : [prodData.images];
          ids.forEach((id) => {
            if (typeof id === "number") imageIds.add(id);
          });
        }
      }

      // Delete only media files used by products
      let deletedCount = 0;
      for (const imageId of imageIds) {
        try {
          await payload.delete({ collection: "media", id: imageId });
          deletedCount++;
        } catch (error) {
          // Media might already be deleted or not exist
        }
      }
      console.log(`✅ Deleted ${deletedCount} product-related media entries`);
    }

    type ProductSeed = {
      productId: string;
      slug: string;
      availability?: "available" | "out-of-stock";
      [key: string]: unknown;
    };

    const { created, updated } = await seedBatch<ProductSeed>({
      payload,
      collection: "products",
      items: products as ProductSeed[],
      uniqueField: "productId",
      label: (p: ProductSeed) => `${p.slug} (${p.productId})`,
      transform: async (p: ProductSeed) => {
        // Find image path based on slug
        const imagePath = findImagePathForSlug(p.slug);
        
        // Upload image if found
        const imageId = imagePath
          ? await uploadImageIfExists(payload, imagePath)
          : undefined;

        return {
          ...p,
          // Use availability from JSON file, default to "available" if not specified
          availability: p.availability || "available",
          // Add image to images array (products support multiple images, but we'll add one for now)
          images: imageId ? [imageId] : undefined,
        };
      },
      clear,
    });

    console.log(
      `\n✅ Products seeded. Created: ${created}, Updated: ${updated}`,
    );
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
