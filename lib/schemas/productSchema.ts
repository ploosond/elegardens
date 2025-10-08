import { z } from 'zod';

const commonNameSchema = z.object({
  en: z.string().min(1, 'English common name is required'),
  de: z.string().min(1, 'German common name is required'),
});

const descriptionSchema = z.object({
  en: z.string().min(1, 'English description is required'),
  de: z.string().min(1, 'German description is required'),
});

const imageSchema = z.object({
  url: z.string().url('Valid image URL is required'),
  altText: z.string().min(1, 'Alt text is required'),
});

const imagesArraySchema = z
  .array(imageSchema)
  .min(1, 'At least one image is required')
  .max(3, 'Maximum 3 images are allowed');

const lightSchema = z.object({
  en: z.enum(['sun', 'half-shadow', 'shadow']),
  de: z.enum(['sonne', 'halb-schatten', 'schatten']),
});

export const createProductSchema = z.object({
  common_name: commonNameSchema,
  description: descriptionSchema,
  images: imagesArraySchema,
  height: z.number().positive('Height must be a positive number'),
  diameter: z.number().positive('Diameter must be a positive number'),
  hardiness: z.number('Hardiness must be a number'),
  light: lightSchema,
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/i, 'Color must be a valid hex color')
    .optional(),
});

export const updateProductSchema = z.object({
  common_name: commonNameSchema.optional(),
  description: descriptionSchema.optional(),
  images: z.array(imageSchema).optional(),
  height: z.number().positive('Height must be a positive number').optional(),
  diameter: z
    .number()
    .positive('Diameter must be a positive number')
    .optional(),
  hardiness: z.number('Hardiness must be a number').optional(),
  light: lightSchema.optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/i, 'Color must be a valid hex color')
    .optional(),
});
