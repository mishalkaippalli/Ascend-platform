import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/app-error.js';
import { logger } from '../config/logger.js';
import { HttpStatusCode } from '../constants/http-status-code.js';
import { sendErrorResponse } from '../utils/api-response.util.js';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    logger.warn(
      {
        statusCode: error.statusCode,
        error: error.message,
      },
      'Application error',
    );

    sendErrorResponse(res, error.statusCode, error.message);

    return;
  }

  logger.error(error, 'Unhandled application error');

  sendErrorResponse(
    res,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    'Internal server error',
  );
};
