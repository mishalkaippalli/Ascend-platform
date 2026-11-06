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
    return this._model.findOne({ slug }).exec();
  }

  async findByPublisherId(
    publisherId: Types.ObjectId,
  ): Promise<BookDocument[]> {
    return this._model.find({ publisherId }).sort({ createdAt: -1 }).exec();
  }

  async findByIdAndPublisherId(
    bookId: Types.ObjectId,
    publisherId: Types.ObjectId,
  ): Promise<BookDocument | null> {
    return this._model
      .findOne({
        _id: bookId,
        publisherId,
      })
      .exec();
  }
}
