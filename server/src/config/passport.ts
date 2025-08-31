import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// @ts-ignore
import AppleStrategy from 'passport-apple';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/social/google/callback",
    scope: ['profile', 'email']
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      let user = await prisma.$queryRaw`
        SELECT * FROM users 
        WHERE google_id = ${profile.id} OR email = ${profile.emails?.[0]?.value}
        LIMIT 1
      ` as any;

      if (!user || user.length === 0) {
        // Créer un nouvel utilisateur
        user = await prisma.$executeRaw`
          INSERT INTO users (email, first_name, last_name, google_id, avatar, is_email_verified, auth_provider, created_at, updated_at)
          VALUES (${profile.emails?.[0]?.value || ''}, ${profile.name?.givenName || ''}, ${profile.name?.familyName || ''}, ${profile.id}, ${profile.photos?.[0]?.value || null}, ${profile.emails?.[0]?.verified || false}, 'GOOGLE', NOW(), NOW())
        `;
        
        // Récupérer l'utilisateur créé
        user = await prisma.$queryRaw`
          SELECT * FROM users WHERE google_id = ${profile.id} LIMIT 1
        ` as any;
      } else {
        user = user[0];
        // Mettre à jour les informations si nécessaire
        if (!user.google_id) {
          await prisma.$executeRaw`
            UPDATE users SET google_id = ${profile.id} WHERE id = ${user.id}
          `;
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:5000/api/auth/social/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'photos']
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      // Vérifier si l'utilisateur existe déjà
      let user = await prisma.$queryRaw`
        SELECT * FROM users 
        WHERE facebook_id = ${profile.id} OR email = ${profile.emails?.[0]?.value}
        LIMIT 1
      ` as any;

      if (!user || user.length === 0) {
        // Créer un nouvel utilisateur
        user = await prisma.$executeRaw`
          INSERT INTO users (email, first_name, last_name, facebook_id, avatar, is_email_verified, auth_provider, created_at, updated_at)
          VALUES (${profile.emails?.[0]?.value || ''}, ${profile.name?.givenName || ''}, ${profile.name?.familyName || ''}, ${profile.id}, ${profile.photos?.[0]?.value || null}, false, 'FACEBOOK', NOW(), NOW())
        `;
        
        // Récupérer l'utilisateur créé
        user = await prisma.$queryRaw`
          SELECT * FROM users WHERE facebook_id = ${profile.id} LIMIT 1
        ` as any;
      } else {
        user = user[0];
        // Mettre à jour les informations si nécessaire
        if (!user.facebook_id) {
          await prisma.$executeRaw`
            UPDATE users SET facebook_id = ${profile.id} WHERE id = ${user.id}
          `;
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
}

// Apple Sign-In Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY_PATH) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: process.env.APPLE_CALLBACK_URL || "http://localhost:5000/api/auth/social/apple/callback",
    passReqToCallback: true
  }, async (req: any, accessToken: any, refreshToken: any, idToken: any, profile: any, done: any) => {
    try {
      const appleId = profile.id;
      
      // Vérifier si l'utilisateur existe déjà
      let user = await prisma.$queryRaw`
        SELECT * FROM users 
        WHERE apple_id = ${appleId} OR email = ${profile.email}
        LIMIT 1
      ` as any;

      if (!user || user.length === 0) {
        // Créer un nouvel utilisateur
        user = await prisma.$executeRaw`
          INSERT INTO users (email, first_name, last_name, apple_id, is_email_verified, auth_provider, created_at, updated_at)
          VALUES (${profile.email || ''}, ${profile.name?.firstName || ''}, ${profile.name?.lastName || ''}, ${appleId}, true, 'APPLE', NOW(), NOW())
        `;
        
        // Récupérer l'utilisateur créé
        user = await prisma.$queryRaw`
          SELECT * FROM users WHERE apple_id = ${appleId} LIMIT 1
        ` as any;
      } else {
        user = user[0];
        // Mettre à jour les informations si nécessaire
        if (!user.apple_id) {
          await prisma.$executeRaw`
            UPDATE users SET apple_id = ${appleId} WHERE id = ${user.id}
          `;
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));
}

// Serialize user for the session
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
