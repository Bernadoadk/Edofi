import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "HH:MM AM/PM",
  label,
  required = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const parseTime = (timeString: string) => {
    if (!timeString) return { hours: 12, minutes: 0, period: 'AM' };
    
    // Handle 24-hour format
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return { hours: displayHours, minutes, period };
    }
    
    // Handle 12-hour format
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      return {
        hours: parseInt(match[1]),
        minutes: parseInt(match[2]),
        period: match[3].toUpperCase()
      };
    }
    
    return { hours: 12, minutes: 0, period: 'AM' };
  };

  const formatTime = (hours: number, minutes: number, period: string): string => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const formatTimeForInput = (hours: number, minutes: number, period: string): string => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  };

  const { hours, minutes, period } = parseTime(selectedTime);

  const handleHourChange = (newHour: number) => {
    const newTime = formatTime(newHour, minutes, period);
    setSelectedTime(newTime);
    const inputTime = formatTimeForInput(newHour, minutes, period);
    onChange(inputTime);
  };

  const handleMinuteChange = (newMinute: number) => {
    const newTime = formatTime(hours, newMinute, period);
    setSelectedTime(newTime);
    const inputTime = formatTimeForInput(hours, newMinute, period);
    onChange(inputTime);
  };

  const handlePeriodChange = (newPeriod: string) => {
    const newTime = formatTime(hours, minutes, newPeriod);
    setSelectedTime(newTime);
    const inputTime = formatTimeForInput(hours, minutes, newPeriod);
    onChange(inputTime);
  };

  const incrementHour = () => {
    const newHour = hours === 12 ? 1 : hours + 1;
    handleHourChange(newHour);
  };

  const decrementHour = () => {
    const newHour = hours === 1 ? 12 : hours - 1;
    handleHourChange(newHour);
  };

  const incrementMinute = () => {
    const newMinute = minutes === 59 ? 0 : minutes + 1;
    handleMinuteChange(newMinute);
  };

  const decrementMinute = () => {
    const newMinute = minutes === 0 ? 59 : minutes - 1;
    handleMinuteChange(newMinute);
  };

  const togglePeriod = () => {
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    handlePeriodChange(newPeriod);
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={selectedTime}
          onChange={() => {}} // Read-only
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-2 py-2 pl-12 border border-blue-500 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          readOnly
        />
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Time Picker Modal */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Caret */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          
          {/* Time Selection */}
          <div className="flex items-center justify-center p-4 space-x-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <button
                onClick={incrementHour}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronUp className="w-3 h-3 text-gray-600" />
              </button>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-center min-w-[40px]">
                {hours.toString().padStart(2, '0')}
              </div>
              <button
                onClick={decrementHour}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* Separator */}
            <div className="text-lg font-semibold text-gray-600">:</div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <button
                onClick={incrementMinute}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronUp className="w-3 h-3 text-gray-600" />
              </button>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-center min-w-[40px]">
                {minutes.toString().padStart(2, '0')}
              </div>
              <button
                onClick={decrementMinute}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col items-center">
              <button
                onClick={togglePeriod}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronUp className="w-3 h-3 text-gray-600" />
              </button>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-center min-w-[40px]">
                {period}
              </div>
              <button
                onClick={togglePeriod}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 