import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getContests(req: AuthenticatedRequest, res: Response) {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { startTime: 'desc' },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        durationSeconds: true,
        status: true,
        creator: {
          select: { name: true },
        },
      },
    });

    return res.json({ contests });
  } catch (error) {
    console.error('Fetch contests error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contests.' });
  }
}

export async function getContestById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                difficulty: true,
                tags: true,
                solvedCount: true,
              },
            },
          },
          orderBy: { alias: 'asc' },
        },
        creator: {
          select: { name: true },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found.' });
    }

    return res.json({ contest });
  } catch (error) {
    console.error('Fetch contest by ID error:', error);
    return res.status(500).json({ error: 'Failed to retrieve contest details.' });
  }
}

export async function getContestScoreboard(req: AuthenticatedRequest, res: Response) {
  try {
    const { id: contestId } = req.params;

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found.' });
    }

    // 1. Fetch all problems in the contest
    const contestProblems = await prisma.contestProblem.findMany({
      where: { contestId },
      orderBy: { alias: 'asc' },
    });

    // 2. Fetch all submissions during the contest duration
    const submissions = await prisma.submission.findMany({
      where: {
        contestId,
        submittedAt: {
          gte: contest.startTime,
          lte: contest.endTime,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });

    // 3. ICPC Scoreboard Calculation Algorithm
    const scoreboardMap: Record<string, {
      userId: string;
      userName: string;
      solvedCount: number;
      totalPenalty: number;
      problems: Record<string, {
        solved: boolean;
        penalty: number;
        attemptsBeforeSolve: number;
        solvedTimeMinutes: number | null;
      }>;
    }> = {};

    // Initialize map
    submissions.forEach(sub => {
      if (!scoreboardMap[sub.userId]) {
        scoreboardMap[sub.userId] = {
          userId: sub.userId,
          userName: sub.user.name,
          solvedCount: 0,
          totalPenalty: 0,
          problems: {},
        };

        contestProblems.forEach(p => {
          scoreboardMap[sub.userId].problems[p.problemId] = {
            solved: false,
            penalty: 0,
            attemptsBeforeSolve: 0,
            solvedTimeMinutes: null,
          };
        });
      }
    });

    // Process submissions in chronological order
    submissions.forEach(sub => {
      const userEntry = scoreboardMap[sub.userId];
      const probEntry = userEntry.problems[sub.problemId];

      if (!probEntry || probEntry.solved) {
        return; // Ignore if problem is already solved by this user
      }

      // Calculate time offset in minutes
      const timeDiffMinutes = Math.floor(
        (sub.submittedAt.getTime() - contest.startTime.getTime()) / 60000
      );

      if (sub.status === 'ACCEPTED') {
        probEntry.solved = true;
        probEntry.solvedTimeMinutes = timeDiffMinutes;
        probEntry.penalty = timeDiffMinutes + probEntry.attemptsBeforeSolve * 20;

        userEntry.solvedCount += 1;
        userEntry.totalPenalty += probEntry.penalty;
      } else {
        probEntry.attemptsBeforeSolve += 1;
      }
    });

    // Convert map to sorted list
    const standings = Object.values(scoreboardMap).sort((a, b) => {
      if (b.solvedCount !== a.solvedCount) {
        return b.solvedCount - a.solvedCount; // primary order: solved count desc
      }
      return a.totalPenalty - b.totalPenalty; // secondary order: penalty asc
    });

    return res.json({
      contestId,
      problems: contestProblems.map(p => ({
        problemId: p.problemId,
        alias: p.alias,
        score: p.score,
      })),
      standings,
    });
  } catch (error) {
    console.error('Scoreboard calculation error:', error);
    return res.status(500).json({ error: 'Failed to calculate contest standings.' });
  }
}
