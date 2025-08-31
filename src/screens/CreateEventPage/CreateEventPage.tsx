import React, { useState, useEffect } from 'react';
import { ProgressBar } from '../../components/ProgressBar';
import { StepEdit } from '../../components/StepEdit';
import { StepBanner } from '../../components/StepBanner';
import { StepTicketing } from '../../components/StepTicketing';
import { StepReview } from '../../components/StepReview';
import { eventService, Event, CreateEventData } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import notificationTriggers from '../../services/notificationTriggers';

interface EventFormData {
  title: string;
  description: string;
  category_id: number;
  event_type: 'single' | 'recurring';
  start_date: string;
  start_time: string;
  duration_type: 'days' | 'hours';
  duration_value: number;
  end_date?: string; // Calculé automatiquement
  end_time?: string; // Calculé automatiquement
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  banner_image?: string;
  tickets?: Array<{
    name: string;
    price: number;
    quantity: number;
    description: string;
    currency: string;
  }>;
}

export const CreateEventPage: React.FC = () => {
  console.log('CreateEventPage: Component rendering');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log('CreateEventPage: User:', user);

  // Charger les catégories au montage du composant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await eventService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category_id: 0,
    event_type: 'single',
    start_date: '',
    start_time: '',
    duration_type: 'days',
    duration_value: 0,
    location: null,
    banner_image: '',
    tickets: []
  });

  const handleDataChange = (newData: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Vous devez être connecté pour créer un événement');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Préparer les données pour l'API
      const eventData: CreateEventData = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        event_type: formData.event_type,
        start_date: formData.start_date,
        start_time: formData.start_time,
        end_date: formData.end_date || '',
        end_time: formData.end_time || '',
        duration_type: formData.duration_type,
        duration_value: formData.duration_value,
        location_address: formData.location?.address || '',
        location_lat: formData.location?.lat || 0,
        location_lng: formData.location?.lng || 0,
        banner_image: formData.banner_image,
        is_published: false // Par défaut, l'événement n'est pas publié
      };

      const response = await eventService.createEvent(eventData, bannerImageFile || undefined);
      
      console.log('Événement créé avec succès:', response);
      
      // Déclencher une notification de création d'événement
      if (user?.id) {
        try {
          await notificationTriggers.onEventCreated(
            user.id,
            formData.title,
            response.id
          );
        } catch (error) {
          console.error('Erreur lors de la création de la notification:', error);
        }
      }
      
      // Rediriger vers la page de l'événement créé
      navigate(`/event/${response.id}`);
      
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'événement:', error);
      setError(error.response?.data?.message || 'Erreur lors de la création de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    try {
      console.log('CreateEventPage: Rendering step:', step);
      
      switch (step) {
        case 1:
          return (
            <StepEdit
              data={formData}
              onDataChange={handleDataChange}
              onNext={handleNext}
            />
          );
        case 2:
          return (
            <StepBanner
              eventData={formData}
              categories={categories}
              onBack={handleBack}
              onNext={(bannerImage) => {
                setBannerImageFile(bannerImage);
                handleDataChange({ banner_image: bannerImage ? URL.createObjectURL(bannerImage) : '' });
                handleNext();
              }}
              initialBannerImage={bannerImageFile}
            />
          );
        case 3:
          return (
            <StepTicketing
              eventData={formData}
              categories={categories}
              bannerImage={bannerImageFile}
              onBack={handleBack}
              onNext={(ticketingData) => {
                // Convert TicketType[] to the format expected by EventFormData
                const convertedTickets = ticketingData.ticketTypes.map(ticket => ({
                  name: ticket.name,
                  price: ticket.price,
                  quantity: ticket.quantity,
                  description: ticket.description,
                  currency: ticketingData.currency
                }));
                handleDataChange({ tickets: convertedTickets });
                handleNext();
              }}
            />
          );
        case 4:
          return (
            <StepReview
              eventData={formData}
              categories={categories}
              bannerImage={bannerImageFile}
              ticketingData={{ 
                ticketTypes: formData.tickets?.map((ticket, index) => ({
                  id: index.toString(),
                  name: ticket.name,
                  price: ticket.price,
                  quantity: ticket.quantity,
                  description: ticket.description
                })) || [], 
                currency: 'EUR' 
              }}
              onBack={handleBack}
              onEditStep={(step) => setStep(step)}
              onSubmit={handleSubmit}
            />
          );
        default:
          return null;
      }
    } catch (error) {
      console.error('CreateEventPage: Error rendering step:', error);
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Erreur lors du rendu de l'étape: {String(error)}</p>
        </div>
      );
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Créer un événement
              </h1>
              <p className="text-gray-600">
                Remplissez les informations ci-dessous pour créer votre événement
              </p>
            </div>

            <ProgressBar step={step} />

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-8">
              {renderStep()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 