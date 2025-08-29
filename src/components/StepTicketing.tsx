import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Plus, Trash2 } from 'lucide-react';

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

interface StepTicketingProps {
  eventData: EventFormData;
  categories: Array<{ id: number; name: string }>;
  bannerImage: File | null;
  onBack: () => void;
  onNext: (ticketingData: TicketingData) => void;
  initialTicketingData?: TicketingData;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export interface TicketingData {
  ticketTypes: TicketType[];
  currency: string;
}

export const StepTicketing: React.FC<StepTicketingProps> = ({
  eventData,
  categories,
  bannerImage,
  onBack,
  onNext,
  initialTicketingData
}) => {
  const [ticketingData, setTicketingData] = useState<TicketingData>({
    ticketTypes: initialTicketingData?.ticketTypes || [
      {
        id: '1',
        name: 'Billet Standard',
        price: 25,
        quantity: 100,
        description: 'Accès général à l\'événement'
      }
    ],
    currency: initialTicketingData?.currency || 'EUR'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addTicketType = () => {
    const newTicketType: TicketType = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      quantity: 1,
      description: ''
    };
    setTicketingData(prev => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, newTicketType]
    }));
  };

  const removeTicketType = (id: string) => {
    if (ticketingData.ticketTypes.length > 1) {
      setTicketingData(prev => ({
        ...prev,
        ticketTypes: prev.ticketTypes.filter(ticket => ticket.id !== id)
      }));
    }
  };

  const updateTicketType = (id: string, field: keyof TicketType, value: string | number) => {
    setTicketingData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map(ticket =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    ticketingData.ticketTypes.forEach((ticket, index) => {
      if (!ticket.name.trim()) {
        newErrors[`ticket-${ticket.id}-name`] = 'Le nom du billet est requis';
      }
      if (ticket.price <= 0) {
        newErrors[`ticket-${ticket.id}-price`] = 'Le prix doit être supérieur à 0';
      }
      if (ticket.quantity <= 0) {
        newErrors[`ticket-${ticket.id}-quantity`] = 'La quantité doit être supérieure à 0';
      }
      if (!ticket.description.trim()) {
        newErrors[`ticket-${ticket.id}-description`] = 'La description est requise';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(ticketingData);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold text-assignment-1dark-navy-blue mb-6">
          Billets et prix
        </h2>

        {/* Event Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-4">
            {bannerImage && (
              <img
                src={URL.createObjectURL(bannerImage)}
                alt="Event banner"
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-medium text-assignment-1dark-navy-blue mb-2">
                {eventData.title}
              </h3>
              <p className="text-sm text-gray-600">
                {eventData.category_id ? 
                  categories.find(cat => cat.id === eventData.category_id)?.name || `Catégorie ID: ${eventData.category_id}` 
                  : 'Non définie'} • {eventData.start_date} • {eventData.start_time} • Durée: {eventData.duration_type === 'days' ? `${eventData.duration_value}j` : `${eventData.duration_value}h`}
              </p>
            </div>
          </div>
        </div>

        {/* Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Devise
          </label>
          <select
            value={ticketingData.currency}
            onChange={(e) => setTicketingData(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-assignment-1yellow"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        {/* Ticket Types */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-assignment-1dark-navy-blue">
              Types de billets
            </h3>
            <Button
              type="button"
              onClick={addTicketType}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un type</span>
            </Button>
          </div>

          {ticketingData.ticketTypes.map((ticket, index) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Type de billet {index + 1}</h4>
                {ticketingData.ticketTypes.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeTicketType(ticket.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du billet *
                  </label>
                  <Input
                    type="text"
                    value={ticket.name}
                    onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                    placeholder="Ex: Billet Standard"
                    className={errors[`ticket-${ticket.id}-name`] ? 'border-red-500' : ''}
                  />
                  {errors[`ticket-${ticket.id}-name`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`ticket-${ticket.id}-name`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix ({ticketingData.currency}) *
                  </label>
                  <Input
                    type="number"
                    value={ticket.price}
                    onChange={(e) => updateTicketType(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className={errors[`ticket-${ticket.id}-price`] ? 'border-red-500' : ''}
                  />
                  {errors[`ticket-${ticket.id}-price`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`ticket-${ticket.id}-price`]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité disponible *
                  </label>
                  <Input
                    type="number"
                    value={ticket.quantity}
                    onChange={(e) => updateTicketType(ticket.id, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                    className={errors[`ticket-${ticket.id}-quantity`] ? 'border-red-500' : ''}
                  />
                  {errors[`ticket-${ticket.id}-quantity`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`ticket-${ticket.id}-quantity`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Input
                    type="text"
                    value={ticket.description}
                    onChange={(e) => updateTicketType(ticket.id, 'description', e.target.value)}
                    placeholder="Ex: Accès général à l'événement"
                    className={errors[`ticket-${ticket.id}-description`] ? 'border-red-500' : ''}
                  />
                  {errors[`ticket-${ticket.id}-description`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`ticket-${ticket.id}-description`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Retour à l'image
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