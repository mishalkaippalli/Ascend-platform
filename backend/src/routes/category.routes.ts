
import { Router } from 'express';

import {
  categoryController,
} from '../config/dependencies';

const router = Router();

router.get(
  '/',
  categoryController.getActiveCategories.bind(categoryController),
);


export default router;
