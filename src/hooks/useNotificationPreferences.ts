import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import { 
  NotificationPreference,
  UpdateNotificationPreferenceRequest
} from '../types/notifications';

export interface UseNotificationPreferencesReturn {
  preferences: NotificationPreference | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (preferences: UpdateNotificationPreferenceRequest) => Promise<void>;
  savePreferences: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

export const useNotificationPreferences = (): UseNotificationPreferencesReturn => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger les préférences
  const loadPreferences = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getUserPreferences(user.id);
      setPreferences(data);
    } catch (err) {
      setError('Erreur lors du chargement des préférences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Mettre à jour les préférences
  const updatePreferences = useCallback(async (newPreferences: UpdateNotificationPreferenceRequest) => {
    if (!user?.id) return;

    try {
      const updatedPreferences = await notificationService.updateUserPreferences(user.id, newPreferences);
      setPreferences(updatedPreferences);
      setHasChanges(true);
    } catch (err) {
      setError('Erreur lors de la mise à jour des préférences');
      console.error('Error updating preferences:', err);
    }
  }, [user?.id]);

  // Sauvegarder les préférences
  const savePreferences = useCallback(async () => {
    if (!preferences || !user?.id) return;

    try {
      setLoading(true);
      setError(null);
      await notificationService.updateUserPreferences(user.id, preferences);
      setHasChanges(false);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des préférences');
      console.error('Error saving preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [preferences, user?.id]);

  // Réinitialiser aux valeurs par défaut
  const resetToDefaults = useCallback(async () => {
    if (!user?.id) return;

    const defaultPreferences: UpdateNotificationPreferenceRequest = {
      email_enabled: true,
      push_enabled: true,
      sms_enabled: false,
      in_app_enabled: true,
      planning_enabled: true,
      booking_enabled: true,
      social_enabled: true,
      performance_enabled: true,
      system_enabled: true,
      commercial_enabled: false,
      personalized_enabled: true,
      urgent_enabled: true
    };

    try {
      setLoading(true);
      setError(null);
      const updatedPreferences = await notificationService.updateUserPreferences(user.id, defaultPreferences);
      setPreferences(updatedPreferences);
      setHasChanges(false);
    } catch (err) {
      setError('Erreur lors de la réinitialisation des préférences');
      console.error('Error resetting preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Charger les préférences au montage
  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id, loadPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    savePreferences,
    resetToDefaults
  };
};
