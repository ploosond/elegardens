import { PrismaClient, Prisma } from '@/app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function main() {
  const hashedPassword = await bcrypt.hash('password', 10);

  await prisma.user.create({
    data: {
      first_name: 'Admin',
      last_name: 'User',
      username: 'adminuser',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
}

main();
