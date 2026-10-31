import { z } from 'zod';

export const createAuthorSchema = z.object({
  name: z.string().trim().min(1).max(100),

  origin: z.string().trim().max(100).optional(),

  profileImage: z.object({
    publicId: z.string().trim().min(1),
    url: z.string().trim().url(),
  }).optional(),

  bio: z.string().trim().max(500).optional(),
});

export const updateAuthorSchema = createAuthorSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided',
  );