import express from 'express';
import {
  adminListDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  reorderDocuments,
} from '../controllers/downloadDocumentsController.js';
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/permit.js';
import { uploadDocumentFiles } from '../middleware/uploadDocuments.js';

const router = express.Router();
router.use(authMiddleware);
router.use(permit('admin'));

router.get('/', adminListDocuments);
router.post('/', uploadDocumentFiles, createDocument);
router.patch('/reorder', reorderDocuments);
router.patch('/:id', uploadDocumentFiles, updateDocument);
router.delete('/:id', deleteDocument);

export default router;
