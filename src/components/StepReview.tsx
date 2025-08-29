import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Edit3 } from 'lucide-react';

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

interface TicketingData {
  currency: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }>;
}

interface StepReviewProps {
  eventData: EventFormData;
  categories: Array<{ id: number; name: string }>;
  bannerImage: File | null;
  ticketingData: TicketingData;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
}

export const StepReview: React.FC<StepReviewProps> = ({
  eventData,
  categories,
  bannerImage,
  ticketingData,
  onBack,
  onEditStep,
  onSubmit
}) => {
  // Debug pour voir les données reçues
  console.log('StepReview - bannerImage:', bannerImage);
  console.log('StepReview - eventData.banner_image:', eventData.banner_image);
  console.log('StepReview - eventData:', eventData);
  const getCurrencySymbol = (currency: string): string => {
    const symbols: { [key: string]: string } = {
      'EUR': '€',
      'USD': '$',
      'GBP': '£',
    };
    return symbols[currency] || currency;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-semibold text-assignment-1dark-navy-blue">
            Vérification finale
          </h2>
        </div>

        <p className="text-gray-600 mb-8">
          Vérifiez toutes les informations de votre événement avant de le publier.
        </p>

        {/* Event Information */}
        <div className="space-y-6">
          {/* Step 1: Event Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-assignment-1dark-navy-blue">
                Informations de l'événement
              </h3>
              <Button
                type="button"
                onClick={() => onEditStep(1)}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-assignment-1yellow hover:text-assignment-1yellow/80"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier</span>
              </Button>
            </div>
            
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
                <span className="font-medium text-gray-700">Type :</span>
                <p className="text-gray-900">
                  {eventData.event_type === 'single' ? 'Événement unique' : 'Événement récurrent'}
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
                <span className="font-medium text-gray-700">Date :</span>
                <p className="text-gray-900">{eventData.start_date}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Heure :</span>
                <p className="text-gray-900">{eventData.start_time}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Durée :</span>
                <p className="text-gray-900">
                  {eventData.duration_type === 'days' ? `${eventData.duration_value} jour${eventData.duration_value > 1 ? 's' : ''}` : ''} {eventData.duration_type === 'hours' ? `${eventData.duration_value} heure${eventData.duration_value > 1 ? 's' : ''}` : ''}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Description :</span>
                <p className="text-gray-900 mt-1">{eventData.description}</p>
              </div>
            </div>
          </div>

          {/* Step 2: Banner Image */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-assignment-1dark-navy-blue">
                Image de l'événement
              </h3>
              <Button
                type="button"
                onClick={() => onEditStep(2)}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-assignment-1yellow hover:text-assignment-1yellow/80"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier</span>
              </Button>
            </div>
            
            {bannerImage ? (
              <div className="flex items-center space-x-4">
                <img
                  src={URL.createObjectURL(bannerImage)}
                  alt="Event banner"
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                  <span className="text-gray-500 text-xs">Erreur image</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fichier :</span> {bannerImage.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Taille :</span> {(bannerImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : eventData.banner_image ? (
              <div className="flex items-center space-x-4">
                <img
                  src={eventData.banner_image}
                  alt="Event banner"
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                  <span className="text-gray-500 text-xs">Erreur image</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Image :</span> Aperçu de l'image sélectionnée
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Aucune image</span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Aucune image sélectionnée</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Ticketing */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-assignment-1dark-navy-blue">
                Billets et prix
              </h3>
              <Button
                type="button"
                onClick={() => onEditStep(3)}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-assignment-1yellow hover:text-assignment-1yellow/80"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier</span>
              </Button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Devise :</span> {ticketingData.currency} ({getCurrencySymbol(ticketingData.currency)})
              </p>
              
              {ticketingData.ticketTypes.map((ticket, index) => (
                <div key={ticket.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.name}</p>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-assignment-1dark-navy-blue">
                        {ticket.price} {getCurrencySymbol(ticketingData.currency)}
                      </p>
                      <p className="text-sm text-gray-600">{ticket.quantity} disponibles</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Retour aux billets
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="bg-assignment-1yellow hover:bg-assignment-1yellow/90 text-assignment-1dark-navy-blue px-8 py-2 rounded-lg font-medium"
          >
            Publier l'événement
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 