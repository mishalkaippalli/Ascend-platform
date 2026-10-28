import { z } from 'zod';

export const createCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).optional(),
  })
  .strict();

  export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).optional(),
  })
  .strict()
  .refine(
    (data) => data.name !== undefined || data.description !== undefined,
    { message: 'Provide at least one field to update.' },
  );

  export const updateCategoryStatusSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();