import { Router } from 'express';

import { authorController } from '../config/dependencies';

import {
  authenticateMiddleware,
  authorizationMiddleware,
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';

import { validate } from '../middlewares/validate.middleware';

import {
  createAuthorSchema,
  updateAuthorSchema,
} from '../validators/author.validator';

const router = Router();

// All author management routes require an authenticated publisher.
router.use(
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
);


router.post(
  '/',
  validate(createAuthorSchema),
  authorController.createAuthor.bind(authorController),
);


router.get(
  '/',
  authorController.getMyAuthors.bind(authorController),
);


router.patch(
  '/:authorId',
  validate(updateAuthorSchema),
  authorController.updateAuthor.bind(authorController),
);

export default router;