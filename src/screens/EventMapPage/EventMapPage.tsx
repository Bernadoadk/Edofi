import React, { useState, useEffect } from 'react';
import { EventMap } from '../../components/EventMap';
import { eventService } from '../../services/eventService';
import { Event } from '../../services/eventService';
import { Layout } from '../../components/Layout';

export const EventMapPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('Fetching events...');
        const response = await eventService.getEvents();
        console.log('API Response:', response);
        
        // S'assurer que response est un tableau
        const eventsArray = Array.isArray(response) ? response : [];
        console.log('Events array:', eventsArray);
        
        setEvents(eventsArray);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError('Erreur lors du chargement des événements');
        setEvents([]); // S'assurer que events est un tableau vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // S'assurer que events est toujours un tableau
  const safeEvents = Array.isArray(events) ? events : [];
  console.log('Safe events for map:', safeEvents);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Carte des événements
                </h1>
                <p className="text-gray-600 mt-2">
                  Découvrez tous les événements sur la carte
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {safeEvents.length} événement{safeEvents.length > 1 ? 's' : ''} trouvé{safeEvents.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Map Controls */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Votre position</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Événements</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Cliquez sur un marqueur pour voir les détails
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <EventMap 
              events={safeEvents} 
              height="600px"
              showUserLocation={true}
            />
          </div>

          {/* Legend */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Légende des catégories :
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Concert', color: '#FF6B6B' },
                { name: 'Conference', color: '#4ECDC4' },
                { name: 'Exhibition', color: '#45B7D1' },
                { name: 'Festival', color: '#96CEB4' },
                { name: 'Networking', color: '#FFEAA7' },
                { name: 'Sports', color: '#DDA0DD' },
                { name: 'Theater', color: '#98D8C8' },
                { name: 'Workshop', color: '#F7DC6F' }
              ].map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events List (Mobile) */}
        {safeEvents.length > 0 && (
          <div className="mt-6 md:hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Liste des événements
            </h3>
            <div className="space-y-4">
              {safeEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(event.start_date).toLocaleDateString('fr-FR')} à {event.start_time}
                  </p>
                  <p className="text-sm text-gray-500">
                    📍 {event.location_address}
                  </p>
                </div>
              ))}
              {safeEvents.length > 5 && (
                <p className="text-center text-sm text-gray-500">
                  Et {safeEvents.length - 5} autre{safeEvents.length - 5 > 1 ? 's' : ''} événement{safeEvents.length - 5 > 1 ? 's' : ''}...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Message si aucun événement */}
        {safeEvents.length === 0 && !loading && !error && (
          <div className="mt-6 text-center">
            <div className="text-gray-400 text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600">
              Il n'y a actuellement aucun événement à afficher sur la carte.
            </p>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}; 