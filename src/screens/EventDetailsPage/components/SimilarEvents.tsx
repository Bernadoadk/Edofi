import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimilarEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  currency: string;
  image?: string;
}

interface SimilarEventsProps {
  events: SimilarEvent[];
}

export const SimilarEvents: React.FC<SimilarEventsProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, events.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, events.length - 2)) % Math.max(1, events.length - 2));
  };

  useEffect(() => {
    const handleResize = () => {
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-assignment-1dark-navy-blue">
          Événements similaires
        </h3>
        
        {events.length > 3 && (
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Events Carousel */}
      <div className="relative overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-6 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 group"
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-gray-500 text-xl">📷</span>
                      </div>
                      <p className="text-gray-500 text-xs">Aucune image</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-secondary-color text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {event.currency} {event.price}
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                  <p className="text-sm text-gray-500">{event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}; 