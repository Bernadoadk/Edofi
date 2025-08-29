import React from 'react';
import { ArrowRight, Plus, Minus } from 'lucide-react';

interface Ticket {
  type: string;
  price: number;
  currency: string;
}

interface SelectTicketsProps {
  tickets: Ticket[];
  selectedTickets: { [key: string]: number };
  onQuantityChange: (ticketType: string, quantity: number) => void;
  onNext: () => void;
  canProceed: boolean;
  totalQuantity: number;
  subTotal: number;
}

export const SelectTickets: React.FC<SelectTicketsProps> = ({
  tickets,
  selectedTickets,
  onQuantityChange,
  onNext,
  canProceed,
  totalQuantity,
  subTotal
}) => {
  return (
    <div className="p-6">
      {/* Ticket List */}
      <div className="space-y-4 mb-6">
        {tickets.map((ticket) => {
          const quantity = selectedTickets[ticket.type] || 0;
          
          return (
            <div key={ticket.type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              {/* Ticket Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-assignment-1dark-navy-blue">
                  {ticket.type}
                </h3>
                <p className="text-lg font-bold text-assignment-1dark-navy-blue">
                  {ticket.currency} {ticket.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onQuantityChange(ticket.type, quantity - 1)}
                  disabled={quantity === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                
                <span className="w-8 text-center font-semibold text-assignment-1dark-navy-blue">
                  {quantity}
                </span>
                
                <button
                  onClick={() => onQuantityChange(ticket.type, quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4">
        {/* Summary */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Qty: {totalQuantity}
          </div>
          <div className="text-lg font-semibold text-assignment-1dark-navy-blue">
            Total: ₹ {subTotal.toFixed(2)}
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full bg-assignment-1dark-navy-blue hover:bg-assignment-1dark-navy-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>Proceed</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 