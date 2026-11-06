import { Router } from 'express';

import {
  authenticateMiddleware,
  authorizationMiddleware,
  bookController,
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';
import { validate } from '../middlewares/validate.middleware';
import { createBookSchema } from '../validators/book.validator';
import { generateBookAssetUploadUrlSchema } from '../validators/book-asset.validator';

const router = Router();

router.post(
  '/create',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
  validate(createBookSchema),
  bookController.createBook.bind(bookController),
);

router.post(
  '/:bookId/assets/upload-url',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
  validate(generateBookAssetUploadUrlSchema),
  bookController.generateAssetUploadUrl.bind(bookController),
);

export default router;
