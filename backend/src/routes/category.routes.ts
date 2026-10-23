
import { Router } from 'express';

import {
  authenticateMiddleware,
  authorizationMiddleware,
  categoryController,
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema } from '../validators/category.validator';

const router = Router();

// Anyone can get active categories.
router.get(
  '/categories',
  categoryController.getActiveCategories.bind(categoryController),
);

// Only authenticated admins can create categories.
router.post(
  '/admin/categories',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory.bind(categoryController),
);

export default router;
