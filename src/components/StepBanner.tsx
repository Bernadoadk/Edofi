import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface EventFormData {
  title: string;
  description: string;
  category_id: number;
  event_type: 'single' | 'recurring';
  start_date: string;
  start_time: string;
  duration_type: 'days' | 'hours';
  duration_value: number;
  end_date?: string;
  end_time?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  banner_image?: string;
  tickets?: Array<{
    name: string;
    price: number;
    quantity: number;
    description: string;
    currency: string;
  }>;
}

interface StepBannerProps {
  eventData: EventFormData;
  categories: Array<{ id: number; name: string }>;
  onBack: () => void;
  onNext: (bannerImage: File | null) => void;
  initialBannerImage?: File | null;
}

export const StepBanner: React.FC<StepBannerProps> = ({ 
  eventData, 
  categories,
  onBack, 
  onNext, 
  initialBannerImage 
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(initialBannerImage || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialBannerImage ? URL.createObjectURL(initialBannerImage) : null
  );
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setSelectedImage(file);
      setError('');
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    onNext(selectedImage);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-assignment-1dark-navy-blue mb-6">
          Image de l'événement
        </h2>

        {/* Event Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-assignment-1dark-navy-blue mb-3">
            Récapitulatif de l'événement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Titre :</span>
              <p className="text-gray-900">{eventData.title}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Catégorie :</span>
              <p className="text-gray-900">
                {eventData.category_id ? 
                  categories.find(cat => cat.id === eventData.category_id)?.name || `Catégorie ID: ${eventData.category_id}` 
                  : 'Non définie'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Lieu :</span>
              <p className="text-gray-900">
                {eventData.location && typeof eventData.location === 'object' 
                  ? eventData.location.address 
                  : 'Non défini'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date et heure :</span>
              <p className="text-gray-900">
                {eventData.start_date} • {eventData.start_time}
              </p>
              <p className="text-gray-600 text-xs">
                Durée : {eventData.duration_type === 'days' ? `${eventData.duration_value} jour${eventData.duration_value > 1 ? 's' : ''}` : `${eventData.duration_value} heure${eventData.duration_value > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de l'événement
            </label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-assignment-1yellow transition-colors">
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <div className="flex justify-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        setError('');
                      }}
                      className="text-sm"
                    >
                      Changer l'image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Glissez-déposez votre image ici, ou{' '}
                      <label className="text-assignment-1yellow hover:text-assignment-1yellow/80 cursor-pointer font-medium">
                        cliquez pour parcourir
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Input (hidden) */}
            {!previewUrl && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
            )}

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Image Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Recommandations pour l'image
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Formats acceptés : JPG, PNG, WebP</li>
              <li>• Taille maximale : 5MB</li>
              <li>• Résolution recommandée : 1200x630 pixels (ratio 1.91:1)</li>
              <li>• Qualité : haute résolution pour un meilleur rendu</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Retour aux informations
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-assignment-1dark-navy-blue hover:bg-assignment-1dark-navy-blue/90 text-white px-6 py-2 rounded-lg font-medium"
          >
            Enregistrer et continuer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 