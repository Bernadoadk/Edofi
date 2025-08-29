import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

interface TimePicker12hProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const TimePicker12h: React.FC<TimePicker12hProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner l'heure",
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convertir la valeur 24h en format 12h pour l'affichage
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':').map(Number);
      if (hours === 0) {
        setSelectedHour(12);
        setSelectedPeriod('AM');
      } else if (hours === 12) {
        setSelectedHour(12);
        setSelectedPeriod('PM');
      } else if (hours > 12) {
        setSelectedHour(hours - 12);
        setSelectedPeriod('PM');
      } else {
        setSelectedHour(hours);
        setSelectedPeriod('AM');
      }
      setSelectedMinute(minutes);
    }
  }, [value]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeChange = (hour: number, minute: number, period: 'AM' | 'PM') => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);

    // Convertir en format 24h
    let hours24 = hour;
    if (period === 'PM' && hour !== 12) {
      hours24 = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hours24 = 0;
    }

    const time24h = `${hours24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(time24h);
  };

  const formatDisplayTime = () => {
    if (!value) return placeholder;
    const [hours, minutes] = value.split(':').map(Number);
    let displayHour = hours;
    let period = 'AM';

    if (hours === 0) {
      displayHour = 12;
    } else if (hours === 12) {
      period = 'PM';
    } else if (hours > 12) {
      displayHour = hours - 12;
      period = 'PM';
    }

    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${
          value ? 'border-gray-300 bg-white' : 'border-gray-300 bg-gray-50'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayTime()}
        </span>
        <Clock className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Heures */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleTimeChange(hour, selectedMinute, selectedPeriod)}
                      className={`w-full px-2 py-1 text-sm text-left hover:bg-blue-50 ${
                        selectedHour === hour ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleTimeChange(selectedHour, minute, selectedPeriod)}
                      className={`w-full px-2 py-1 text-sm text-left hover:bg-blue-50 ${
                        selectedMinute === minute ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleTimeChange(selectedHour, selectedMinute, 'AM')}
                    className={`w-full px-2 py-1 text-sm text-center rounded ${
                      selectedPeriod === 'AM' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeChange(selectedHour, selectedMinute, 'PM')}
                    className={`w-full px-2 py-1 text-sm text-center rounded ${
                      selectedPeriod === 'PM' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
