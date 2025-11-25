// Team Routes - Team CRUD, Invitation, and Member Management
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireTeamOwner, requireTeamAdmin, requireTeamMember } from '../middleware/teamAuth.js';
import { generateInviteCode } from '../lib/inviteCodeGenerator.js';

const router: Router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(requireAuth);

// POST /teams - Create team
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    // Create team and add creator as owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: name.trim(),
          ownerId: userId,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: 'owner',
        },
      });

      return team;
    });

    res.status(201).json({ team: result });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// GET /teams - Get all user's teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const memberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const teams = memberships.map((m) => ({
      ...m.team,
      myRole: m.role,
      memberCount: m.team._count.members,
    }));

    res.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// GET /teams/:id - Get single team details
router.get('/:id', requireTeamMember, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const teamId = req.params.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Get user's role
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    res.json({
      team: {
        ...team,
        myRole: membership?.role,
        memberCount: team._count.members,
      },
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// PUT /teams/:id - Update team (owner only)
router.put('/:id', requireTeamOwner, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await prisma.team.update({
      where: { id: req.params.id },
      data: { name: name.trim() },
    });

    res.json({ team });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// DELETE /teams/:id - Delete team (owner only)
router.delete('/:id', requireTeamOwner, async (req: Request, res: Response) => {
  try {
    await prisma.team.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

// POST /teams/:id/invites - Generate invite code (owner/admin only)
router.post('/:id/invites', requireTeamAdmin, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const teamId = req.params.id;
    const { expiresAt, maxUses } = req.body;

    // Default: expires in 7 days
    const expirationDate = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Validate expiration date
    if (expirationDate <= new Date()) {
      return res.status(400).json({ error: 'Expiration date must be in the future' });
    }

    // Default: max 10 uses
    const maxUsesValue = maxUses && typeof maxUses === 'number' && maxUses > 0
      ? maxUses
      : 10;

    const code = generateInviteCode();

    const inviteCode = await prisma.inviteCode.create({
      data: {
        code,
        teamId,
        createdById: userId,
        expiresAt: expirationDate,
        maxUses: maxUsesValue,
      },
    });

    // Generate invite URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const inviteUrl = `${frontendUrl}/join/${code}`;

    res.status(201).json({
      inviteCode,
      inviteUrl,
    });
  } catch (error) {
    console.error('Error generating invite:', error);
    res.status(500).json({ error: 'Failed to generate invite code' });
  }
});

// GET /teams/:id/invites - Get active invite codes (owner/admin only)
router.get('/:id/invites', requireTeamAdmin, async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;

    const invites = await prisma.inviteCode.findMany({
      where: {
        teamId,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ invites });
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
});

// POST /teams/join/:code - Join team via invite code
router.post('/join/:code', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { code } = req.params;

    // Find and validate invite code
    const invite = await prisma.inviteCode.findUnique({
      where: { code },
      include: {
        team: true,
      },
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    // Check expiration
    if (invite.expiresAt <= new Date()) {
      return res.status(400).json({ error: 'Invite code has expired' });
    }

    // Check usage limit
    if (invite.usedCount >= invite.maxUses) {
      return res.status(400).json({ error: 'Invite code has reached maximum uses' });
    }

    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: invite.teamId,
          userId,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member of this team' });
    }

    // Add member and increment usage count in transaction
    const result = await prisma.$transaction(async (tx) => {
      const member = await tx.teamMember.create({
        data: {
          teamId: invite.teamId,
          userId,
          role: 'member',
        },
      });

      await tx.inviteCode.update({
        where: { id: invite.id },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });

      return member;
    });

    res.status(201).json({
      team: invite.team,
      membership: result,
      message: 'Successfully joined team',
    });
  } catch (error) {
    console.error('Error joining team:', error);
    res.status(500).json({ error: 'Failed to join team' });
  }
});

// GET /teams/:id/members - Get team members
router.get('/:id/members', requireTeamMember, async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;

    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // owner first, then admin, then member
        { joinedAt: 'asc' },
      ],
    });

    res.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// DELETE /teams/:id/members/:userId - Remove member (owner/admin only)
router.delete('/:id/members/:userId', requireTeamAdmin, async (req: Request, res: Response) => {
  try {
    const requesterId = (req.user as any).id;
    const teamId = req.params.id;
    const targetUserId = req.params.userId;

    // Get team to check owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Cannot remove owner
    if (targetUserId === team.ownerId) {
      return res.status(403).json({ error: 'Cannot remove team owner' });
    }

    // Cannot remove self unless not owner
    if (targetUserId === requesterId && requesterId === team.ownerId) {
      return res.status(403).json({ error: 'Owner cannot leave team. Please delete the team or transfer ownership first.' });
    }

    // Check if target is a member
    const targetMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
    });

    if (!targetMember) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// GET /teams/:id/canvases - Get team canvases (team members only)
router.get('/:id/canvases', requireTeamMember, async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;

    const canvases = await prisma.canvas.findMany({
      where: {
        teamId,
        visibility: 'team',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ canvases });
  } catch (error) {
    console.error('Error fetching team canvases:', error);
    res.status(500).json({ error: 'Failed to fetch team canvases' });
  }
});

export default router;
