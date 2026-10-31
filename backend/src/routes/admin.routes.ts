import { Router } from 'express';

import {
  authenticateMiddleware,
  authorizationMiddleware,
  publisherController,
  categoryController
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';
import { createCategorySchema } from '../validators/category.validator';
import { validate } from '../middlewares/validate.middleware';

import { updateCategorySchema, updateCategoryStatusSchema } from '../validators/category.validator';

const router = Router();

//ADMIN PUBLISHERS
// Retrieve all publishers 
router.get(
  '/publishers',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.getAllPublishers.bind(publisherController),
);

// Retrieve pending publishers
router.get(
  '/publishers/pending',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.findPending.bind(publisherController),
);

// Approve a publisher 
router.patch(
  '/publishers/:publisherId/approve',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.approvePublisher.bind(publisherController),
);

// Reject a publisher 
router.patch(
  '/publishers/:publisherId/reject',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.rejectPublisher.bind(publisherController),
);


//ADMIN CATEGORIES
router.post(
  '/categories',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory.bind(categoryController),
);

router.patch(
  '/categories/:categoryId',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory.bind(categoryController),
);

// Admin can activate or deactivate a category.
router.patch(
  '/categories/:categoryId/status',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  validate(updateCategoryStatusSchema),
  categoryController.updateCategoryStatus.bind(categoryController),
);

// Admin can view all categories, including inactive ones.
router.get(
  '/categories',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  categoryController.getAllCategories.bind(categoryController),
);

export default router;