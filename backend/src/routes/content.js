import express from 'express';
import { listContent, createContent } from '../controllers/contentController.js';
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/permit.js';
const router = express.Router();

router.get('/', listContent); // public, filters by role if user present
router.post('/', authMiddleware, permit('admin','employee'), createContent); // только сотрудники/админы могут добавлять контент

export default router;