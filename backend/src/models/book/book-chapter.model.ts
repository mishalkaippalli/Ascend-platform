
import { HydratedDocument, Schema, model, Types } from 'mongoose';

interface IChapterMediaAsset {
  publicId: string;
  url: string;
  durationSeconds: number;
}

interface IChapterMedia {
  audio?: IChapterMediaAsset;
  video?: IChapterMediaAsset;
}

export interface IBookChapter {
  bookId: Types.ObjectId;
  chapterNumber: number;
  title: string;
  summary?: string;
  readingContent: string;
  media?: IChapterMedia;
  createdAt: Date;
  updatedAt: Date;
}



const chapterMediaAssetSchema = new Schema<IChapterMediaAsset>(
  {
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    durationSeconds: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: (value: number) =>
          Number.isInteger(value) && value > 0,
        message: 'Media duration must be a positive integer.',
      },
    },
  },
  { _id: false },
);

const chapterMediaSchema = new Schema<IChapterMedia>(
  {
    audio: {
      type: chapterMediaAssetSchema,
      required: false,
    },
    video: {
      type: chapterMediaAssetSchema,
      required: false,
    },
  },
  { _id: false },
);

const bookChapterSchema = new Schema<IBookChapter>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (value: number) =>
          Number.isInteger(value) && value > 0,
        message: 'Chapter number must be a positive integer.',
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    readingContent: {
      type: String,
      required: true,
      trim: true,
    },
    media: {
      type: chapterMediaSchema,
      required: false,
    },
  },
  { timestamps: true },
);

// A book cannot have duplicate chapter numbers.
bookChapterSchema.index(
  { bookId: 1, chapterNumber: 1 },
  { unique: true },
);

export type BookChapterDocument = HydratedDocument<IBookChapter>;

export const BookChapter = model<IBookChapter>(
  'BookChapter',
  bookChapterSchema,
);
