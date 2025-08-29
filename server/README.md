# 🚀 Evently Backend API

Backend API pour la plateforme de gestion d'événements Edofi, développé avec TypeScript, Express, Prisma et PostgreSQL.

## 🛠️ Technologies Utilisées

- **TypeScript** - Langage de programmation typé
- **Express.js** - Framework web pour Node.js
- **Prisma** - ORM moderne pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcrypt** - Hachage des mots de passe
- **Multer** - Gestion des uploads de fichiers
- **Express Validator** - Validation des données

## 📁 Structure du Projet

```
server/
├── prisma/
│   ├── schema.prisma    # Schéma de base de données
│   └── seed.ts         # Script de données initiales
├── src/
│   ├── controllers/    # Contrôleurs de l'API
│   ├── middleware/     # Middlewares personnalisés
│   ├── routes/         # Définition des routes
│   ├── types/          # Types TypeScript
│   ├── utils/          # Utilitaires
│   ├── lib/            # Configuration des librairies
│   └── index.ts        # Point d'entrée de l'application
├── uploads/            # Dossier des fichiers uploadés
├── package.json        # Dépendances et scripts
├── tsconfig.json       # Configuration TypeScript
└── .env               # Variables d'environnement
```

## 🚀 Installation et Configuration

### 1. Installation des dépendances

```bash
cd server
npm install
```

### 2. Configuration de la base de données

1. **Installer PostgreSQL** sur votre machine
2. **Créer une base de données** nommée `evently_db`
3. **Configurer les variables d'environnement** dans le fichier `.env` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/evently_db?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Configuration de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# (Optionnel) Exécuter les migrations
npm run db:migrate

# Peupler la base avec des données de test
npm run db:seed
```

### 4. Démarrage du serveur

```bash
# Mode développement (avec hot reload)
npm run dev

# Mode production
npm run build
npm start
```

## 📡 API Endpoints

### 🔐 Authentification

- `POST /api/auth/register` - Inscription d'un utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur

### 🎉 Événements

- `GET /api/events` - Récupérer tous les événements publiés
- `GET /api/events/:id` - Récupérer un événement par ID
- `POST /api/events` - Créer un nouvel événement (authentifié)
- `PUT /api/events/:id` - Modifier un événement (authentifié)
- `DELETE /api/events/:id` - Supprimer un événement (authentifié)
- `PATCH /api/events/:id/publish` - Publier/dépublier un événement (authentifié)

### 📂 Catégories

- `GET /api/events/categories` - Récupérer toutes les catégories

### 🏥 Santé

- `GET /health` - Vérifier l'état du serveur

## 🔧 Scripts Disponibles

```bash
npm run dev          # Démarrage en mode développement
npm run build        # Compilation TypeScript
npm run start        # Démarrage en mode production
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma vers la DB
npm run db:migrate   # Exécuter les migrations
npm run db:studio    # Ouvrir Prisma Studio
npm run db:seed      # Peupler la base de données
```

## 🗄️ Modèles de Données

### User
- `id` - Identifiant unique
- `email` - Email unique
- `password` - Mot de passe hashé
- `first_name` - Prénom
- `last_name` - Nom
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

### Category
- `id` - Identifiant unique
- `name` - Nom de la catégorie
- `description` - Description (optionnel)
- `icon` - Icône (optionnel)
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

### Event
- `id` - Identifiant unique
- `title` - Titre de l'événement
- `description` - Description
- `event_type` - Type (single/recurring)
- `start_date` - Date de début
- `start_time` - Heure de début
- `end_date` - Date de fin (optionnel)
- `end_time` - Heure de fin
- `duration_type` - Type de durée (days/hours)
- `duration_value` - Valeur de la durée
- `location_address` - Adresse
- `location_lat` - Latitude
- `location_lng` - Longitude
- `banner_image` - Image de bannière (optionnel)
- `is_published` - Statut de publication
- `user_id` - ID de l'utilisateur créateur
- `category_id` - ID de la catégorie
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

## 🔒 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Pour les routes protégées, incluez le token dans le header :

```
Authorization: Bearer <your-jwt-token>
```

## 📤 Upload de Fichiers

L'API supporte l'upload d'images pour les bannières d'événements :
- Format accepté : JPEG, JPG, PNG, GIF
- Taille maximale : 5MB
- Champ : `banner_image`

## 🧪 Données de Test

Le script de seed crée automatiquement :
- 8 catégories d'événements
- 1 utilisateur de test (`test@evently.com` / `password123`)
- 4 événements d'exemple

## 🛠️ Développement

### Variables d'environnement de développement

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/evently_db?schema=public"
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key
```

### Outils de développement

- **Prisma Studio** : `npm run db:studio` - Interface graphique pour la base de données
- **Hot Reload** : `npm run dev` - Redémarrage automatique lors des modifications

## 🚀 Déploiement

1. **Build de production** : `npm run build`
2. **Variables d'environnement** : Configurer les variables de production
3. **Base de données** : Configurer la base de données de production
4. **Démarrage** : `npm start`

## 📝 Notes

- L'API est configurée pour accepter les requêtes CORS depuis `localhost:3000`, `localhost:5173` et `localhost:5174`
- Les logs sont activés en mode développement
- Les erreurs sont gérées de manière centralisée
- La validation des données est effectuée avec Express Validator
