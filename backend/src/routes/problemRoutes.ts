import { Router } from 'express';
import { getProblems, getProblemById, submitProblem, getSubmissions } from '../controllers/problemController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getProblems as any);
router.get('/:id', getProblemById as any);
router.post('/:id/submit', submitProblem as any);
router.get('/:id/submissions', getSubmissions as any);

export default router;
