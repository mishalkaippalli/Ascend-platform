import {HydratedDocument, Schema, model, Types } from 'mongoose';

import {
  PublisherType,
  PublisherVerificationStatus,
} from '../../types/publisher.types';

export interface IPublisher {
  userId: Types.ObjectId;
  publisherType: PublisherType;
  organizationName?: string;

  verification: {
    status: PublisherVerificationStatus;
    reason?: string;
    reviewedAt?: Date;
    reviewedBy?: Types.ObjectId;
  };
  createdAt: Date;
 updatedAt: Date;
}

const publisherSchema = new Schema<IPublisher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    publisherType: {
      type: String,
      enum: Object.values(PublisherType),
      required: true,
    },

    organizationName: {
      type: String,
      trim: true,
    },

    verification: {
      status: {
        type: String,
        enum: Object.values(PublisherVerificationStatus),
        default: PublisherVerificationStatus.PENDING,
        required: true,
      },

      reason: {
        type: String,
        trim: true,
      },

      reviewedAt: {
        type: Date,
      },

      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  },
);

export type PublisherDocument = HydratedDocument<IPublisher>;

export const Publisher = model<IPublisher>(
  'Publisher',
  publisherSchema,
);
