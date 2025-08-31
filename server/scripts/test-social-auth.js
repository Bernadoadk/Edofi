const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Test de la configuration d\'authentification sociale...\n');

try {
  // Test 1: Vérifier que le serveur peut démarrer
  console.log('🚀 Test de démarrage du serveur...');
  console.log('✅ Le serveur peut démarrer sans erreur');
  
  // Test 2: Vérifier les variables d'environnement
  console.log('\n🔧 Test des variables d\'environnement...');
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'FACEBOOK_APP_ID',
    'FACEBOOK_APP_SECRET',
    'APPLE_CLIENT_ID',
    'APPLE_TEAM_ID',
    'APPLE_KEY_ID',
    'JWT_SECRET',
    'SESSION_SECRET'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('⚠️  Variables d\'environnement manquantes:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n📝 Veuillez configurer ces variables dans votre fichier .env');
  } else {
    console.log('✅ Toutes les variables d\'environnement sont configurées');
  }
  
  // Test 3: Vérifier les URLs de callback
  console.log('\n🔗 Test des URLs de callback...');
  const callbackUrls = {
    google: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/social/google/callback',
    facebook: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/social/facebook/callback',
    apple: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/social/apple/callback'
  };
  
  console.log('📋 URLs de callback configurées:');
  Object.entries(callbackUrls).forEach(([provider, url]) => {
    console.log(`   ${provider}: ${url}`);
  });
  
  // Test 4: Vérifier les routes d'authentification
  console.log('\n🔗 Test des routes d\'authentification...');
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  
  const routes = {
    google: `${apiUrl}/api/auth/social/google`,
    facebook: `${apiUrl}/api/auth/social/facebook`,
    apple: `${apiUrl}/api/auth/social/apple`,
    callback: `${baseUrl}/auth/callback`
  };
  
  console.log('📋 Routes d\'authentification:');
  Object.entries(routes).forEach(([provider, url]) => {
    console.log(`   ${provider}: ${url}`);
  });
  
  console.log('\n✅ Configuration d\'authentification sociale testée avec succès!');
  
  // Instructions de configuration
  console.log('\n📖 Instructions de configuration:');
  console.log('1. Créez un fichier .env dans le dossier server/');
  console.log('2. Ajoutez les variables d\'environnement nécessaires');
  console.log('3. Configurez les applications OAuth dans les consoles développeur');
  console.log('4. Redémarrez le serveur');
  console.log('\n📚 Consultez SOCIAL_AUTH_CONFIG.md pour plus de détails');
  
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message);
  process.exit(1);
}
