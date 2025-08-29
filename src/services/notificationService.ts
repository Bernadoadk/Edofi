import { apiService as api } from './api';
import { 
  Notification, 
  NotificationPreference, 
  CreateNotificationRequest, 
  UpdateNotificationRequest, 
  UpdateNotificationPreferenceRequest,
  NotificationFilters,
  NotificationType
} from '../types/notifications';

export interface NotificationResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class NotificationService {
  private baseUrl = '/notifications';

  // Obtenir les notifications d'un utilisateur
  async getUserNotifications(userId: number, filters: NotificationFilters = {}): Promise<Notification[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.read !== undefined) queryParams.append('read', filters.read.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.offset) queryParams.append('offset', filters.offset.toString());

      const response = await api.get(`${this.baseUrl}/user/${userId}?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  // Créer une notification
  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response;
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
  ): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/template`, {
        userId,
        type,
        variables,
        data
      });
      return response;
    } catch (error) {
      console.error('Error creating notification from template:', error);
      throw new Error('Failed to create notification from template');
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const response = await api.put(`${this.baseUrl}/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId: number): Promise<void> {
    try {
      await api.put(`${this.baseUrl}/user/${userId}/mark-all-read`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Supprimer une notification
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  // Obtenir les préférences de notifications d'un utilisateur
  async getUserPreferences(userId: number): Promise<NotificationPreference | null> {
    try {
      const response = await api.get(`${this.baseUrl}/user/${userId}/preferences`);
      return response;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw new Error('Failed to fetch user preferences');
    }
  }

  // Mettre à jour les préférences de notifications d'un utilisateur
  async updateUserPreferences(
    userId: number, 
    preferences: UpdateNotificationPreferenceRequest
  ): Promise<NotificationPreference> {
    try {
      const response = await api.put(`${this.baseUrl}/user/${userId}/preferences`, preferences);
      return response;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const response = await api.get(`${this.baseUrl}/user/${userId}/unread-count`);
      return response.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw new Error('Failed to fetch unread count');
    }
  }

  // Créer une notification avec vérification des préférences
  async createNotificationWithPreferences(
    userId: number,
    type: NotificationType,
    variables: Record<string, any> = {},
    data: any = {}
  ): Promise<Notification | null> {
    try {
      const response = await api.post(`${this.baseUrl}/with-preferences`, {
        userId,
        type,
        variables,
        data
      });
      return response;
    } catch (error) {
      console.error('Error creating notification with preferences:', error);
      throw new Error('Failed to create notification with preferences');
    }
  }

  // Notifications spécifiques par type

  // Notification de rappel d'événement
  async sendEventReminder(userId: number, eventTitle: string, timeRemaining: string): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/event-reminder`, {
        userId,
        eventTitle,
        timeRemaining
      });
      return response;
    } catch (error) {
      console.error('Error sending event reminder:', error);
      throw new Error('Failed to send event reminder');
    }
  }

  // Notification de nouvelle réservation
  async sendNewBookingNotification(
    userId: number, 
    participantName: string, 
    eventTitle: string
  ): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/new-booking`, {
        userId,
        participantName,
        eventTitle
      });
      return response;
    } catch (error) {
      console.error('Error sending new booking notification:', error);
      throw new Error('Failed to send new booking notification');
    }
  }

  // Notification de paiement reçu
  async sendPaymentReceivedNotification(
    userId: number, 
    amount: string, 
    eventTitle: string
  ): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/payment-received`, {
        userId,
        amount,
        eventTitle
      });
      return response;
    } catch (error) {
      console.error('Error sending payment received notification:', error);
      throw new Error('Failed to send payment received notification');
    }
  }

  // Notification d'événement en tendance
  async sendEventTrendingNotification(userId: number, eventTitle: string): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/event-trending`, {
        userId,
        eventTitle
      });
      return response;
    } catch (error) {
      console.error('Error sending event trending notification:', error);
      throw new Error('Failed to send event trending notification');
    }
  }

  // Notification d'urgence - événement modifié
  async sendEventModifiedNotification(userId: number, eventTitle: string): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/event-modified`, {
        userId,
        eventTitle
      });
      return response;
    } catch (error) {
      console.error('Error sending event modified notification:', error);
      throw new Error('Failed to send event modified notification');
    }
  }

  // Notification d'urgence - événement annulé
  async sendEventCancelledNotification(userId: number, eventTitle: string): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/event-cancelled`, {
        userId,
        eventTitle
      });
      return response;
    } catch (error) {
      console.error('Error sending event cancelled notification:', error);
      throw new Error('Failed to send event cancelled notification');
    }
  }

  // Notification de nouveau commentaire
  async sendNewCommentNotification(
    userId: number, 
    commenterName: string, 
    eventTitle: string
  ): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/new-comment`, {
        userId,
        commenterName,
        eventTitle
      });
      return response;
    } catch (error) {
      console.error('Error sending new comment notification:', error);
      throw new Error('Failed to send new comment notification');
    }
  }

  // Notification de nouveau follower
  async sendNewFollowerNotification(userId: number, followerName: string): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/new-follower`, {
        userId,
        followerName
      });
      return response;
    } catch (error) {
      console.error('Error sending new follower notification:', error);
      throw new Error('Failed to send new follower notification');
    }
  }

  // Notification d'événements à proximité
  async sendNearbyEventsNotification(userId: number, eventCount: number): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/nearby-events`, {
        userId,
        eventCount
      });
      return response;
    } catch (error) {
      console.error('Error sending nearby events notification:', error);
      throw new Error('Failed to send nearby events notification');
    }
  }

  // Notification de promotion commerciale
  async sendCommercialPromotionNotification(
    userId: number, 
    promotionType: string, 
    discountPercent?: number
  ): Promise<Notification> {
    try {
      const response = await api.post(`${this.baseUrl}/commercial-promotion`, {
        userId,
        promotionType,
        discountPercent
      });
      return response;
    } catch (error) {
      console.error('Error sending commercial promotion notification:', error);
      throw new Error('Failed to send commercial promotion notification');
    }
  }

  // Méthodes utilitaires pour les notifications courantes

  // Notification de bienvenue pour un nouvel utilisateur
  async sendWelcomeNotification(userId: number, userName: string): Promise<Notification> {
    return this.createNotificationFromTemplate(
      userId,
      NotificationType.NEW_FEATURE,
      { feature_name: 'Bienvenue sur Edofi !' },
      { userName, type: 'welcome' }
    );
  }

  // Notification de rappel quotidien
  async sendDailyReminder(userId: number, eventCount: number): Promise<Notification> {
    return this.createNotificationFromTemplate(
      userId,
      NotificationType.DAILY_STATS,
      { views: eventCount },
      { type: 'daily_reminder' }
    );
  }

  // Notification de weekend
  async sendWeekendEventsNotification(userId: number): Promise<Notification> {
    return this.createNotificationFromTemplate(
      userId,
      NotificationType.WEEKEND_EVENTS,
      {},
      { type: 'weekend_reminder' }
    );
  }

  // Notification de saison
  async sendSeasonalEventsNotification(userId: number, season: string): Promise<Notification> {
    return this.createNotificationFromTemplate(
      userId,
      NotificationType.SEASONAL_EVENTS,
      { season },
      { type: 'seasonal', season }
    );
  }

  // Notification de sécurité
  async sendSecurityNotification(userId: number, location: string): Promise<Notification> {
    return this.createNotificationFromTemplate(
      userId,
      NotificationType.NEW_LOGIN,
      { location },
      { type: 'security', location }
    );
  }

  // Notification de maintenance
  async sendMaintenanceNotification(userId: number, maintenanceDate: string): Promise<Notification> {
    return this.createNotificationFromTemplate(
      userId,
      NotificationType.MAINTENANCE_SCHEDULED,
      { maintenance_date: maintenanceDate },
      { type: 'maintenance', maintenanceDate }
    );
  }
}

export default new NotificationService();
