import notificationService from './notificationService';
import { NotificationType } from '../types/notifications';

export interface NotificationTrigger {
  action: string;
  description: string;
  notificationType: NotificationType;
  variables: Record<string, any>;
  data?: any;
}

class NotificationTriggers {
  // Déclencher une notification lors de la création d'un événement
  async onEventCreated(userId: number, eventTitle: string, eventId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_FEATURE,
        { event_title: eventTitle },
        { eventId, eventTitle }
      );
    } catch (error) {
      console.error('Error triggering event created notification:', error);
    }
  }

  // Déclencher une notification lors de la modification d'un événement
  async onEventModified(userId: number, eventTitle: string, eventId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_MODIFIED,
        { event_title: eventTitle },
        { eventId, eventTitle }
      );
    } catch (error) {
      console.error('Error triggering event modified notification:', error);
    }
  }

  // Déclencher une notification lors de l'annulation d'un événement
  async onEventCancelled(userId: number, eventTitle: string, eventId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_CANCELLED,
        { event_title: eventTitle },
        { eventId, eventTitle }
      );
    } catch (error) {
      console.error('Error triggering event cancelled notification:', error);
    }
  }

  // Déclencher une notification lors d'une nouvelle réservation
  async onNewBooking(
    eventOwnerId: number, 
    participantName: string, 
    eventTitle: string, 
    eventId: number
  ) {
    try {
      await notificationService.createNotificationWithPreferences(
        eventOwnerId,
        NotificationType.NEW_BOOKING,
        { participant_name: participantName, event_title: eventTitle },
        { eventId, eventTitle, participantName }
      );
    } catch (error) {
      console.error('Error triggering new booking notification:', error);
    }
  }

  // Déclencher une notification lors d'un paiement reçu
  async onPaymentReceived(
    eventOwnerId: number, 
    amount: string, 
    eventTitle: string, 
    eventId: number
  ) {
    try {
      await notificationService.createNotificationWithPreferences(
        eventOwnerId,
        NotificationType.PAYMENT_RECEIVED,
        { amount, event_title: eventTitle },
        { eventId, eventTitle, amount }
      );
    } catch (error) {
      console.error('Error triggering payment received notification:', error);
    }
  }

  // Déclencher une notification lors d'un nouveau commentaire
  async onNewComment(
    eventOwnerId: number, 
    commenterName: string, 
    eventTitle: string, 
    eventId: number
  ) {
    try {
      await notificationService.createNotificationWithPreferences(
        eventOwnerId,
        NotificationType.NEW_COMMENT,
        { commenter_name: commenterName, event_title: eventTitle },
        { eventId, eventTitle, commenterName }
      );
    } catch (error) {
      console.error('Error triggering new comment notification:', error);
    }
  }

  // Déclencher une notification lors d'un nouveau follower
  async onNewFollower(userId: number, followerName: string) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_FOLLOWER,
        { follower_name: followerName },
        { followerName }
      );
    } catch (error) {
      console.error('Error triggering new follower notification:', error);
    }
  }

  // Déclencher une notification lors d'un partage d'événement
  async onEventShared(userId: number, eventTitle: string, eventId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_SHARED,
        { event_title: eventTitle },
        { eventId, eventTitle }
      );
    } catch (error) {
      console.error('Error triggering event shared notification:', error);
    }
  }

  // Déclencher une notification lors d'un rappel d'événement
  async onEventReminder(userId: number, eventTitle: string, timeRemaining: string, eventId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_REMINDER,
        { event_title: eventTitle, time_remaining: timeRemaining },
        { eventId, eventTitle, timeRemaining }
      );
    } catch (error) {
      console.error('Error triggering event reminder notification:', error);
    }
  }

  // Déclencher une notification lors d'un événement en tendance
  async onEventTrending(userId: number, eventTitle: string, eventId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.EVENT_TRENDING,
        { event_title: eventTitle },
        { eventId, eventTitle }
      );
    } catch (error) {
      console.error('Error triggering event trending notification:', error);
    }
  }

  // Déclencher une notification lors d'événements à proximité
  async onNearbyEvents(userId: number, eventCount: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEARBY_EVENTS,
        { event_count: eventCount },
        { eventCount }
      );
    } catch (error) {
      console.error('Error triggering nearby events notification:', error);
    }
  }

  // Déclencher une notification de bienvenue pour un nouvel utilisateur
  async onUserRegistered(userId: number, userName: string) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_FEATURE,
        { user_name: userName },
        { userName, type: 'welcome' }
      );
    } catch (error) {
      console.error('Error triggering welcome notification:', error);
    }
  }

  // Déclencher une notification de connexion depuis un nouvel appareil
  async onNewLogin(userId: number, location: string) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_LOGIN,
        { location },
        { location, type: 'security' }
      );
    } catch (error) {
      console.error('Error triggering new login notification:', error);
    }
  }

  // Déclencher une notification de promotion commerciale
  async onCommercialPromotion(
    userId: number, 
    promotionType: string, 
    discountPercent?: number
  ) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.SEASONAL_DISCOUNT,
        { promotion_type: promotionType, discount_percent: discountPercent },
        { promotionType, discountPercent }
      );
    } catch (error) {
      console.error('Error triggering commercial promotion notification:', error);
    }
  }

  // Déclencher une notification de maintenance
  async onMaintenanceScheduled(userId: number, maintenanceDate: string) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.MAINTENANCE_SCHEDULED,
        { maintenance_date: maintenanceDate },
        { maintenanceDate, type: 'maintenance' }
      );
    } catch (error) {
      console.error('Error triggering maintenance notification:', error);
    }
  }

  // Déclencher une notification de statistiques quotidiennes
  async onDailyStats(userId: number, stats: { views: number; bookings: number; revenue: number }) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.DAILY_STATS,
        { 
          views: stats.views, 
          bookings: stats.bookings, 
          revenue: stats.revenue 
        },
        { ...stats, type: 'daily_stats' }
      );
    } catch (error) {
      console.error('Error triggering daily stats notification:', error);
    }
  }

  // Déclencher une notification de weekend
  async onWeekendEvents(userId: number) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.WEEKEND_EVENTS,
        {},
        { type: 'weekend_reminder' }
      );
    } catch (error) {
      console.error('Error triggering weekend events notification:', error);
    }
  }

  // Déclencher une notification de saison
  async onSeasonalEvents(userId: number, season: string) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.SEASONAL_EVENTS,
        { season },
        { season, type: 'seasonal' }
      );
    } catch (error) {
      console.error('Error triggering seasonal events notification:', error);
    }
  }

  // Déclencher une notification de nouvelle fonctionnalité
  async onNewFeature(userId: number, featureName: string) {
    try {
      await notificationService.createNotificationWithPreferences(
        userId,
        NotificationType.NEW_FEATURE,
        { feature_name: featureName },
        { featureName, type: 'new_feature' }
      );
    } catch (error) {
      console.error('Error triggering new feature notification:', error);
    }
  }
}

export default new NotificationTriggers();
