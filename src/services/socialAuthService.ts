import apiService from './api';

export interface SocialAuthResponse {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
}

export interface EmailCheckResponse {
  success: boolean;
  exists: boolean;
  user?: {
    id: number;
    email: string;
    authProvider: string;
    hasGoogle: boolean;
    hasFacebook: boolean;
    hasApple: boolean;
  };
}

class SocialAuthService {
  private baseURL = '/api/auth/social';

  // Rediriger vers l'authentification Google
  async initiateGoogleAuth(): Promise<void> {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${this.baseURL}/google`;
  }

  // Rediriger vers l'authentification Facebook
  async initiateFacebookAuth(): Promise<void> {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${this.baseURL}/facebook`;
  }

  // Rediriger vers l'authentification Apple
  async initiateAppleAuth(): Promise<void> {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${this.baseURL}/apple`;
  }

  // Vérifier si un email est déjà associé à un compte social
  async checkEmail(email: string): Promise<EmailCheckResponse> {
    try {
      const response = await apiService.get(`${this.baseURL}/check-email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error checking email:', error);
      throw new Error('Erreur lors de la vérification de l\'email');
    }
  }

  // Lier un compte social à un compte existant
  async linkAccount(userId: number, provider: string, providerId: string, email: string): Promise<SocialAuthResponse> {
    try {
      const response = await apiService.post(`${this.baseURL}/link-account`, {
        userId,
        provider,
        providerId,
        email
      });
      return response.data;
    } catch (error) {
      console.error('Error linking account:', error);
      throw new Error('Erreur lors de la liaison du compte');
    }
  }

  // Traiter le callback d'authentification sociale
  async handleAuthCallback(token: string, user: any): Promise<SocialAuthResponse> {
    try {
      // Stocker le token et les informations utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        message: 'Authentification réussie',
        user,
        token
      };
    } catch (error) {
      console.error('Error handling auth callback:', error);
      throw new Error('Erreur lors du traitement de l\'authentification');
    }
  }

  // Vérifier si l'utilisateur vient d'une authentification sociale
  isSocialAuthCallback(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('token') && urlParams.has('user');
  }

  // Extraire les données du callback
  extractCallbackData(): { token: string; user: any } | null {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userStr = urlParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        return { token, user };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }

    return null;
  }

  // Nettoyer l'URL après traitement du callback
  cleanCallbackUrl(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    url.searchParams.delete('user');
    window.history.replaceState({}, document.title, url.pathname);
  }
}

export const socialAuthService = new SocialAuthService();
