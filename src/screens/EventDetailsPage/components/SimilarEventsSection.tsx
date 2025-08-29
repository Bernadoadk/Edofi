import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../../../services/eventService';

interface SimilarEventsSectionProps {
  events: Event[];
}

export const SimilarEventsSection: React.FC<SimilarEventsSectionProps> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Événements similaires
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.slice(0, 4).map((event) => (
          <Link
            key={event.id}
            to={`/event/${event.id}`}
            className="block group"
          >
            <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Event Image */}
              <div className="relative h-32 bg-gray-200">
                {event.banner_image ? (
                  <img
                    src={event.banner_image.startsWith('http') ? 
                      event.banner_image : 
                      `http://localhost:5000/uploads/${event.banner_image}`
                    }
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                  <span className="text-gray-500 text-2xl">📷</span>
                </div>
              </div>
              
              {/* Event Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(event.start_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {event.location_address}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
