import { Types } from 'mongoose';

import {
  CreatePublisherData,
  IPublisherRepository,
  UpdatePublisherData,
} from '../interfaces/repository/IPublisherRepository';

import {
  IPublisher,
  Publisher,
} from '../models/publisher/publisher.model';
import { PublisherVerificationStatus } from '../types/publisher.types';

import { BaseRepository } from './base.repository';

export class PublisherRepository
  extends BaseRepository<
    IPublisher,
    CreatePublisherData,
    UpdatePublisherData
  >
  implements IPublisherRepository
{
  constructor() {
    super(Publisher);
  }

  async findByUserId(userId: Types.ObjectId) {
    return this._model.findOne({ userId }).exec();
  }

  async findPending(): Promise<IPublisher[]> {
    return this._model
      .find({
        'verification.status': PublisherVerificationStatus.PENDING,
      })
      .populate('userId', 'name email emailVerified isActive createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async approvePending(
    publisherId: Types.ObjectId,
    reviewedBy: Types.ObjectId,
  ): Promise<IPublisher | null> {
    return this._model
      .findOneAndUpdate(
        {
          _id: publisherId,
          'verification.status': PublisherVerificationStatus.PENDING,
        },
        {
          $set: {
            'verification.status': PublisherVerificationStatus.APPROVED,
            'verification.reviewedAt': new Date(),
            'verification.reviewedBy': reviewedBy,
          },
          $unset: {
            'verification.reason': 1,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }
  
  async rejectPending(
    publisherId: Types.ObjectId,
    reviewedBy: Types.ObjectId,
    reason: string,
  ): Promise<IPublisher | null> {
    return this._model
      .findOneAndUpdate(
        {
          _id: publisherId,
          'verification.status': PublisherVerificationStatus.PENDING,
        },
        {
          $set: {
            'verification.status': PublisherVerificationStatus.REJECTED,
            'verification.reason': reason,
            'verification.reviewedAt': new Date(),
            'verification.reviewedBy': reviewedBy,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }
}