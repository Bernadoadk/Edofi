import React from 'react';
import { EventMap } from './EventMap';

// Sample events data for demonstration
const sampleEvents = [
  {
    id: 1,
    title: "Concert de Jazz au Sunset",
    description: "Une soirée exceptionnelle avec les meilleurs musiciens de jazz de la région. Ambiance feutrée et cocktails d'exception.",
    start_date: "2024-02-15",
    start_time: "20:00",
    location_address: "Sunset Bar, Cotonou",
    location_lat: 6.3705,
    location_lng: 2.3920,
    category_name: "Concert",
    banner_image: undefined,
    category_id: 1,
    event_type: 'single' as const,
    is_published: true,
    user_id: 1
  },
  {
    id: 2,
    title: "Tournoi de Football Amical",
    description: "Tournoi de football amical entre équipes locales. Venez encourager votre équipe préférée !",
    start_date: "2024-02-20",
    start_time: "16:00",
    location_address: "Stade de l'Amitié, Cotonou",
    location_lat: 6.3720,
    location_lng: 2.3950,
    category_name: "Sports",
    banner_image: undefined,
    category_id: 2,
    event_type: 'single' as const,
    is_published: true,
    user_id: 1
  },
  {
    id: 3,
    title: "Exposition d'Art Contemporain",
    description: "Découvrez les œuvres d'artistes contemporains béninois. Une exposition unique à ne pas manquer.",
    start_date: "2024-02-25",
    start_time: "14:00",
    location_address: "Musée d'Art Moderne, Cotonou",
    location_lat: 6.3680,
    location_lng: 2.3880,
    category_name: "Exhibition",
    banner_image: undefined,
    category_id: 3,
    event_type: 'single' as const,
    is_published: true,
    user_id: 1
  },
  {
    id: 4,
    title: "Meetup Développeurs Web",
    description: "Rencontre entre développeurs web pour échanger sur les dernières technologies et bonnes pratiques.",
    start_date: "2024-03-01",
    start_time: "19:00",
    location_address: "Espace Coworking, Cotonou",
    location_lat: 6.3750,
    location_lng: 2.3900,
    category_name: "Networking",
    banner_image: undefined,
    category_id: 4,
    event_type: 'single' as const,
    is_published: true,
    user_id: 1
  }
];

export const EventMapDemo: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Démonstration de la Carte des Événements
      </h2>
      <p className="text-gray-600 mb-6">
        Carte interactive avec des événements d'exemple centrée sur Cotonou, Bénin.
      </p>
      
      <EventMap 
        events={sampleEvents}
        height="600px"
        showUserLocation={true}
      />
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Fonctionnalités :</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Carte OpenStreetMap avec tous les lieux existants</li>
          <li>• Marqueurs colorés par catégorie d'événement</li>
          <li>• Position de l'utilisateur avec animation</li>
          <li>• Popups détaillés pour chaque événement</li>
          <li>• Centrée par défaut sur Cotonou, Bénin</li>
        </ul>
      </div>
    </div>
  );
};
