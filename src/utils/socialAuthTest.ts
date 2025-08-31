import { socialAuthService } from '../services/socialAuthService';

export const testSocialAuth = {
  // Test de vérification d'email
  async testEmailCheck(email: string) {
    try {
      console.log('🔍 Test de vérification d\'email:', email);
      const result = await socialAuthService.checkEmail(email);
      console.log('✅ Résultat:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      throw error;
    }
  },

  // Test de callback d'authentification
  testCallbackHandling() {
    console.log('🔍 Test de gestion des callbacks');
    
    // Simuler un callback
    const mockToken = 'mock-jwt-token';
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      authProvider: 'GOOGLE'
    };

    const callbackData = socialAuthService.extractCallbackData();
    console.log('📋 Données de callback extraites:', callbackData);

    const isCallback = socialAuthService.isSocialAuthCallback();
    console.log('🔄 Est-ce un callback?', isCallback);

    return { mockToken, mockUser, callbackData, isCallback };
  },

  // Test de nettoyage d'URL
  testUrlCleaning() {
    console.log('🧹 Test de nettoyage d\'URL');
    
    // Simuler une URL avec des paramètres de callback
    const originalUrl = window.location.href;
    console.log('📄 URL originale:', originalUrl);
    
    // Note: Cette fonction ne peut pas être testée sans modifier l'URL réelle
    console.log('ℹ️  La fonction cleanCallbackUrl() nécessite une URL avec des paramètres de callback');
    
    return { originalUrl };
  },

  // Test complet
  async runAllTests() {
    console.log('🚀 Démarrage des tests d\'authentification sociale...');
    
    try {
      // Test 1: Vérification d'email
      await this.testEmailCheck('test@example.com');
      
      // Test 2: Gestion des callbacks
      this.testCallbackHandling();
      
      // Test 3: Nettoyage d'URL
      this.testUrlCleaning();
      
      console.log('✅ Tous les tests sont terminés avec succès!');
    } catch (error) {
      console.error('❌ Erreur lors des tests:', error);
    }
  }
};

// Fonction pour tester les URLs d'authentification
export const testAuthUrls = {
  google: () => {
    console.log('🔗 URL Google OAuth:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/social/google`);
  },
  
  facebook: () => {
    console.log('🔗 URL Facebook OAuth:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/social/facebook`);
  },
  
  apple: () => {
    console.log('🔗 URL Apple Sign-In:', `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/social/apple`);
  },
  
  all: function() {
    this.google();
    this.facebook();
    this.apple();
  }
};

// Fonction pour vérifier la configuration
export const checkSocialAuthConfig = () => {
  console.log('🔧 Vérification de la configuration d\'authentification sociale...');
  
  const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    frontendUrl: window.location.origin,
    hasGoogleConfig: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
    hasFacebookConfig: !!import.meta.env.VITE_FACEBOOK_APP_ID,
    hasAppleConfig: !!import.meta.env.VITE_APPLE_CLIENT_ID
  };
  
  console.log('📋 Configuration:', config);
  
  if (!config.hasGoogleConfig) {
    console.warn('⚠️  Google OAuth non configuré');
  }
  
  if (!config.hasFacebookConfig) {
    console.warn('⚠️  Facebook OAuth non configuré');
  }
  
  if (!config.hasAppleConfig) {
    console.warn('⚠️  Apple Sign-In non configuré');
  }
  
  return config;
};
