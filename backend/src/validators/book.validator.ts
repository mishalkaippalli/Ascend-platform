import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),

  authorIds: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid author ID'),
    )
    .min(1, 'At least one author is required')
    .refine(
      (ids) => new Set(ids).size === ids.length,
      'Duplicate authors are not allowed',
    ),

  // Validate category IDs just like author IDs.
  categoryIds: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    )
    .min(1, 'At least one category is required')
    .refine(
      (ids) => new Set(ids).size === ids.length,
      'Duplicate categories are not allowed',
    ),

  price: z.number().finite().nonnegative(),
  salePrice: z.number().finite().nonnegative().optional(),

  language: z.string().trim().min(1).max(50),
  previewText: z.string().trim().max(5000).optional(),
});