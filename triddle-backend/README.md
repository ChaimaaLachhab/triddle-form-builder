# Triddle Form Builder Backend

Backend pour une application de création et gestion de formulaires. Ce projet a été refactorisé pour utiliser PostgreSQL avec Prisma, intégrer Cloudinary pour le stockage des fichiers, et inclure une documentation OpenAPI/Swagger.

## Technologies

- **Node.js & Express** - Framework serveur
- **PostgreSQL & Prisma** - Base de données et ORM
- **JWT** - Authentification
- **Swagger/OpenAPI** - Documentation API
- **Cloudinary** - Stockage de fichiers dans le cloud
- **Winston** - Journalisation

## Caractéristiques

- 🔐 Authentification et autorisation complètes
- 📝 Création et gestion de formulaires personnalisables
- 📊 Collecte et analyse de réponses aux formulaires
- 📂 Upload de fichiers avec Cloudinary
- 📑 Documentation API interactive avec Swagger
- 📈 Analyse des données de formulaires
- 🔄 Exportation des réponses en CSV/JSON
- 🚀 Configuration pour déploiement en production

## Installation

```bash
# Cloner le dépôt
git clone <repository-url>
cd triddle-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier le fichier .env avec vos propres valeurs

# Générer le client Prisma
npx prisma generate

# Créer les tables de base de données
npx prisma migrate dev --name init

# Lancer le serveur en mode développement
npm run dev
```

## Structure du projet

```
triddle-backend/
├── prisma/                 # Configuration Prisma
├── src/
│   ├── config/             # Configuration
│   ├── controllers/        # Contrôleurs
│   ├── middleware/         # Middleware
│   ├── routes/             # Routes API
│   ├── utils/              # Utilitaires
│   └── index.js            # Point d'entrée
├── .env                    # Variables d'environnement
└── package.json            # Dépendances et scripts
```

## API Documentation

Une fois le serveur démarré, la documentation Swagger est disponible à:

```
http://localhost:5000/api-docs
```

## Configuration requise

- Node.js v14+
- PostgreSQL v12+
- Compte Cloudinary (pour la gestion des fichiers)

## Scripts

- `npm run dev` - Lancer le serveur en mode développement
- `npm start` - Lancer le serveur en mode production
- `npm run migrate` - Exécuter les migrations Prisma
- `npm run generate` - Générer le client Prisma
- `npm run studio` - Ouvrir Prisma Studio pour gérer la base de données
