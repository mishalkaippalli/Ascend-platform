import { NextFunction, Request, Response } from 'express';

import { IPublisherSignupDTO } from '../dtos/publisher.dto';

import { IPublisherService } from '../interfaces/service/publisher/IPublisherService';
import { HttpStatusCode } from '../constants/http-status-code';
import { sendSuccessResponse } from '../utils/api-response.util';

export class PublisherController {
  constructor(private readonly _publisherService: IPublisherService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: IPublisherSignupDTO = req.body;

      const publisher = await this._publisherService.signup(input);

      sendSuccessResponse(
        res,
        HttpStatusCode.CREATED,
        'Publisher signup successful',
        publisher,
      );
    } catch (error) {
      next(error);
    }
  }
}
