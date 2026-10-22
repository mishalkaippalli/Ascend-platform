
import { Types } from 'mongoose';

import { IBookChapterRepository } from '../../interfaces/repository/IBookChapterRepository';
import { IBookChapterService } from '../../interfaces/service/book/IBookChapterService';
import { BookChapterDocument } from '../../models/book/book-chapter.model';
import { NotFoundError } from '../../errors/not-found.error';
import type { BookChapterOverviewDTO } from '../../dtos/book-chapter.dto';

export class BookChapterService implements IBookChapterService {
  constructor(
    private readonly _bookChapterRepository: IBookChapterRepository,
  ) {}

    async getChaptersByBookId(
    bookId: Types.ObjectId,
    ): Promise<BookChapterOverviewDTO[]> {
    const chapters = await this._bookChapterRepository.findByBookId(bookId);

    return chapters.map((chapter) => ({
        id: chapter._id.toString(),
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        ...(chapter.summary !== undefined
        ? { summary: chapter.summary }
        : {}),
    }));
    }

  async getChapterByNumber(
    bookId: Types.ObjectId,
    chapterNumber: number,
  ): Promise<BookChapterDocument> {
    const chapter =
      await this._bookChapterRepository.findByBookIdAndChapterNumber(
        bookId,
        chapterNumber,
      );

    if (!chapter) {
      throw new NotFoundError('Chapter not found.');
    }

    return chapter;
  }
}
