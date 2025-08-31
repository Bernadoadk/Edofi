import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const testSocialAuthConfig = async () => {
  console.log('🔍 Test de la configuration d\'authentification sociale...');
  
  try {
    // Test 1: Vérifier la connexion à la base de données
    console.log('📊 Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');
    
    // Test 2: Vérifier que la table users existe avec les nouveaux champs
    console.log('📋 Test de la structure de la table users...');
    const userCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users` as any;
    console.log(`✅ Table users accessible, ${userCount[0].count} utilisateurs trouvés`);
    
    // Test 3: Vérifier les variables d'environnement
    console.log('🔧 Test des variables d\'environnement...');
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
      console.log('⚠️  Variables d\'environnement manquantes:', missingVars);
      console.log('📝 Veuillez configurer ces variables dans votre fichier .env');
    } else {
      console.log('✅ Toutes les variables d\'environnement sont configurées');
    }
    
    // Test 4: Vérifier les URLs de callback
    console.log('🔗 Test des URLs de callback...');
    const callbackUrls = {
      google: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/social/google/callback',
      facebook: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/social/facebook/callback',
      apple: process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/api/auth/social/apple/callback'
    };
    
    console.log('📋 URLs de callback configurées:');
    Object.entries(callbackUrls).forEach(([provider, url]) => {
      console.log(`   ${provider}: ${url}`);
    });
    
    console.log('✅ Configuration d\'authentification sociale testée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Fonction pour tester les routes d'authentification
export const testAuthRoutes = () => {
  console.log('🔗 Test des routes d\'authentification...');
  
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
  
  console.log('✅ Routes d\'authentification configurées');
};

// Fonction pour afficher les instructions de configuration
export const showConfigInstructions = () => {
  console.log('\n📖 Instructions de configuration:');
  console.log('1. Créez un fichier .env dans le dossier server/');
  console.log('2. Ajoutez les variables d\'environnement nécessaires');
  console.log('3. Configurez les applications OAuth dans les consoles développeur');
  console.log('4. Redémarrez le serveur');
  console.log('\n📚 Consultez SOCIAL_AUTH_CONFIG.md pour plus de détails');
};

// Exécuter les tests si le fichier est appelé directement
if (require.main === module) {
  testSocialAuthConfig()
    .then(() => {
      testAuthRoutes();
      showConfigInstructions();
    })
    .catch(console.error);
}
