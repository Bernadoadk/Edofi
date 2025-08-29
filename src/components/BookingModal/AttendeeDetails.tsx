import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { PhoneInput } from '../PhoneInput/PhoneInput';

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

interface AttendeeDetailsProps {
  event: {
    title: string;
    date: string;
    tickets: Ticket[];
  };
  selectedTickets: { [key: string]: number };
  attendeeDetails: Attendee;
  onAttendeeChange: (field: keyof Attendee, value: string) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  totalQuantity: number;
  subTotal: number;
}

export const AttendeeDetails: React.FC<AttendeeDetailsProps> = ({
  event,
  selectedTickets,
  attendeeDetails,
  onAttendeeChange,
  onNext,
  canProceed,
  totalQuantity,
  subTotal
}) => {
  const getSelectedTicketTypes = () => {
    return Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([type, quantity]) => ({ type, quantity }));
  };

  return (
    <div className="p-6">
      {/* Event Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-assignment-1dark-navy-blue mb-1">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {event.date}
        </p>
        {getSelectedTicketTypes().map(({ type, quantity }, index) => (
          <p key={index} className="text-sm text-gray-600">
            {type}: Ticket #{index + 1}
          </p>
        ))}
      </div>

      {/* Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <Input
            type="text"
            value={attendeeDetails.fullName}
            onChange={(e) => onAttendeeChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            type="email"
            value={attendeeDetails.email}
            onChange={(e) => onAttendeeChange('email', e.target.value)}
            placeholder="Enter your email"
            className="w-full"
          />
        </div>

        <PhoneInput
          value={attendeeDetails.phone}
          onChange={(value) => onAttendeeChange('phone', value)}
          placeholder="Enter Attendee's Phone Number"
          label="Phone"
          required={true}
        />
      </div>

      {/* Terms */}
      <div className="mb-6">
        <p className="text-xs text-gray-600 leading-relaxed">
          I accept the{' '}
          <a href="#" className="text-assignment-1dark-navy-blue hover:underline">
            Terms of Service
          </a>{' '}
          and have read the{' '}
          <a href="#" className="text-assignment-1dark-navy-blue hover:underline">
            Privacy Policy
          </a>
        </p>
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

        {/* Continue Button */}
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full bg-assignment-1dark-navy-blue hover:bg-assignment-1dark-navy-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>Continue to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 