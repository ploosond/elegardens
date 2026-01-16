import type { Payload } from "payload";
import type { Config } from "@/payload-types";

type CollectionSlug = keyof Config["collections"];

type UpsertResult = {
  created: number;
  updated: number;
};

export function hasFlag(name: string): boolean {
  const flag = `--${name}`;
  return (
    process.argv.includes(flag) ||
    process.env[`SEED_${name.toUpperCase()}`] === "true"
  );
}

export async function deleteAll(payload: Payload, collection: CollectionSlug) {
  const existing = await payload.find({ collection, limit: 1000 });
  if (existing.docs.length === 0) return 0;

  for (const doc of existing.docs) {
    const id = (doc as { id: string | number }).id;
    await payload.delete({ collection, id });
  }
  return existing.docs.length;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
export async function upsertByUnique<T extends Record<string, unknown>>(
  payload: Payload,
  collection: CollectionSlug,
  uniqueField: keyof T & string,
  item: T,
): Promise<"created" | "updated"> {
  const uniqueValue = item[uniqueField];
  if (!uniqueValue) {
    throw new Error(`Missing required unique field '${uniqueField}'`);
  }

  const existing = await payload.find({
    collection,
    limit: 1,
    where: {
      [uniqueField]: { equals: uniqueValue as unknown },
    },
  });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as { id: string | number };
    await payload.update({
      collection,
      id: doc.id,
      data: item as Record<string, unknown>,
    });
    return "updated";
  } else {
    await payload.create({ collection, data: item as Record<string, unknown> });
    return "created";
  }
}

export async function seedBatch<T extends Record<string, unknown>>({
  payload,
  collection,
  items,
  uniqueField,
  label,
  transform,
  clear,
}: {
  payload: Payload;
  collection: CollectionSlug;
  items: T[];
  uniqueField: keyof T & string;
  label?: (item: T) => string;
  transform?: (item: T) => T;
  clear?: boolean;
}): Promise<UpsertResult> {
  const result: UpsertResult = { created: 0, updated: 0 };

  if (clear) {
    console.log(`🗑️  Clearing existing ${collection}...`);
    const deleted = await deleteAll(payload, collection);
    console.log(`✅ Deleted ${deleted} existing ${collection}`);
  }

  console.log(`\n🌱 Seeding ${items.length} ${collection}...`);

  for (const item of items) {
    const data = transform ? transform(item) : item;
    const name = label ? label(item) : String(item[uniqueField]);

    try {
      const status = await upsertByUnique(
        payload,
        collection,
        uniqueField,
        data,
      );
      if (status === "created") {
        result.created++;
        console.log(`➕ Created: ${name}`);
      } else {
        result.updated++;
        console.log(`♻️  Updated: ${name}`);
      }
    } catch (error: unknown) {
      console.error(`\n❌ Failed to upsert ${collection.slice(0, -1)}:`);
      console.error(`   ${uniqueField}: ${String(item[uniqueField])}`);
      console.error(`   Label: ${name}`);
      console.error(`   Error: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  return result;
}
