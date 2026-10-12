import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}
