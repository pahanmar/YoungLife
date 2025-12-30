// src/routes/admin.js
import express from 'express';
import { listUsers, updateRole, routePermissions } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/permit.js';
const router = express.Router();

router.use(authMiddleware);
router.get('/route-permissions', (req, res) => routePermissions(req, res));
router.get('/users', permit('admin'), listUsers);
router.patch('/users/:userId/role', permit('admin'), updateRole);

export default router;