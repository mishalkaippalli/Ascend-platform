import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}
