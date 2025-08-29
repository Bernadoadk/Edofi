import React from 'react';
import { Lock } from 'lucide-react';

interface Ticket {
  type: string;
  price: number;
  currency: string;
}

interface Attendee {
  fullName: string;
  email: string;
  phone: string;
}

interface OrderSummaryProps {
  event: {
    title: string;
    date: string;
    tickets: Ticket[];
  };
  selectedTickets: { [key: string]: number };
  attendeeDetails: Attendee;
  onBack: () => void;
  onPay: () => void;
  subTotal: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  event,
  selectedTickets,
  attendeeDetails,
  onPay,
  subTotal,
  tax,
  total
}) => {
  const getSelectedTicketTypes = () => {
    return Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([type, quantity]) => ({ type, quantity }));
  };

  return (
    <div className="p-6">
      {/* Ticket Preview */}
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gradient-to-br from-assignment-1yellow/10 to-assignment-1yellow/5">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-assignment-1dark-navy-blue mb-2">
              Standard Ticket
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{attendeeDetails.fullName}</p>
              <p>{attendeeDetails.email}</p>
              <p className="text-lg font-semibold text-assignment-1dark-navy-blue">
                ₹ 200.00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-6">
        <h4 className="font-semibold text-assignment-1dark-navy-blue mb-3">
          Price Breakdown
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sub Total:</span>
            <span className="text-assignment-1dark-navy-blue">₹ {subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="text-assignment-1dark-navy-blue">₹ {tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-assignment-1dark-navy-blue">Order Total:</span>
              <span className="font-bold text-green-600 text-lg">₹ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-assignment-1dark-navy-blue mb-2">
          Event Details
        </h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p>{event.title}</p>
          <p>{event.date}</p>
          {getSelectedTicketTypes().map(({ type, quantity }, index) => (
            <p key={index}>
              {type}: {quantity} ticket{quantity > 1 ? 's' : ''}
            </p>
          ))}
        </div>
      </div>

      {/* Pay Button */}
      <button
        onClick={onPay}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <Lock className="w-5 h-5" />
        <span>Pay Now</span>
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Your payment is secured with SSL encryption
      </p>
    </div>
  );
}; 