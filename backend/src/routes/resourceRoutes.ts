import { Router } from 'express';
import { getResources, getResourceById, incrementDownloads } from '../controllers/resourceController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getResources as any);
router.get('/:id', getResourceById as any);
router.post('/:id/download', incrementDownloads as any);

export default router;
