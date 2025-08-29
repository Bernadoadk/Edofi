import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventDetailsProps {
  event: {
    title: string;
    start_date: string;
    start_time: string;
    location_address: string;
  };
  onAddToCalendar: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event, onAddToCalendar }) => {
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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Détails de l'événement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date and Time */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Date & Heure
              </h3>
              <p className="text-gray-700 mb-2">{formatDate(event.start_date)}</p>
              <p className="text-gray-700 mb-3">{formatTime(event.start_time)}</p>
              <button
                onClick={onAddToCalendar}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
              >
                <Calendar className="w-4 h-4" />
                <span>Ajouter au calendrier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Lieu
              </h3>
              <p className="text-gray-700">{event.location_address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 