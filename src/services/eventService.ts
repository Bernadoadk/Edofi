import { apiService } from './api';

export interface Ticket {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  currency: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category_id: number;
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
  category_name?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  updated_at?: string;
  tickets?: Ticket[];
}

export interface CreateEventData {
  title: string;
  description: string;
  category_id: number;
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
}

export interface EventFilters {
  category_id?: number;
  search?: string;
  location?: string;
  limit?: number;
  offset?: number;
  upcoming?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

class EventService {
  // Récupérer tous les événements
  async getEvents(filters: EventFilters = {}) {
    const params = new URLSearchParams();
    
    if (filters.category_id) params.append('category_id', filters.category_id.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.upcoming) params.append('upcoming', 'true');

    console.log('=== DEBUG eventService.getEvents ===');
    console.log('Filters:', filters);
    console.log('URL params:', params.toString());

    const response = await apiService.get(`/events?${params.toString()}`);
    
    console.log('Full API response:', response);
    console.log('Response.data:', response.data);
    console.log('Response.data.data:', response.data.data);
    
    // Correction : accéder directement à response.data au lieu de response.data.data
    const result = response.data.data || response.data;
    console.log('Returning:', result);
    console.log('=== FIN DEBUG eventService.getEvents ===');
    
    return result; // Extraire les données des événements de la réponse API
  }

  // Récupérer un événement par ID
  async getEventById(id: number) {
    const response = await apiService.get(`/events/${id}`);
    // Correction : accéder directement à response.data au lieu de response.data.data
    return response.data.data || response.data; // Extraire les données de l'événement de la réponse API
  }

  // Récupérer les événements de l'utilisateur connecté
  async getUserEvents() {
    const response = await apiService.get('/events/user/events');
    // Correction : accéder directement à response.data au lieu de response.data.data
    return response.data.data || response.data; // Extraire les données des événements de la réponse API
  }

  // Créer un événement
  async createEvent(eventData: CreateEventData, bannerImage?: File) {
    const formData = new FormData();
    
    // Ajouter les données de l'événement
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('category_id', eventData.category_id.toString());
    formData.append('event_type', eventData.event_type);
    formData.append('start_date', eventData.start_date);
    formData.append('start_time', eventData.start_time);
    if (eventData.end_date) formData.append('end_date', eventData.end_date);
    if (eventData.end_time) formData.append('end_time', eventData.end_time);
    if (eventData.duration_type !== undefined) formData.append('duration_type', eventData.duration_type);
    if (eventData.duration_value !== undefined) formData.append('duration_value', eventData.duration_value.toString());
    formData.append('location_address', eventData.location_address);
    formData.append('location_lat', eventData.location_lat.toString());
    formData.append('location_lng', eventData.location_lng.toString());
    formData.append('is_published', eventData.is_published.toString());
    
    // Ajouter l'image si elle existe
    if (bannerImage) {
      formData.append('banner_image', bannerImage);
    }
    
    // Debug: Afficher les données envoyées
    console.log('=== DEBUG: Données envoyées au serveur ===');
    console.log('EventData:', eventData);
    console.log('BannerImage:', bannerImage);
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('=== FIN DEBUG ===');
    
    const response = await apiService.postFormData('/events', formData);
    return response.data;
  }

  // Mettre à jour un événement
  async updateEvent(id: number, eventData: Partial<Event>) {
    const response = await apiService.put(`/events/${id}`, eventData);
    return response.data;
  }

  // Supprimer un événement
  async deleteEvent(id: number) {
    const response = await apiService.delete(`/events/${id}`);
    return response.data;
  }

  // Publier/Dépublier un événement
  async toggleEventPublish(id: number) {
    const response = await apiService.patch(`/events/${id}/publish`);
    return response.data;
  }

  // Récupérer les catégories
  async getCategories() {
    const response = await apiService.get('/events/categories');
    console.log('API Response for categories:', response);
    return response.data; // Retourner seulement les données
  }
}

export const eventService = new EventService(); 