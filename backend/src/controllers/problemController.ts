import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { addSubmissionJob } from '../jobs/submissionQueue';
import { SubmissionStatus } from '@prisma/client';

export async function getProblems(req: AuthenticatedRequest, res: Response) {
  try {
    const { page = '1', limit = '20', search = '', tag = '', difficulty = '' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (search) {
      whereClause.title = { contains: search as string, mode: 'insensitive' };
    }

    if (tag) {
      whereClause.tags = { has: tag as string };
    }

    if (difficulty) {
      whereClause.difficulty = difficulty as string;
    }

    const [problems, totalCount] = await Promise.all([
      prisma.problem.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          difficulty: true,
          tags: true,
          solvedCount: true,
          timeLimitMs: true,
          memoryLimitMb: true,
        },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.problem.count({ where: whereClause }),
    ]);

    return res.json({
      problems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('Fetch problems error:', error);
    return res.status(500).json({ error: 'Failed to retrieve problems.' });
  }
}

export async function getProblemById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true },
        },
      },
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    return res.json({ problem });
  } catch (error) {
    console.error('Fetch problem by ID error:', error);
    return res.status(500).json({ error: 'Failed to retrieve problem details.' });
  }
}

export async function submitProblem(req: AuthenticatedRequest, res: Response) {
  try {
    const { id: problemId } = req.params;
    const { language, code, contestId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code body are required.' });
    }

    const problem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    // Create the submission record in pending status
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        contestId: contestId || null,
        language,
        code,
        status: SubmissionStatus.PENDING,
      },
    });

    // Add evaluation task to BullMQ
    await addSubmissionJob({
      submissionId: submission.id,
      problemId,
      code,
      language,
    });

    return res.status(201).json({
      message: 'Submission queued successfully.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Problem submit error:', error);
    return res.status(500).json({ error: 'Failed to queue submission.' });
  }
}

export async function getSubmissions(req: AuthenticatedRequest, res: Response) {
  try {
    const { id: problemId } = req.params;
    const userId = req.user?.id;

    const submissions = await prisma.submission.findMany({
      where: {
        problemId,
        userId,
      },
      orderBy: { submittedAt: 'desc' },
    });

    return res.json({ submissions });
  } catch (error) {
    console.error('Fetch problem submissions error:', error);
    return res.status(500).json({ error: 'Failed to retrieve submission history.' });
  }
}
