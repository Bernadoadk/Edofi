import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Settings, Check, Trash2, Filter, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationItem } from './NotificationItem';
import { NotificationFilters } from './NotificationFilters';
import { NotificationPreferences } from './NotificationPreferences';
import { useAuth } from '../../contexts/AuthContext';
import notificationService from '../../services/notificationService';
import { createNotificationDemo } from '../../utils/notificationDemo';
import { 
  Notification, 
  NotificationFilters as NotificationFiltersType,
  NotificationPreference,
  UpdateNotificationPreferenceRequest
} from '../../types/notifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationUpdate: (newCount: number) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNotificationUpdate
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [filters, setFilters] = useState<NotificationFiltersType>({
    read: false,
    limit: 20
  });
  const [showFilters, setShowFilters] = useState(false);

  // Charger les notifications
  const loadNotifications = async () => {
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
  };

  // Charger les préférences
  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      const data = await notificationService.getUserPreferences(user.id);
      setPreferences(data);
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  // Marquer une notification comme lue
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: 'READ' as any, read_at: new Date().toISOString() }
            : notif
        )
      );
      
      // Mettre à jour le compteur
      if (user?.id) {
        const newCount = await notificationService.getUnreadCount(user.id);
        onNotificationUpdate(newCount);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Supprimer une notification
  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Mettre à jour le compteur
      if (user?.id) {
        const newCount = await notificationService.getUnreadCount(user.id);
        onNotificationUpdate(newCount);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Marquer toutes comme lues
  const handleMarkAllAsRead = async () => {
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
      onNotificationUpdate(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Mettre à jour les préférences
  const handleUpdatePreferences = async (newPreferences: UpdateNotificationPreferenceRequest) => {
    if (!user?.id) return;

    try {
      const updatedPreferences = await notificationService.updateUserPreferences(user.id, newPreferences);
      setPreferences(updatedPreferences);
    } catch (err) {
      console.error('Error updating preferences:', err);
    }
  };

  // Test du système de notifications
  const handleTestNotifications = async () => {
    if (!user?.id) return;

    try {
      const demo = createNotificationDemo(user.id);
      await demo.quickTest();
      await loadNotifications();
      await loadUnreadCount();
    } catch (err) {
      console.error('Error testing notifications:', err);
    }
  };

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    if (isOpen && user?.id) {
      loadNotifications();
      loadPreferences();
    }
  }, [isOpen, user?.id, filters]);

  // Rafraîchir les notifications toutes les 30 secondes
  useEffect(() => {
    if (!isOpen || !user?.id) return;

    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isOpen, user?.id]);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-4 right-4 w-96 h-[calc(100vh-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTestNotifications}
                  className="p-1"
                  title="Tester les notifications"
                >
                  <Play className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-1"
                >
                  <Filter className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(activeTab === 'notifications' ? 'preferences' : 'notifications')}
                  className="p-1"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <NotificationFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'notifications' ? (
                <div className="flex flex-col h-full">
                  {/* Actions */}
                  {unreadCount > 0 && (
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="w-full"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Marquer toutes comme lues
                      </Button>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {loading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : error ? (
                      <div className="p-4 text-center">
                        <p className="text-red-600 text-sm">{error}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={loadNotifications}
                          className="mt-2"
                        >
                          Réessayer
                        </Button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                          {filters.read === false ? 'Aucune nouvelle notification' : 'Aucune notification'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDeleteNotification}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <NotificationPreferences
                  preferences={preferences}
                  onUpdate={handleUpdatePreferences}
                  onSave={() => {}}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
