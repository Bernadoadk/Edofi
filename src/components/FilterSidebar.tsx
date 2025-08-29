import React, { useState } from 'react';
import { Category } from '../services/eventService';

interface FilterSidebarProps {
  className?: string;
  categories?: Category[];
  filters?: {
    category_id: number;
    search: string;
    location: string;
    sort: string;
  };
  onFilterChange?: (filters: any) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  className = '', 
  categories = [],
  filters = { category_id: 0, search: '', location: '', sort: 'date' },
  onFilterChange = () => {}
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const handleCategoryChange = (categoryId: number) => {
    onFilterChange({ category_id: categoryId });
  };

  const handlePriceChange = (maxPrice: number) => {
    setPriceRange([0, maxPrice]);
    // TODO: Implement price filtering when backend supports it
  };

  return (
    <div className={`w-full md:w-64 bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Filtres
      </h3>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Prix</h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>0€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Catégories</h4>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={filters.category_id === 0}
              onChange={() => handleCategoryChange(0)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-3 text-sm text-gray-700">Toutes les catégories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category_id === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-3 text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Lieu</h4>
        <input
          type="text"
          placeholder="Rechercher par lieu..."
          value={filters.location}
          onChange={(e) => onFilterChange({ location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({ category_id: 0, search: '', location: '' })}
        className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        Effacer tous les filtres
      </button>
    </div>
  );
}; 