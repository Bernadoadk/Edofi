// Notification Types
export enum NotificationType {
  // Planification (8 types)
  EVENT_REMINDER = 'EVENT_REMINDER',
  CREATION_DEADLINE = 'CREATION_DEADLINE',
  MATERIAL_PREPARATION = 'MATERIAL_PREPARATION',
  FINALIZATION_REMINDER = 'FINALIZATION_REMINDER',
  MODIFICATION_DEADLINE = 'MODIFICATION_DEADLINE',
  PUBLICATION_REMINDER = 'PUBLICATION_REMINDER',
  VERIFICATION_REMINDER = 'VERIFICATION_REMINDER',
  CONFIGURATION_REMINDER = 'CONFIGURATION_REMINDER',

  // Réservations (12 types)
  NEW_BOOKING = 'NEW_BOOKING',
  BOOKING_CANCELLATION = 'BOOKING_CANCELLATION',
  CAPACITY_REACHED = 'CAPACITY_REACHED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_PROCESSED = 'REFUND_PROCESSED',
  WAITLIST_ACTIVATED = 'WAITLIST_ACTIVATED',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  PARTICIPANT_REMINDER = 'PARTICIPANT_REMINDER',
  STATUS_CHANGE = 'STATUS_CHANGE',
  NEW_TICKET_AVAILABLE = 'NEW_TICKET_AVAILABLE',
  TICKET_PROMOTION = 'TICKET_PROMOTION',

  // Social (10 types)
  NEW_PARTICIPANT = 'NEW_PARTICIPANT',
  NEW_COMMENT = 'NEW_COMMENT',
  EVENT_SHARED = 'EVENT_SHARED',
  EVENT_FAVORITED = 'EVENT_FAVORITED',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  COMMENT_MENTION = 'COMMENT_MENTION',
  COMMENT_REPLY = 'COMMENT_REPLY',
  EVENT_RECOMMENDED = 'EVENT_RECOMMENDED',
  NEW_LIKE = 'NEW_LIKE',
  NEW_RATING = 'NEW_RATING',

  // Performance (8 types)
  EVENT_TRENDING = 'EVENT_TRENDING',
  VIEWS_RECORD = 'VIEWS_RECORD',
  RECOMMENDATION_ENGINE = 'RECOMMENDATION_ENGINE',
  DAILY_STATS = 'DAILY_STATS',
  EVENT_VIRAL = 'EVENT_VIRAL',
  FOLLOWER_GROWTH = 'FOLLOWER_GROWTH',
  EVENT_POPULAR = 'EVENT_POPULAR',
  GOAL_ACHIEVED = 'GOAL_ACHIEVED',

  // Système (6 types)
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  NEW_LOGIN = 'NEW_LOGIN',
  SECURITY_UPDATE = 'SECURITY_UPDATE',
  NEW_FEATURE = 'NEW_FEATURE',
  MAINTENANCE_SCHEDULED = 'MAINTENANCE_SCHEDULED',
  TECHNICAL_ISSUE = 'TECHNICAL_ISSUE',

  // Commercial (8 types)
  SERVICE_PROMOTION = 'SERVICE_PROMOTION',
  NEW_CATEGORY = 'NEW_CATEGORY',
  SPECIAL_OFFER = 'SPECIAL_OFFER',
  PREMIUM_EVENT = 'PREMIUM_EVENT',
  SEASONAL_DISCOUNT = 'SEASONAL_DISCOUNT',
  NEW_PRICING = 'NEW_PRICING',
  LOYALTY_PROGRAM = 'LOYALTY_PROGRAM',
  SPONSORED_EVENT = 'SPONSORED_EVENT',

  // Personnalisées (6 types)
  NEARBY_EVENTS = 'NEARBY_EVENTS',
  SIMILAR_EVENTS = 'SIMILAR_EVENTS',
  WEEKEND_EVENTS = 'WEEKEND_EVENTS',
  SEASONAL_EVENTS = 'SEASONAL_EVENTS',
  POPULAR_EVENTS = 'POPULAR_EVENTS',
  RECOMMENDED_EVENTS = 'RECOMMENDED_EVENTS',

  // Urgence (6 types)
  EVENT_MODIFIED = 'EVENT_MODIFIED',
  EVENT_CANCELLED = 'EVENT_CANCELLED',
  TECHNICAL_PROBLEM = 'TECHNICAL_PROBLEM',
  EVENT_POSTPONED = 'EVENT_POSTPONED',
  LOCATION_CHANGE = 'LOCATION_CHANGE',
  TIME_CHANGE = 'TIME_CHANGE',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  data?: any;
  read_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: number;
  user_id: number;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  in_app_enabled: boolean;
  planning_enabled: boolean;
  booking_enabled: boolean;
  social_enabled: boolean;
  performance_enabled: boolean;
  system_enabled: boolean;
  commercial_enabled: boolean;
  personalized_enabled: boolean;
  urgent_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationRequest {
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  data?: any;
}

export interface UpdateNotificationRequest {
  status?: NotificationStatus;
  read_at?: string;
  sent_at?: string;
}

export interface UpdateNotificationPreferenceRequest {
  email_enabled?: boolean;
  push_enabled?: boolean;
  sms_enabled?: boolean;
  in_app_enabled?: boolean;
  planning_enabled?: boolean;
  booking_enabled?: boolean;
  social_enabled?: boolean;
  performance_enabled?: boolean;
  system_enabled?: boolean;
  commercial_enabled?: boolean;
  personalized_enabled?: boolean;
  urgent_enabled?: boolean;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  read?: boolean;
  limit?: number;
  offset?: number;
}

// Notification Templates
export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: 'planning' | 'booking' | 'social' | 'performance' | 'system' | 'commercial' | 'personalized' | 'urgent';
}

// Types pour les composants UI
export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

export interface NotificationPreferencesProps {
  preferences: NotificationPreference;
  onUpdate: (preferences: UpdateNotificationPreferenceRequest) => void;
  onSave: () => void;
}

// Types pour les hooks
export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export interface UseNotificationPreferencesReturn {
  preferences: NotificationPreference | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (preferences: UpdateNotificationPreferenceRequest) => Promise<void>;
  savePreferences: () => Promise<void>;
}

// Types pour les animations et styles
export interface NotificationAnimationProps {
  isVisible: boolean;
  priority: NotificationPriority;
  type: NotificationType;
}

// Types pour les icônes et couleurs
export interface NotificationIconProps {
  type: NotificationType;
  priority: NotificationPriority;
  size?: 'sm' | 'md' | 'lg';
}

export interface NotificationPriorityColors {
  [key in NotificationPriority]: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface NotificationTypeIcons {
  [key in NotificationType]: string;
}

// Types pour les catégories
export interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  types: NotificationType[];
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: 'planning',
    name: 'Planification',
    description: 'Rappels et deadlines pour vos événements',
    icon: '📅',
    color: 'blue',
    types: [
      NotificationType.EVENT_REMINDER,
      NotificationType.CREATION_DEADLINE,
      NotificationType.MATERIAL_PREPARATION,
      NotificationType.FINALIZATION_REMINDER,
      NotificationType.MODIFICATION_DEADLINE,
      NotificationType.PUBLICATION_REMINDER,
      NotificationType.VERIFICATION_REMINDER,
      NotificationType.CONFIGURATION_REMINDER,
    ]
  },
  {
    id: 'booking',
    name: 'Réservations',
    description: 'Nouvelles réservations et paiements',
    icon: '🎫',
    color: 'green',
    types: [
      NotificationType.NEW_BOOKING,
      NotificationType.BOOKING_CANCELLATION,
      NotificationType.CAPACITY_REACHED,
      NotificationType.PAYMENT_RECEIVED,
      NotificationType.PAYMENT_FAILED,
      NotificationType.REFUND_PROCESSED,
      NotificationType.WAITLIST_ACTIVATED,
      NotificationType.BOOKING_CONFIRMATION,
      NotificationType.PARTICIPANT_REMINDER,
      NotificationType.STATUS_CHANGE,
      NotificationType.NEW_TICKET_AVAILABLE,
      NotificationType.TICKET_PROMOTION,
    ]
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Interactions sociales et commentaires',
    icon: '👥',
    color: 'purple',
    types: [
      NotificationType.NEW_PARTICIPANT,
      NotificationType.NEW_COMMENT,
      NotificationType.EVENT_SHARED,
      NotificationType.EVENT_FAVORITED,
      NotificationType.NEW_FOLLOWER,
      NotificationType.COMMENT_MENTION,
      NotificationType.COMMENT_REPLY,
      NotificationType.EVENT_RECOMMENDED,
      NotificationType.NEW_LIKE,
      NotificationType.NEW_RATING,
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Statistiques et tendances de vos événements',
    icon: '📊',
    color: 'orange',
    types: [
      NotificationType.EVENT_TRENDING,
      NotificationType.VIEWS_RECORD,
      NotificationType.RECOMMENDATION_ENGINE,
      NotificationType.DAILY_STATS,
      NotificationType.EVENT_VIRAL,
      NotificationType.FOLLOWER_GROWTH,
      NotificationType.EVENT_POPULAR,
      NotificationType.GOAL_ACHIEVED,
    ]
  },
  {
    id: 'system',
    name: 'Système',
    description: 'Notifications système et sécurité',
    icon: '⚙️',
    color: 'gray',
    types: [
      NotificationType.EMAIL_VERIFICATION,
      NotificationType.NEW_LOGIN,
      NotificationType.SECURITY_UPDATE,
      NotificationType.NEW_FEATURE,
      NotificationType.MAINTENANCE_SCHEDULED,
      NotificationType.TECHNICAL_ISSUE,
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Promotions et offres spéciales',
    icon: '💰',
    color: 'yellow',
    types: [
      NotificationType.SERVICE_PROMOTION,
      NotificationType.NEW_CATEGORY,
      NotificationType.SPECIAL_OFFER,
      NotificationType.PREMIUM_EVENT,
      NotificationType.SEASONAL_DISCOUNT,
      NotificationType.NEW_PRICING,
      NotificationType.LOYALTY_PROGRAM,
      NotificationType.SPONSORED_EVENT,
    ]
  },
  {
    id: 'personalized',
    name: 'Personnalisées',
    description: 'Recommandations personnalisées',
    icon: '🎯',
    color: 'pink',
    types: [
      NotificationType.NEARBY_EVENTS,
      NotificationType.SIMILAR_EVENTS,
      NotificationType.WEEKEND_EVENTS,
      NotificationType.SEASONAL_EVENTS,
      NotificationType.POPULAR_EVENTS,
      NotificationType.RECOMMENDED_EVENTS,
    ]
  },
  {
    id: 'urgent',
    name: 'Urgence',
    description: 'Notifications urgentes et importantes',
    icon: '🚨',
    color: 'red',
    types: [
      NotificationType.EVENT_MODIFIED,
      NotificationType.EVENT_CANCELLED,
      NotificationType.TECHNICAL_PROBLEM,
      NotificationType.EVENT_POSTPONED,
      NotificationType.LOCATION_CHANGE,
      NotificationType.TIME_CHANGE,
    ]
  }
];
