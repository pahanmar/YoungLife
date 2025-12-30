import express from 'express';
import { listUsers, updateRole } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/permit.js';
const router = express.Router();

router.use(authMiddleware);
router.get('/users', permit('admin'), listUsers);
router.patch('/users/:userId/role', permit('admin'), updateRole);

export default router;