
import { Types } from 'mongoose';

import type { BookChapterDocument } from '../../../models/book/book-chapter.model';
import type { BookChapterOverviewDTO } from '../../../dtos/book-chapter.dto';

export interface IBookChapterService {
  getChaptersByBookId(
    bookId: Types.ObjectId,
  ): Promise<BookChapterOverviewDTO[]>;

  getChapterByNumber(
    bookId: Types.ObjectId,
    chapterNumber: number,
  ): Promise<BookChapterDocument>;
}
