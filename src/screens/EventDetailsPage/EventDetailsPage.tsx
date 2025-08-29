import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { eventService, Event } from '../../services/eventService';
import { EventBanner } from './components/EventBanner';
import { EventDetails } from './components/EventDetails';
import { EventLocation } from './components/EventLocation';
import { EventOrganizer } from './components/EventOrganizer';
import { EventDescription } from './components/EventDescription';
import { EventTags } from './components/EventTags';
import { TicketSection } from './components/TicketSection';
import { SimilarEventsSection } from './components/SimilarEventsSection';
import { BookingModal } from './components/BookingModal';
import { ShareModal } from "../../components/ShareModal/ShareModal";
import { Layout } from "../../components/Layout";

export const EventDetailsPage = (): JSX.Element => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(parseInt(eventId));
        setEvent(eventData);
        
        // Fetch similar events (same category)
        if (eventData.category_id) {
          const similar = await eventService.getEvents({ 
            category_id: eventData.category_id,
            limit: 4
          });
          setSimilarEvents(similar.filter((e: Event) => e.id !== eventData.id));
        }
      } catch (error: any) {
        console.error('Error fetching event:', error);
        setError('Événement non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleFavoriteToggle = () => {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite');
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    
    const eventDate = new Date(`${event.start_date}T${event.start_time}`);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${eventDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location_address)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleBuyTickets = () => {
    setIsBookingModalOpen(true);
  };

  // Event creator actions
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
    navigate(`/edit-event/${eventId}`);
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
          is_published: false
        }
      }
    });
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
    <Layout>
      <div className="bg-assignment-1white w-full max-w-[1920px] relative">
        
        {/* Event Banner with conditional actions */}
        <EventBanner 
          event={event}
          onFavoriteToggle={handleFavoriteToggle}
          onShare={handleShare}
          onBuyTickets={handleBuyTickets}
          isOwner={isOwner}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onTogglePublish={handleTogglePublish}
          onDelete={handleDelete}
          publishing={publishing}
        />

        {/* Main Content */}
        <main className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Event Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Details */}
                <EventDetails 
                  event={event}
                  onAddToCalendar={handleAddToCalendar}
                />

                {/* Event Location */}
                <EventLocation location={event} />

                {/* Event Organizer */}
                <EventOrganizer organizer={event} />

                {/* Event Description */}
                <EventDescription 
                  description={event.description}
                />

                {/* Event Tags */}
                <EventTags tags={[event.category_name || 'Événement']} />
              </div>

              {/* Right Column - Tickets & Actions */}
              <div className="lg:col-span-1">
                <TicketSection 
                  event={event}
                  onBuyTickets={handleBuyTickets}
                />
              </div>
            </div>

            {/* Similar Events */}
            {similarEvents.length > 0 && (
              <SimilarEventsSection events={similarEvents} />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        event={event}
      />
      
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        event={event}
      />
    </Layout>
  );
}; 