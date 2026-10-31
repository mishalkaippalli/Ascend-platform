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

router.get(
  '/me/verification',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
  publisherController.getMyVerificationStatus.bind(publisherController),
);

router.get(
  '/me',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  authorizationMiddleware.execute(UserRole.PUBLISHER),
  publisherController.getMyProfile.bind(publisherController),
);



export default router;