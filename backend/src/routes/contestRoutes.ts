import { Router } from 'express';
import { getContests, getContestById, getContestScoreboard } from '../controllers/contestController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getContests as any);
router.get('/:id', getContestById as any);
router.get('/:id/scoreboard', getContestScoreboard as any);

export default router;
