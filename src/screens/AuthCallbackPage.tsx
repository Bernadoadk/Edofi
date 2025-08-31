import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { socialAuthService } from '../services/socialAuthService';
import { useAuth } from '../contexts/AuthContext';

export const AuthCallbackPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Vérifier si c'est un callback d'authentification sociale
        if (!socialAuthService.isSocialAuthCallback()) {
          navigate('/login');
          return;
        }

        // Extraire les données du callback
        const callbackData = socialAuthService.extractCallbackData();
        if (!callbackData) {
          setError('Données d\'authentification invalides');
          setIsProcessing(false);
          return;
        }

        // Traiter l'authentification
        const result = await socialAuthService.handleAuthCallback(
          callbackData.token,
          callbackData.user
        );

        if (result.success) {
          // Connecter l'utilisateur via le contexte
          await login(callbackData.user, callbackData.token);
          
          // Nettoyer l'URL
          socialAuthService.cleanCallbackUrl();
          
          // Rediriger vers la page d'accueil
          navigate('/', { replace: true });
        } else {
          setError(result.message || 'Erreur lors de l\'authentification');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Erreur lors du traitement de l\'authentification');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, login]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Connexion en cours...
          </h2>
          <p className="text-gray-500">
            Veuillez patienter pendant que nous vous connectons.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">Erreur d'authentification</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return null;
};
