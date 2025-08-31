import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { useSocialAuth } from '../hooks/useSocialAuth';

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  isOpen,
  onClose,
  email,
  onSuccess
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const { loading, error, handleSocialAuth, clearError } = useSocialAuth();

  if (!isOpen) return null;

  const handleProviderSelect = async (provider: 'google' | 'facebook' | 'apple') => {
    setSelectedProvider(provider);
    clearError();
    
    try {
      await handleSocialAuth(provider);
    } catch (error) {
      console.error('Social auth error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center">
            Lier votre compte
          </CardTitle>
          <p className="text-center text-gray-600">
            Choisissez un service pour lier votre compte {email}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={() => handleProviderSelect('google')}
              disabled={loading !== null}
            >
              {loading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <FcGoogle className="w-5 h-5" />
              )}
              <span>Continuer avec Google</span>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              onClick={() => handleProviderSelect('facebook')}
              disabled={loading !== null}
            >
              {loading === 'facebook' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              ) : (
                <FaFacebook className="w-5 h-5" />
              )}
              <span>Continuer avec Facebook</span>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 bg-black text-white border-black hover:bg-gray-800"
              onClick={() => handleProviderSelect('apple')}
              disabled={loading !== null}
            >
              {loading === 'apple' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FaApple className="w-5 h-5" />
              )}
              <span>Continuer avec Apple</span>
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading !== null}
            >
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
