import { NextFunction, Request, Response } from 'express';

import { IPublisherSignupDTO } from '../dtos/publisher.dto';

import { IPublisherService } from '../interfaces/service/publisher/IPublisherService';
import { HttpStatusCode } from '../constants/http-status-code';
import { sendSuccessResponse } from '../utils/api-response.util';
import { BadRequestError } from '../errors/bad-request.error';
import { UnauthorizedError } from '../errors/unauthorized.error';

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

  async findPending(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const publishers = await this._publisherService.findPending();

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Pending publishers retrieved successfully',
        publishers,
      );
    } catch (error) {
      next(error);
    }
  } 

  async approvePublisher(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { publisherId } = req.params;

      if (typeof publisherId !== 'string') {
        throw new BadRequestError('Invalid publisher ID');
      }

      // The authenticated admin's ID is attached by authentication middleware.
        if (!req.user) {
          throw new UnauthorizedError('Authentication required');
        }

        const adminId = req.user.id;

      const publisher = await this._publisherService.approvePublisher(
        publisherId,
        adminId,
      );

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Publisher approved successfully',
        publisher,
      );
    } catch (error) {
      next(error);
    }
  }

  async rejectPublisher(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { publisherId } = req.params;

      if (typeof publisherId !== 'string') {
        throw new BadRequestError('Invalid publisher ID');
      }

      const { reason } = req.body;
      if (typeof reason !== 'string' || !reason.trim()) {
        throw new BadRequestError('Rejection reason is required');
      }

      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const publisher = await this._publisherService.rejectPublisher(
        publisherId,
        req.user.id,
        reason,
      );

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Publisher rejected successfully',
        publisher,
      );
    } catch (error) {
      next(error);
    }
  }
}