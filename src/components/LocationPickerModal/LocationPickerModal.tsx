import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icône pour le marqueur de sélection
const selectionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Position par défaut (Bénin)
const DEFAULT_POSITION: [number, number] = [9.3077, 2.3158];

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location | null;
}

// Composant pour gérer les clics sur la carte
const MapClickHandler: React.FC<{
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}> = ({ onLocationSelect, selectedLocation }) => {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      try {
        // Récupérer l'adresse via l'API de géocodage inverse
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({
          lat,
          lng,
          address
        });
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse:', error);
        // Utiliser les coordonnées si l'adresse ne peut pas être récupérée
        onLocationSelect({
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      }
    },
  });

  return null;
};

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Rechercher une adresse
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=bj`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Sélectionner un résultat de recherche
  const selectSearchResult = (result: any) => {
    const location: Location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name
    };
    
    setSelectedLocation(location);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    
    // Centrer la carte sur la position sélectionnée
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 15);
    }
  };

  // Confirmer la sélection
  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  // Réinitialiser la sélection
  const handleReset = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Gérer la sélection de localisation depuis la carte
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchQuery(location.address);
  };

  // Effet pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Sélectionner le lieu de l'événement
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Barre de recherche */}
            <div className="mt-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une adresse..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Résultats de recherche */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => selectSearchResult(result)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    >
                      <p className="text-sm text-gray-900">{result.display_name}</p>
                    </button>
                  ))}
                </div>
              )}
              
              {isSearching && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Contenu */}
          <div className="bg-white">
            {/* Instructions */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <p className="text-sm text-blue-800">
                Cliquez sur la carte pour placer un marqueur ou utilisez la barre de recherche ci-dessus.
              </p>
            </div>

            {/* Carte */}
            <div className="h-96 relative">
              <MapContainer
                center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : DEFAULT_POSITION}
                zoom={selectedLocation ? 15 : 7}
                className="h-full w-full"
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapClickHandler 
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />

                {/* Marqueur sélectionné */}
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={selectionIcon}
                  />
                )}
              </MapContainer>
            </div>

            {/* Informations de localisation */}
            {selectedLocation && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Lieu sélectionné :</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedLocation.address}</p>
                <p className="text-xs text-gray-500">
                  Coordonnées : {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Réinitialiser
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedLocation}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 