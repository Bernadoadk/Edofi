import React from 'react';
import { Star, Share2, Edit, Copy, Trash2 } from 'lucide-react';

interface EventBannerProps {
  event: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    start_time: string;
    location_address: string;
    banner_image?: string;
    category_name?: string;
    is_published: boolean;
  };
  onFavoriteToggle: () => void;
  onShare: () => void;
  onBuyTickets: () => void;
  isOwner?: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onTogglePublish?: () => void;
  onDelete?: () => void;
  publishing?: boolean;
}

export const EventBanner: React.FC<EventBannerProps> = ({ 
  event, 
  onFavoriteToggle, 
  onShare,
  onBuyTickets,
  isOwner = false,
  onEdit,
  onDuplicate,
  onTogglePublish,
  onDelete,
  publishing = false
}) => {
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

  const getImageUrl = () => {
    if (event.banner_image) {
      return event.banner_image.startsWith('http') ? 
        event.banner_image : 
        `http://localhost:5000/uploads/${event.banner_image}`;
    }
    return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop';
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getImageUrl()})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              {/* Event Info */}
              <div className="text-white mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-bold">
                    {event.title}
                  </h1>
                  {isOwner && (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.is_published 
                        ? 'bg-secondary-color text-white' 
                        : 'bg-accent-color text-white'
                    }`}>
                      {event.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  )}
                </div>
                <p className="text-lg md:text-xl text-gray-200 mb-4">
                  {event.category_name}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTime(event.start_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location_address}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                {/* Owner Actions */}
                {isOwner && (
                  <div className="flex items-center space-x-2 mr-4">
                    <button
                      onClick={onEdit}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onDuplicate}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onTogglePublish}
                      disabled={publishing}
                      className={`p-2 rounded-lg transition-colors ${
                        event.is_published
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      title={event.is_published ? 'Dépublier' : 'Publier'}
                    >
                      {publishing ? '...' : event.is_published ? 'Dépublier' : 'Publier'}
                    </button>
                    <button
                      onClick={onDelete}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Public Actions */}
                <div className="flex items-center space-x-2">
                  {/* Favorite Button */}
                  <button
                    onClick={onFavoriteToggle}
                    className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Star className="w-6 h-6" />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={onShare}
                    className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>

                  {/* Buy Tickets Button */}
                  <button 
                    onClick={onBuyTickets}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Acheter des tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 