import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "Enter Attendee's Phone Number",
  label = "Phone",
  required = false,
  error,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Validation: Phone number must be 10 digits long (excluding country code)
  useEffect(() => {
    if (value) {
      const phoneNumber = value.replace(/\D/g, ''); // Remove non-digits
      setIsValid(phoneNumber.length === 10);
    } else {
      setIsValid(true); // Empty is considered valid initially
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Only allow digits
    const digitsOnly = inputValue.replace(/\D/g, '');
    onChange(digitsOnly);
  };

  const getBorderColor = () => {
    if (error || (!isValid && value)) return 'border-red-500';
    if (isFocused) return 'border-blue-500';
    return 'border-gray-300';
  };

  const getBackgroundColor = () => {
    if (isFocused) return 'bg-white';
    return 'bg-gray-50';
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div className="flex">
        {/* Country Code Selector */}
        <div className="flex-shrink-0">
          <div className={`flex items-center px-3 py-2 border border-r-0 ${getBorderColor()} rounded-l-lg ${getBackgroundColor()} transition-colors`}>
            <span className="text-2xl mr-2">🇮🇳</span>
            <span className="text-sm text-gray-600">+91</span>
            <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
          </div>
        </div>

        {/* Phone Input */}
        <input
          type="tel"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2 border ${getBorderColor()} rounded-r-lg ${getBackgroundColor()} transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {/* Validation Error */}
      {!isValid && value && (
        <p className="mt-1 text-sm text-red-600">
          Phone number must be 10 digits long.
        </p>
      )}
    </div>
  );
}; 