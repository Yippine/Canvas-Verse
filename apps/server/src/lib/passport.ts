// Passport Google OAuth Configuration
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Serialize user into session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3004/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              googleId: profile.id,
              name: profile.displayName || profile.emails?.[0]?.value.split('@')[0],
              avatar: profile.photos?.[0]?.value,
            }
          });
        } else if (!user.googleId) {
          // Update existing user with Google ID
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value,
            }
          });
        }

        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;
