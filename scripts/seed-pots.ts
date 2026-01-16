import { getPayload } from "payload";
import config from "@payload-config";
import { hasFlag, seedBatch } from "./seed-utils";

import pots from "../data/pots.json";

async function run() {
  try {
    const payload = await getPayload({ config });

    const clear = hasFlag("clear");

    type PotSeed = {
      potId: string;
      name: string;
      availability?: "available" | "out-of-stock";
      [key: string]: unknown;
    };

    const randomAvailability = (): "available" | "out-of-stock" =>
      Math.random() < 0.5 ? "available" : "out-of-stock";

    const { created, updated } = await seedBatch<PotSeed>({
      payload,
      collection: "pots",
      items: pots as PotSeed[],
      uniqueField: "potId",
      label: (p: PotSeed) => `${p.name} (${p.potId})`,
      transform: (p: PotSeed) => ({
        ...p,
        availability: randomAvailability(),
      }),
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
