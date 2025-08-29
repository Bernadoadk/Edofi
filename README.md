# Edofi - Plateforme d'Événements avec Réservations & Paiement

🎟️ **Plateforme complète** pour organisateurs de concerts, conférences, événements culturels avec gestion de réservations et intégration paiement.

## 🚀 Fonctionnalités

- 🗓️ **Liste et création d'événements** (lieu, date, thème)
- 👥 **Pages publiques d'événements** + réservation
- 💳 **Paiement** intégré
- 📧 **Confirmation par email** + QR Code ticket (bonus)
- 🔐 **Authentification complète** (inscription, connexion, profil)

## 🛠️ Stack Technique

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Shadcn/ui** - Composants UI

### Backend
- **Node.js** + Express.js
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **express-validator** - Validation
- **nodemailer** - Envoi d'emails

### Extras (à implémenter)
- **Flutterwave API** - Paiements
- **QR code lib** - Génération de tickets
- **Resend/MailerLite** - Emails

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd Edofi
   ```

2. **Installer toutes les dépendances**
   ```bash
   npm run install:all
   ```

3. **Configuration de la base de données**
   ```bash
   # Créer la base de données PostgreSQL
   createdb evently_db
   
   # Exécuter le script d'initialisation
   psql -d evently_db -f server/database/init.sql
   ```

4. **Configuration de l'environnement**
   ```bash
   # Copier le fichier d'exemple du backend
   cp server/env.example server/.env
   
   # Modifier server/.env avec vos configurations
   ```

5. **Démarrer l'application**
   ```bash
   # Démarrer frontend et backend ensemble
   npm run dev:full
   
   # Ou démarrer séparément
   npm run dev          # Frontend (port 3000)
   npm run dev:backend  # Backend (port 5000)
   ```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📚 API Endpoints

### Authentification
- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/signin` - Se connecter
- `GET /api/auth/profile` - Récupérer le profil
- `PUT /api/auth/profile` - Mettre à jour le profil
- `PUT /api/auth/change-password` - Changer le mot de passe

## 🗄️ Structure de la base de données

### Tables principales
- **users** - Utilisateurs de la plateforme
- **events** - Événements créés
- **bookings** - Réservations d'événements
- **categories** - Catégories d'événements

## 🔐 Authentification

L'application utilise JWT pour l'authentification :
- Tokens stockés dans localStorage
- Expiration automatique après 7 jours
- Protection des routes sensibles

## 📁 Structure du projet

```
Evently/
├── src/                    # Frontend React
│   ├── components/         # Composants UI
│   ├── screens/           # Écrans de l'application
│   ├── services/          # Services API
│   └── lib/               # Utilitaires
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── config/        # Configuration DB
│   │   ├── controllers/   # Contrôleurs API
│   │   ├── middleware/    # Middleware auth
│   │   ├── models/        # Modèles de données
│   │   ├── routes/        # Routes API
│   │   └── utils/         # Utilitaires
│   ├── database/          # Scripts SQL
│   └── package.json
└── package.json           # Configuration principale
```

## 🚀 Déploiement

### Variables d'environnement de production

```env
# Backend (.env)
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_NAME=evently_db
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### PM2 (recommandé pour la production)

```bash
# Installer PM2
npm install -g pm2

# Démarrer le backend
cd server
pm2 start src/index.js --name "evently-api"

# Démarrer le frontend (après build)
npm run build
pm2 serve dist 3000 --name "evently-frontend"

# Sauvegarder et configurer le démarrage automatique
pm2 save
pm2 startup
```

## 🔧 Scripts disponibles

- `npm run dev` - Démarrer le frontend
- `npm run dev:backend` - Démarrer le backend
- `npm run dev:full` - Démarrer frontend et backend
- `npm run build` - Build de production
- `npm run install:all` - Installer toutes les dépendances

## 📊 Monitoring

- **Morgan** - Logs des requêtes HTTP
- **Health check** - Endpoint `/health` pour vérifier l'état du serveur

## 🎯 Prochaines étapes

1. **Gestion des événements** - CRUD complet
2. **Système de réservations** - Booking et paiements
3. **Intégration Flutterwave** - Paiements en ligne
4. **Génération QR codes** - Tickets numériques
5. **Système d'emails** - Confirmations et notifications
6. **Dashboard organisateur** - Gestion des événements
7. **Recherche et filtres** - Découverte d'événements

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur le repository GitHub.

---

**Evently** - Rendez vos événements inoubliables ! 🎉
