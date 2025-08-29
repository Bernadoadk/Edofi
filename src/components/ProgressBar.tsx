import React from 'react';

interface ProgressBarProps {
  step: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  const steps = [
    { id: 1, name: 'Edit', description: 'Informations de base' },
    { id: 2, name: 'Banner', description: 'Image de l\'événement' },
    { id: 3, name: 'Ticketing', description: 'Billets et prix' },
    { id: 4, name: 'Review', description: 'Vérification finale' },
  ];

  return (
    <div className="mb-8">
      {/* Progress Line */}
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div 
          className="absolute top-4 left-0 h-0.5 bg-assignment-1yellow transition-all duration-500 ease-in-out"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="flex justify-between relative">
        {steps.map((stepItem, index) => {
          const isActive = step >= stepItem.id;
          const isCompleted = step > stepItem.id;
          
          return (
            <div key={stepItem.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                isCompleted 
                  ? 'bg-secondary-color text-white' 
                  : isActive 
                    ? 'bg-text-black text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepItem.id
                )}
              </div>
              
              {/* Step Name */}
              <span className={`mt-2 text-xs font-medium transition-colors ${
                isActive ? 'text-text-black' : 'text-gray-500'
              }`}>
                {stepItem.name}
              </span>
              
              {/* Step Description */}
              <span className={`text-xs text-center mt-1 transition-colors ${
                isActive ? 'text-text-black' : 'text-gray-400'
              }`}>
                {stepItem.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 