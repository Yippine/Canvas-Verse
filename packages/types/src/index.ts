// Canvas-Verse Shared Type Definitions
// CFDS: Type system for entire application

// ============= Auth Types =============
// CFDS: Code (auth flow) + Data (auth payloads) + State (session context)

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export interface AuthResponse {
  user: SessionUser;
  message: string;
}

export interface PasswordHashResult {
  hash: string;
}

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'EMAIL_EXISTS' | 'SESSION_EXPIRED' | 'UNAUTHORIZED';
  message: string;
}

// ============= Canvas Types =============

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Canvas {
  id: string;
  title: string;
  width: number;
  height: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasElement {
  id: string;
  canvasId: string;
  type: 'shape' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  data: Record<string, unknown>;
}
