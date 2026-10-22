import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { HttpStatusCode } from '../constants/http-status-code';
import { ICreateBookDTO } from '../dtos/book.dto';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { IBookService } from '../interfaces/service/book/IBookService';
import { sendSuccessResponse } from '../utils/api-response.util';

export class BookController {
  constructor(private readonly _bookService: IBookService) {}

  async createBook(req: Request, res: Response): Promise<void> {
   // req.user is set by authentication middleware
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userId = new Types.ObjectId(req.user.id);

    const book = await this._bookService.createBook(
      userId,
      req.body as ICreateBookDTO,
    );

    sendSuccessResponse(
      res,
      HttpStatusCode.CREATED,
      'Book draft created successfully.',
      {
        id: book._id.toString(),
        title: book.title,
        slug: book.slug,
        status: book.status,
      },
    );
  }
}