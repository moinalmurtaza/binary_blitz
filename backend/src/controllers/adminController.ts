import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { Role, Category, ContestStatus } from '@prisma/client';

export async function getUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await prisma.profile.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        category: true,
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user accounts.' });
  }
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { role, category } = req.body;

    const updatedUser = await prisma.profile.update({
      where: { id },
      data: {
        role: role as Role,
        category: category as Category,
      },
    });

    return res.json({ message: 'User role updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Update user role error:', error);
    return res.status(500).json({ error: 'Failed to modify user attributes.' });
  }
}

export async function createProblem(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, statement, constraints, timeLimitMs, memoryLimitMb, difficulty, tags, testCases } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!title || !statement || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: 'Title, statement and test cases are required.' });
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        statement,
        constraints: constraints || '',
        timeLimitMs: parseInt(timeLimitMs) || 1000,
        memoryLimitMb: parseInt(memoryLimitMb) || 256,
        difficulty: difficulty || '800',
        tags: tags || [],
        testCases,
        creatorId,
      },
    });

    return res.status(201).json({ message: 'Problem created successfully.', problem });
  } catch (error) {
    console.error('Create problem error:', error);
    return res.status(500).json({ error: 'Failed to create problem.' });
  }
}

export async function createContest(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, description, startTime, endTime, durationSeconds, problems } = req.body;
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!title || !startTime || !endTime || !durationSeconds) {
      return res.status(400).json({ error: 'Title, start time, end time and duration are required.' });
    }

    // Create contest and associate contest problems
    const contest = await prisma.$transaction(async (tx) => {
      const newContest = await tx.contest.create({
        data: {
          title,
          description,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          durationSeconds: parseInt(durationSeconds),
          status: ContestStatus.UPCOMING,
          creatorId,
        },
      });

      if (problems && Array.isArray(problems)) {
        for (let i = 0; i < problems.length; i++) {
          const prob = problems[i];
          await tx.contestProblem.create({
            data: {
              contestId: newContest.id,
              problemId: prob.problemId,
              alias: prob.alias || String.fromCharCode(65 + i), // A, B, C...
              score: parseInt(prob.score) || 100,
            },
          });
        }
      }

      return newContest;
    });

    return res.status(201).json({ message: 'Contest scheduled successfully.', contest });
  } catch (error) {
    console.error('Create contest error:', error);
    return res.status(500).json({ error: 'Failed to create contest.' });
  }
}
