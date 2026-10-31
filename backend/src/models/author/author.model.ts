import { HydratedDocument, Schema, model, Types } from 'mongoose';

export interface IAuthor {
  publisherId: Types.ObjectId;

  name: string;
  slug: string;

  origin?: string;

  profileImage?: {
    publicId: string;
    url: string;
  };

  bio?: string;

  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema<IAuthor>(
  {
    publisherId: {
      type: Schema.Types.ObjectId,
      ref: 'Publisher',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    origin: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    profileImage: {
      publicId: {
        type: String,
        trim: true,
      },
      url: {
        type: String,
        trim: true,
      },
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

// An author name/slug only needs to be unique within its publisher.
authorSchema.index(
  { publisherId: 1, slug: 1 },
  { unique: true },
);

export type AuthorDocument = HydratedDocument<IAuthor>;

export const Author = model<IAuthor>('Author', authorSchema);