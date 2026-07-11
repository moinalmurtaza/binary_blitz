import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';
import { DayType } from '@prisma/client';

// ================= PHASES API =================

export async function getPhases(req: AuthenticatedRequest, res: Response) {
  try {
    const studentId = req.user?.id;
    const { search, filterType, filterStatus } = req.query;

    // Build day filter
    const dayWhereClause: any = {};
    if (filterType) {
      dayWhereClause.type = filterType as DayType;
    }
    if (filterStatus) {
      dayWhereClause.status = filterStatus as string;
    }

    // Perform DB Query to retrieve complete nested tree
    const phases = await prisma.phase.findMany({
      orderBy: { phaseOrder: 'asc' },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            days: {
              where: dayWhereClause,
              orderBy: { dayNumber: 'asc' },
              include: {
                resources: true,
                progress: studentId ? {
                  where: { studentId }
                } : false
              }
            }
          }
        }
      }
    });

    // If search filter is active, filter the tree in memory
    let filteredPhases = phases;
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filteredPhases = phases.map(phase => {
        const matchingWeeks = phase.weeks.map(week => {
          const matchingDays = week.days.filter(day => 
            day.title.toLowerCase().includes(q) ||
            day.description?.toLowerCase().includes(q) ||
            day.type.toLowerCase().includes(q) ||
            day.resources.some(r => 
              r.title.toLowerCase().includes(q) || 
              r.description?.toLowerCase().includes(q)
            )
          );
          return { ...week, days: matchingDays };
        }).filter(week => week.days.length > 0);

        return { ...phase, weeks: matchingWeeks };
      }).filter(phase => 
        phase.title.toLowerCase().includes(q) || 
        phase.description?.toLowerCase().includes(q) || 
        phase.weeks.length > 0
      );
    }

    return res.json({ phases: filteredPhases });
  } catch (error) {
    console.error('Fetch phases error:', error);
    return res.status(500).json({ error: 'Failed to retrieve roadmap phases.' });
  }
}

export async function createPhase(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, description, phaseOrder, startDate, endDate } = req.body;

    if (!title || phaseOrder === undefined || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, phase order, start date, and end date are required.' });
    }

    // Validation: Date logic
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date.' });
    }

    // Validation: Duplicate phase order
    const existing = await prisma.phase.findFirst({ where: { phaseOrder } });
    if (existing) {
      return res.status(400).json({ error: `Phase order ${phaseOrder} is already assigned.` });
    }

    const phase = await prisma.phase.create({
      data: {
        title,
        description,
        phaseOrder: parseInt(phaseOrder),
        startDate: start,
        endDate: end,
      }
    });

    return res.status(201).json({ message: 'Phase created successfully.', phase });
  } catch (error) {
    console.error('Create phase error:', error);
    return res.status(500).json({ error: 'Failed to create phase.' });
  }
}

export async function updatePhase(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, phaseOrder, startDate, endDate } = req.body;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    if (start && end && end <= start) {
      return res.status(400).json({ error: 'End date must be after start date.' });
    }

    if (phaseOrder !== undefined) {
      const existing = await prisma.phase.findFirst({
        where: { phaseOrder: parseInt(phaseOrder), NOT: { id } }
      });
      if (existing) {
        return res.status(400).json({ error: `Phase order ${phaseOrder} is already in use by another phase.` });
      }
    }

    const phase = await prisma.phase.update({
      where: { id },
      data: {
        title,
        description,
        phaseOrder: phaseOrder !== undefined ? parseInt(phaseOrder) : undefined,
        startDate: start,
        endDate: end,
      }
    });

    return res.json({ message: 'Phase updated successfully.', phase });
  } catch (error) {
    console.error('Update phase error:', error);
    return res.status(500).json({ error: 'Failed to update phase.' });
  }
}

export async function deletePhase(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await prisma.phase.delete({ where: { id } });
    return res.json({ message: 'Phase deleted successfully.' });
  } catch (error) {
    console.error('Delete phase error:', error);
    return res.status(500).json({ error: 'Failed to delete phase.' });
  }
}

// ================= WEEKS API =================

export async function createWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const { phaseId, weekNumber, startDate, endDate } = req.body;

    if (!phaseId || weekNumber === undefined || !startDate || !endDate) {
      return res.status(400).json({ error: 'Phase ID, week number, start date, and end date are required.' });
    }

    // Verify Phase exists
    const phase = await prisma.phase.findUnique({ where: { id: phaseId } });
    if (!phase) {
      return res.status(404).json({ error: 'Target phase not found.' });
    }

    // Verify Dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date.' });
    }

    // Validation: Duplicate week number in this phase
    const existing = await prisma.week.findFirst({
      where: { phaseId, weekNumber: parseInt(weekNumber) }
    });
    if (existing) {
      return res.status(400).json({ error: `Week number ${weekNumber} is already defined in this phase.` });
    }

    const week = await prisma.week.create({
      data: {
        phaseId,
        weekNumber: parseInt(weekNumber),
        startDate: start,
        endDate: end,
      }
    });

    return res.status(201).json({ message: 'Week created successfully.', week });
  } catch (error) {
    console.error('Create week error:', error);
    return res.status(500).json({ error: 'Failed to create week.' });
  }
}

export async function updateWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { weekNumber, startDate, endDate } = req.body;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    if (start && end && end <= start) {
      return res.status(400).json({ error: 'End date must be after start date.' });
    }

    const currentWeek = await prisma.week.findUnique({ where: { id } });
    if (!currentWeek) {
      return res.status(404).json({ error: 'Week not found.' });
    }

    if (weekNumber !== undefined) {
      const existing = await prisma.week.findFirst({
        where: { 
          phaseId: currentWeek.phaseId, 
          weekNumber: parseInt(weekNumber),
          NOT: { id } 
        }
      });
      if (existing) {
        return res.status(400).json({ error: `Week number ${weekNumber} is already defined in this phase.` });
      }
    }

    const week = await prisma.week.update({
      where: { id },
      data: {
        weekNumber: weekNumber !== undefined ? parseInt(weekNumber) : undefined,
        startDate: start,
        endDate: end,
      }
    });

    return res.json({ message: 'Week updated successfully.', week });
  } catch (error) {
    console.error('Update week error:', error);
    return res.status(500).json({ error: 'Failed to update week.' });
  }
}

export async function deleteWeek(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await prisma.week.delete({ where: { id } });
    return res.json({ message: 'Week deleted successfully.' });
  } catch (error) {
    console.error('Delete week error:', error);
    return res.status(500).json({ error: 'Failed to delete week.' });
  }
}

// ================= DAYS API =================

export async function getDay(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const studentId = req.user?.id;

    const day = await prisma.day.findUnique({
      where: { id },
      include: {
        resources: true,
        week: {
          include: { phase: true }
        },
        progress: studentId ? {
          where: { studentId }
        } : false
      }
    });

    if (!day) {
      return res.status(404).json({ error: 'Day session not found.' });
    }

    return res.json({ day });
  } catch (error) {
    console.error('Fetch day error:', error);
    return res.status(500).json({ error: 'Failed to retrieve day details.' });
  }
}

export async function createDay(req: AuthenticatedRequest, res: Response) {
  try {
    const { weekId, dayNumber, date, type, title, description, status } = req.body;

    if (!weekId || dayNumber === undefined || !date || !type || !title || !status) {
      return res.status(400).json({ error: 'Week ID, day number (1-7), date, type, title, and status are required.' });
    }

    const dayNum = parseInt(dayNumber);
    if (dayNum < 1 || dayNum > 7) {
      return res.status(400).json({ error: 'Day number must be between 1 and 7.' });
    }

    // Verify week exists
    const week = await prisma.week.findUnique({ where: { id: weekId } });
    if (!week) {
      return res.status(404).json({ error: 'Week not found.' });
    }

    // Validation: Duplicate day in week
    const existing = await prisma.day.findFirst({
      where: { weekId, dayNumber: dayNum }
    });
    if (existing) {
      return res.status(400).json({ error: `Day ${dayNum} is already defined in this week.` });
    }

    const day = await prisma.day.create({
      data: {
        weekId,
        dayNumber: dayNum,
        date: new Date(date),
        type: type as DayType,
        title,
        description,
        status,
      }
    });

    return res.status(201).json({ message: 'Day session created successfully.', day });
  } catch (error) {
    console.error('Create day error:', error);
    return res.status(500).json({ error: 'Failed to create day.' });
  }
}

export async function updateDay(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { dayNumber, date, type, title, description, status } = req.body;

    const currentDay = await prisma.day.findUnique({ where: { id } });
    if (!currentDay) {
      return res.status(404).json({ error: 'Day not found.' });
    }

    if (dayNumber !== undefined) {
      const dayNum = parseInt(dayNumber);
      if (dayNum < 1 || dayNum > 7) {
        return res.status(400).json({ error: 'Day number must be between 1 and 7.' });
      }

      const existing = await prisma.day.findFirst({
        where: { 
          weekId: currentDay.weekId, 
          dayNumber: dayNum,
          NOT: { id } 
        }
      });
      if (existing) {
        return res.status(400).json({ error: `Day ${dayNum} is already defined in this week.` });
      }
    }

    const day = await prisma.day.update({
      where: { id },
      data: {
        dayNumber: dayNumber !== undefined ? parseInt(dayNumber) : undefined,
        date: date ? new Date(date) : undefined,
        type: type ? (type as DayType) : undefined,
        title,
        description,
        status,
      }
    });

    return res.json({ message: 'Day session updated successfully.', day });
  } catch (error) {
    console.error('Update day error:', error);
    return res.status(500).json({ error: 'Failed to update day.' });
  }
}

export async function deleteDay(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await prisma.day.delete({ where: { id } });
    return res.json({ message: 'Day session deleted successfully.' });
  } catch (error) {
    console.error('Delete day error:', error);
    return res.status(500).json({ error: 'Failed to delete day.' });
  }
}

// ================= DAY RESOURCES API =================

export async function createResource(req: AuthenticatedRequest, res: Response) {
  try {
    const { dayId, title, resourceType, url, description } = req.body;

    if (!dayId || !title || !resourceType || !url) {
      return res.status(400).json({ error: 'Day ID, title, resource type, and URL are required.' });
    }

    // Verify day exists
    const day = await prisma.day.findUnique({ where: { id: dayId } });
    if (!day) {
      return res.status(404).json({ error: 'Day session not found.' });
    }

    // Validate resource URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Please enter a valid resource URL.' });
    }

    const resource = await prisma.dayResource.create({
      data: {
        dayId,
        title,
        resourceType,
        url,
        description,
      }
    });

    return res.status(201).json({ message: 'Resource added successfully.', resource });
  } catch (error) {
    console.error('Create resource error:', error);
    return res.status(500).json({ error: 'Failed to add day resource.' });
  }
}

export async function updateResource(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, resourceType, url, description } = req.body;

    if (url) {
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: 'Please enter a valid resource URL.' });
      }
    }

    const resource = await prisma.dayResource.update({
      where: { id },
      data: {
        title,
        resourceType,
        url,
        description,
      }
    });

    return res.json({ message: 'Resource updated successfully.', resource });
  } catch (error) {
    console.error('Update resource error:', error);
    return res.status(500).json({ error: 'Failed to update day resource.' });
  }
}

export async function deleteResource(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await prisma.dayResource.delete({ where: { id } });
    return res.json({ message: 'Resource removed successfully.' });
  } catch (error) {
    console.error('Delete resource error:', error);
    return res.status(500).json({ error: 'Failed to delete resource.' });
  }
}

// ================= PROGRESS TRACKING API =================

export async function toggleProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const studentId = req.user?.id;
    const { dayId } = req.body;

    if (!studentId) {
      return res.status(401).json({ error: 'Student authentication required.' });
    }

    if (!dayId) {
      return res.status(400).json({ error: 'Day ID is required.' });
    }

    // Verify day exists
    const day = await prisma.day.findUnique({
      where: { id: dayId },
      include: {
        week: {
          include: { phase: true }
        }
      }
    });

    if (!day) {
      return res.status(404).json({ error: 'Day session not found.' });
    }

    // Check if progress already marked
    const existingProgress = await prisma.studentProgress.findUnique({
      where: {
        studentId_dayId: {
          studentId,
          dayId,
        }
      }
    });

    let completed = false;

    if (existingProgress) {
      // Toggle off: Delete progress
      await prisma.studentProgress.delete({
        where: { id: existingProgress.id }
      });
      completed = false;
    } else {
      // Toggle on: Create progress
      await prisma.studentProgress.create({
        data: {
          studentId,
          dayId,
          weekId: day.weekId,
          phaseId: day.week.phaseId,
          completed: true,
        }
      });
      completed = true;

      // Automatically update student's current position to this day
      await prisma.profile.update({
        where: { id: studentId },
        data: {
          currentPhase: day.week.phase.title,
          currentWeek: day.week.weekNumber,
          currentDay: day.dayNumber,
        }
      });
    }

    return res.json({ 
      message: completed ? 'Session marked as completed.' : 'Session marked as incomplete.',
      completed
    });
  } catch (error) {
    console.error('Toggle progress error:', error);
    return res.status(500).json({ error: 'Failed to toggle session progress.' });
  }
}

export async function getProgressSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const totalDays = await prisma.day.count();
    const completedDays = await prisma.studentProgress.count({
      where: { studentId, completed: true }
    });

    const studentProfile = await prisma.profile.findUnique({
      where: { id: studentId },
      select: {
        currentPhase: true,
        currentWeek: true,
        currentDay: true,
      }
    });

    const completionPercentage = totalDays > 0 
      ? Math.round((completedDays / totalDays) * 100) 
      : 0;

    return res.json({
      totalDays,
      completedDays,
      remainingDays: Math.max(0, totalDays - completedDays),
      completionPercentage,
      currentPhase: studentProfile?.currentPhase || 'Phase 1',
      currentWeek: studentProfile?.currentWeek || 1,
      currentDay: studentProfile?.currentDay || 1,
    });
  } catch (error) {
    console.error('Fetch progress summary error:', error);
    return res.status(500).json({ error: 'Failed to retrieve progress stats.' });
  }
}
