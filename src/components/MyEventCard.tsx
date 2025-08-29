import React, { useState } from 'react';
import { Star, Clock, MapPin, Edit, Trash2, Copy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';

interface MyEventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    start_time: string;
    location_address: string;
    banner_image?: string;
    category_name?: string;
    category_id: number;
    event_type: 'single' | 'recurring';
    end_date?: string;
    end_time?: string;
    duration_type?: 'days' | 'hours';
    duration_value?: number;
    location_lat: number;
    location_lng: number;
    is_published: boolean;
    user_id: number;
  };
  onEventDeleted: () => void;
}

export const MyEventCard: React.FC<MyEventCardProps> = ({ event, onEventDeleted }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-event/${event.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await eventService.deleteEvent(event.id);
      onEventDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'événement');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigate('/create-event', { 
      state: { 
        duplicateEvent: {
          title: `${event.title} (Copie)`,
          description: event.description,
          category_id: event.category_id,
          event_type: event.event_type,
          start_date: event.start_date,
          start_time: event.start_time,
          end_date: event.end_date,
          end_time: event.end_time,
          duration_type: event.duration_type,
          duration_value: event.duration_value,
          location_address: event.location_address,
          location_lat: event.location_lat,
          location_lng: event.location_lng,
          is_published: false
        }
      }
    });
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
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

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.is_published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {event.is_published ? 'Publié' : 'Brouillon'}
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
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-3 right-12 flex space-x-1">
          <button
            onClick={handleEdit}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            title="Modifier"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            title="Dupliquer"
          >
            <Copy className="w-4 h-4 text-purple-600" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link to={`/event/${event.id}`} className="block">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formatDate(event.start_date)} à {formatTime(event.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location_address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
