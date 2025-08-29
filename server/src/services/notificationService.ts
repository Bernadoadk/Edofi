import prisma from '../lib/prisma';
import { 
  NotificationType,
  NotificationStatus,
  NotificationPriority,
  type Notification as PrismaNotification,
  type NotificationPreference as PrismaNotificationPreference
} from '@prisma/client';
import { 
  CreateNotificationRequest, 
  UpdateNotificationRequest, 
  UpdateNotificationPreferenceRequest,
  NotificationFilters,
  NotificationTemplate
} from '../types';

// Templates de notifications
const NOTIFICATION_TEMPLATES: Record<import('@prisma/client').NotificationType, NotificationTemplate> = {
  // Planification
  [NotificationType.EVENT_REMINDER]: {
    type: NotificationType.EVENT_REMINDER,
    title: "Rappel d'événement",
    message: "Votre événement {event_title} commence dans {time_remaining}",
    priority: NotificationPriority.HIGH,
    category: 'planning'
  },
  [NotificationType.CREATION_DEADLINE]: {
    type: NotificationType.CREATION_DEADLINE,
    title: "Deadline de création",
    message: "Il reste {days_remaining} jours pour finaliser votre événement",
    priority: NotificationPriority.MEDIUM,
    category: 'planning'
  },
  [NotificationType.MATERIAL_PREPARATION]: {
    type: NotificationType.MATERIAL_PREPARATION,
    title: "Préparation matériel",
    message: "N'oubliez pas de préparer votre matériel pour {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'planning'
  },
  [NotificationType.FINALIZATION_REMINDER]: {
    type: NotificationType.FINALIZATION_REMINDER,
    title: "Finalisation requise",
    message: "Votre événement {event_title} nécessite une finalisation",
    priority: NotificationPriority.HIGH,
    category: 'planning'
  },
  [NotificationType.MODIFICATION_DEADLINE]: {
    type: NotificationType.MODIFICATION_DEADLINE,
    title: "Deadline de modification",
    message: "Dernière chance de modifier {event_title}",
    priority: NotificationPriority.HIGH,
    category: 'planning'
  },
  [NotificationType.PUBLICATION_REMINDER]: {
    type: NotificationType.PUBLICATION_REMINDER,
    title: "Publication en attente",
    message: "Votre événement {event_title} est prêt à être publié",
    priority: NotificationPriority.MEDIUM,
    category: 'planning'
  },
  [NotificationType.VERIFICATION_REMINDER]: {
    type: NotificationType.VERIFICATION_REMINDER,
    title: "Vérification requise",
    message: "Veuillez vérifier les informations de {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'planning'
  },
  [NotificationType.CONFIGURATION_REMINDER]: {
    type: NotificationType.CONFIGURATION_REMINDER,
    title: "Configuration incomplète",
    message: "La configuration de {event_title} n'est pas complète",
    priority: NotificationPriority.MEDIUM,
    category: 'planning'
  },

  // Réservations
  [NotificationType.NEW_BOOKING]: {
    type: NotificationType.NEW_BOOKING,
    title: "Nouvelle réservation",
    message: "{participant_name} s'est inscrit à {event_title}",
    priority: NotificationPriority.HIGH,
    category: 'booking'
  },
  [NotificationType.BOOKING_CANCELLATION]: {
    type: NotificationType.BOOKING_CANCELLATION,
    title: "Réservation annulée",
    message: "{participant_name} a annulé sa réservation pour {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'booking'
  },
  [NotificationType.CAPACITY_REACHED]: {
    type: NotificationType.CAPACITY_REACHED,
    title: "Capacité atteinte",
    message: "Votre événement {event_title} est complet !",
    priority: NotificationPriority.HIGH,
    category: 'booking'
  },
  [NotificationType.PAYMENT_RECEIVED]: {
    type: NotificationType.PAYMENT_RECEIVED,
    title: "Paiement reçu",
    message: "Paiement de {amount} reçu pour {event_title}",
    priority: NotificationPriority.HIGH,
    category: 'booking'
  },
  [NotificationType.PAYMENT_FAILED]: {
    type: NotificationType.PAYMENT_FAILED,
    title: "Échec de paiement",
    message: "Le paiement pour {event_title} a échoué",
    priority: NotificationPriority.HIGH,
    category: 'booking'
  },
  [NotificationType.REFUND_PROCESSED]: {
    type: NotificationType.REFUND_PROCESSED,
    title: "Remboursement traité",
    message: "Remboursement de {amount} traité pour {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'booking'
  },
  [NotificationType.WAITLIST_ACTIVATED]: {
    type: NotificationType.WAITLIST_ACTIVATED,
    title: "Liste d'attente activée",
    message: "La liste d'attente est maintenant active pour {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'booking'
  },
  [NotificationType.BOOKING_CONFIRMATION]: {
    type: NotificationType.BOOKING_CONFIRMATION,
    title: "Réservation confirmée",
    message: "Votre réservation pour {event_title} est confirmée",
    priority: NotificationPriority.HIGH,
    category: 'booking'
  },
  [NotificationType.PARTICIPANT_REMINDER]: {
    type: NotificationType.PARTICIPANT_REMINDER,
    title: "Rappel participant",
    message: "L'événement {event_title} commence dans {time_remaining}",
    priority: NotificationPriority.HIGH,
    category: 'booking'
  },
  [NotificationType.STATUS_CHANGE]: {
    type: NotificationType.STATUS_CHANGE,
    title: "Changement de statut",
    message: "Le statut de {event_title} a changé : {new_status}",
    priority: NotificationPriority.MEDIUM,
    category: 'booking'
  },
  [NotificationType.NEW_TICKET_AVAILABLE]: {
    type: NotificationType.NEW_TICKET_AVAILABLE,
    title: "Nouveaux billets disponibles",
    message: "De nouveaux billets sont disponibles pour {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'booking'
  },
  [NotificationType.TICKET_PROMOTION]: {
    type: NotificationType.TICKET_PROMOTION,
    title: "Promotion billets",
    message: "Promotion spéciale sur les billets de {event_title}",
    priority: NotificationPriority.MEDIUM,
    category: 'booking'
  },

  // Social
  [NotificationType.NEW_PARTICIPANT]: {
    type: NotificationType.NEW_PARTICIPANT,
    title: "Nouveau participant",
    message: "{participant_name} participe à {event_title}",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.NEW_COMMENT]: {
    type: NotificationType.NEW_COMMENT,
    title: "Nouveau commentaire",
    message: "{commenter_name} a commenté {event_title}",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.EVENT_SHARED]: {
    type: NotificationType.EVENT_SHARED,
    title: "Événement partagé",
    message: "{sharer_name} a partagé {event_title}",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.EVENT_FAVORITED]: {
    type: NotificationType.EVENT_FAVORITED,
    title: "Événement favori",
    message: "{user_name} a ajouté {event_title} à ses favoris",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.NEW_FOLLOWER]: {
    type: NotificationType.NEW_FOLLOWER,
    title: "Nouveau follower",
    message: "{follower_name} vous suit maintenant",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.COMMENT_MENTION]: {
    type: NotificationType.COMMENT_MENTION,
    title: "Mention dans un commentaire",
    message: "{commenter_name} vous a mentionné dans un commentaire",
    priority: NotificationPriority.MEDIUM,
    category: 'social'
  },
  [NotificationType.COMMENT_REPLY]: {
    type: NotificationType.COMMENT_REPLY,
    title: "Réponse à votre commentaire",
    message: "{replier_name} a répondu à votre commentaire",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.EVENT_RECOMMENDED]: {
    type: NotificationType.EVENT_RECOMMENDED,
    title: "Événement recommandé",
    message: "Nous pensons que {event_title} pourrait vous intéresser",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.NEW_LIKE]: {
    type: NotificationType.NEW_LIKE,
    title: "Nouveau like",
    message: "{liker_name} a aimé {event_title}",
    priority: NotificationPriority.LOW,
    category: 'social'
  },
  [NotificationType.NEW_RATING]: {
    type: NotificationType.NEW_RATING,
    title: "Nouvelle évaluation",
    message: "{rater_name} a évalué {event_title} avec {rating} étoiles",
    priority: NotificationPriority.LOW,
    category: 'social'
  },

  // Performance
  [NotificationType.EVENT_TRENDING]: {
    type: NotificationType.EVENT_TRENDING,
    title: "Événement en tendance",
    message: "Votre événement {event_title} est en tendance !",
    priority: NotificationPriority.HIGH,
    category: 'performance'
  },
  [NotificationType.VIEWS_RECORD]: {
    type: NotificationType.VIEWS_RECORD,
    title: "Nouveau record de vues",
    message: "Votre événement {event_title} a battu un record de vues",
    priority: NotificationPriority.MEDIUM,
    category: 'performance'
  },
  [NotificationType.RECOMMENDATION_ENGINE]: {
    type: NotificationType.RECOMMENDATION_ENGINE,
    title: "Recommandation",
    message: "Votre événement {event_title} est recommandé aux utilisateurs",
    priority: NotificationPriority.MEDIUM,
    category: 'performance'
  },
  [NotificationType.DAILY_STATS]: {
    type: NotificationType.DAILY_STATS,
    title: "Statistiques quotidiennes",
    message: "Votre événement {event_title} a eu {views} vues aujourd'hui",
    priority: NotificationPriority.LOW,
    category: 'performance'
  },
  [NotificationType.EVENT_VIRAL]: {
    type: NotificationType.EVENT_VIRAL,
    title: "Événement viral",
    message: "Votre événement {event_title} devient viral !",
    priority: NotificationPriority.HIGH,
    category: 'performance'
  },
  [NotificationType.FOLLOWER_GROWTH]: {
    type: NotificationType.FOLLOWER_GROWTH,
    title: "Croissance des followers",
    message: "Vous avez gagné {new_followers} nouveaux followers",
    priority: NotificationPriority.MEDIUM,
    category: 'performance'
  },
  [NotificationType.EVENT_POPULAR]: {
    type: NotificationType.EVENT_POPULAR,
    title: "Événement populaire",
    message: "Votre événement {event_title} est très populaire",
    priority: NotificationPriority.MEDIUM,
    category: 'performance'
  },
  [NotificationType.GOAL_ACHIEVED]: {
    type: NotificationType.GOAL_ACHIEVED,
    title: "Objectif atteint",
    message: "Félicitations ! Vous avez atteint votre objectif pour {event_title}",
    priority: NotificationPriority.HIGH,
    category: 'performance'
  },

  // Système
  [NotificationType.EMAIL_VERIFICATION]: {
    type: NotificationType.EMAIL_VERIFICATION,
    title: "Vérification email",
    message: "Veuillez vérifier votre adresse email",
    priority: NotificationPriority.HIGH,
    category: 'system'
  },
  [NotificationType.NEW_LOGIN]: {
    type: NotificationType.NEW_LOGIN,
    title: "Nouvelle connexion",
    message: "Nouvelle connexion détectée depuis {location}",
    priority: NotificationPriority.MEDIUM,
    category: 'system'
  },
  [NotificationType.SECURITY_UPDATE]: {
    type: NotificationType.SECURITY_UPDATE,
    title: "Mise à jour sécurité",
    message: "Mise à jour de sécurité disponible",
    priority: NotificationPriority.HIGH,
    category: 'system'
  },
  [NotificationType.NEW_FEATURE]: {
    type: NotificationType.NEW_FEATURE,
    title: "Nouvelle fonctionnalité",
    message: "Découvrez notre nouvelle fonctionnalité : {feature_name}",
    priority: NotificationPriority.LOW,
    category: 'system'
  },
  [NotificationType.MAINTENANCE_SCHEDULED]: {
    type: NotificationType.MAINTENANCE_SCHEDULED,
    title: "Maintenance prévue",
    message: "Maintenance prévue le {maintenance_date}",
    priority: NotificationPriority.MEDIUM,
    category: 'system'
  },
  [NotificationType.TECHNICAL_ISSUE]: {
    type: NotificationType.TECHNICAL_ISSUE,
    title: "Problème technique",
    message: "Un problème technique a été détecté",
    priority: NotificationPriority.HIGH,
    category: 'system'
  },

  // Commercial
  [NotificationType.SERVICE_PROMOTION]: {
    type: NotificationType.SERVICE_PROMOTION,
    title: "Promotion service",
    message: "20% de réduction sur nos frais de service",
    priority: NotificationPriority.LOW,
    category: 'commercial'
  },
  [NotificationType.NEW_CATEGORY]: {
    type: NotificationType.NEW_CATEGORY,
    title: "Nouvelle catégorie",
    message: "Nouvelle catégorie d'événements disponible : {category_name}",
    priority: NotificationPriority.LOW,
    category: 'commercial'
  },
  [NotificationType.SPECIAL_OFFER]: {
    type: NotificationType.SPECIAL_OFFER,
    title: "Offre spéciale",
    message: "Offre spéciale : {offer_description}",
    priority: NotificationPriority.MEDIUM,
    category: 'commercial'
  },
  [NotificationType.PREMIUM_EVENT]: {
    type: NotificationType.PREMIUM_EVENT,
    title: "Événement premium",
    message: "Passez à l'événement premium pour plus de fonctionnalités",
    priority: NotificationPriority.LOW,
    category: 'commercial'
  },
  [NotificationType.SEASONAL_DISCOUNT]: {
    type: NotificationType.SEASONAL_DISCOUNT,
    title: "Réduction saisonnière",
    message: "Réduction saisonnière de {discount_percent}%",
    priority: NotificationPriority.MEDIUM,
    category: 'commercial'
  },
  [NotificationType.NEW_PRICING]: {
    type: NotificationType.NEW_PRICING,
    title: "Nouveau plan tarifaire",
    message: "Découvrez nos nouveaux plans tarifaires",
    priority: NotificationPriority.LOW,
    category: 'commercial'
  },
  [NotificationType.LOYALTY_PROGRAM]: {
    type: NotificationType.LOYALTY_PROGRAM,
    title: "Programme fidélité",
    message: "Rejoignez notre programme fidélité et gagnez des récompenses",
    priority: NotificationPriority.LOW,
    category: 'commercial'
  },
  [NotificationType.SPONSORED_EVENT]: {
    type: NotificationType.SPONSORED_EVENT,
    title: "Événement sponsorisé",
    message: "Sponsorisez votre événement pour plus de visibilité",
    priority: NotificationPriority.LOW,
    category: 'commercial'
  },

  // Personnalisées
  [NotificationType.NEARBY_EVENTS]: {
    type: NotificationType.NEARBY_EVENTS,
    title: "Événements à proximité",
    message: "{event_count} nouveaux événements près de chez vous",
    priority: NotificationPriority.LOW,
    category: 'personalized'
  },
  [NotificationType.SIMILAR_EVENTS]: {
    type: NotificationType.SIMILAR_EVENTS,
    title: "Événements similaires",
    message: "Découvrez des événements similaires à ceux que vous aimez",
    priority: NotificationPriority.LOW,
    category: 'personalized'
  },
  [NotificationType.WEEKEND_EVENTS]: {
    type: NotificationType.WEEKEND_EVENTS,
    title: "Événements du week-end",
    message: "Que faire ce week-end ? Découvrez nos événements",
    priority: NotificationPriority.LOW,
    category: 'personalized'
  },
  [NotificationType.SEASONAL_EVENTS]: {
    type: NotificationType.SEASONAL_EVENTS,
    title: "Événements de saison",
    message: "Événements d'{season} à ne pas manquer",
    priority: NotificationPriority.LOW,
    category: 'personalized'
  },
  [NotificationType.POPULAR_EVENTS]: {
    type: NotificationType.POPULAR_EVENTS,
    title: "Événements populaires",
    message: "Les événements les plus populaires cette semaine",
    priority: NotificationPriority.LOW,
    category: 'personalized'
  },
  [NotificationType.RECOMMENDED_EVENTS]: {
    type: NotificationType.RECOMMENDED_EVENTS,
    title: "Événements recommandés",
    message: "Événements recommandés spécialement pour vous",
    priority: NotificationPriority.LOW,
    category: 'personalized'
  },

  // Urgence
  [NotificationType.EVENT_MODIFIED]: {
    type: NotificationType.EVENT_MODIFIED,
    title: "Événement modifié",
    message: "Votre événement {event_title} a été modifié",
    priority: NotificationPriority.URGENT,
    category: 'urgent'
  },
  [NotificationType.EVENT_CANCELLED]: {
    type: NotificationType.EVENT_CANCELLED,
    title: "Événement annulé",
    message: "Votre événement {event_title} a été annulé",
    priority: NotificationPriority.URGENT,
    category: 'urgent'
  },
  [NotificationType.TECHNICAL_PROBLEM]: {
    type: NotificationType.TECHNICAL_PROBLEM,
    title: "Problème technique",
    message: "Un problème technique a été détecté sur votre événement",
    priority: NotificationPriority.URGENT,
    category: 'urgent'
  },
  [NotificationType.EVENT_POSTPONED]: {
    type: NotificationType.EVENT_POSTPONED,
    title: "Événement reporté",
    message: "Votre événement {event_title} a été reporté",
    priority: NotificationPriority.URGENT,
    category: 'urgent'
  },
  [NotificationType.LOCATION_CHANGE]: {
    type: NotificationType.LOCATION_CHANGE,
    title: "Changement de lieu",
    message: "Le lieu de {event_title} a changé",
    priority: NotificationPriority.URGENT,
    category: 'urgent'
  },
  [NotificationType.TIME_CHANGE]: {
    type: NotificationType.TIME_CHANGE,
    title: "Changement d'horaires",
    message: "Les horaires de {event_title} ont changé",
    priority: NotificationPriority.URGENT,
    category: 'urgent'
  }
};

class NotificationService {
  // Créer une notification
  async createNotification(data: CreateNotificationRequest): Promise<PrismaNotification> {
    try {
      const notification = await prisma.notification.create({
        data: {
          user_id: data.user_id,
          type: data.type,
          title: data.title,
          message: data.message,
          priority: data.priority || NotificationPriority.MEDIUM,
          data: data.data || {},
          status: NotificationStatus.PENDING
        }
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Créer une notification à partir d'un template
  async createNotificationFromTemplate(
    userId: number,
    type: NotificationType,
    variables: Record<string, any> = {},
    data: any = {}
  ): Promise<PrismaNotification> {
    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) {
      throw new Error(`Template not found for notification type: ${type}`);
    }

    let title = template.title;
    let message = template.message;

    // Remplacer les variables dans le titre et le message
    Object.keys(variables).forEach(key => {
      const placeholder = `{${key}}`;
      title = title.replace(placeholder, variables[key]);
      message = message.replace(placeholder, variables[key]);
    });

    return this.createNotification({
      user_id: userId,
      type,
      title,
      message,
      priority: template.priority,
      data
    });
  }

  // Obtenir les notifications d'un utilisateur
  async getUserNotifications(userId: number, filters: NotificationFilters = {}): Promise<PrismaNotification[]> {
    try {
      const where: any = { user_id: userId };

      if (filters.type) where.type = filters.type;
      if (filters.priority) where.priority = filters.priority;
      if (filters.status) where.status = filters.status;
      if (filters.read !== undefined) {
        if (filters.read) {
          where.read_at = { not: null };
        } else {
          where.read_at = null;
        }
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0
      });

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw new Error('Failed to get user notifications');
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: number): Promise<PrismaNotification> {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: NotificationStatus.READ,
          read_at: new Date()
        }
      });

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId: number): Promise<void> {
    try {
      await prisma.notification.updateMany({
        where: { 
          user_id: userId,
          status: { not: NotificationStatus.READ }
        },
        data: {
          status: NotificationStatus.READ,
          read_at: new Date()
        }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Supprimer une notification
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await prisma.notification.delete({
        where: { id: notificationId }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  // Obtenir les préférences de notifications d'un utilisateur
  async getUserPreferences(userId: number): Promise<PrismaNotificationPreference | null> {
    try {
      const preferences = await prisma.notificationPreference.findUnique({
        where: { user_id: userId }
      });

      return preferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('Failed to get user preferences');
    }
  }

  // Créer ou mettre à jour les préférences de notifications
  async updateUserPreferences(
    userId: number, 
    preferences: UpdateNotificationPreferenceRequest
  ): Promise<PrismaNotificationPreference> {
    try {
      const userPreferences = await prisma.notificationPreference.upsert({
        where: { user_id: userId },
        update: preferences,
        create: {
          user_id: userId,
          ...preferences
        }
      });

      return userPreferences;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const count = await prisma.notification.count({
        where: {
          user_id: userId,
          read_at: null
        }
      });

      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error('Failed to get unread count');
    }
  }

  // Vérifier si un utilisateur doit recevoir une notification
  async shouldSendNotification(userId: number, type: NotificationType): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) return true; // Par défaut, envoyer

      const template = NOTIFICATION_TEMPLATES[type];
      if (!template) return false;

      // Vérifier les préférences par catégorie
      switch (template.category) {
        case 'planning':
          return preferences.planning_enabled;
        case 'booking':
          return preferences.booking_enabled;
        case 'social':
          return preferences.social_enabled;
        case 'performance':
          return preferences.performance_enabled;
        case 'system':
          return preferences.system_enabled;
        case 'commercial':
          return preferences.commercial_enabled;
        case 'personalized':
          return preferences.personalized_enabled;
        case 'urgent':
          return preferences.urgent_enabled;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking notification preferences:', error);
      return true; // En cas d'erreur, envoyer par défaut
    }
  }

  // Créer une notification avec vérification des préférences
  async createNotificationWithPreferences(
    userId: number,
    type: NotificationType,
    variables: Record<string, any> = {},
    data: any = {}
  ): Promise<PrismaNotification | null> {
    try {
      const shouldSend = await this.shouldSendNotification(userId, type);
      if (!shouldSend) return null;

      return this.createNotificationFromTemplate(userId, type, variables, data);
    } catch (error) {
      console.error('Error creating notification with preferences:', error);
      throw new Error('Failed to create notification with preferences');
    }
  }

  // Nettoyer les notifications existantes qui contiennent des placeholders
  async cleanExistingNotifications(): Promise<void> {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          OR: [
            { title: { contains: '{' } },
            { message: { contains: '{' } }
          ]
        }
      });

      for (const notification of notifications) {
        const template = NOTIFICATION_TEMPLATES[notification.type];
        if (template) {
          // Essayer de récupérer les variables depuis les données
          const data = notification.data as any || {};
          const variables: Record<string, any> = {};

          // Extraire les variables depuis les données
          if (data.eventTitle) variables.event_title = data.eventTitle;
          if (data.event_title) variables.event_title = data.event_title;
          if (data.participantName) variables.participant_name = data.participantName;
          if (data.participant_name) variables.participant_name = data.participant_name;
          if (data.amount) variables.amount = data.amount;
          if (data.commenterName) variables.commenter_name = data.commenterName;
          if (data.commenter_name) variables.commenter_name = data.commenter_name;
          if (data.followerName) variables.follower_name = data.followerName;
          if (data.follower_name) variables.follower_name = data.follower_name;
          if (data.timeRemaining) variables.time_remaining = data.timeRemaining;
          if (data.time_remaining) variables.time_remaining = data.time_remaining;
          if (data.eventCount) variables.event_count = data.eventCount;
          if (data.event_count) variables.event_count = data.event_count;
          if (data.promotionType) variables.promotion_type = data.promotionType;
          if (data.promotion_type) variables.promotion_type = data.promotion_type;
          if (data.discountPercent) variables.discount_percent = data.discountPercent;
          if (data.discount_percent) variables.discount_percent = data.discount_percent;
          if (data.views) variables.views = data.views;
          if (data.bookings) variables.bookings = data.bookings;
          if (data.revenue) variables.revenue = data.revenue;
          if (data.season) variables.season = data.season;
          if (data.featureName) variables.feature_name = data.featureName;
          if (data.feature_name) variables.feature_name = data.feature_name;
          if (data.location) variables.location = data.location;
          if (data.maintenanceDate) variables.maintenance_date = data.maintenanceDate;
          if (data.maintenance_date) variables.maintenance_date = data.maintenance_date;
          if (data.userName) variables.user_name = data.userName;
          if (data.user_name) variables.user_name = data.user_name;

          // Remplacer les variables dans le titre et le message
          let title = template.title;
          let message = template.message;

          Object.keys(variables).forEach(key => {
            const placeholder = `{${key}}`;
            title = title.replace(placeholder, variables[key]);
            message = message.replace(placeholder, variables[key]);
          });

          // Mettre à jour la notification
          await prisma.notification.update({
            where: { id: notification.id },
            data: { title, message }
          });
        }
      }

      console.log(`Cleaned ${notifications.length} notifications with placeholders`);
    } catch (error) {
      console.error('Error cleaning existing notifications:', error);
    }
  }
}

export default new NotificationService();
