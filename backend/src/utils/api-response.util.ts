import type { Response } from 'express';

import { HttpStatusCode } from '../constants/http-status-code.js';
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../types/api-response.js';

export function sendSuccessResponse<T>(
  res: Response,
  statusCode: HttpStatusCode,
  message: string,
  data?: T,
): Response<ApiSuccessResponse<T>> {
  const response: ApiSuccessResponse<T> =
    data === undefined
      ? { success: true, message }
      : { success: true, message, data };

  return res.status(statusCode).json(response);
}

export function sendErrorResponse(
  res: Response,
  statusCode: HttpStatusCode,
  message: string,
  errors?: unknown,
): Response<ApiErrorResponse> {
  const response: ApiErrorResponse =
    errors === undefined
      ? { success: false, message }
      : { success: false, message, errors };

  return res.status(statusCode).json(response);
}