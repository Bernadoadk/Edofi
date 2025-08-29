import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import notificationService from '../services/notificationService';
import notificationTriggers from '../services/notificationTriggers';

export const NotificationTest: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('test123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await apiService.signin({ email, password });
      if (response.success) {
        login(response.data.user as any, response.data.token);
        setMessage('✅ Connexion réussie !');
      } else {
        setMessage('❌ Erreur de connexion: ' + response.message);
      }
    } catch (error) {
      setMessage('❌ Erreur: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testBasicNotifications = async () => {
    if (!user) {
      setMessage('❌ Vous devez être connecté pour tester les notifications');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Test 1: Obtenir le nombre de notifications non lues
      const unreadCount = await notificationService.getUnreadCount(user.id);
      setMessage(`📊 Notifications non lues: ${unreadCount}`);

      // Test 2: Créer une notification de test
      const testNotification = await notificationService.createNotification({
        user_id: user.id,
        type: 'EVENT_REMINDER' as any,
        title: 'Test Notification',
        message: 'Ceci est une notification de test',
        priority: 'MEDIUM' as any
      });

      setMessage(prev => prev + `\n✅ Notification créée avec l'ID: ${testNotification.id}`);

      // Test 3: Obtenir toutes les notifications
      const notifications = await notificationService.getUserNotifications(user.id, { limit: 10 });
      setMessage(prev => prev + `\n📋 Total notifications: ${notifications.length}`);

    } catch (error) {
      setMessage('❌ Erreur lors du test: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testRealNotifications = async () => {
    if (!user) {
      setMessage('❌ Vous devez être connecté pour tester les notifications');
      return;
    }

    setLoading(true);
    setMessage('🧪 Test des notifications réelles...\n');

    try {
      // Test 1: Notification de création d'événement
      await notificationTriggers.onEventCreated(user.id, 'Concert de Jazz', 123);
      setMessage(prev => prev + '✅ Notification de création d\'événement\n');

      // Test 2: Notification de nouvelle réservation
      await notificationTriggers.onNewBooking(user.id, 'Marie Dupont', 'Concert de Jazz', 123);
      setMessage(prev => prev + '✅ Notification de nouvelle réservation\n');

      // Test 3: Notification de paiement reçu
      await notificationTriggers.onPaymentReceived(user.id, '25€', 'Concert de Jazz', 123);
      setMessage(prev => prev + '✅ Notification de paiement reçu\n');

      // Test 4: Notification de nouveau commentaire
      await notificationTriggers.onNewComment(user.id, 'Jean Martin', 'Concert de Jazz', 123);
      setMessage(prev => prev + '✅ Notification de nouveau commentaire\n');

      // Test 5: Notification de nouveau follower
      await notificationTriggers.onNewFollower(user.id, 'Sophie Bernard');
      setMessage(prev => prev + '✅ Notification de nouveau follower\n');

      // Test 6: Notification d'événement en tendance
      await notificationTriggers.onEventTrending(user.id, 'Concert de Jazz', 123);
      setMessage(prev => prev + '✅ Notification d\'événement en tendance\n');

      // Test 7: Notification d'événements à proximité
      await notificationTriggers.onNearbyEvents(user.id, 5);
      setMessage(prev => prev + '✅ Notification d\'événements à proximité\n');

      // Test 8: Notification de promotion commerciale
      await notificationTriggers.onCommercialPromotion(user.id, 'Réduction Été', 20);
      setMessage(prev => prev + '✅ Notification de promotion commerciale\n');

      // Test 9: Notification de statistiques quotidiennes
      await notificationTriggers.onDailyStats(user.id, { views: 150, bookings: 12, revenue: 300 });
      setMessage(prev => prev + '✅ Notification de statistiques quotidiennes\n');

      // Test 10: Notification de weekend
      await notificationTriggers.onWeekendEvents(user.id);
      setMessage(prev => prev + '✅ Notification de weekend\n');

      setMessage(prev => prev + '\n🎉 Tous les tests de notifications réelles sont terminés !');

    } catch (error) {
      setMessage('❌ Erreur lors du test: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testSpecificNotifications = async () => {
    if (!user) {
      setMessage('❌ Vous devez être connecté pour tester les notifications');
      return;
    }

    setLoading(true);
    setMessage('🎯 Test des notifications spécifiques...\n');

    try {
      // Test de notifications d'urgence
      await notificationTriggers.onEventModified(user.id, 'Concert de Jazz', 123);
      setMessage(prev => prev + '🚨 Notification d\'événement modifié\n');

      await notificationTriggers.onEventCancelled(user.id, 'Concert de Jazz', 123);
      setMessage(prev => prev + '🚨 Notification d\'événement annulé\n');

      // Test de notifications de sécurité
      await notificationTriggers.onNewLogin(user.id, 'Paris, France');
      setMessage(prev => prev + '🔒 Notification de nouvelle connexion\n');

      // Test de notifications de maintenance
      await notificationTriggers.onMaintenanceScheduled(user.id, '2024-01-15 02:00');
      setMessage(prev => prev + '🔧 Notification de maintenance\n');

      // Test de notifications saisonnières
      await notificationTriggers.onSeasonalEvents(user.id, 'Été');
      setMessage(prev => prev + '🌞 Notification d\'événements d\'été\n');

      // Test de notifications de nouvelles fonctionnalités
      await notificationTriggers.onNewFeature(user.id, 'Système de Notifications');
      setMessage(prev => prev + '✨ Notification de nouvelle fonctionnalité\n');

      setMessage(prev => prev + '\n🎉 Tous les tests de notifications spécifiques sont terminés !');

    } catch (error) {
      setMessage('❌ Erreur lors du test: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearAllNotifications = async () => {
    if (!user) {
      setMessage('❌ Vous devez être connecté');
      return;
    }

    setLoading(true);
    setMessage('🗑️ Suppression de toutes les notifications...');

    try {
      const notifications = await notificationService.getUserNotifications(user.id, { limit: 100 });
      
      for (const notification of notifications) {
        try {
          await notificationService.deleteNotification(notification.id);
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
        }
      }

      setMessage('✅ Toutes les notifications ont été supprimées !');
    } catch (error) {
      setMessage('❌ Erreur lors de la suppression: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cleanPlaceholders = async () => {
    if (!user) {
      setMessage('❌ Vous devez être connecté');
      return;
    }

    setLoading(true);
    setMessage('🧹 Nettoyage des placeholders...');

    try {
      const response = await fetch('http://localhost:5000/api/notifications/clean-placeholders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage('✅ Placeholders nettoyés avec succès !');
        // Recharger les notifications
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        setMessage('❌ Erreur lors du nettoyage: ' + error.error);
      }
    } catch (error) {
      setMessage('❌ Erreur lors du nettoyage: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Test des Notifications</h2>
      
      {!user ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-100 p-3 rounded">
            <p className="font-medium">✅ Connecté en tant que:</p>
            <p>{user.firstName} {user.lastName} ({user.email})</p>
            <p>ID: {user.id}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={testBasicNotifications}
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Test...' : 'Test Notifications Basiques'}
            </button>

            <button
              onClick={testRealNotifications}
              disabled={loading}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Test...' : 'Test Notifications Réelles'}
            </button>

            <button
              onClick={testSpecificNotifications}
              disabled={loading}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Test...' : 'Test Notifications Spécifiques'}
            </button>

            <button
              onClick={cleanPlaceholders}
              disabled={loading}
              className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Nettoyage...' : 'Nettoyer les Placeholders'}
            </button>

            <button
              onClick={clearAllNotifications}
              disabled={loading}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Suppression...' : 'Supprimer Toutes les Notifications'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap text-sm">{message}</pre>
        </div>
      )}
    </div>
  );
};
