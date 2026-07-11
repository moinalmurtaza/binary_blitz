import { Router } from 'express';
import { getUsers, updateUserRole, createProblem, createContest } from '../controllers/adminController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Protect all admin endpoints for ADMIN and TRAINER roles only
router.use(authMiddleware as any);
router.use(roleMiddleware([Role.ADMIN, Role.TRAINER]) as any);

router.get('/users', getUsers as any);
router.put('/users/:id/role', updateUserRole as any);
router.post('/problems', createProblem as any);
router.post('/contests', createContest as any);

export default router;
