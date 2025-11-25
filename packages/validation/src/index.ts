// Canvas-Verse Validation Schemas
// CFDS: Code (input validation) + Data (schema constraints) + State (validation rules)
import { z } from 'zod';

// ============= Auth Validation Schemas =============
// CFDS: Input validation for authentication endpoints

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
});

export const authResponseSchema = z.object({
  user: sessionUserSchema,
  message: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SessionUserType = z.infer<typeof sessionUserSchema>;
export type AuthResponseType = z.infer<typeof authResponseSchema>;

// ============= Canvas Validation Schemas =============

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  createdAt: z.date(),
});

export const canvasSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  width: z.number().positive(),
  height: z.number().positive(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const canvasElementSchema = z.object({
  id: z.string(),
  canvasId: z.string(),
  type: z.enum(['shape', 'text', 'image']),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  data: z.record(z.unknown()),
});
