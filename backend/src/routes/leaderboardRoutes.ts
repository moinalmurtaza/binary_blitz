import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);
router.get('/', getLeaderboard as any);

export default router;
