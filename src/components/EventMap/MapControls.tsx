import React from 'react';
import { useMap } from 'react-leaflet';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MapControlsProps {
  onCenterOnUser?: () => void;
  userLocation?: [number, number] | null;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  onCenterOnUser, 
  userLocation 
}) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetView = () => {
    // Reset to default center (Cotonou)
    map.setView([6.370293, 2.391236], 13);
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      map.setView(userLocation, 15);
    } else if (onCenterOnUser) {
      onCenterOnUser();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Location Controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handleCenterOnUser}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
          title="Centrer sur ma position"
        >
          <Navigation className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleResetView}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Vue par défaut"
        >
          <RotateCcw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-lg p-3 max-w-48">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Légende</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Votre position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Événements</span>
          </div>
        </div>
      </div>
    </div>
  );
};
