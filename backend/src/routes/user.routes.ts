import { Router } from 'express'

import { userController } from '../config/dependencies'
import { authenticateMiddleware} from '../config/dependencies'

const router = Router()

router.get(
  '/me',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  userController.getCurrentUser.bind(userController),
)

export default router