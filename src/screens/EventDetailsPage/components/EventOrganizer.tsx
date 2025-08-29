import React, { useState } from 'react';
import { User, Plus, Minus } from 'lucide-react';

interface EventOrganizerProps {
  organizer: {
    first_name?: string;
    last_name?: string;
    banner_image?: string;
    description?: string;
  };
}

export const EventOrganizer: React.FC<EventOrganizerProps> = ({ organizer }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const organizerName = `${organizer.first_name || ''} ${organizer.last_name || ''}`.trim() || 'Organisateur';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Organisé par
        </h3>
      </div>

      <div className="flex items-start space-x-4">
        {/* Organizer Avatar */}
        <div className="flex-shrink-0">
          {organizer.banner_image ? (
            <img
              src={organizer.banner_image.startsWith('http') ? 
                organizer.banner_image : 
                `http://localhost:5000/uploads/${organizer.banner_image}`
              }
              alt={organizerName}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center hidden">
            <span className="text-gray-500 text-xl font-semibold">
              {organizerName.charAt(0) || 'O'}
            </span>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {organizerName}
          </h4>
          {organizer.description && (
            <p className="text-gray-600 text-sm mb-4">
              {organizer.description}
            </p>
          )}
          <button
            onClick={handleFollowToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? (
              <>
                <Minus className="w-4 h-4" />
                <span>Ne plus suivre</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Suivre</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 