import { Router } from 'express';

import { publisherController } from '../config/dependencies';
import { validate } from '../middlewares/validate.middleware';
import { publisherSignupSchema } from '../validators/publisher.validator';
import {
  authenticateMiddleware,
  authorizationMiddleware,
} from '../config/dependencies';

import { UserRole } from '../types/auth.types';

const router = Router();

// Publisher registration
router.post(
  '/signup',
  validate(publisherSignupSchema),
  publisherController.signup.bind(publisherController),
);

// Admin: retrieve pending publishers
router.get(
  '/admin/pending',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.findPending.bind(publisherController),
);

router.patch(
  '/admin/:publisherId/approve',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.approvePublisher.bind(publisherController),
);

router.patch(
  '/admin/:publisherId/reject',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.ADMIN),
  publisherController.rejectPublisher.bind(publisherController),
);

router.get(
  '/me/verification',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
  publisherController.getMyVerificationStatus.bind(publisherController),
);

export default router;