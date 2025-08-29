import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { SelectTickets } from './SelectTickets';
import { AttendeeDetails } from './AttendeeDetails';
import { OrderSummary } from './OrderSummary';

export type BookingStep = 'select-tickets' | 'attendee-details' | 'order-summary';

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    date: string;
    tickets: Ticket[];
  };
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  event 
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-tickets');
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const [attendeeDetails, setAttendeeDetails] = useState<Attendee>({
    fullName: '',
    email: '',
    phone: ''
  });

  const handleTicketQuantityChange = (ticketType: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketType]: Math.max(0, quantity)
    }));
  };

  const handleAttendeeDetailsChange = (field: keyof Attendee, value: string) => {
    setAttendeeDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'select-tickets':
        setCurrentStep('attendee-details');
        break;
      case 'attendee-details':
        setCurrentStep('order-summary');
        break;
      case 'order-summary':
        // Handle payment
        console.log('Processing payment...');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'attendee-details':
        setCurrentStep('select-tickets');
        break;
      case 'order-summary':
        setCurrentStep('attendee-details');
        break;
    }
  };

  const getTotalQuantity = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const getSubTotal = () => {
    return event.tickets.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.type] || 0;
      return total + (ticket.price * quantity);
    }, 0);
  };

  const getTax = () => {
    return getSubTotal() * 0.059; // 5.9% tax
  };

  const getTotal = () => {
    return getSubTotal() + getTax();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'select-tickets':
        return getTotalQuantity() > 0;
      case 'attendee-details':
        const phoneNumber = attendeeDetails.phone.replace(/\D/g, '');
        return attendeeDetails.fullName && 
               attendeeDetails.email && 
               attendeeDetails.phone && 
               phoneNumber.length === 10;
      case 'order-summary':
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'select-tickets':
        return (
          <SelectTickets
            tickets={event.tickets}
            selectedTickets={selectedTickets}
            onQuantityChange={handleTicketQuantityChange}
            onNext={handleNext}
            canProceed={canProceed()}
            totalQuantity={getTotalQuantity()}
            subTotal={getSubTotal()}
          />
        );
      case 'attendee-details':
        return (
          <AttendeeDetails
            event={event}
            selectedTickets={selectedTickets}
            attendeeDetails={attendeeDetails}
            onAttendeeChange={handleAttendeeDetailsChange}
            onBack={handleBack}
            onNext={handleNext}
            canProceed={canProceed()}
            totalQuantity={getTotalQuantity()}
            subTotal={getSubTotal()}
          />
        );
      case 'order-summary':
        return (
          <OrderSummary
            event={event}
            selectedTickets={selectedTickets}
            attendeeDetails={attendeeDetails}
            onBack={handleBack}
            onPay={handleNext}
            subTotal={getSubTotal()}
            tax={getTax()}
            total={getTotal()}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {currentStep !== 'select-tickets' && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-assignment-1dark-navy-blue">
              {currentStep === 'select-tickets' && 'Select Tickets'}
              {currentStep === 'attendee-details' && 'Attendee Details'}
              {currentStep === 'order-summary' && 'Order Summary'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}; 