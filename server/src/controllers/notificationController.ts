import { Request, Response } from 'express';
import notificationService from '../services/notificationService';
import { 
  CreateNotificationRequest, 
  UpdateNotificationRequest, 
  UpdateNotificationPreferenceRequest,
  NotificationFilters,
  NotificationType
} from '../types';

class NotificationController {
  // Obtenir toutes les notifications d'un utilisateur
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const filters: NotificationFilters = {
        type: req.query.type as NotificationType,
        priority: req.query.priority as any,
        status: req.query.status as any,
        read: req.query.read === 'true',
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0
      };

      const notifications = await notificationService.getUserNotifications(userId, filters);
      res.json(notifications);
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      res.status(500).json({ error: 'Failed to get user notifications' });
    }
  }

  // Créer une nouvelle notification
  async createNotification(req: Request, res: Response) {
    try {
      const notificationData: CreateNotificationRequest = req.body;
      const notification = await notificationService.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in createNotification:', error);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }

  // Créer une notification à partir d'un template
  async createNotificationFromTemplate(req: Request, res: Response) {
    try {
      const { userId, type, variables, data } = req.body;
      const notification = await notificationService.createNotificationFromTemplate(
        userId,
        type,
        variables || {},
        data || {}
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in createNotificationFromTemplate:', error);
      res.status(500).json({ error: 'Failed to create notification from template' });
    }
  }

  // Marquer une notification comme lue
  async markAsRead(req: Request, res: Response) {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await notificationService.markAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      await notificationService.markAllAsRead(userId);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
  }

  // Supprimer une notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const notificationId = parseInt(req.params.id);
      await notificationService.deleteNotification(notificationId);
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  }

  // Obtenir les préférences de notifications d'un utilisateur
  async getUserPreferences(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const preferences = await notificationService.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      res.status(500).json({ error: 'Failed to get user preferences' });
    }
  }

  // Mettre à jour les préférences de notifications d'un utilisateur
  async updateUserPreferences(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const preferences: UpdateNotificationPreferenceRequest = req.body;
      const updatedPreferences = await notificationService.updateUserPreferences(userId, preferences);
      res.json(updatedPreferences);
    } catch (error) {
      console.error('Error in updateUserPreferences:', error);
      res.status(500).json({ error: 'Failed to update user preferences' });
    }
  }

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({ error: 'Failed to get unread count' });
    }
  }

  // Créer une notification avec vérification des préférences
  async createNotificationWithPreferences(req: Request, res: Response) {
    try {
      const { userId, type, variables, data } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        type,
        variables || {},
        data || {}
      );
      
      if (notification) {
        res.status(201).json(notification);
      } else {
        res.status(200).json({ message: 'Notification not sent due to user preferences' });
      }
    } catch (error) {
      console.error('Error in createNotificationWithPreferences:', error);
      res.status(500).json({ error: 'Failed to create notification with preferences' });
    }
  }

  // Notifications spécifiques par type

  // Notification de rappel d'événement
  async sendEventReminder(req: Request, res: Response) {
    try {
      const { userId, eventTitle, timeRemaining } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_REMINDER,
        { event_title: eventTitle, time_remaining: timeRemaining },
        { eventTitle, timeRemaining }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendEventReminder:', error);
      res.status(500).json({ error: 'Failed to send event reminder' });
    }
  }

  // Notification de nouvelle réservation
  async sendNewBookingNotification(req: Request, res: Response) {
    try {
      const { userId, participantName, eventTitle } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_BOOKING,
        { participant_name: participantName, event_title: eventTitle },
        { participantName, eventTitle }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendNewBookingNotification:', error);
      res.status(500).json({ error: 'Failed to send new booking notification' });
    }
  }

  // Notification de paiement reçu
  async sendPaymentReceivedNotification(req: Request, res: Response) {
    try {
      const { userId, amount, eventTitle } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.PAYMENT_RECEIVED,
        { amount, event_title: eventTitle },
        { amount, eventTitle }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendPaymentReceivedNotification:', error);
      res.status(500).json({ error: 'Failed to send payment received notification' });
    }
  }

  // Notification d'événement en tendance
  async sendEventTrendingNotification(req: Request, res: Response) {
    try {
      const { userId, eventTitle } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_TRENDING,
        { event_title: eventTitle },
        { eventTitle }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendEventTrendingNotification:', error);
      res.status(500).json({ error: 'Failed to send event trending notification' });
    }
  }

  // Notification d'urgence - événement modifié
  async sendEventModifiedNotification(req: Request, res: Response) {
    try {
      const { userId, eventTitle } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_MODIFIED,
        { event_title: eventTitle },
        { eventTitle }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendEventModifiedNotification:', error);
      res.status(500).json({ error: 'Failed to send event modified notification' });
    }
  }

  // Notification d'urgence - événement annulé
  async sendEventCancelledNotification(req: Request, res: Response) {
    try {
      const { userId, eventTitle } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_CANCELLED,
        { event_title: eventTitle },
        { eventTitle }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendEventCancelledNotification:', error);
      res.status(500).json({ error: 'Failed to send event cancelled notification' });
    }
  }

  // Notification de nouveau commentaire
  async sendNewCommentNotification(req: Request, res: Response) {
    try {
      const { userId, commenterName, eventTitle } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_COMMENT,
        { commenter_name: commenterName, event_title: eventTitle },
        { commenterName, eventTitle }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendNewCommentNotification:', error);
      res.status(500).json({ error: 'Failed to send new comment notification' });
    }
  }

  // Notification de nouveau follower
  async sendNewFollowerNotification(req: Request, res: Response) {
    try {
      const { userId, followerName } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_FOLLOWER,
        { follower_name: followerName },
        { followerName }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendNewFollowerNotification:', error);
      res.status(500).json({ error: 'Failed to send new follower notification' });
    }
  }

  // Notification d'événements à proximité
  async sendNearbyEventsNotification(req: Request, res: Response) {
    try {
      const { userId, eventCount } = req.body;
      const notification = await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEARBY_EVENTS,
        { event_count: eventCount },
        { eventCount }
      );
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendNearbyEventsNotification:', error);
      res.status(500).json({ error: 'Failed to send nearby events notification' });
    }
  }

  // Notification de promotion commerciale
  async sendCommercialPromotionNotification(req: Request, res: Response) {
    try {
      const { userId, promotionType, discountPercent } = req.body;
      let notification;
      
      switch (promotionType) {
        case 'service':
          notification = await notificationService.createNotificationWithPreferences(
            userId,
            NotificationType.SERVICE_PROMOTION,
            {},
            { promotionType }
          );
          break;
        case 'seasonal':
          notification = await notificationService.createNotificationWithPreferences(
            userId,
            NotificationType.SEASONAL_DISCOUNT,
            { discount_percent: discountPercent },
            { promotionType, discountPercent }
          );
          break;
        default:
          notification = await notificationService.createNotificationWithPreferences(
            userId,
            NotificationType.SPECIAL_OFFER,
            { offer_description: promotionType },
            { promotionType }
          );
      }
      
      res.status(201).json(notification);
    } catch (error) {
      console.error('Error in sendCommercialPromotionNotification:', error);
      res.status(500).json({ error: 'Failed to send commercial promotion notification' });
    }
  }

  // Nettoyer les notifications existantes avec des placeholders
  async cleanExistingNotifications(req: Request, res: Response) {
    try {
      await notificationService.cleanExistingNotifications();
      res.json({ message: 'Notifications cleaned successfully' });
    } catch (error) {
      console.error('Error in cleanExistingNotifications:', error);
      res.status(500).json({ error: 'Failed to clean notifications' });
    }
  }
}

export default new NotificationController();
