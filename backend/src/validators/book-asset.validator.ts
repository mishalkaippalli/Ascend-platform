import { z } from 'zod';
import type { BookAssetType } from '../dtos/book-asset.dto';

// Each asset type has its own set of permitted MIME types.
const allowedContentTypes: Record<BookAssetType, string[]> = {
  coverImage: ['image/jpeg', 'image/png', 'image/webp'],
  promotionalVideo: ['video/mp4'],
  audioPreview: ['audio/mpeg'],
};

export const generateBookAssetUploadUrlSchema = z
  .object({
    assetType: z.enum(['coverImage', 'promotionalVideo', 'audioPreview']),
    contentType: z.string().min(1, 'Content type is required'),
  })
  .superRefine((data, ctx) => {
    // Check whether the MIME type is allowed for the selected asset.
    if (!allowedContentTypes[data.assetType].includes(data.contentType)) {
      ctx.addIssue({
        code: 'custom',
        path: ['contentType'],
        message: `Invalid content type for ${data.assetType}`,
      });
    }
  });
