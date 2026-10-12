import { AppError } from './app-error.js';
import { HttpStatusCode } from '../constants/http-status-code.js';

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HttpStatusCode.CONFLICT);
    this.name = 'ConflictError';
  }
}
