// Canvas-Verse Server Entry Point
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from './lib/passport.js';
import authRouter from './routes/auth.js';
import canvasesRouter from './routes/canvases.js';

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3004;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware: JSON body parser
app.use(express.json());

// Middleware: CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware: Cookie parser
app.use(cookieParser());

// Middleware: Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware: Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware: Request logging (development)
if (NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Routes
// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Canvas-Verse Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Auth routes
app.use('/api/auth', authRouter);

// Canvas routes
app.use('/api/canvases', canvasesRouter);

// 404 handler - must be after all other routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${new Date().toISOString()}`, err);

  res.status(500).json({
    error: 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         Canvas-Verse Server Started Successfully              ║
╠════════════════════════════════════════════════════════════════╣
║ Environment:  ${NODE_ENV.padEnd(49)}║
║ Port:         ${String(PORT).padEnd(49)}║
║ Health Check: http://localhost:${String(PORT)}/health${' '.repeat(24 - String(PORT).length)}║
║ Time:         ${new Date().toISOString().padEnd(49)}║
╚════════════════════════════════════════════════════════════════╝
  `);
});
