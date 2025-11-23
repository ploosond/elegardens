import { z } from 'zod';

const bilingualStringSchema = z.object({
  en: z.string().trim().min(1, 'English text is required'),
  de: z.string().trim().min(1, 'German text is required'),
});

const sectionSchema = z.object({
  title: z.string().trim().min(1, 'Section title is required'),
  texts: z
    .array(z.string().trim().min(1, 'Text cannot be empty'))
    .min(1, 'At least one text paragraph is required'),
});

const sectionsSchema = z.object({
  de: z.array(sectionSchema).min(1, 'At least one German section is required'),
  en: z.array(sectionSchema).min(1, 'At least one English section is required'),
});

export const createProjectSchema = z.object({
  client: z.string().trim().min(1, 'Client name is required'),
  title: bilingualStringSchema,
  category: bilingualStringSchema,
  tagline: bilingualStringSchema,
  image: z.string().url('Valid image URL is required'),
  sections: sectionsSchema,
  displayRank: z.number().int().min(0),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  client: z.string().trim().min(1, 'Client name is required').optional(),
  title: bilingualStringSchema.optional(),
  category: bilingualStringSchema.optional(),
  tagline: bilingualStringSchema.optional(),
  image: z
    .union([
      z.string().url('Valid image URL is required'),
      z.string().length(0, 'Image can be empty'),
    ])
    .optional(),
  sections: sectionsSchema.optional(),
  displayRank: z.number().int().min(0).optional(),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
