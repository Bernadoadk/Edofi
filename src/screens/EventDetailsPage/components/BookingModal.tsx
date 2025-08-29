import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Event, Ticket } from '../../../services/eventService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, event }) => {
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  
  // Mock tickets data - à remplacer par les vraies données de l'API
  const tickets: Ticket[] = event?.tickets || [
    {
      id: 1,
      name: 'Ticket Standard',
      price: 25,
      quantity: 100,
      description: 'Accès général à l\'événement',
      currency: 'EUR'
    },
    {
      id: 2,
      name: 'Ticket VIP',
      price: 50,
      quantity: 20,
      description: 'Accès VIP avec zone dédiée',
      currency: 'EUR'
    }
  ];

  const handleQuantityChange = (ticketId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: newQuantity
    }));
  };

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return tickets.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.id] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const handlePurchase = () => {
    // TODO: Implémenter la logique d'achat
    console.log('Achat de tickets:', selectedTickets);
    alert('Fonctionnalité d\'achat à implémenter');
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Acheter des tickets
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600">
              {new Date(event.start_date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} à {event.start_time}
            </p>
            <p className="text-sm text-gray-600">{event.location_address}</p>
          </div>

          {/* Tickets */}
          <div className="space-y-4 mb-6">
            {tickets.map((ticket) => {
              const quantity = selectedTickets[ticket.id] || 0;
              const available = ticket.quantity - quantity;
              
              return (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">
                        {ticket.price} {ticket.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        {available} disponibles
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(ticket.id, quantity - 1)}
                        disabled={quantity === 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-semibold text-gray-900">
                        {quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(ticket.id, quantity + 1)}
                        disabled={available === 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {quantity > 0 && (
                      <div className="text-sm text-gray-600">
                        Total: {ticket.price * quantity} {ticket.currency}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          {getTotalQuantity() > 0 && (
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total ({getTotalQuantity()} ticket{getTotalQuantity() > 1 ? 's' : ''})</span>
                <span className="font-bold text-xl text-gray-900">{getTotalPrice()} EUR</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handlePurchase}
            disabled={getTotalQuantity() === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>
              {getTotalQuantity() === 0 ? 'Sélectionner des tickets' : `Acheter ${getTotalQuantity()} ticket${getTotalQuantity() > 1 ? 's' : ''}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
