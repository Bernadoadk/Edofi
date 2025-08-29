import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

interface Event {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category_name: string;
  event_type: 'single' | 'recurring';
  start_date: string;
  start_time: string;
  end_date?: string;
  end_time?: string;
  duration_type?: 'days' | 'hours';
  duration_value?: number;
  location_address: string;
  location_lat: number;
  location_lng: number;
  banner_image?: string;
  is_published: boolean;
  user_id: number;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(parseInt(id!));
        setEvent(eventData);
      } catch (error: any) {
        console.error('Erreur lors de la récupération de l\'événement:', error);
        setError('Erreur lors de la récupération de l\'événement');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleTogglePublish = async () => {
    if (!event) return;

    try {
      setPublishing(true);
      await eventService.toggleEventPublish(event.id);
      setEvent(prev => prev ? { ...prev, is_published: !prev.is_published } : null);
    } catch (error: any) {
      console.error('Erreur lors de la modification du statut:', error);
      setError('Erreur lors de la modification du statut');
    } finally {
      setPublishing(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-event/${id}`);
  };

  const handleDelete = async () => {
    if (!event || !confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

    try {
      await eventService.deleteEvent(event.id);
      navigate('/my-events');
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l\'événement');
    }
  };

  const handleDuplicate = () => {
    if (!event) return;
    
    // Naviguer vers la page de création avec les données pré-remplies
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
          is_published: false // La copie n'est pas publiée par défaut
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-4">{error || 'Événement non trouvé'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === event.user_id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Retour
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.category_name}</p>
            </div>
            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={handleDuplicate}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Dupliquer
                </button>
                <button
                  onClick={handleTogglePublish}
                  disabled={publishing}
                  className={`px-4 py-2 rounded-lg ${
                    event.is_published
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {publishing ? '...' : event.is_published ? 'Dépublier' : 'Publier'}
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Banner Image */}
        {event.banner_image && (
          <div className="mb-8">
            <img
              src={`http://localhost:5000/uploads/${event.banner_image}`}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Détails de l'événement</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-900">{event.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Date et heure</h3>
                  <p className="text-gray-900">
                    {formatDate(event.start_date)} à {formatTime(event.start_time)}
                  </p>
                  {event.end_date && event.end_time && (
                    <p className="text-gray-600 text-sm">
                      Jusqu'au {formatDate(event.end_date)} à {formatTime(event.end_time)}
                    </p>
                  )}
                  {event.duration_type && event.duration_value && (
                    <p className="text-gray-600 text-sm">
                      Durée : {event.duration_value} {event.duration_type === 'days' ? 'jour(s)' : 'heure(s)'}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Lieu</h3>
                  <p className="text-gray-900">{event.location_address}</p>
                  <a
                    href={`https://www.google.com/maps?q=${event.location_lat},${event.location_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Voir sur Google Maps
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Type d'événement</h3>
                  <p className="text-gray-900 capitalize">
                    {event.event_type === 'single' ? 'Événement unique' : 'Événement récurrent'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Organisateur</h3>
                  <p className="text-gray-900">
                    {event.first_name} {event.last_name}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Statut</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700">Créé le</h3>
                  <p className="text-gray-900">{formatDate(event.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 