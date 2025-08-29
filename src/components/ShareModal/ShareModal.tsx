import React, { useState } from 'react';
import { X, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    description: string;
    start_date: string;
    start_time: string;
    location_address: string;
  } | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, event }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !event) return null;

  const eventUrl = window.location.href;
  const eventText = `${event.title} - ${new Date(event.start_date).toLocaleDateString('fr-FR')} à ${event.start_time}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleShare = (platform: string) => {
    let url = '';
    const encodedUrl = encodeURIComponent(eventUrl);
    const encodedText = encodeURIComponent(eventText);

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(`${eventText}\n\n${event.description}\n\nLieu: ${event.location_address}\n\nPlus d'infos: ${eventUrl}`)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Partager cet événement
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600">
              {new Date(event.start_date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} à {event.start_time}
            </p>
            <p className="text-sm text-gray-600">{event.location_address}</p>
          </div>

          {/* Share Options */}
          <div className="space-y-4">
            {/* Copy Link */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-600 truncate flex-1 mr-3">
                {eventUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center space-x-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={() => handleShare('email')}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 