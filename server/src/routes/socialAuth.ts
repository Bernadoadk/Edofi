import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Fonction utilitaire pour générer le token JWT
const generateToken = (user: any) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      authProvider: user.auth_provider 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

// Fonction utilitaire pour rediriger avec le token
const redirectWithToken = (res: express.Response, token: string, user: any) => {
  const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
  res.redirect(redirectUrl);
};

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = generateToken(user);
      
      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { updated_at: new Date() }
      });

      redirectWithToken(res, token, user);
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed`);
    }
  }
);

// Facebook OAuth Routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = generateToken(user);
      
      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { updated_at: new Date() }
      });

      redirectWithToken(res, token, user);
    } catch (error) {
      console.error('Facebook auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=facebook_auth_failed`);
    }
  }
);

// Apple Sign-In Routes
router.get('/apple', passport.authenticate('apple', { scope: ['email', 'name'] }));

router.get('/apple/callback',
  passport.authenticate('apple', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = generateToken(user);
      
      // Mettre à jour la dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { updated_at: new Date() }
      });

      redirectWithToken(res, token, user);
    } catch (error) {
      console.error('Apple auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=apple_auth_failed`);
    }
  }
);

// Route pour lier un compte social à un compte existant
router.post('/link-account', async (req, res) => {
  try {
    const { userId, provider, providerId, email } = req.body;
    
    const updateData: any = {};
    if (provider === 'google') updateData.google_id = providerId;
    if (provider === 'facebook') updateData.facebook_id = providerId;
    if (provider === 'apple') updateData.apple_id = providerId;
    
    updateData.auth_provider = provider.toUpperCase();
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Compte lié avec succès',
      user
    });
  } catch (error) {
    console.error('Link account error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la liaison du compte'
    });
  }
});

// Route pour vérifier si un email est déjà associé à un compte social
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await prisma.$queryRaw`
      SELECT id, email, auth_provider, google_id, facebook_id, apple_id 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    ` as any;

    const userData = Array.isArray(user) ? user[0] : user;
    
    res.json({
      success: true,
      exists: !!userData,
      user: userData ? {
        id: userData.id,
        email: userData.email,
        authProvider: userData.auth_provider,
        hasGoogle: !!userData.google_id,
        hasFacebook: !!userData.facebook_id,
        hasApple: !!userData.apple_id
      } : null
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
});

export default router;
