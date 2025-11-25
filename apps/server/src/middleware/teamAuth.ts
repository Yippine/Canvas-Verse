// Team Authorization Middleware
// Role-based access control for team operations
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Get team member with role
async function getTeamMember(teamId: string, userId: string) {
  return await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });
}

// Middleware: Require team owner
export async function requireTeamOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any)?.id;
    const teamId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.ownerId !== userId) {
      return res.status(403).json({ error: 'Only team owner can perform this action' });
    }

    next();
  } catch (error) {
    console.error('Error in requireTeamOwner:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
}

// Middleware: Require team admin (owner or admin)
export async function requireTeamAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any)?.id;
    const teamId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const member = await getTeamMember(teamId, userId);

    if (!member) {
      return res.status(403).json({ error: 'Not a team member' });
    }

    if (member.role !== 'owner' && member.role !== 'admin') {
      return res.status(403).json({ error: 'Admin or owner access required' });
    }

    next();
  } catch (error) {
    console.error('Error in requireTeamAdmin:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
}

// Middleware: Require team member
export async function requireTeamMember(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.user as any)?.id;
    const teamId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const member = await getTeamMember(teamId, userId);

    if (!member) {
      return res.status(403).json({ error: 'Not a team member' });
    }

    next();
  } catch (error) {
    console.error('Error in requireTeamMember:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
}
