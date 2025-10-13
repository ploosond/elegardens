import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@/lib/schemas/loginSchema';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    // 1. Validate input
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const { username, password } = result.data;

    // 2. Find user by username
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // 3. Check if user exists and is admin
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Admin access required', 401);
    }

    // 4. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse('Invalid credentials', 401);
    }

    // TODO : look if we can do this differently
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || typeof jwtSecret !== 'string') {
      return errorResponse('JWT secret is not configured on the server', 500);
    }

    // Create JWT token for authenticated user
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse('Login successful', {
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error: ', error);
    return errorResponse('Something went wrong during login', 500);
  }
}
