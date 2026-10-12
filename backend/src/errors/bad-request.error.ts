import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}
