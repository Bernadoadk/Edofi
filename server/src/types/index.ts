import { Request } from 'express';

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  event_type: 'single' | 'recurring';
  start_date: Date;
  start_time: string;
  end_date?: Date;
  end_time: string;
  duration_type?: 'days' | 'hours';
  duration_value?: number;
  location_address: string;
  location_lat: number;
  location_lng: number;
  banner_image?: string;
  is_published: boolean;
  user_id: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
  user?: User;
  category?: Category;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  event_type: 'single' | 'recurring';
  start_date: string;
  start_time: string;
  end_date?: string;
  end_time?: string;
  duration_type?: 'days' | 'hours';
  duration_value?: number;
  location_address: string;
  location_lat: number;
  location_lng: number;
  category_id: number;
  is_published?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

// Filter types
export interface EventFilters {
  category_id?: number;
  search?: string;
  location?: string;
  limit?: number;
  offset?: number;
  upcoming?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

// Auth types
export interface AuthRequest extends Request {
  user?: User;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

// File upload types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

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
  read_at?: Date;
  sent_at?: Date;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface CreateNotificationRequest {
  user_id: number;
  type: import('@prisma/client').NotificationType;
  title: string;
  message: string;
  priority?: import('@prisma/client').NotificationPriority;
  data?: any;
}

export interface UpdateNotificationRequest {
  status?: NotificationStatus;
  read_at?: Date;
  sent_at?: Date;
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
  type: import('@prisma/client').NotificationType;
  title: string;
  message: string;
  priority: import('@prisma/client').NotificationPriority;
  category: 'planning' | 'booking' | 'social' | 'performance' | 'system' | 'commercial' | 'personalized' | 'urgent';
}
