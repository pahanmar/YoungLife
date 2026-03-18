import express from 'express';
import {
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/booksController.js';
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/permit.js';
import { uploadBookFiles } from '../middleware/uploadBooks.js';

const router = express.Router();
router.use(authMiddleware);
router.use(permit('admin'));

router.post('/', uploadBookFiles, createBook);
router.patch('/:id', uploadBookFiles, updateBook);
router.delete('/:id', deleteBook);

export default router;
