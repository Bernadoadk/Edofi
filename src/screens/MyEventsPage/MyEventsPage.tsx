import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { eventService, Event } from '../../services/eventService';
import { MyEventCard } from '../../components/MyEventCard';
import { Layout } from '../../components/Layout';

export const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    loadMyEvents();
  }, [isAuthenticated, navigate]);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      // Utiliser le nouvel endpoint backend pour récupérer les événements de l'utilisateur
      const myEvents = await eventService.getUserEvents();
      setEvents(myEvents);
    } catch (error: any) {
      console.error('Erreur lors du chargement de mes événements:', error);
      setError('Erreur lors du chargement de vos événements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleEventDeleted = () => {
    // Recharger la liste après suppression
    loadMyEvents();
  };

  if (!isAuthenticated) {
    return null; // Redirection en cours
  }

    return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#2B293D] via-[#2D2C3C] to-[#2B293D] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Mes événements
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Gérez et organisez vos événements créés
              </p>
              
              {/* Create Event Button */}
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={handleCreateEvent}
                  className="bg-assignment-1yellow text-assignment-1dark-navy-blue px-8 py-4 rounded-lg hover:bg-assignment-1yellow/90 transition-colors font-semibold text-lg shadow-lg"
                >
                  + Créer un nouvel événement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with stats */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Chargement...' : `${events?.length || 0} événement${events?.length !== 1 ? 's' : ''} créé${events?.length !== 1 ? 's' : ''}`}
              </h2>
              <p className="text-gray-600 mt-1">
                Gérez vos événements et suivez leurs performances
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCreateEvent}
                className="bg-assignment-1dark-navy-blue text-white px-6 py-3 rounded-lg hover:bg-assignment-1dark-navy-blue/90 transition-colors font-medium"
              >
                + Nouvel événement
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement de vos événements...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement créé</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Vous n'avez pas encore créé d'événements. Commencez par créer votre premier événement et partagez-le avec le monde !
              </p>
              <button
                onClick={handleCreateEvent}
                className="bg-assignment-1yellow text-assignment-1dark-navy-blue px-8 py-4 rounded-lg hover:bg-assignment-1yellow/90 transition-colors font-semibold text-lg"
              >
                Créer mon premier événement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <MyEventCard 
                  key={event.id} 
                  event={event} 
                  onEventDeleted={handleEventDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
