import { Types } from 'mongoose';

import { IBaseRepository } from './IBaseRepository';
import { BookChapterDocument, IBookChapter } from '../../models/book/book-chapter.model';

export interface IBookChapterRepository
  extends IBaseRepository<
    IBookChapter,
    Partial<IBookChapter>,
    Partial<IBookChapter>
  > {
  findByBookId(
  bookId: Types.ObjectId,
): Promise<BookChapterDocument[]>;

  findByBookIdAndChapterNumber(
    bookId: Types.ObjectId,
    chapterNumber: number,
  ): Promise<BookChapterDocument | null>;
}
