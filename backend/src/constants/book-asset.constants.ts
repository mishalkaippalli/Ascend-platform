import type { BookAssetType } from '../dtos/book-asset.dto.js';

export const BOOK_ASSET_CONFIG: Record<
  BookAssetType,
  {
    folder: string;
    allowedContentTypes: string[];
    extensions: Record<string, string>;
  }
> = {
  coverImage: {
    folder: 'cover',
    allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
    extensions: {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    },
  },

  promotionalVideo: {
    folder: 'promotional-video',
    allowedContentTypes: ['video/mp4'],
    extensions: {
      'video/mp4': 'mp4',
    },
  },

  audioPreview: {
    folder: 'audio-preview',
    allowedContentTypes: ['audio/mpeg'],
    extensions: {
      'audio/mpeg': 'mp3',
    },
  },
};
