import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface EventLocationProps {
  location: {
    location_address: string;
    location_lat: number;
    location_lng: number;
  };
}

export const EventLocation: React.FC<EventLocationProps> = ({ location }) => {
  // Custom marker icon
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: #3B82F6;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.location_lat},${location.location_lng}`;
    window.open(url, '_blank');
  };

  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${location.location_lat},${location.location_lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Lieu de l'événement
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Details */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
            <p className="text-gray-600">{location.location_address}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGetDirections}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Itinéraire</span>
            </button>
            
            <button
              onClick={handleOpenInGoogleMaps}
              className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Voir sur Google Maps</span>
            </button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <MapContainer
            center={[location.location_lat, location.location_lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            <Marker
              position={[location.location_lat, location.location_lng]}
              icon={customIcon}
            >
              <Popup>
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <strong>{location.location_address}</strong>
                  <br />
                  <a
                    href={`https://www.google.com/maps?q=${location.location_lat},${location.location_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '12px' }}
                  >
                    Ouvrir dans Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}; 