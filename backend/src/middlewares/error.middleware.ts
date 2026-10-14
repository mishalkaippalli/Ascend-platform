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
    // Expected application errors: validation, authentication,
    // authorization, conflicts, and other known failures.
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

  // Unexpected errors: preserve details for debugging.
  if (error instanceof Error) {
    logger.error(
      {
        err: error,
        stack: error.stack,
      },
      'Unexpected server error',
    );
  } else {
    logger.error(
      { error },
      'Unexpected non-Error value',
    );
  }

  sendErrorResponse(
    res,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    'Internal server error',
  );
};