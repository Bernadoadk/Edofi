import notificationService from '../services/notificationService';
import { NotificationType } from '../types/notifications';

export class NotificationDemo {
  private userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  // Générer des notifications de démonstration
  async generateDemoNotifications() {
    console.log('🎉 Génération de notifications de démonstration...');

    const notifications = [
      // Planification
      {
        type: NotificationType.EVENT_REMINDER,
        variables: { event_title: 'Concert de Jazz', time_remaining: '2 heures' },
        data: { eventId: 1, eventTitle: 'Concert de Jazz' }
      },
      {
        type: NotificationType.CREATION_DEADLINE,
        variables: { days_remaining: '3' },
        data: { eventId: 2, eventTitle: 'Conférence Tech' }
      },
      {
        type: NotificationType.MATERIAL_PREPARATION,
        variables: { event_title: 'Workshop Design' },
        data: { eventId: 3, eventTitle: 'Workshop Design' }
      },

      // Réservations
      {
        type: NotificationType.NEW_BOOKING,
        variables: { participant_name: 'Marie Dupont', event_title: 'Concert de Jazz' },
        data: { bookingId: 1, participantName: 'Marie Dupont', eventTitle: 'Concert de Jazz' }
      },
      {
        type: NotificationType.PAYMENT_RECEIVED,
        variables: { amount: '45€', event_title: 'Conférence Tech' },
        data: { paymentId: 1, amount: '45€', eventTitle: 'Conférence Tech' }
      },
      {
        type: NotificationType.CAPACITY_REACHED,
        variables: { event_title: 'Workshop Design' },
        data: { eventId: 3, eventTitle: 'Workshop Design' }
      },

      // Social
      {
        type: NotificationType.NEW_COMMENT,
        variables: { commenter_name: 'Jean Martin', event_title: 'Concert de Jazz' },
        data: { commentId: 1, commenterName: 'Jean Martin', eventTitle: 'Concert de Jazz' }
      },
      {
        type: NotificationType.NEW_FOLLOWER,
        variables: { follower_name: 'Sophie Bernard' },
        data: { followerId: 1, followerName: 'Sophie Bernard' }
      },
      {
        type: NotificationType.EVENT_SHARED,
        variables: { sharer_name: 'Pierre Durand', event_title: 'Conférence Tech' },
        data: { sharerId: 1, sharerName: 'Pierre Durand', eventTitle: 'Conférence Tech' }
      },

      // Performance
      {
        type: NotificationType.EVENT_TRENDING,
        variables: { event_title: 'Concert de Jazz' },
        data: { eventId: 1, eventTitle: 'Concert de Jazz' }
      },
      {
        type: NotificationType.VIEWS_RECORD,
        variables: { event_title: 'Workshop Design' },
        data: { eventId: 3, eventTitle: 'Workshop Design' }
      },
      {
        type: NotificationType.GOAL_ACHIEVED,
        variables: { event_title: 'Conférence Tech' },
        data: { eventId: 2, eventTitle: 'Conférence Tech' }
      },

      // Système
      {
        type: NotificationType.NEW_FEATURE,
        variables: { feature_name: 'Système de notifications avancé' },
        data: { featureName: 'Système de notifications avancé' }
      },
      {
        type: NotificationType.SECURITY_UPDATE,
        variables: {},
        data: { updateType: 'security' }
      },

      // Commercial
      {
        type: NotificationType.SERVICE_PROMOTION,
        variables: {},
        data: { promotionType: 'service_discount' }
      },
      {
        type: NotificationType.SEASONAL_DISCOUNT,
        variables: { discount_percent: '20' },
        data: { discountPercent: 20, season: 'été' }
      },

      // Personnalisées
      {
        type: NotificationType.NEARBY_EVENTS,
        variables: { event_count: '5' },
        data: { eventCount: 5, location: 'Paris' }
      },
      {
        type: NotificationType.WEEKEND_EVENTS,
        variables: {},
        data: { weekend: 'prochain' }
      },

      // Urgence
      {
        type: NotificationType.EVENT_MODIFIED,
        variables: { event_title: 'Concert de Jazz' },
        data: { eventId: 1, eventTitle: 'Concert de Jazz', changeType: 'time' }
      },
      {
        type: NotificationType.LOCATION_CHANGE,
        variables: { event_title: 'Workshop Design' },
        data: { eventId: 3, eventTitle: 'Workshop Design', newLocation: 'Salle B' }
      }
    ];

    // Créer les notifications avec des délais pour simuler des notifications réelles
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      
      setTimeout(async () => {
        try {
          await notificationService.createNotificationWithPreferences(
            this.userId,
            notification.type,
            notification.variables,
            notification.data
          );
          console.log(`✅ Notification créée: ${notification.type}`);
        } catch (error) {
          console.error(`❌ Erreur lors de la création de la notification ${notification.type}:`, error);
        }
      }, i * 1000); // 1 seconde entre chaque notification
    }

    console.log(`🚀 ${notifications.length} notifications de démonstration programmées !`);
  }

  // Générer des notifications par catégorie
  async generateCategoryNotifications(category: string) {
    const categoryNotifications = {
      planning: [
        { type: NotificationType.EVENT_REMINDER, variables: { event_title: 'Rappel Test', time_remaining: '1 heure' } },
        { type: NotificationType.CREATION_DEADLINE, variables: { days_remaining: '5' } },
        { type: NotificationType.MATERIAL_PREPARATION, variables: { event_title: 'Événement Test' } }
      ],
      booking: [
        { type: NotificationType.NEW_BOOKING, variables: { participant_name: 'Test User', event_title: 'Événement Test' } },
        { type: NotificationType.PAYMENT_RECEIVED, variables: { amount: '25€', event_title: 'Événement Test' } },
        { type: NotificationType.CAPACITY_REACHED, variables: { event_title: 'Événement Test' } }
      ],
      social: [
        { type: NotificationType.NEW_COMMENT, variables: { commenter_name: 'Test User', event_title: 'Événement Test' } },
        { type: NotificationType.NEW_FOLLOWER, variables: { follower_name: 'Test User' } },
        { type: NotificationType.EVENT_SHARED, variables: { sharer_name: 'Test User', event_title: 'Événement Test' } }
      ],
      performance: [
        { type: NotificationType.EVENT_TRENDING, variables: { event_title: 'Événement Test' } },
        { type: NotificationType.VIEWS_RECORD, variables: { event_title: 'Événement Test' } },
        { type: NotificationType.GOAL_ACHIEVED, variables: { event_title: 'Événement Test' } }
      ],
      system: [
        { type: NotificationType.NEW_FEATURE, variables: { feature_name: 'Fonctionnalité Test' } },
        { type: NotificationType.SECURITY_UPDATE, variables: {} },
        { type: NotificationType.MAINTENANCE_SCHEDULED, variables: { maintenance_date: 'Demain 14h' } }
      ],
      commercial: [
        { type: NotificationType.SERVICE_PROMOTION, variables: {} },
        { type: NotificationType.SEASONAL_DISCOUNT, variables: { discount_percent: '15' } },
        { type: NotificationType.SPECIAL_OFFER, variables: { offer_description: 'Offre spéciale test' } }
      ],
      personalized: [
        { type: NotificationType.NEARBY_EVENTS, variables: { event_count: '3' } },
        { type: NotificationType.WEEKEND_EVENTS, variables: {} },
        { type: NotificationType.SEASONAL_EVENTS, variables: { season: 'printemps' } }
      ],
      urgent: [
        { type: NotificationType.EVENT_MODIFIED, variables: { event_title: 'Événement Test' } },
        { type: NotificationType.EVENT_CANCELLED, variables: { event_title: 'Événement Test' } },
        { type: NotificationType.LOCATION_CHANGE, variables: { event_title: 'Événement Test' } }
      ]
    };

    const notifications = categoryNotifications[category as keyof typeof categoryNotifications] || [];
    
    console.log(`🎯 Génération de notifications pour la catégorie: ${category}`);

    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      
      setTimeout(async () => {
        try {
          await notificationService.createNotificationWithPreferences(
            this.userId,
            notification.type,
            notification.variables,
            { category, demo: true }
          );
          console.log(`✅ Notification ${category} créée: ${notification.type}`);
        } catch (error) {
          console.error(`❌ Erreur lors de la création de la notification ${notification.type}:`, error);
        }
      }, i * 500); // 500ms entre chaque notification
    }
  }

  // Nettoyer toutes les notifications de démonstration
  async clearDemoNotifications() {
    console.log('🧹 Nettoyage des notifications de démonstration...');
    
    try {
      // Cette fonction nécessiterait une implémentation côté backend
      // Pour l'instant, on affiche juste un message
      console.log('⚠️ Fonctionnalité de nettoyage à implémenter côté backend');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
    }
  }

  // Générer des notifications de test rapides
  async quickTest() {
    console.log('⚡ Test rapide du système de notifications...');

    const quickNotifications = [
      {
        type: NotificationType.NEW_BOOKING,
        variables: { participant_name: 'Test User', event_title: 'Événement Test' }
      },
      {
        type: NotificationType.EVENT_REMINDER,
        variables: { event_title: 'Événement Test', time_remaining: '30 minutes' }
      },
      {
        type: NotificationType.EVENT_TRENDING,
        variables: { event_title: 'Événement Test' }
      }
    ];

    for (const notification of quickNotifications) {
      try {
        await notificationService.createNotificationWithPreferences(
          this.userId,
          notification.type,
          notification.variables,
          { demo: true, quickTest: true }
        );
        console.log(`✅ Notification de test créée: ${notification.type}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la création de la notification de test:`, error);
      }
    }
  }
}

// Fonction utilitaire pour créer une instance de démonstration
export const createNotificationDemo = (userId: number) => {
  return new NotificationDemo(userId);
};
