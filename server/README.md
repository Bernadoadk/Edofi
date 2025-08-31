# 🚀 Edofi Backend API

## 📋 Vue d'ensemble

Backend API pour Edofi - Plateforme de gestion d'événements avec authentification sociale complète.

## 🔐 Authentification Sociale

L'application supporte l'authentification via :
- ✅ Google OAuth 2.0
- ✅ Facebook Login
- ✅ Apple Sign-In

### Configuration requise

1. **Variables d'environnement** - Créez un fichier `.env` dans le dossier `server/` :

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

2. **Configuration des fournisseurs OAuth** - Consultez `../SOCIAL_AUTH_CONFIG.md` pour les instructions détaillées.

## 🏃‍♂️ Installation et démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Ou pousser le schéma directement
npm run db:push
```

### 3. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## 🧪 Tests

### Tester la configuration d'authentification sociale

```bash
npm run test:social-auth
```

Ce script vérifie :
- ✅ La connexion à la base de données
- ✅ La structure de la table users
- ✅ Les variables d'environnement
- ✅ Les URLs de callback
- ✅ Les routes d'authentification

## 📊 Base de données

### Schéma utilisateur étendu

Le modèle `User` inclut maintenant :

```prisma
model User {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  password   String?  // Optionnel pour l'authentification sociale
  first_name String
  last_name  String
  avatar     String?  // URL de l'avatar
  is_email_verified Boolean @default(false)
  
  // Identifiants sociaux
  google_id  String?  @unique
  facebook_id String? @unique
  apple_id   String?  @unique
  auth_provider AuthProvider @default(EMAIL)
  
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // Relations
  events Event[]
  notifications Notification[]
  notification_preferences NotificationPreference?

  @@map("users")
}

enum AuthProvider {
  EMAIL
  GOOGLE
  FACEBOOK
  APPLE
}
```

## 🔗 Routes d'API

### Authentification sociale

- `GET /api/auth/social/google` - Initier l'authentification Google
- `GET /api/auth/social/google/callback` - Callback Google
- `GET /api/auth/social/facebook` - Initier l'authentification Facebook
- `GET /api/auth/social/facebook/callback` - Callback Facebook
- `GET /api/auth/social/apple` - Initier l'authentification Apple
- `GET /api/auth/social/apple/callback` - Callback Apple
- `POST /api/auth/social/link-account` - Lier un compte social
- `GET /api/auth/social/check-email/:email` - Vérifier l'existence d'un email

### Authentification classique

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil
- `PUT /api/auth/change-password` - Changer le mot de passe

## 🔒 Sécurité

- **JWT Tokens** - Authentification stateless
- **Sessions sécurisées** - Gestion des sessions avec express-session
- **Validation des callbacks** - Vérification côté serveur
- **Gestion d'erreurs** - Erreurs sécurisées et informatives
- **CORS configuré** - Autorisation des origines spécifiques

## 🐛 Dépannage

### Erreurs courantes

1. **"Invalid redirect URI"**
   - Vérifiez les URLs de callback dans les consoles développeur
   - Assurez-vous que les domaines correspondent

2. **"Client ID not found"**
   - Vérifiez les variables d'environnement
   - Redémarrez le serveur après modification du `.env`

3. **"Database connection failed"**
   - Vérifiez que PostgreSQL est en cours d'exécution
   - Vérifiez l'URL de connexion à la base de données

### Logs utiles

```bash
# Vérifier les logs du serveur
npm run dev

# Vérifier la base de données
npm run db:studio

# Tester la configuration
npm run test:social-auth
```

## 📚 Documentation

- [Guide de configuration sociale](../SOCIAL_AUTH_CONFIG.md)
- [Documentation Passport.js](http://www.passportjs.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign-In](https://developer.apple.com/sign-in-with-apple/)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.
