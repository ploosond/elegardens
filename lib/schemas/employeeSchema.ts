import { z } from 'zod';

const roleSchema = z.object({
  en: z.string().trim().min(1, 'English role is required'),
  de: z.string().trim().min(1, 'German role is required'),
});

const departmentSchema = z.object({
  en: z.string().trim().min(1, 'English department is required'),
  de: z.string().trim().min(1, 'German department is required'),
});

const profilePictureSchema = z.object({
  url: z.string().url('Valid image URL is required'),
  public_id: z.string().trim().min(1, 'Public ID is required'),
  altText: z.string().trim().min(1, 'Alt text is required'),
});

export const createEmployeeSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Valid email is required').optional(),
  role: roleSchema,
  department: departmentSchema,
  telephone: z.string().trim().min(1, 'Telephone is required').optional(),
  profilePicture: profilePictureSchema.optional(),
});

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').optional(),
  last_name: z.string().trim().min(1, 'Last name is required').optional(),
  email: z.email('Valid email is required').optional(),
  role: roleSchema.optional(),
  department: departmentSchema.optional(),
  telephone: z.string().trim().min(1, 'Telephone is required').optional(),
  profilePicture: profilePictureSchema.optional(),
});
