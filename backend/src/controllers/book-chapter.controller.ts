import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { BadRequestError } from '../errors/bad-request.error';
import { IBookChapterService } from '../interfaces/service/book/IBookChapterService';
import { HttpStatusCode } from '../constants/http-status-code';
import { sendSuccessResponse } from '../utils/api-response.util';


function parseBookId(bookId: unknown): Types.ObjectId {                      // Validate the route parameter before converting it to an ObjectId.
  if (
    typeof bookId !== 'string' ||
    !Types.ObjectId.isValid(bookId)
  ) {
    throw new BadRequestError('Invalid book ID.');
  }

  return new Types.ObjectId(bookId);
}

export class BookChapterController {
  constructor(
    private readonly _bookChapterService: IBookChapterService,
  ) {}

  // Retrieve all chapters belonging to a book.
  async getChaptersByBookId(
    req: Request,
    res: Response,
  ): Promise<void> {
   
    const bookObjectId = parseBookId(req.params.bookId);

    const chapters =
      await this._bookChapterService.getChaptersByBookId(
        bookObjectId,
      );

    
    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'Book chapters retrieved successfully.',
      chapters,
    );
  }

  // Retrieve one chapter by its number within a particular book.
  async getChapterByNumber(
    req: Request,
    res: Response,
  ): Promise<void> {
    const bookObjectId = parseBookId(req.params.bookId);
   
    const parsedChapterNumber = Number(req.params.chapterNumber);

    if (
      !Number.isInteger(parsedChapterNumber) ||
      parsedChapterNumber < 1
    ) {
      throw new BadRequestError('Invalid chapter number.');
    }

    const chapter =
      await this._bookChapterService.getChapterByNumber(
        bookObjectId,
        parsedChapterNumber,
      );

    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'Book chapter retrieved successfully.',
      chapter,
    );
  }
}
