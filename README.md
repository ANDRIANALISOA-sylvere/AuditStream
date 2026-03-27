<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="./client/src/assets/activity.svg" width="120" alt="Nest Logo" /></a>
</p>

**Système d'audit en temps réel des transactions financières**

[![TypeScript](https://img.shields.io/badge/TypeScript-95.5%25-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/) [![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/) [![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/) [![License](https://img.shields.io/badge/License-UNLICENSED-red?style=flat-square)](./LICENSE)


_Supervision complète des versements bancaires avec journal d'audit automatique piloté par des triggers PostgreSQL._

---

## Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Déploiement Docker](#-déploiement-docker)
- [Tests](#-tests)
- [Structure du projet](#-structure-du-projet)

---

## Aperçu

AuditStream est une plateforme fullstack de supervision des opérations de versement bancaire. Chaque insertion, modification ou suppression sur les données financières est automatiquement tracée en base de données grâce à des **triggers PostgreSQL**, garantissant un journal d'audit immuable et temps réel.

L'interface d'administration permet aux superviseurs de visualiser en un coup d'œil l'ensemble des opérations, de gérer les utilisateurs et leurs rôles, et de consulter l'historique complet des versements.

---

## Fonctionnalités

#### Authentification

- Connexion via **Google OAuth 2.0** (passport-google-oauth20)
- Gestion des sessions avec **JWT**
- Rôles utilisateurs : `ADMIN` et `USER`

#### Dashboard de supervision

- Compteurs en temps réel : insertions, modifications, suppressions
- Indicateur de statut live (ping animé)
- Vue consolidée des clients et versements récents

#### Journal d'audit (Audit Trail)

- Traçabilité complète de chaque opération (`INSERT`, `UPDATE`, `DELETE`)
- Historique daté avec : numéro de versement, numéro de compte, client, montant ancien/nouveau, utilisateur responsable
- Alimenté automatiquement par des **triggers PostgreSQL**

#### Gestion des utilisateurs

- Liste, ajout et suppression d'utilisateurs
- Changement de rôle à la volée
- Recherche par nom ou email
- Avatars Google avec fallback sur initiales

#### Versements

- Vue des clients avec solde et nombre de versements
- Liste des versements récents avec numéro de chèque et montant

---

## Architecture

```
AuditStream/
├── src/                    # Backend NestJS
│   ├── auth/               # Authentification (JWT + Google OAuth)
│   ├── users/              # Gestion des utilisateurs
│   ├── versements/         # Module versements
│   └── audit/              # Journal d'audit
├── client/                 # Frontend React + Vite
│   └── src/
│       ├── components/     # Composants UI (shadcn/ui)
│       ├── hooks/          # Hooks personnalisés (useAuth, ...)
│       ├── store/          # État global (Zustand)
│       └── types/          # Types TypeScript
├── prisma/                 # Schéma et migrations PostgreSQL
├── test/                   # Tests e2e
├── Dockerfile
└── docker-compose.yml
```

Le backend expose une **API REST NestJS** consommée par le frontend React. La base de données PostgreSQL héberge des **triggers** qui alimentent automatiquement une table d'audit à chaque opération sur les versements.

---

## Stack technique

| Couche               | Technologie                          |
| -------------------- | ------------------------------------ |
| **Backend**          | NestJS 11, TypeScript 5, Passport.js |
| **Frontend**         | React, Vite, Tailwind CSS, shadcn/ui |
| **Base de données**  | PostgreSQL 16                        |
| **ORM**              | Prisma 7                             |
| **Authentification** | Google OAuth 2.0, JWT                |
| **Infrastructure**   | Docker, Docker Compose               |
| **Tests**            | Jest, Supertest                      |

---

## Prérequis

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) >= 9
- [Docker](https://www.docker.com/) & Docker Compose (pour le déploiement conteneurisé)
- Un compte Google Cloud avec OAuth 2.0 configuré

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ANDRIANALISOA-sylvere/AuditStream.git
cd AuditStream
```

### 2. Installer les dépendances backend

```bash
npm install
```

### 3. Installer les dépendances frontend

```bash
cd client
npm install
cd ..
```

---

## Configuration

Copier le fichier d'exemple et le remplir avec vos valeurs :

```bash
cp .env.example .env
```

Voici les variables d'environnement attendues :

```env
# Serveur
PORT=3000

# Base de données
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=audistream

# Frontend
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT
JWT_SECRET=your_jwt_secret
```

> **Google OAuth** : Créez vos identifiants sur la [Google Cloud Console](https://console.cloud.google.com/). Ajoutez `http://localhost:3000/auth/google/callback` comme URI de redirection autorisée.

---

## Lancement

### Développement

**Backend :**

```bash
# Mode watch (rechargement automatique)
npm run start:dev
```

**Frontend :**

```bash
cd client
npm run dev
```

L'API est disponible sur `http://localhost:3000` et le frontend sur `http://localhost:5173`.

### Production

```bash
# Build backend
npm run build

# Démarrage production
npm run start:prod
```

---

## Déploiement Docker

Le `docker-compose.yml` lance trois services en une seule commande :

| Service   | Port   | Description                           |
| --------- | ------ | ------------------------------------- |
| `api`     | `3000` | Backend NestJS                        |
| `db`      | `5432` | PostgreSQL 16                         |
| `pgadmin` | `8080` | Interface d'administration PostgreSQL |

```bash
# Lancer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f api

# Arrêter
docker compose down
```

**pgAdmin** est accessible sur `http://localhost:8080` avec les identifiants :

- Email : `admin@admin.com`
- Mot de passe : `admin`

---

## Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

---

## Structure du projet

```
src/
├── main.ts                 # Point d'entrée NestJS
├── app.module.ts           # Module racine
├── auth/                   # Stratégies JWT & Google OAuth
├── users/                  # CRUD utilisateurs + gestion des rôles
├── versements/             # Logique métier versements
└── audit/                  # Lecture du journal d'audit

client/src/
├── assets/                 # Images, icônes
├── components/
│   ├── common/             # AvatarWithFallback, UserDialog, ...
│   └── ui/                 # Composants shadcn/ui
├── hooks/
│   └── useAuth.ts          # Hook d'authentification
├── pages/
│   └── AdminSpace.tsx      # Dashboard principal
├── store/
│   └── userStore.ts        # Store Zustand utilisateurs
└── types/
    └── auth.types.ts       # Types Role, User, ...
```

---

<div align="center">

Fait avec ❤️ par [ANDRIANALISOA Sylvère](https://github.com/ANDRIANALISOA-sylvere)

</div>
