import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Bell, Mail, Smartphone, Monitor } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  NotificationPreference,
  UpdateNotificationPreferenceRequest,
  NOTIFICATION_CATEGORIES
} from '../../types/notifications';

interface NotificationPreferencesProps {
  preferences: NotificationPreference | null;
  onUpdate: (preferences: UpdateNotificationPreferenceRequest) => void;
  onSave: () => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onUpdate,
  onSave
}) => {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreference | null>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  if (!localPreferences) {
    return (
      <div className="p-8 text-center">
        <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Chargement des préférences...</p>
      </div>
    );
  }

  const handleToggle = (key: keyof UpdateNotificationPreferenceRequest) => {
    if (!localPreferences) return;

    const newPreferences = {
      ...localPreferences,
      [key]: !localPreferences[key as keyof NotificationPreference]
    };
    setLocalPreferences(newPreferences);
    setHasChanges(true);
    onUpdate({ [key]: newPreferences[key as keyof NotificationPreference] });
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = NOTIFICATION_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || '📋';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = NOTIFICATION_CATEGORIES.find(cat => cat.id === categoryId);
    switch (category?.color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      case 'gray': return 'text-gray-600';
      case 'yellow': return 'text-yellow-600';
      case 'pink': return 'text-pink-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Préférences</h3>
        </div>
        {hasChanges && (
          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Sauvegarder
          </Button>
        )}
      </div>

      {/* Canaux de notification */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Canaux de notification
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Monitor className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Notifications in-app</p>
                <p className="text-xs text-gray-500">Notifications dans l'application</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.in_app_enabled}
                onChange={() => handleToggle('in_app_enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Notifications email</p>
                <p className="text-xs text-gray-500">Recevoir par email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.email_enabled}
                onChange={() => handleToggle('email_enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Notifications push</p>
                <p className="text-xs text-gray-500">Notifications push navigateur</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.push_enabled}
                onChange={() => handleToggle('push_enabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Catégories de notification */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Catégories de notification</h4>
        <div className="space-y-2">
          {NOTIFICATION_CATEGORIES.map((category) => {
            const preferenceKey = `${category.id}_enabled` as keyof NotificationPreference;
            const isEnabled = localPreferences[preferenceKey] as boolean;

            return (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`text-lg ${getCategoryColor(category.id)}`}>
                    {getCategoryIcon(category.id)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggle(preferenceKey as keyof UpdateNotificationPreferenceRequest)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note d'information */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Note :</strong> Les notifications urgentes seront toujours envoyées, 
          même si vous désactivez certaines catégories.
        </p>
      </div>
    </motion.div>
  );
};
