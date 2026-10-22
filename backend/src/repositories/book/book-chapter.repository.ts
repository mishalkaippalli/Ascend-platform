import { Types } from 'mongoose';

import { IBookChapterRepository } from '../../interfaces/repository/IBookChapterRepository';
import {
  BookChapter,
  BookChapterDocument,
  IBookChapter,
} from '../../models/book/book-chapter.model';
import { BaseRepository } from '../base.repository';

export class BookChapterRepository
  extends BaseRepository<
    IBookChapter,
    Partial<IBookChapter>,
    Partial<IBookChapter>
  >
  implements IBookChapterRepository
{
  constructor() {
    super(BookChapter);
  }

  async findByBookId(
    bookId: Types.ObjectId,
  ): Promise<BookChapterDocument[]> {
    return BookChapter.find({ bookId })
      .sort({ chapterNumber: 1 })
      .exec();
  }

    async findByBookIdAndChapterNumber(
    bookId: Types.ObjectId,
    chapterNumber: number,
    ): Promise<BookChapterDocument | null> {
    return BookChapter.findOne({
        bookId,
        chapterNumber,
    }).exec();
    }
}