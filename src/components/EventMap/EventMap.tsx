import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EventMap.css';
import { MapControls } from './MapControls';
import { Event } from '../../services/eventService';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different event categories
const createCustomIcon = (category: string) => {
  const colors: { [key: string]: string } = {
    'Concert': '#FF6B6B',
    'Conference': '#4ECDC4',
    'Exhibition': '#45B7D1',
    'Festival': '#96CEB4',
    'Networking': '#FFEAA7',
    'Sports': '#DDA0DD',
    'Theater': '#98D8C8',
    'Workshop': '#F7DC6F',
    'default': '#6C5CE7'
  };

  const color = colors[category] || colors.default;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">
        ${category.charAt(0).toUpperCase()}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// User location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      background-color: #3498db;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -4px;
        left: -4px;
        width: 24px;
        height: 24px;
        border: 2px solid #3498db;
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    </style>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8]
});

interface EventMapProps {
  events: Event[];
  height?: string;
  showUserLocation?: boolean;
}

// Component to handle user location
const UserLocationMarker: React.FC<{ showUserLocation: boolean }> = ({ showUserLocation }) => {
  const map = useMap();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!showUserLocation) return;

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
      
      // Center map on user location if it's the first time
      if (!userLocation) {
        map.setView([latitude, longitude], 15);
      }
    };

    const error = (error: GeolocationPositionError) => {
      console.error('Error getting user location:', error);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [showUserLocation, map, userLocation]);

  if (!userLocation) return null;

  return (
    <Marker position={userLocation} icon={userLocationIcon}>
      <Popup>
        <div className="text-center">
          <strong>Votre position</strong>
          <br />
          <small>Vous êtes ici</small>
        </div>
      </Popup>
    </Marker>
  );
};

// Component to add controls to the map
const MapControlsWrapper: React.FC<{ showUserLocation: boolean }> = ({ showUserLocation }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!showUserLocation) return;

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
    };

    const error = (error: GeolocationPositionError) => {
      console.error('Error getting user location:', error);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [showUserLocation]);

  return <MapControls userLocation={userLocation} />;
};

export const EventMap: React.FC<EventMapProps> = ({ 
  events, 
  height = "500px",
  showUserLocation = true 
}) => {
  const [mapKey, setMapKey] = useState(0);

  // Default center (Cotonou)
  const defaultCenter: [number, number] = [6.370293, 2.391236];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get image URL for event
  const getEventImageUrl = (event: Event) => {
    if (!event.banner_image) return null;
    return event.banner_image.startsWith('http') 
      ? event.banner_image 
      : `http://localhost:5000/uploads/${event.banner_image}`;
  };

  return (
    <div className="w-full relative">
      <MapContainer
        key={mapKey}
        center={defaultCenter}
        zoom={13}
        style={{ height, width: "100%" }}
        className="rounded-lg shadow-lg"
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* User Location Marker */}
        <UserLocationMarker showUserLocation={showUserLocation} />

        {/* Map Controls */}
        <MapControlsWrapper showUserLocation={showUserLocation} />

        {/* Event Markers */}
        {events.map((event) => {
          const position: [number, number] = [event.location_lat, event.location_lng];
          const icon = createCustomIcon(event.category_name || 'default');
          const imageUrl = getEventImageUrl(event);

          return (
            <Marker key={event.id || Math.random()} position={position} icon={icon}>
              <Popup className="event-popup">
                <div className="max-w-xs">
                  {/* Event Image */}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  {/* Event Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  
                  {/* Category */}
                  {event.category_name && (
                    <div className="mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {event.category_name}
                      </span>
                    </div>
                  )}
                  
                  {/* Date and Time */}
                  <p className="text-sm text-gray-600 mb-2">
                    📅 {formatDate(event.start_date)} à {event.start_time}
                  </p>
                  
                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-3">
                    📍 {event.location_address}
                  </p>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {event.description.length > 100 
                      ? `${event.description.substring(0, 100)}...` 
                      : event.description
                    }
                  </p>
                  
                  {/* Action Button */}
                  <a
                    href={`/event/${event.id}`}
                    className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Voir détails
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
