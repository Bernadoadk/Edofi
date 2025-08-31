# 🔐 Configuration de l'Authentification Sociale - Edofi

## 📋 Vue d'ensemble

Ce guide explique comment configurer l'authentification sociale avec Google, Facebook et Apple pour l'application Edofi.

## 🚀 Configuration Backend

### 1. Variables d'environnement

Créez un fichier `.env` dans le dossier `server/` avec les variables suivantes :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/evently_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Session
SESSION_SECRET="your-session-secret-key-here"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/social/google/callback"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_CALLBACK_URL="http://localhost:5000/api/auth/social/facebook/callback"

# Apple Sign-In
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_KEY_ID="your-apple-key-id"
APPLE_PRIVATE_KEY_PATH="path/to/your/apple/private/key.p8"
APPLE_CALLBACK_URL="http://localhost:5000/api/auth/social/apple/callback"
```

## 🔧 Configuration des Services

### Google OAuth 2.0

1. **Créer un projet Google Cloud :**
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créez un nouveau projet ou sélectionnez un existant
   - Activez l'API Google+ API

2. **Configurer les identifiants OAuth :**
   - Allez dans "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "OAuth 2.0 Client IDs"
   - Sélectionnez "Web application"
   - Ajoutez les URLs autorisées :
     - Origines JavaScript autorisées : `http://localhost:5173`
     - URIs de redirection autorisés : `http://localhost:5000/api/auth/social/google/callback`

3. **Récupérer les identifiants :**
   - Copiez le Client ID et Client Secret
   - Ajoutez-les dans votre fichier `.env`

### Facebook Login

1. **Créer une application Facebook :**
   - Allez sur [Facebook Developers](https://developers.facebook.com/)
   - Créez une nouvelle application
   - Sélectionnez "Consumer" comme type d'application

2. **Configurer Facebook Login :**
   - Ajoutez le produit "Facebook Login"
   - Dans les paramètres, ajoutez :
     - URL de site web : `http://localhost:5173`
     - URI de redirection OAuth valides : `http://localhost:5000/api/auth/social/facebook/callback`

3. **Récupérer les identifiants :**
   - Copiez l'App ID et App Secret
   - Ajoutez-les dans votre fichier `.env`

### Apple Sign-In

1. **Configurer dans Apple Developer Console :**
   - Allez sur [Apple Developer](https://developer.apple.com/)
   - Créez un nouvel App ID ou modifiez un existant
   - Activez "Sign In with Apple"

2. **Créer une clé privée :**
   - Allez dans "Keys"
   - Créez une nouvelle clé avec "Sign In with Apple" activé
   - Téléchargez le fichier `.p8`
   - Notez le Key ID et Team ID

3. **Configurer les identifiants :**
   - Ajoutez les identifiants dans votre fichier `.env`
   - Placez le fichier `.p8` dans un dossier sécurisé

## 🏃‍♂️ Démarrage

### 1. Installer les dépendances

```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 2. Configurer la base de données

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### 3. Démarrer les serveurs

```bash
# Backend
cd server
npm run dev

# Frontend (dans un autre terminal)
npm run dev
```

## 🎯 Fonctionnalités implémentées

### ✅ Backend
- [x] Configuration Passport.js
- [x] Stratégies Google, Facebook et Apple
- [x] Routes d'authentification sociale
- [x] Gestion des callbacks
- [x] Liaison de comptes sociaux
- [x] Migration de base de données

### ✅ Frontend
- [x] Boutons d'authentification sociale
- [x] Service d'authentification sociale
- [x] Page de callback
- [x] Intégration dans les pages Login/SignUp
- [x] Gestion des états de chargement
- [x] Gestion des erreurs

## 🔒 Sécurité

- Les tokens JWT sont utilisés pour l'authentification
- Les sessions sont sécurisées avec des secrets
- Les callbacks sont validés côté serveur
- Les erreurs sont gérées de manière sécurisée

## 🐛 Dépannage

### Erreurs courantes

1. **"Invalid redirect URI"**
   - Vérifiez que les URLs de callback sont correctement configurées
   - Assurez-vous que les domaines correspondent

2. **"Client ID not found"**
   - Vérifiez que les variables d'environnement sont correctement définies
   - Redémarrez le serveur après modification du `.env`

3. **"Database connection failed"**
   - Vérifiez que PostgreSQL est en cours d'exécution
   - Vérifiez l'URL de connexion à la base de données

### Logs utiles

```bash
# Vérifier les logs du serveur
cd server
npm run dev

# Vérifier les logs de la base de données
npx prisma studio
```

## 📞 Support

Pour toute question ou problème, consultez :
- La documentation Passport.js
- Les guides officiels des fournisseurs OAuth
- Les logs du serveur pour le débogage
