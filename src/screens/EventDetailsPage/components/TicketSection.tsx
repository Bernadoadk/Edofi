import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, Calendar, MapPin, Clock } from 'lucide-react';
import { Ticket } from '../../../services/eventService';

interface TicketSectionProps {
  event: {
    id: number;
    title: string;
    start_date: string;
    start_time: string;
    location_address: string;
    banner_image?: string;
    category_name?: string;
    tickets?: Ticket[];
  };
  onBuyTickets: () => void;
}

export const TicketSection: React.FC<TicketSectionProps> = ({ event, onBuyTickets }) => {
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  
  // Mock tickets data - à remplacer par les vraies données de l'API
  const tickets = event.tickets || [
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Acheter des tickets</h3>
        
        {/* Event Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(event.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location_address}</span>
          </div>
        </div>
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

      {/* Buy Button */}
      <button
        onClick={onBuyTickets}
        disabled={getTotalQuantity() === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>
          {getTotalQuantity() === 0 ? 'Sélectionner des tickets' : `Acheter ${getTotalQuantity()} ticket${getTotalQuantity() > 1 ? 's' : ''}`}
        </span>
      </button>

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Paiement sécurisé • Remboursement possible</p>
      </div>
    </div>
  );
};
