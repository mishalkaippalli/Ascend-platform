
import { Router } from 'express';

import {
  authenticateMiddleware,
  authorizationMiddleware,
  categoryController,
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema } from '../validators/category.validator';

import { updateCategorySchema, updateCategoryStatusSchema } from '../validators/category.validator';

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

router.patch(
  '/admin/categories/:categoryId',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory.bind(categoryController),
);

// Admin can activate or deactivate a category.
router.patch(
  '/admin/categories/:categoryId/status',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  validate(updateCategoryStatusSchema),
  categoryController.updateCategoryStatus.bind(categoryController),
);

// Admin can view all categories, including inactive ones.
router.get(
  '/admin/categories',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  categoryController.getAllCategories.bind(categoryController),
);

export default router;
