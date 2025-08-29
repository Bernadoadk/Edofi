import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, CreateEventRequest, UpdateEventRequest, EventFilters, ApiResponse } from '../types';
import prisma from '../lib/prisma';

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('=== DEBUG: Données reçues ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);
    console.log('=== FIN DEBUG ===');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('=== ERREURS DE VALIDATION ===');
      console.log(errors.array());
      console.log('=== FIN ERREURS ===');
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
      return;
    }

    const eventData: CreateEventRequest = req.body;
    const bannerImage = req.file;

    // Préparer les données pour Prisma
    const prismaEventData = {
      ...eventData,
      user_id: req.user.id,
      category_id: parseInt(eventData.category_id.toString()),
      start_date: new Date(eventData.start_date),
      end_date: eventData.end_date ? new Date(eventData.end_date) : null,
      end_time: eventData.end_time || eventData.start_time, // Utiliser start_time comme fallback
      location_lat: parseFloat(eventData.location_lat.toString()),
      location_lng: parseFloat(eventData.location_lng.toString()),
      duration_value: parseInt((eventData.duration_value || 0).toString()),
                    banner_image: bannerImage?.filename || null,
              is_published: String(eventData.is_published) === 'true'
    };

    // Calculer la date et heure de fin si pas fournies mais que la durée est fournie
    if (!prismaEventData.end_date && prismaEventData.duration_type && prismaEventData.duration_value) {
      const startDateTime = new Date(`${eventData.start_date}T${eventData.start_time}`);
      const endDateTime = new Date(startDateTime);
      
      if (prismaEventData.duration_type === 'days') {
        endDateTime.setDate(endDateTime.getDate() + parseInt((prismaEventData.duration_value || 0).toString()));
      } else if (prismaEventData.duration_type === 'hours') {
        endDateTime.setHours(endDateTime.getHours() + parseInt((prismaEventData.duration_value || 0).toString()));
      }
      
      prismaEventData.end_date = endDateTime;
      prismaEventData.end_time = endDateTime.toTimeString().slice(0, 5);
    }

    const event = await prisma.event.create({
      data: prismaEventData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Événement créé avec succès',
      data: event
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Erreur création événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement'
    });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category_id,
      search,
      location,
      limit = 20,
      offset = 0,
      upcoming
    } = req.query;

    console.log('=== DEBUG getEvents ===');
    console.log('Query params:', req.query);

    // Construire les filtres Prisma
    const where: any = {
      is_published: true // Remis en place pour ne montrer que les événements publiés
    };

    if (category_id) {
      where.category_id = parseInt(category_id as string);
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (location) {
      where.location_address = { contains: location as string, mode: 'insensitive' };
    }

    if (upcoming === 'true') {
      const now = new Date();
      where.OR = [
        { start_date: { gt: now } },
        {
          AND: [
            { start_date: { gte: new Date(now.toISOString().split('T')[0]) } },
            { start_time: { gt: now.toTimeString().slice(0, 5) } }
          ]
        }
      ];
    }

    console.log('Where clause:', where);

    const events = await prisma.event.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      },
      orderBy: [
        { start_date: 'asc' },
        { start_time: 'asc' }
      ],
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    console.log('Events found:', events.length);
    console.log('Events:', events.map(e => ({ id: e.id, title: e.title, is_published: e.is_published })));

    const total = await prisma.event.count({ where });

    const response: ApiResponse = {
      success: true,
      message: 'Événements récupérés avec succès',
      data: events,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total
      }
    };

    console.log('=== FIN DEBUG getEvents ===');
    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur récupération événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Événement récupéré avec succès',
      data: event
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur récupération événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement'
    });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
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

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
      return;
    }

    const { id } = req.params;
    const updateData: UpdateEventRequest = req.body;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    if (existingEvent.user_id !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cet événement'
      });
      return;
    }

    // Préparer les données de mise à jour
    const prismaUpdateData: any = { ...updateData };
    
    if (updateData.start_date) {
      prismaUpdateData.start_date = new Date(updateData.start_date);
    }
    if (updateData.end_date) {
      prismaUpdateData.end_date = new Date(updateData.end_date);
    }
    if (updateData.location_lat) {
      prismaUpdateData.location_lat = parseFloat(updateData.location_lat.toString());
    }
    if (updateData.location_lng) {
      prismaUpdateData.location_lng = parseFloat(updateData.location_lng.toString());
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: prismaUpdateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Événement mis à jour avec succès',
      data: updatedEvent
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur mise à jour événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'événement'
    });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
      return;
    }

    const { id } = req.params;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    if (event.user_id !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cet événement'
      });
      return;
    }

    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Événement supprimé avec succès'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur suppression événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement'
    });
  }
};

export const toggleEventPublish = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
      return;
    }

    const { id } = req.params;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    if (event.user_id !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cet événement'
      });
      return;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { is_published: !event.is_published },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true
          }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      message: `Événement ${updatedEvent.is_published ? 'publié' : 'dépublié'} avec succès`,
      data: updatedEvent
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur toggle publication événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification du statut de publication'
    });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Catégories récupérées avec succès',
      data: categories
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
};

export const getAllEventsDebug = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== DEBUG getAllEventsDebug ===');
    
    const events = await prisma.event.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    console.log('Total events in database:', events.length);
    console.log('Events details:', events.map(e => ({
      id: e.id,
      title: e.title,
      is_published: e.is_published,
      user_id: e.user_id,
      category_id: e.category_id
    })));

    const response: ApiResponse = {
      success: true,
      message: 'Tous les événements (debug)',
      data: events
    };

    console.log('=== FIN DEBUG getAllEventsDebug ===');
    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur debug événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements (debug)'
    });
  }
};

export const getUserEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non authentifié'
      });
      return;
    }

    const {
      limit = 20,
      offset = 0
    } = req.query;

    const events = await prisma.event.findMany({
      where: {
        user_id: req.user.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        }
      },
      orderBy: [
        { created_at: 'desc' }
      ],
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    const total = await prisma.event.count({
      where: {
        user_id: req.user.id
      }
    });

    const response: ApiResponse = {
      success: true,
      message: 'Événements de l\'utilisateur récupérés avec succès',
      data: events,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erreur récupération événements utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};
