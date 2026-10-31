import { Types } from 'mongoose';

import { IAuthor, AuthorDocument } from '../../models/author/author.model';
import { IBaseRepository } from './IBaseRepository';

export interface IAuthorRepository
  extends IBaseRepository<
    IAuthor,
    Partial<IAuthor>,
    Partial<IAuthor>
  >
{
  findByPublisherId(
    publisherId: Types.ObjectId,
  ): Promise<AuthorDocument[]>;

  findByPublisherIdAndSlug(
    publisherId: Types.ObjectId,
    slug: string,
  ): Promise<AuthorDocument | null>;

  findByIdAndPublisherId(
    authorId: Types.ObjectId,
    publisherId: Types.ObjectId,
  ): Promise<AuthorDocument | null>;
}