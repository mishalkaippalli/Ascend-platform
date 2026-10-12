import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}
