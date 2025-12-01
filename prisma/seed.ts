import { PrismaClient, Prisma } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      first_name: 'Root',
      last_name: 'User',
      username: 'root',
      email: 'root@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
}

main();
