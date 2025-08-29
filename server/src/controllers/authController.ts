import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateUserRequest, LoginRequest, ApiResponse } from '../types';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import prisma from '../lib/prisma';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
      return;
    }

    const { email, password, first_name, last_name }: CreateUserRequest = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true
      }
    });

    // Générer le token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    const response: ApiResponse = {
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user,
        token
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
      return;
    }

    const { email, password }: LoginRequest = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
      return;
    }

    // Générer le token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    const response: ApiResponse = {
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          created_at: user.created_at
        },
        token
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};
