import { z } from 'zod';

const commonNameSchema = z
  .object({
    en: z.string().trim(),
    de: z.string().trim(),
  })
  .refine(
    (data) => {
      const enTrimmed = (data.en || '').trim();
      const deTrimmed = (data.de || '').trim();
      return enTrimmed.length > 0 || deTrimmed.length > 0;
    },
    {
      message: 'At least one language (EN or DE) must have a name',
    }
  );

const descriptionSchema = z
  .object({
    en: z.string().trim(),
    de: z.string().trim(),
  })
  .refine(
    (data) => {
      const enTrimmed = (data.en || '').trim();
      const deTrimmed = (data.de || '').trim();
      return enTrimmed.length > 0 || deTrimmed.length > 0;
    },
    {
      message: 'At least one language (EN or DE) must have a description',
    }
  );

const imageSchema = z.object({
  url: z.string().url('Valid image URL is required'),
  public_id: z.string().trim().min(1, 'Public ID is required'),
  altText: z.string().trim().min(1, 'Alt text is required'),
});

const imagesArraySchema = z
  .array(imageSchema)
  .min(1, 'At least one image is required')
  .max(6, 'Maximum 6 images are allowed');

const lightSchema = z.object({
  en: z.enum(['sun', 'half-shadow', 'shadow'], {
    message: 'Please select a light requirement',
  }),
  de: z.enum(['sonne', 'halb-schatten', 'schatten'], {
    message: 'Please select a light requirement',
  }),
});

export const createProductSchema = z.object({
  common_name: commonNameSchema,
  description: descriptionSchema,
  images: imagesArraySchema,
  height: z.string().trim().min(1, 'Height must be provided'),
  diameter: z.string().trim().min(1, 'Diameter must be provided'),
  hardiness: z.string().trim().min(1, 'Hardiness must be provided'),
  light: lightSchema,
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/i, 'Color must be a valid hex color'),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  common_name: commonNameSchema.optional(),
  description: descriptionSchema.optional(),
  images: imagesArraySchema.optional(),
  height: z.string().trim().min(1, 'Height must be provided').optional(),
  diameter: z.string().trim().min(1, 'Diameter must be provided').optional(),
  hardiness: z.string().trim().min(1, 'Hardiness must be provided').optional(),
  light: lightSchema.optional(),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/i, 'Color must be a valid hex color')
    .optional(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
