// src/routes/admin.js
import express from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  updateRole,
  routePermissions,
  updateRoutePermission,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/permit.js';
const router = express.Router();

router.use(authMiddleware);
router.get('/route-permissions', (req, res) => routePermissions(req, res));
router.patch('/route-permissions', permit('admin'), (req, res) =>
  updateRoutePermission(req, res)
);
router.get('/users', permit('admin'), listUsers);
router.post('/users', permit('admin'), createUser);
router.patch('/users/:userId', permit('admin'), updateUser);
router.delete('/users/:userId', permit('admin'), deleteUser);
router.patch('/users/:userId/role', permit('admin'), updateRole);

export default router;
