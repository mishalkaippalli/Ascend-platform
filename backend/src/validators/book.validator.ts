import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),

  authors: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(20),

  categoryIds: z.array(
    z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
  ),

  // Prices are sent in rupees and converted to paise by the service.
  price: z.number().finite().nonnegative(),
  salePrice: z.number().finite().nonnegative().optional(),

  language: z.string().trim().min(1).max(50),
  previewText: z.string().trim().max(5000).optional(),
});