import { Router } from 'express';
import { 
  getPhases, createPhase, updatePhase, deletePhase,
  createWeek, updateWeek, deleteWeek,
  getDay, createDay, updateDay, deleteDay,
  createResource, updateResource, deleteResource,
  toggleProgress, getProgressSummary
} from '../controllers/scheduleController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

// Retrieve roadmap & progress summaries (any authenticated user)
router.get('/phases', authMiddleware as any, getPhases as any);
router.get('/days/:id', authMiddleware as any, getDay as any);
router.get('/progress/summary', authMiddleware as any, getProgressSummary as any);

// Student actions
router.post('/progress/toggle', authMiddleware as any, toggleProgress as any);

// Instructor / Admin management actions
const instructPrivileges = roleMiddleware([Role.ADMIN, Role.TRAINER]) as any;

// Phase Management
router.post('/phases', authMiddleware as any, instructPrivileges, createPhase as any);
router.put('/phases/:id', authMiddleware as any, instructPrivileges, updatePhase as any);
router.delete('/phases/:id', authMiddleware as any, instructPrivileges, deletePhase as any);

// Week Management
router.post('/weeks', authMiddleware as any, instructPrivileges, createWeek as any);
router.put('/weeks/:id', authMiddleware as any, instructPrivileges, updateWeek as any);
router.delete('/weeks/:id', authMiddleware as any, instructPrivileges, deleteWeek as any);

// Day Management
router.post('/days', authMiddleware as any, instructPrivileges, createDay as any);
router.put('/days/:id', authMiddleware as any, instructPrivileges, updateDay as any);
router.delete('/days/:id', authMiddleware as any, instructPrivileges, deleteDay as any);

// Resource Management
router.post('/resources', authMiddleware as any, instructPrivileges, createResource as any);
router.put('/resources/:id', authMiddleware as any, instructPrivileges, updateResource as any);
router.delete('/resources/:id', authMiddleware as any, instructPrivileges, deleteResource as any);

export default router;
