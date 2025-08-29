import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  NotificationFilters as NotificationFiltersType,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  NOTIFICATION_CATEGORIES
} from '../../types/notifications';

interface NotificationFiltersProps {
  filters: NotificationFiltersType;
  onFiltersChange: (filters: NotificationFiltersType) => void;
  onClose: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState<NotificationFiltersType>(filters);

  const handleFilterChange = (key: keyof NotificationFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const defaultFilters: NotificationFiltersType = {
      read: false,
      limit: 20
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onClose();
  };

  const handleClose = () => {
    setLocalFilters(filters); // Reset to original filters
    onClose();
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-b border-gray-200 bg-gray-50"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Filtres</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Statut de lecture */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Statut
            </label>
            <div className="flex space-x-2">
              <Button
                variant={localFilters.read === false ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('read', false)}
                className="text-xs"
              >
                Non lues
              </Button>
              <Button
                variant={localFilters.read === true ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('read', true)}
                className="text-xs"
              >
                Lues
              </Button>
              <Button
                variant={localFilters.read === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('read', undefined)}
                className="text-xs"
              >
                Toutes
              </Button>
            </div>
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Priorité
            </label>
            <select
              value={localFilters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les priorités</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">Élevée</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LOW">Faible</option>
            </select>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={localFilters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {NOTIFICATION_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Limite */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Nombre de résultats
            </label>
            <select
              value={localFilters.limit || 20}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="flex-1 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Réinitialiser
            </Button>
            <Button
              onClick={handleApplyFilters}
              size="sm"
              className="flex-1 text-xs"
            >
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
