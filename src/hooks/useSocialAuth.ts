import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { socialAuthService } from '../services/socialAuthService';
import { useAuth } from '../contexts/AuthContext';

export const useSocialAuth = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSocialAuth = useCallback(async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(provider);
    setError(null);
    
    try {
      switch (provider) {
        case 'google':
          await socialAuthService.initiateGoogleAuth();
          break;
        case 'facebook':
          await socialAuthService.initiateFacebookAuth();
          break;
        case 'apple':
          await socialAuthService.initiateAppleAuth();
          break;
        default:
          throw new Error(`Provider ${provider} non supporté`);
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      setError(`Erreur lors de l'authentification avec ${provider}`);
      setLoading(null);
    }
  }, []);

  const checkEmailExists = useCallback(async (email: string) => {
    try {
      const response = await socialAuthService.checkEmail(email);
      return response;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }, []);

  const linkAccount = useCallback(async (userId: number, provider: string, providerId: string, email: string) => {
    try {
      const response = await socialAuthService.linkAccount(userId, provider, providerId, email);
      return response;
    } catch (error) {
      console.error('Error linking account:', error);
      throw error;
    }
  }, []);

  const handleAuthCallback = useCallback(async (token: string, user: any) => {
    try {
      const result = await socialAuthService.handleAuthCallback(token, user);
      
      if (result.success) {
        await login(user, token);
        navigate('/', { replace: true });
        return result;
      } else {
        throw new Error(result.message || 'Erreur lors de l\'authentification');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      setError('Erreur lors du traitement de l\'authentification');
      throw error;
    }
  }, [login, navigate]);

  return {
    loading,
    error,
    handleSocialAuth,
    checkEmailExists,
    linkAccount,
    handleAuthCallback,
    clearError: () => setError(null)
  };
};
