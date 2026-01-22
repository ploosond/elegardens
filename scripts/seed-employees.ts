import { getPayload } from 'payload';
import config from '@payload-config';
import { hasFlag, seedBatch } from './seed-utils';

import employees from '../data/employees.json';

async function run() {
  try {
    const payload = await getPayload({ config });

    const clear = hasFlag('clear');

    type EmployeeSeed = {
      first_name: string;
      last_name: string;
      email?: string | null;
      telephone?: string | null;
      role_en: string;
      role_de: string;
      department_en?: string;
      department_de?: string;
      [key: string]: unknown;
    };

    const { created, updated } = await seedBatch<EmployeeSeed>({
      payload,
      collection: 'employees',
      items: employees as EmployeeSeed[],
      uniqueField: 'last_name',
      label: (e: EmployeeSeed) =>
        `${e.first_name} ${e.last_name} (${e.role_en})`,
      transform: (e: EmployeeSeed) => ({
        ...e,
        email: e.email || undefined,
        telephone: e.telephone || undefined,
      }),
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
