import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { NotificationCenter } from './NotificationCenter/NotificationCenter';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import { Notification } from '../types/notifications';

interface NotificationIconProps {
  notificationCount?: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  notificationCount: initialCount = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Charger le nombre de notifications non lues
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const count = await notificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUnreadCount();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleNotificationClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationCenterClose = () => {
    setIsOpen(false);
    // Rafraîchir le compteur après fermeture
    if (user?.id) {
      notificationService.getUnreadCount(user.id).then(setUnreadCount);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
        onClick={handleNotificationClick}
        disabled={loading}
      >
        {/* Notification Bell Icon */}
        <svg
          className={`w-6 h-6 text-assignment-1white ${loading ? 'animate-pulse' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 005.25 5.95V21a.75.75 0 001.5 0v-1.55A6 6 0 0018 13.5V9.75a6 6 0 00-6-6h-1.5z"
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </Button>

      {/* Notification Center Modal */}
      {isOpen && (
        <NotificationCenter 
          isOpen={isOpen} 
          onClose={handleNotificationCenterClose}
          onNotificationUpdate={(newCount) => setUnreadCount(newCount)}
        />
      )}
    </div>
  );
}; 