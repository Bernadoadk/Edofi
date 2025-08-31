import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useLoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  // Gestion du chargement initial
  useEffect(() => {
    if (isInitialLoad) {
      // Le chargement initial sera contrôlé par le composant LoadingScreen
      // On ne met plus de timer ici
    }
  }, [isInitialLoad]);

  // Gestion du chargement lors des changements de page
  useEffect(() => {
    if (!isInitialLoad && location.pathname !== previousPath.current) {
      previousPath.current = location.pathname;
      setIsLoading(true);
      // Le chargement sera contrôlé par le composant LoadingScreen
    }
  }, [location.pathname, isInitialLoad]);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading
  };
};

