import { Request, Response } from 'express';
import { Types } from 'mongoose';

import { HttpStatusCode } from '../constants/http-status-code';
import { ICreateBookDTO } from '../dtos/book.dto';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { IBookService } from '../interfaces/service/book/IBookService';
import { sendSuccessResponse } from '../utils/api-response.util';
import { BadRequestError } from '../errors/bad-request.error';

import type { IGenerateBookAssetUploadUrlDTO } from '../dtos/book-asset.dto.js';
//mapping has top be done in service layer
export class BookController {
  constructor(private readonly _bookService: IBookService) {}

  async createBook(req: Request, res: Response): Promise<void> {
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
  async generateAssetUploadUrl(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userId = new Types.ObjectId(req.user.id);
    const bookId = req.params.bookId;

    if (typeof bookId !== 'string') {
      throw new BadRequestError('Invalid book ID.');
    }

    const result = await this._bookService.generateAssetUploadUrl(
      userId,
      bookId,
      req.body as IGenerateBookAssetUploadUrlDTO,
    );

    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'Upload URL generated successfully.',
      result,
    );
  }
}
