import React, { useState, useEffect } from 'react';
import { DatePicker } from './DatePicker/DatePicker';
import { TimePicker12h } from './TimePicker12h/TimePicker12h';
import { LocationPickerMap } from './LocationPickerMap/LocationPickerMap';
import { eventService, Category } from '../services/eventService';

interface EventFormData {
  title: string;
  description: string;
  category_id: number;
  event_type: 'single' | 'recurring';
  start_date: string;
  start_time: string;
  duration_type: 'days' | 'hours';
  duration_value: number;
  end_date?: string; // Calculé automatiquement
  end_time?: string; // Calculé automatiquement
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
}

interface StepEditProps {
  data: EventFormData;
  onDataChange: (data: EventFormData) => void;
  onNext: () => void;
}

export const StepEdit: React.FC<StepEditProps> = ({ data, onDataChange, onNext }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('Chargement des catégories...');
      const response = await eventService.getCategories();
      console.log('Réponse complète des catégories:', response);
      
      // Le service retourne directement les données des catégories
      if (response && Array.isArray(response)) {
        setCategories(response);
        console.log('Catégories définies:', response);
      } else {
        console.error('Structure de réponse inattendue:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      setCategories([]); // Ensure categories is always an array
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!data.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!data.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!data.category_id) {
      newErrors.category_id = 'La catégorie est requise';
    }

    if (!data.start_date) {
      newErrors.start_date = 'La date de début est requise';
    }

    if (!data.start_time) {
      newErrors.start_time = 'L\'heure de début est requise';
    }

    if (data.duration_type === 'days' && data.duration_value < 0) {
      newErrors.duration_value = 'La durée en jours ne peut pas être négative';
    }

    if (data.duration_type === 'hours' && data.duration_value < 0) {
      newErrors.duration_value = 'La durée en heures ne peut pas être négative';
    }

    if (data.duration_value <= 0) {
      newErrors.duration_value = 'La durée doit être supérieure à 0';
    }

    if (!data.location) {
      newErrors.location = 'Le lieu est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateData = (field: keyof EventFormData, value: any) => {
    onDataChange({
      ...data,
      [field]: value
    });
  };

  const handleNext = () => {
    if (validateForm()) {
      // Calculer la date et heure de fin basées sur la durée
      if (data.start_date && data.start_time && data.duration_type && data.duration_value > 0) {
        const startDateTime = new Date(`${data.start_date}T${data.start_time}`);
        const endDateTime = new Date(startDateTime);
        
        if (data.duration_type === 'days') {
          endDateTime.setDate(endDateTime.getDate() + data.duration_value);
        } else if (data.duration_type === 'hours') {
          endDateTime.setHours(endDateTime.getHours() + data.duration_value);
        }
        
        const endDate = endDateTime.toISOString().split('T')[0];
        const endTime = endDateTime.toTimeString().slice(0, 5);
        
        updateData('end_date', endDate);
        updateData('end_time', endTime);
      }
      
      onNext();
    }
  };

  const openLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationModalOpen(false);
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    updateData('location', {
      address: location.address,
      lat: location.lat,
      lng: location.lng
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations de base
        </h3>
        
        {/* Titre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l'événement *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData('title', e.target.value)}
            placeholder="Ex: Concert de Jazz au Sunset"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={data.description}
            onChange={(e) => updateData('description', e.target.value)}
            placeholder="Décrivez votre événement..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Catégorie */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            value={data.category_id || ''}
            onChange={(e) => updateData('category_id', e.target.value ? parseInt(e.target.value) : 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Chargement des catégories...' : 'Sélectionner une catégorie'}
            </option>
            {(categories || []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {loading && (
            <p className="mt-1 text-sm text-blue-600">Chargement des catégories...</p>
          )}
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
          )}
        </div>

        {/* Type d'événement */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'événement *
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="single"
                checked={data.event_type === 'single'}
                onChange={(e) => updateData('event_type', e.target.value as 'single' | 'recurring')}
                className="mr-2"
              />
              Événement unique
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="recurring"
                checked={data.event_type === 'recurring'}
                onChange={(e) => updateData('event_type', e.target.value as 'single' | 'recurring')}
                className="mr-2"
              />
              Événement récurrent
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Date, heure et durée
        </h3>
        
        {/* Date de début */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de début *
          </label>
          <DatePicker
            value={data.start_date ? new Date(data.start_date) : null}
            onChange={(date: Date) => updateData('start_date', date.toISOString().split('T')[0])}
            placeholder="Sélectionner une date"
            required
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
          )}
        </div>

        {/* Heure de début */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure de début *
          </label>
          <TimePicker12h
            value={data.start_time}
            onChange={(time) => updateData('start_time', time)}
            placeholder="Sélectionner l'heure"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Format 12h (AM/PM) - L'heure sera automatiquement convertie au format 24h
          </p>
          {errors.start_time && (
            <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
          )}
        </div>

        {/* Durée */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de durée *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="days"
                  checked={data.duration_type === 'days'}
                  onChange={(e) => updateData('duration_type', e.target.value as 'days' | 'hours')}
                  className="mr-2"
                />
                Jours
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hours"
                  checked={data.duration_type === 'hours'}
                  onChange={(e) => updateData('duration_type', e.target.value as 'days' | 'hours')}
                  className="mr-2"
                />
                Heures
              </label>
            </div>
            {errors.duration_type && (
              <p className="mt-1 text-sm text-red-600">{errors.duration_type}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valeur de durée *
            </label>
            <input
              type="number"
              min="0"
              value={data.duration_value || 0}
              onChange={(e) => updateData('duration_value', parseInt(e.target.value) || 0)}
              placeholder="0"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.duration_value ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.duration_value && (
              <p className="mt-1 text-sm text-red-600">{errors.duration_value}</p>
            )}
          </div>
        </div>

        {/* Aperçu de la durée */}
        {(data.duration_value > 0) && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Durée totale :</strong> {data.duration_type === 'days' ? `${data.duration_value} jour${data.duration_value > 1 ? 's' : ''}` : `${data.duration_value} heure${data.duration_value > 1 ? 's' : ''}`}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lieu
        </h3>
        
        {/* Bouton pour ouvrir le modal de sélection de localisation */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lieu de l'événement *
          </label>
          
          <button
            type="button"
            onClick={openLocationModal}
            className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-left transition-colors ${
              data.location 
                ? 'border-green-300 bg-green-50 hover:border-green-400' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            } ${errors.location ? 'border-red-500' : ''}`}
          >
            {data.location ? (
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-green-700">Lieu sélectionné</span>
                  </div>
                  <span className="text-sm text-green-600">Modifier</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{data.location.address}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Coordonnées : {data.location.lat.toFixed(6)}, {data.location.lng.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">Cliquez pour sélectionner le lieu sur la carte</span>
              </div>
            )}
          </button>
          
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continuer
        </button>
      </div>

      {/* Modal de sélection de localisation avec carte */}
      <LocationPickerMap
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onLocationSelect={handleLocationSelect}
        initialLocation={data.location ? {
          lat: data.location.lat,
          lng: data.location.lng,
          address: data.location.address
        } : null}
      />
    </div>
  );
}; 