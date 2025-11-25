// Auth Routes - Google OAuth
import { Router, Request, Response } from 'express';
import passport from '../lib/passport.js';

const router: Router = Router();

// GET /auth/google - Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// GET /auth/google/callback - Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect to frontend
    res.redirect(process.env.CORS_ORIGIN || 'http://localhost:5173');
  }
);

// GET /auth/me - Get current user
router.get('/me', (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.user });
});

// GET /auth/logout - Logout
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
