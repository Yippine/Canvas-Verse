// Canvas CRUD Routes
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';

const router: Router = Router();
const prisma = new PrismaClient();

// All routes require authentication
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

    await prisma.canvas.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Canvas deleted successfully' });
  } catch (error) {
    console.error('Error deleting canvas:', error);
    res.status(500).json({ error: 'Failed to delete canvas' });
  }
});

export default router;
