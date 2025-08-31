import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/Fiwè.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  isLoading: boolean;
}

export const LoadingScreen = ({ onLoadingComplete, isLoading }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isLoading || hasCompleted) return;

    // Reset progress when loading starts
    setProgress(0);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setHasCompleted(true);
          return 100;
        }
        return prevProgress + 1; // Increment by 1% every interval for slower loading
      });
    }, 80); // Update every 80ms for slower, more visible animation

    return () => clearInterval(interval);
  }, [isLoading, hasCompleted]);

  // Call onLoadingComplete when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && hasCompleted) {
      onLoadingComplete();
    }
  }, [progress, hasCompleted, onLoadingComplete]);

  // Reset hasCompleted when location changes (for page navigation)
  useEffect(() => {
    setHasCompleted(false);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Logo et barre de progression au centre */}
      <div className="flex flex-col items-center space-y-8">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Fiwè Logo" 
          className="w-32 h-32 object-contain"
        />
        
        {/* Barre de progression */}
        <div className="w-64">
          <div className="relative">
            {/* Contour blanc qui disparaît progressivement */}
            <div 
              className="absolute inset-0 border-2 border-white rounded-full transition-all duration-300 ease-in-out"
              style={{
                opacity: Math.max(0, 1 - (progress / 100))
              }}
            />
            
            {/* Barre de progression avec le dégradé */}
            <div className="relative h-2 bg-transparent rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#dfe0c5] via-[#04b1d9] to-[#f24638] transition-all duration-300 ease-in-out"
                style={{
                  width: `${progress}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
