import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username is required and must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password is required and must be at least 8 characters long'),
});
