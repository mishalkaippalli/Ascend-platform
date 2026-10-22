import { Types } from 'mongoose';

import { IBaseRepository } from './IBaseRepository';
import { BookDocument, IBook } from '../../models/book/book.model';

export interface IBookRepository
  extends IBaseRepository<IBook, Partial<IBook>, Partial<IBook>> {
  findBySlug(slug: string): Promise<BookDocument | null>;

  findByPublisherId(
    publisherId: Types.ObjectId,
  ): Promise<BookDocument[]>;
}