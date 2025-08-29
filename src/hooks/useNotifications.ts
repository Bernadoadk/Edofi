import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import { 
  Notification, 
  NotificationFilters,
  NotificationType 
} from '../types/notifications';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  sendNotification: (type: NotificationType, variables: Record<string, any>, data?: any) => Promise<void>;
}

export const useNotifications = (filters: NotificationFilters = {}): UseNotificationsReturn => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getUserNotifications(user.id, filters);
      setNotifications(data);
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, filters]);

  // Charger le nombre de notifications non lues
  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  }, [user?.id]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'READ' as any, read_at: new Date().toISOString() }
            : notif
        )
      );
      await loadUnreadCount();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [loadUnreadCount]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          status: 'READ' as any, 
          read_at: new Date().toISOString() 
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }, [user?.id]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      await loadUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [loadUnreadCount]);

  // Rafraîchir les notifications
  const refreshNotifications = useCallback(async () => {
    await Promise.all([loadNotifications(), loadUnreadCount()]);
  }, [loadNotifications, loadUnreadCount]);

  // Envoyer une notification
  const sendNotification = useCallback(async (
    type: NotificationType, 
    variables: Record<string, any> = {}, 
    data: any = {}
  ) => {
    if (!user?.id) return;

    try {
      await notificationService.createNotificationWithPreferences(user.id, type, variables, data);
      await refreshNotifications();
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  }, [user?.id, refreshNotifications]);

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user?.id, loadNotifications, loadUnreadCount]);

  // Rafraîchir automatiquement toutes les 30 secondes
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    sendNotification
  };
};
