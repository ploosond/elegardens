import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/schemas/registerSchema';
import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const { first_name, last_name, username, email, password } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    // Check for existing user
    if (existingUser) {
      return errorResponse('Username or email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admins user
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        username,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      'User registered successfully',
      {
        user: userWithoutPassword,
      },
      201
    );
  } catch (error) {
    console.error('Registration error: ', error);
    return errorResponse('Something went wrong during registration', 500);
  }
}
