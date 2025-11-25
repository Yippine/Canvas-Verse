// Invite Code Generator
// Generates unique invite codes using nanoid
import { nanoid } from 'nanoid';

export const generateInviteCode = (): string => {
  // Generate 12-character unique code
  return nanoid(12);
};
