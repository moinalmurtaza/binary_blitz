import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware as any, logout as any);
router.get('/me', authMiddleware as any, getMe as any);

export default router;
