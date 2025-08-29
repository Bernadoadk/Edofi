import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface ChangeEmailProps {
  user: any;
}

export const ChangeEmail: React.FC<ChangeEmailProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    newEmail: '',
    confirmEmail: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.newEmail) {
      newErrors.newEmail = 'La nouvelle adresse e-mail est requise';
    } else if (!/\S+@\S+\.\S+/.test(formData.newEmail)) {
      newErrors.newEmail = 'Veuillez entrer une adresse e-mail valide';
    }

    if (!formData.confirmEmail) {
      newErrors.confirmEmail = 'La confirmation de l\'adresse e-mail est requise';
    } else if (formData.newEmail !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Les adresses e-mail ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Email change data:', formData);
      alert('Adresse e-mail mise à jour avec succès !');
      setFormData({ newEmail: '', confirmEmail: '' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-assignment-1dark-navy-blue mb-6">
          Changer l'adresse e-mail
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse e-mail actuelle
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
            {user?.email || 'andreagomes@example.com'}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Cette adresse e-mail ne peut pas être modifiée directement
          </p>
        </div>

        {/* New Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nouvelle adresse e-mail *
          </label>
          <Input
            type="email"
            value={formData.newEmail}
            onChange={(e) => handleInputChange('newEmail', e.target.value)}
            placeholder="nouvelle-adresse@example.com"
            className={errors.newEmail ? 'border-red-500' : ''}
          />
          {errors.newEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.newEmail}</p>
          )}
        </div>

        {/* Confirm Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer l'adresse e-mail *
          </label>
          <Input
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => handleInputChange('confirmEmail', e.target.value)}
            placeholder="nouvelle-adresse@example.com"
            className={errors.confirmEmail ? 'border-red-500' : ''}
          />
          {errors.confirmEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmEmail}</p>
          )}
        </div>

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Important
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Vous recevrez un e-mail de confirmation à votre nouvelle adresse</li>
            <li>• Votre adresse e-mail actuelle restera active jusqu'à confirmation</li>
            <li>• Tous vos événements et billets resteront associés à votre compte</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="bg-assignment-1dark-navy-blue hover:bg-assignment-1dark-navy-blue/90 text-white px-6 py-2 rounded-lg font-medium"
          >
            Enregistrer la nouvelle adresse e-mail
          </Button>
        </div>
      </form>
    </div>
  );
}; 