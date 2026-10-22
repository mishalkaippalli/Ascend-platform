import { Router } from 'express';

import {
  authenticateMiddleware,
  authorizationMiddleware,
  bookController,
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';
import { validate } from '../middlewares/validate.middleware';
import { createBookSchema } from '../validators/book.validator';

const router = Router();

router.post(
  '/publishers/books',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
  validate(createBookSchema),
  bookController.createBook.bind(bookController),
);

export default router;