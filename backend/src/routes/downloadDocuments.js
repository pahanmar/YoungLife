import express from 'express';
import { listDocuments } from '../controllers/downloadDocumentsController.js';

const router = express.Router();
router.get('/', listDocuments);
export default router;
