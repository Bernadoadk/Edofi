import React, { useState } from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    start_time: string;
    location_address: string;
    banner_image?: string;
    category_name?: string;
    first_name?: string;
    last_name?: string;
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <Link to={`/event/${event.id}`} className="block">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
        {/* Image Container */}
        <div className="relative h-48 bg-gray-200">
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
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-gray-500 text-2xl">📷</span>
                </div>
                <p className="text-gray-500 text-sm">Aucune image</p>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-secondary-color text-white px-3 py-1 rounded-full text-xs font-semibold">
              {event.category_name || 'Événement'}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                isFavorite 
                  ? 'fill-accent-color text-accent-color' 
                  : 'text-gray-400 hover:text-accent-color'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          {/* Date and Location */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {formatDate(event.start_date)} • {formatTime(event.start_time)}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location_address}</span>
            </div>
          </div>

          {/* Organizer */}
          {event.first_name && event.last_name && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Organisé par {event.first_name} {event.last_name}
              </p>
            </div>
          )}

          {/* Action */}
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Voir détails
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}; 