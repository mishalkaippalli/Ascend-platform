import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, HttpStatusCode.TOO_MANY_REQUESTS);
  }
}