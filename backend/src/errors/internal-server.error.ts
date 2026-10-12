import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, HttpStatusCode.INTERNAL_SERVER_ERROR, false);
  }
}
