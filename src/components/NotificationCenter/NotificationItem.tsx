import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Info, 
  Star, 
  Calendar, 
  CreditCard, 
  User, 
  DollarSign, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Gift, 
  Percent, 
  Eye, 
  ClipboardList, 
  Euro, 
  Sun, 
  Sparkles, 
  MapPin, 
  Wrench 
} from 'lucide-react';
import { Button } from '../ui/button';
import { 
  Notification, 
  NotificationType, 
  NotificationPriority,
  NOTIFICATION_CATEGORIES 
} from '../../types/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const isRead = !!notification.read_at;
  const category = NOTIFICATION_CATEGORIES.find(cat => 
    cat.types.includes(notification.type)
  );

  // Obtenir l'icône et la couleur selon la priorité
  const getPriorityIcon = () => {
    switch (notification.priority) {
      case 'URGENT':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'HIGH':
        return <Star className="w-4 h-4 text-orange-500" />;
      case 'MEDIUM':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'LOW':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  // Obtenir la couleur de bordure selon la priorité
  const getPriorityBorderColor = () => {
    switch (notification.priority) {
      case 'URGENT':
        return 'border-l-red-500';
      case 'HIGH':
        return 'border-l-orange-500';
      case 'MEDIUM':
        return 'border-l-blue-500';
      case 'LOW':
        return 'border-l-gray-300';
      default:
        return 'border-l-gray-300';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Formater les données supplémentaires
  const formatAdditionalData = (data: any) => {
    if (!data || typeof data !== 'object') return null;

    const formattedData: JSX.Element[] = [];

    // Traiter les données selon le type de notification
    if (data.event_title) {
      formattedData.push(
        <div key="event_title" className="flex items-center space-x-2 mb-1">
          <Calendar className="w-3 h-3 text-blue-500" />
          <span>Événement: {data.event_title}</span>
        </div>
      );
    }
    if (data.eventId) {
      formattedData.push(
        <div key="eventId" className="flex items-center space-x-2 mb-1">
          <CreditCard className="w-3 h-3 text-gray-500" />
          <span>ID Événement: {data.eventId}</span>
        </div>
      );
    }
    if (data.participantName) {
      formattedData.push(
        <div key="participantName" className="flex items-center space-x-2 mb-1">
          <User className="w-3 h-3 text-green-500" />
          <span>Participant: {data.participantName}</span>
        </div>
      );
    }
    if (data.amount) {
      formattedData.push(
        <div key="amount" className="flex items-center space-x-2 mb-1">
          <DollarSign className="w-3 h-3 text-green-600" />
          <span>Montant: {data.amount}</span>
        </div>
      );
    }
    if (data.commenterName) {
      formattedData.push(
        <div key="commenterName" className="flex items-center space-x-2 mb-1">
          <MessageSquare className="w-3 h-3 text-blue-500" />
          <span>Commentateur: {data.commenterName}</span>
        </div>
      );
    }
    if (data.followerName) {
      formattedData.push(
        <div key="followerName" className="flex items-center space-x-2 mb-1">
          <Users className="w-3 h-3 text-purple-500" />
          <span>Follower: {data.followerName}</span>
        </div>
      );
    }
    if (data.timeRemaining) {
      formattedData.push(
        <div key="timeRemaining" className="flex items-center space-x-2 mb-1">
          <Clock className="w-3 h-3 text-orange-500" />
          <span>Temps restant: {data.timeRemaining}</span>
        </div>
      );
    }
    if (data.eventCount) {
      formattedData.push(
        <div key="eventCount" className="flex items-center space-x-2 mb-1">
          <BarChart3 className="w-3 h-3 text-indigo-500" />
          <span>Nombre d'événements: {data.eventCount}</span>
        </div>
      );
    }
    if (data.promotionType) {
      formattedData.push(
        <div key="promotionType" className="flex items-center space-x-2 mb-1">
          <Gift className="w-3 h-3 text-pink-500" />
          <span>Type de promotion: {data.promotionType}</span>
        </div>
      );
    }
    if (data.discountPercent) {
      formattedData.push(
        <div key="discountPercent" className="flex items-center space-x-2 mb-1">
          <Percent className="w-3 h-3 text-red-500" />
          <span>Réduction: {data.discountPercent}%</span>
        </div>
      );
    }
    if (data.views) {
      formattedData.push(
        <div key="views" className="flex items-center space-x-2 mb-1">
          <Eye className="w-3 h-3 text-blue-400" />
          <span>Vues: {data.views}</span>
        </div>
      );
    }
    if (data.bookings) {
      formattedData.push(
        <div key="bookings" className="flex items-center space-x-2 mb-1">
          <ClipboardList className="w-3 h-3 text-green-600" />
          <span>Réservations: {data.bookings}</span>
        </div>
      );
    }
    if (data.revenue) {
      formattedData.push(
        <div key="revenue" className="flex items-center space-x-2 mb-1">
          <Euro className="w-3 h-3 text-green-700" />
          <span>Revenus: {data.revenue}€</span>
        </div>
      );
    }
    if (data.season) {
      formattedData.push(
        <div key="season" className="flex items-center space-x-2 mb-1">
          <Sun className="w-3 h-3 text-yellow-500" />
          <span>Saison: {data.season}</span>
        </div>
      );
    }
    if (data.featureName) {
      formattedData.push(
        <div key="featureName" className="flex items-center space-x-2 mb-1">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Fonctionnalité: {data.featureName}</span>
        </div>
      );
    }
    if (data.location) {
      formattedData.push(
        <div key="location" className="flex items-center space-x-2 mb-1">
          <MapPin className="w-3 h-3 text-red-400" />
          <span>Localisation: {data.location}</span>
        </div>
      );
    }
    if (data.maintenanceDate) {
      formattedData.push(
        <div key="maintenanceDate" className="flex items-center space-x-2 mb-1">
          <Wrench className="w-3 h-3 text-gray-600" />
          <span>Date de maintenance: {data.maintenanceDate}</span>
        </div>
      );
    }
    if (data.userName) {
      formattedData.push(
        <div key="userName" className="flex items-center space-x-2 mb-1">
          <User className="w-3 h-3 text-blue-500" />
          <span>Utilisateur: {data.userName}</span>
        </div>
      );
    }

    // Si aucune donnée spécifique n'est trouvée, afficher les données brutes
    if (formattedData.length === 0) {
      return Object.entries(data).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return (
          <div key={key} className="flex items-center space-x-2 mb-1">
            <Info className="w-3 h-3 text-gray-500" />
            <span>{formattedKey}: {String(value)}</span>
          </div>
        );
      });
    }

    return formattedData;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityBorderColor()} ${
        isRead ? 'opacity-75' : 'bg-blue-50'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          <div className="flex items-center space-x-1">
            {getPriorityIcon()}
            {category && (
              <span className="text-lg">{category.icon}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                isRead ? 'text-gray-600' : 'text-gray-900'
              }`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-gray-400">
                  {formatDate(notification.created_at)}
                </span>
                {notification.priority !== 'MEDIUM' && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    notification.priority === 'URGENT' 
                      ? 'bg-red-100 text-red-700'
                      : notification.priority === 'HIGH'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {notification.priority}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-2">
              {!isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 h-6 w-6 text-gray-400 hover:text-green-600"
                  title="Marquer comme lue"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notification.id)}
                className="p-1 h-6 w-6 text-gray-400 hover:text-red-600"
                title="Supprimer"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Additional data if available */}
          {notification.data && Object.keys(notification.data).length > 0 && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <details>
                <summary className="cursor-pointer hover:text-gray-800">
                  Détails supplémentaires
                </summary>
                <div className="mt-1 whitespace-pre-wrap">
                  {formatAdditionalData(notification.data)}
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
