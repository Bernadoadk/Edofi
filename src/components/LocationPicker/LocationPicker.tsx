import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: Location | null;
  onChange: (location: Location) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

// Déclaration globale pour Google Maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner un lieu",
  label,
  required = false,
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // Charger Google Maps API
  useEffect(() => {
    // Vérifier si Google Maps est déjà chargé
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Vérifier si le script est déjà en cours de chargement
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Attendre que le script existant se charge
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setIsLoaded(true);
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }

    // Charger le script Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&loading=async&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Définir la fonction de callback globale
    (window as any).initGoogleMaps = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Erreur lors du chargement de Google Maps API');
      setIsLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      // Ne pas supprimer le script car il peut être utilisé par d'autres composants
    };
  }, []);

  // Initialiser l'autocomplétion
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current && window.google && window.google.maps && window.google.maps.places) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'bj' }, // Restriction au Bénin
          fields: ['formatted_address', 'geometry', 'name']
        });

        // Écouter la sélection d'un lieu
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          
          if (place.geometry && place.geometry.location) {
            const location: Location = {
              address: place.formatted_address || place.name,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            
            onChange(location);
          }
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'autocomplétion:', error);
      }
    }
  }, [isLoaded, onChange]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={value?.address || ''}
          className="w-full px-3 py-2 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      
      {!isLoaded && (
        <div className="mt-2 text-xs text-gray-500">
          Chargement de Google Maps...
        </div>
      )}
    </div>
  );
}; 