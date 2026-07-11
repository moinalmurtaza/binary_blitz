import { Request, Response } from 'express';
import prisma from '../config/db';

export async function getResources(req: Request, res: Response) {
  try {
    const { type, search } = req.query;

    const whereClause: any = {};
    if (type) {
      whereClause.type = type;
    }
    if (search) {
      whereClause.title = { contains: search as string, mode: 'insensitive' };
    }

    const resources = await prisma.resource.findMany({
      where: whereClause,
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ resources });
  } catch (error) {
    console.error('Fetch resources error:', error);
    return res.status(500).json({ error: 'Failed to retrieve materials.' });
  }
}

export async function getResourceById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found.' });
    }

    return res.json({ resource });
  } catch (error) {
    console.error('Fetch resource by ID error:', error);
    return res.status(500).json({ error: 'Failed to retrieve resource.' });
  }
}

export async function incrementDownloads(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.resource.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Increment download count error:', error);
    return res.status(500).json({ error: 'Failed to increment download count.' });
  }
}
