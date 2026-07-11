import { Request, Response } from 'express';
import prisma from '../config/db';

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const { category, limit = '50' } = req.query;
    const limitNum = parseInt(limit as string, 10);

    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const leaderboard = await prisma.profile.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        category: true,
        rating: true,
        avatarUrl: true,
        _count: {
          select: {
            submissions: {
              where: { status: 'ACCEPTED' },
            },
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
      ],
      take: limitNum,
    });

    const formattedLeaderboard = leaderboard.map((user: any, index: number) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      category: user.category,
      rating: user.rating,
      avatarUrl: user.avatarUrl,
      solvedCount: user._count.submissions,
    }));

    return res.json({ leaderboard: formattedLeaderboard });
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    return res.status(500).json({ error: 'Failed to retrieve standings.' });
  }
}
