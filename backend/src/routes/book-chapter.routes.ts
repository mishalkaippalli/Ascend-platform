
import { Router } from 'express';

import { bookChapterController } from '../config/dependencies';
import { authenticateMiddleware } from '../config/dependencies';

const router = Router();

// Retrieve all chapters belonging to a book.
router.get(
  '/books/:bookId/chapters',
  bookChapterController.getChaptersByBookId.bind(bookChapterController),
);

// Retrieve one chapter by its number.
router.get(
  '/books/:bookId/chapters/:chapterNumber',
  authenticateMiddleware.execute.bind(authenticateMiddleware),
  bookChapterController.getChapterByNumber.bind(bookChapterController),
);

export default router;
