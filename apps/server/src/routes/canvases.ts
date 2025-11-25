// Canvas CRUD Routes
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';
import { generateShareToken } from '../lib/shareTokenGenerator.js';

const router: Router = Router();
const prisma = new PrismaClient();

// GET /canvases/examples - Public endpoint to get example canvases (no auth required)
router.get('/examples', async (req: Request, res: Response) => {
  try {
    const examples = await prisma.canvas.findMany({
      where: { isExample: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        type: true,
        code: true,
        description: true,
        tags: true,
        isExample: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    res.json({ canvases: examples });
  } catch (error) {
    console.error('Error fetching examples:', error);
    res.status(500).json({ error: 'Failed to fetch examples' });
  }
});

// POST /canvases/:id/copy - Copy a canvas (example or user's own) to user's collection
router.post('/:id/copy', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const sourceCanvas = await prisma.canvas.findUnique({
      where: { id: req.params.id }
    });

    if (!sourceCanvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    // Create a copy for the current user
    const copiedCanvas = await prisma.canvas.create({
      data: {
        title: `${sourceCanvas.title} (Copy)`,
        type: sourceCanvas.type,
        code: sourceCanvas.code,
        description: sourceCanvas.description,
        tags: sourceCanvas.tags,
        userId,
        isExample: false, // Copies are never examples
        isPublic: false,
        views: 0,
      }
    });

    res.status(201).json({ canvas: copiedCanvas });
  } catch (error) {
    console.error('Error copying canvas:', error);
    res.status(500).json({ error: 'Failed to copy canvas' });
  }
});

// GET /canvases/shared/:token - Public endpoint to view shared canvas (no auth required)
router.get('/shared/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const canvas = await prisma.canvas.findFirst({
      where: {
        shareToken: token,
        visibility: 'public',
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
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found or not publicly shared' });
    }

    // Optional: Increment view count
    await prisma.canvas.update({
      where: { id: canvas.id },
      data: { views: { increment: 1 } },
    });

    res.json({ canvas });
  } catch (error) {
    console.error('Error fetching shared canvas:', error);
    res.status(500).json({ error: 'Failed to fetch shared canvas' });
  }
});

// All routes below require authentication
router.use(requireAuth);

// GET /canvases - Get all user's canvases
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const canvases = await prisma.canvas.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ canvases });
  } catch (error) {
    console.error('Error fetching canvases:', error);
    res.status(500).json({ error: 'Failed to fetch canvases' });
  }
});

// GET /canvases/:id - Get single canvas
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const canvas = await prisma.canvas.findFirst({
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    res.json({ canvas });
  } catch (error) {
    console.error('Error fetching canvas:', error);
    res.status(500).json({ error: 'Failed to fetch canvas' });
  }
});

// POST /canvases - Create new canvas
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { title, type, code, description, tags } = req.body;

    if (!title || !type || !code) {
      return res.status(400).json({ error: 'Missing required fields: title, type, code' });
    }

    const canvas = await prisma.canvas.create({
      data: {
        title,
        type,
        code,
        description: description || '',
        tags: JSON.stringify(tags || []),
        userId,
        isPublic: false,
        views: 0
      }
    });

    res.status(201).json({ canvas });
  } catch (error) {
    console.error('Error creating canvas:', error);
    res.status(500).json({ error: 'Failed to create canvas' });
  }
});

// PUT /canvases/:id - Update canvas
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { title, type, code, description, tags } = req.body;

    const canvas = await prisma.canvas.findFirst({
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    // Protection: Prevent editing example canvases
    if (canvas.isExample) {
      return res.status(403).json({ error: 'Cannot edit example canvases. Please copy it to your collection first.' });
    }

    const updated = await prisma.canvas.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(code && { code }),
        ...(description !== undefined && { description }),
        ...(tags && { tags: JSON.stringify(tags) })
      }
    });

    res.json({ canvas: updated });
  } catch (error) {
    console.error('Error updating canvas:', error);
    res.status(500).json({ error: 'Failed to update canvas' });
  }
});

// DELETE /canvases/:id - Delete canvas
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const canvas = await prisma.canvas.findFirst({
      where: {
        id: req.params.id,
        userId
      }
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    // Protection: Prevent deleting example canvases
    if (canvas.isExample) {
      return res.status(403).json({ error: 'Cannot delete example canvases.' });
    }

    await prisma.canvas.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Canvas deleted successfully' });
  } catch (error) {
    console.error('Error deleting canvas:', error);
    res.status(500).json({ error: 'Failed to delete canvas' });
  }
});

// PUT /canvases/:id/visibility - Set canvas visibility (owner only)
router.put('/:id/visibility', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { visibility, teamId } = req.body;

    // Validate visibility value
    if (!['private', 'team', 'public'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility. Must be private, team, or public' });
    }

    // Check canvas ownership
    const canvas = await prisma.canvas.findFirst({
      where: {
        id: req.params.id,
        userId,
      },
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    // If visibility is team, validate teamId and membership
    if (visibility === 'team') {
      if (!teamId) {
        return res.status(400).json({ error: 'teamId is required when visibility is team' });
      }

      // Verify user is a member of the team
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      });

      if (!membership) {
        return res.status(403).json({ error: 'You must be a member of the team to share with it' });
      }
    }

    // Update canvas visibility
    const updated = await prisma.canvas.update({
      where: { id: req.params.id },
      data: {
        visibility,
        teamId: visibility === 'team' ? teamId : null,
      },
    });

    res.json({ canvas: updated });
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

// POST /canvases/:id/share - Generate public share link (owner only)
router.post('/:id/share', async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    // Check canvas ownership
    const canvas = await prisma.canvas.findFirst({
      where: {
        id: req.params.id,
        userId,
      },
    });

    if (!canvas) {
      return res.status(404).json({ error: 'Canvas not found' });
    }

    // Generate share token if not exists
    let shareToken = canvas.shareToken;
    if (!shareToken) {
      shareToken = generateShareToken();
    }

    // Update canvas with share token and set visibility to public
    const updated = await prisma.canvas.update({
      where: { id: req.params.id },
      data: {
        shareToken,
        visibility: 'public',
      },
    });

    // Construct share URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const shareUrl = `${frontendUrl}/shared/${shareToken}`;

    res.json({
      shareToken,
      shareUrl,
      canvas: updated,
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ error: 'Failed to generate share link' });
  }
});

export default router;
