
import { HydratedDocument, Schema, model, Types } from 'mongoose';

import {
  BookStatus,
  ChatbotIndexingStatus,
} from '../../types/book.types';

export interface IBook {
  publisherId: Types.ObjectId;

  title: string;
  slug: string;
  description: string;
  authors: string[];

  // Book cover displayed as the thumbnail.
  coverImage?: {
    publicId: string;
    url: string;
  };

  // Promotional video introducing the entire book.
  promotionalVideo?: {
    publicId: string;
    url: string;
    durationSeconds: number;
  };

  // Promotional audio sample for readers.
  audioPreview?: {
    publicId: string;
    url: string;
    durationSeconds: number;
  };

  previewText?: string;

  categoryIds: Types.ObjectId[];

  priceInPaise: number;
  salePriceInPaise?: number;

  language: string;

  status: BookStatus;

  totalChapters: number;

  ratingSummary: {
    averageRating: number;
    reviewCount: number;
  };

  submissionCount: number;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  rejectionReason?: string;
  publishedAt?: Date;

  // Metadata for the future book-specific RAG chatbot.
  aiChatbot: {
    enabled: boolean;
    indexingStatus: ChatbotIndexingStatus;
    contentVersion: number;
    indexedContentVersion?: number;
    lastIndexedAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    publisherId: {
      type: Schema.Types.ObjectId,
      ref: 'Publisher',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    authors: {
      type: [String],
      required: true,
      validate: {
        validator: (authors: string[]) =>
          authors.length > 0 &&
          authors.every((author) => author.trim().length > 0),
        message: 'A book must have at least one valid author.',
      },
    },

    coverImage: {
      publicId: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },

    promotionalVideo: {
      publicId: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
      durationSeconds: {
        type: Number,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: 'Video duration must be an integer.',
        },
      },
    },

    audioPreview: {
      publicId: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
      durationSeconds: {
        type: Number,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: 'Audio duration must be an integer.',
        },
      },
    },

    previewText: {
      type: String,
      trim: true,
    },

    categoryIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Category',
      default: [],
    },


    priceInPaise: {
    type: Number,
    required: true,
    min: 0,
    validate: {
        validator: (value: number) => Number.isInteger(value),
        message: 'Price must be an integer in paise.',
    },
    },

    salePriceInPaise: {
    type: Number,
    min: 0,
    validate: {
        validator: (value: number | undefined) =>
        value === undefined || Number.isInteger(value),
        message: 'Sale price must be an integer in paise.',
    },
    },

    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    status: {
      type: String,
      enum: Object.values(BookStatus),
      default: BookStatus.DRAFT,
      required: true,
    },

    totalChapters: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Total chapters must be an integer.',
      },
    },

    ratingSummary: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviewCount: {
        type: Number,
        default: 0,
        min: 0,
        validate: {
          validator: Number.isInteger,
          message: 'Review count must be an integer.',
        },
      },
    },

    submissionCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Submission count must be an integer.',
      },
    },

    submittedAt: Date,
    reviewedAt: Date,

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    publishedAt: Date,

    aiChatbot: {
      enabled: {
        type: Boolean,
        default: true,
      },

      indexingStatus: {
        type: String,
        enum: Object.values(ChatbotIndexingStatus),
        default: ChatbotIndexingStatus.PENDING,
        required: true,
      },

      contentVersion: {
        type: Number,
        default: 1,
        min: 1,
        validate: {
          validator: Number.isInteger,
          message: 'Content version must be an integer.',
        },
      },

    indexedContentVersion: {
    type: Number,
    min: 1,
    validate: {
        validator: (value: number | undefined) =>
        value === undefined || Number.isInteger(value),
        message: 'Indexed content version must be an integer.',
    },
    },

      lastIndexedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Find a publisher's books by their publishing status.
bookSchema.index({ publisherId: 1, status: 1 });

// Support listing books by publication date.
bookSchema.index({ status: 1, publishedAt: -1 });

export type BookDocument = HydratedDocument<IBook>;

export const Book = model<IBook>('Book', bookSchema);
