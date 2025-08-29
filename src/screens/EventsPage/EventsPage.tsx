import React, { useState, useEffect } from 'react';
import { EventsGrid } from '../../components/EventsGrid';
import { FilterSidebar } from '../../components/FilterSidebar';
import { SortDropdown } from '../../components/SortDropdown';
import { eventService, Event, Category } from '../../services/eventService';
import { Layout } from '../../components/Layout';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category_id: 0,
    search: '',
    location: '',
    sort: 'date'
  });

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('=== DEBUG EventsPage loadEvents ===');
      console.log('Filters:', filters);
      
      const response = await eventService.getEvents({
        category_id: filters.category_id || undefined,
        search: filters.search || undefined,
        location: filters.location || undefined
      });
      
      console.log('Raw API response:', response);
      console.log('Response type:', typeof response);
      console.log('Response is array:', Array.isArray(response));
      console.log('Response length:', response?.length);
      
      setEvents(response || []);
      console.log('Events state set to:', response || []);
      console.log('=== FIN DEBUG EventsPage loadEvents ===');
    } catch (error: any) {
      console.error('Erreur lors du chargement des événements:', error);
      setError('Erreur lors du chargement des événements');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await eventService.getCategories();
      console.log('Categories response:', response);
      // Le service retourne directement les données des catégories
      setCategories(response || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des catégories:', error);
      setCategories([]);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#2B293D] via-[#2D2C3C] to-[#2B293D] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Explorez un monde d'événements
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Trouvez ce qui vous passionne !
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des événements..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header with sort */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Chargement...' : `${events?.length || 0} événements trouvés`}
              </h2>
              <SortDropdown
                value={filters.sort}
                onChange={handleSortChange}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Events Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : events && events.length > 0 ? (
              <EventsGrid events={events} />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez de modifier vos filtres ou de rechercher autre chose.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

        </div>
    </Layout>
  );
}; 