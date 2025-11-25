// Share Token Generator - Phase 6
// Generates cryptographically secure tokens for public canvas sharing
import crypto from 'crypto';

/**
 * Generate a secure share token for public canvas links
 * @returns 64-character hex string (32 bytes of entropy)
 */
export function generateShareToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
