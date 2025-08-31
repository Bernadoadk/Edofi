import React from 'react';
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

interface SocialAuthButtonsProps {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  onAppleClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onGoogleClick,
  onFacebookClick,
  onAppleClick,
  isLoading = false,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        onClick={onGoogleClick}
        disabled={isLoading || disabled}
      >
        <FcGoogle className="w-5 h-5" />
        <span>Continuer avec Google</span>
      </Button>

      {/* Facebook Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
        onClick={onFacebookClick}
        disabled={isLoading || disabled}
      >
        <FaFacebook className="w-5 h-5" />
        <span>Continuer avec Facebook</span>
      </Button>

      {/* Apple Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-3 bg-black text-white border-black hover:bg-gray-800"
        onClick={onAppleClick}
        disabled={isLoading || disabled}
      >
        <FaApple className="w-5 h-5" />
        <span>Continuer avec Apple</span>
      </Button>
    </div>
  );
};
