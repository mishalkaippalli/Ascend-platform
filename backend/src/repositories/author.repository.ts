import { Types } from 'mongoose';

import { IAuthorRepository } from '../interfaces/repository/IAuthorRepository';
import {
  Author,
  AuthorDocument,
  IAuthor,
} from '../models/author/author.model';

import { BaseRepository } from './base.repository';

export class AuthorRepository
  extends BaseRepository<IAuthor, Partial<IAuthor>, Partial<IAuthor>>
  implements IAuthorRepository
{
  constructor() {
    super(Author);
  }

  async findByPublisherId(
    publisherId: Types.ObjectId,
  ): Promise<AuthorDocument[]> {
    return this._model
      .find({ publisherId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPublisherIdAndSlug(
    publisherId: Types.ObjectId,
    slug: string,
  ): Promise<AuthorDocument | null> {
    return this._model
      .findOne({ publisherId, slug })
      .exec();
  }

  async findByIdAndPublisherId(
    authorId: Types.ObjectId,
    publisherId: Types.ObjectId,
  ): Promise<AuthorDocument | null> {
    return this._model
      .findOne({
        _id: authorId,
        publisherId,
      })
      .exec();
  }
}