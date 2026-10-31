import { NextFunction, Request, Response } from 'express';

import {
  ICreateAuthorDTO,
  IUpdateAuthorDTO,
} from '../dtos/author.dto';

import { IAuthorService } from '../interfaces/service/publisher/IAuthorService';

import { HttpStatusCode } from '../constants/http-status-code';
import { sendSuccessResponse } from '../utils/api-response.util';

import { BadRequestError } from '../errors/bad-request.error';
import { UnauthorizedError } from '../errors/unauthorized.error';

export class AuthorController {
  constructor(
    private readonly _authorService: IAuthorService,
  ) {}

  async createAuthor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const input: ICreateAuthorDTO = req.body;

      const author = await this._authorService.createAuthor(
        req.user.id,
        input,
      );

      sendSuccessResponse(
        res,
        HttpStatusCode.CREATED,
        'Author created successfully',
        author,
      );
    } catch (error) {
      next(error);
    }
  }

  async getMyAuthors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const authors = await this._authorService.getAuthorsByPublisher(
        req.user.id,
      );

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Authors retrieved successfully',
        authors,
      );
    } catch (error) {
      next(error);
    }
  }

  async updateAuthor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const { authorId } = req.params;

      if (typeof authorId !== 'string') {
        throw new BadRequestError('Invalid author ID');
      }

      const input: IUpdateAuthorDTO = req.body;

      const author = await this._authorService.updateAuthor(
        req.user.id,
        authorId,
        input,
      );

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Author updated successfully',
        author,
      );
    } catch (error) {
      next(error);
    }
  }
}