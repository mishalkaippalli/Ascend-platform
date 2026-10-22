import { Types } from 'mongoose';

import { IBookRepository } from '../../interfaces/repository/IBookRepository';
import { Book, BookDocument, IBook } from '../../models/book/book.model';
import { BaseRepository } from '../base.repository';

export class BookRepository
  extends BaseRepository<IBook, Partial<IBook>, Partial<IBook>>
  implements IBookRepository
{
  constructor() {
    super(Book);
  }

  async findBySlug(slug: string): Promise<BookDocument | null> {
    return Book.findOne({ slug }).exec();
  }

  async findByPublisherId(
    publisherId: Types.ObjectId,
  ): Promise<BookDocument[]> {
    return Book.find({ publisherId }).sort({ createdAt: -1 }).exec();
  }
}