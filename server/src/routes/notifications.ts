import express from 'express';
import notificationController from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken);

// Routes générales
router.get('/user/:userId', notificationController.getUserNotifications);
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);
router.get('/user/:userId/preferences', notificationController.getUserPreferences);
router.put('/user/:userId/preferences', notificationController.updateUserPreferences);

// Routes de gestion des notifications
router.post('/', notificationController.createNotification);
router.post('/template', notificationController.createNotificationFromTemplate);
router.post('/with-preferences', notificationController.createNotificationWithPreferences);
router.put('/:id/read', notificationController.markAsRead);
router.put('/user/:userId/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Routes de notifications spécifiques par type

// Planification
router.post('/event-reminder', notificationController.sendEventReminder);

// Réservations
router.post('/new-booking', notificationController.sendNewBookingNotification);
router.post('/payment-received', notificationController.sendPaymentReceivedNotification);

// Performance
router.post('/event-trending', notificationController.sendEventTrendingNotification);

// Urgence
router.post('/event-modified', notificationController.sendEventModifiedNotification);
router.post('/event-cancelled', notificationController.sendEventCancelledNotification);

// Social
router.post('/new-comment', notificationController.sendNewCommentNotification);
router.post('/new-follower', notificationController.sendNewFollowerNotification);

// Personnalisées
router.post('/nearby-events', notificationController.sendNearbyEventsNotification);

// Commercial
router.post('/commercial-promotion', notificationController.sendCommercialPromotionNotification);

// Route de maintenance
router.post('/clean-placeholders', notificationController.cleanExistingNotifications);

export default router;
