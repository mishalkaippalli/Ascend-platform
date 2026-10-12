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
}