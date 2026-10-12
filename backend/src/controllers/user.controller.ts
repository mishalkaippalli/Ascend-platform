import { Request, Response } from 'express';

import { UnauthorizedError } from '../errors/unauthorized.error';
import { IUserService } from '../interfaces/service/user/IUserService';
import { sendSuccessResponse } from '../utils/api-response.util';
import { HttpStatusCode } from '../constants/http-status-code';

export class UserController {
  constructor(
    private readonly _userService: IUserService,
  ) {}

  async getCurrentUser(
    req: Request,
    res: Response,
  ): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const user = await this._userService.getCurrentUser(req.user.id);

    sendSuccessResponse(
      res,
      HttpStatusCode.OK,
      'User details retrieved successfully',
      user,
    );
  }
}