import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  value?: string;
  onChange?: (sortBy: string) => void;
  onSortChange?: (sortBy: string) => void; // For backward compatibility
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ 
  value, 
  onChange, 
  onSortChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(value || 'date');

  const sortOptions = [
    { value: 'date', label: 'Date (Plus récent)' },
    { value: 'date-asc', label: 'Date (Plus ancien)' },
    { value: 'price', label: 'Prix (Plus bas)' },
    { value: 'price-desc', label: 'Prix (Plus élevé)' },
    { value: 'name', label: 'Nom (A-Z)' },
    { value: 'popularity', label: 'Popularité' },
  ];

  const handleSortChange = (newValue: string) => {
    setSelectedSort(newValue);
    if (onChange) {
      onChange(newValue);
    } else if (onSortChange) {
      onSortChange(newValue);
    }
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    return sortOptions.find(option => option.value === selectedSort)?.label || 'Trier par';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span>{getSelectedLabel()}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedSort === option.value 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 