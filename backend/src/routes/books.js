import express from 'express';
import {
  listBooks,
  getBook,
  downloadBook,
} from '../controllers/booksController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.get('/', listBooks);
router.get('/:id/download', authMiddleware, downloadBook);
router.get('/:id', getBook);
export default router;
