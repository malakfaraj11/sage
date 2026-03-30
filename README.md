# 🌟 Symbiose - Plateforme d'Échange Intergénérationnel

[![MEN Stack](https://img.shields.io/badge/Stack-MEN%20(Vanilla_JS)-blue.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-black.svg?logo=socket.io)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Symbiose** est une plateforme communautaire d'échange de compétences basée sur le principe du "Time-Banking". L'objectif est de permettre aux utilisateurs (particulièrement des experts séniors et des apprentis) de partager leur savoir-faire (artisanat, programmation, langues, menuiserie, etc.) contre d'autres services, sans aucune transaction monétaire.

L'application bénéficie d'une charte graphique résolument moderne, **Luxe Éditorial et Sombre (Dark Mode)**, favorisant une lecture apaisante, avec des accents chaleureux et une UI premium.

---

## 📖 Sommaire
1. [Fonctionnalités Clés](#-fonctionnalités-clés)
2. [Technologies Utilisées](#-technologies-utilisées)
3. [Structure du Projet](#-structure-du-projet)
4. [Installation & Configuration](#-installation--configuration)
5. [Aperçu de la Messagerie](#-messagerie-temps-réel--notifications)

---

## ✨ Fonctionnalités Clés

- **Aesthétique "Luxe Éditorial" :** Interface utilisateur en mode sombre intégral, avec polices Serif élégantes (Cormorant Garamond) et nuances territoriales (Ocre/Bronze).
- **Authentification Sécurisée (JWT) :** Gestion de l'inscription et de la connexion (Login/Register) avec des Tokens Web JSON et mots de passe cryptés.
- **Tableau de Bord & Profils :** Affichage optimisé des compétences sous forme de "Cartes Premiums" et gestion fine du profil.
- **Messagerie Temps Réel (Style WhatsApp) :**
  - Instantanéité propulsée par **Socket.io**.
  - Historique des messages persistés sur MongoDB.
  - **Système de Badges Non-lus** dynamiques et réactifs.
  - Interface divisée avec barre latérale (Sidebar) intelligente et état actf au clic.
- **Responsive Design Complet :** Expérience fluide, du smartphone au desktop large avec navigation "Sticky Glassmorphism".

---

## 🛠 Technologies Utilisées

Le projet a évolué d'une architecture MERN vers une approche **MEN + Vanilla JS** pure, plus légère et performante, avec moteur de rendu direct par le serveur.

**Backend :**
- **Node.js** & **Express.js** : Serveur HTTP et API RESTful.
- **MongoDB** & **Mongoose** : Base de données NoSQL orientée documents.
- **Socket.io** : Couche WebSockets pour le temps réel.
- **JWT (JsonWebToken)** : Authentification sans session.

**Frontend (Dossier `public/`) :**
- **HTML5 & CSS3 natif** : Variables CSS dynamiques (`:root`), Flexbox/Grid, aucun framework lourd (Zero Tailwind, Zero React).
- **Vanilla JavaScript** : Appels `fetch()`, manipulation du DOM native.

---

## 📂 Structure du Projet

Le backend sert directement l'application frontend qui se trouve dans le répertoire `public`.

```text
sage/
├── server.js                  # Point d'entrée principal Node/Express (Socket.io)
├── config/
│   └── db.js                  # Configuration de connexion MongoDB
├── controllers/               # Logique métier backend
│   ├── authController.js      # Register, Login
│   ├── messageController.js   # Chat history, Mark-as-read
│   └── userController.js      # Fetch Users, Unread notifications logic
├── models/                    # Schémas Mongoose
│   ├── User.js
│   └── Message.js             
├── routes/                    # Routeurs Express
│   ├── authRoutes.js
│   └── messageRoutes.js       
├── public/                    # FRONTEND (Servi statiquement)
│   ├── css/
│   │   └── index.css          # Design System "Luxe Éditorial"
│   ├── js/
│   │   ├── chat.js            # Logique Socket.io + Fetch WhatsApp UI
│   │   └── main.js
│   ├── images/
│   ├── index.html             # Landing (Hero Section)
│   ├── chat.html              # Messagerie
│   ├── skills.html            # Catalogue des Compétences
│   └── login.html             # Authentification
└── README.md
```

---

## 🚀 Installation & Configuration

### Prérequis
- [Node.js](https://nodejs.org/) (v16+ recommandé)
- Un compte gratuit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ou MongoDB en local.

### 1. Cloner le projet
```bash
git clone https://github.com/malakfaraj11/sage.git
cd sage
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine du projet et ajoutez vos clés :
```env
PORT=5001
MONGO_URI=votre_chaine_de_connexion_mongodb
JWT_SECRET=super_secret_symbiose_key
CLIENT_URL=http://localhost:5001
```

### 4. Lancer le serveur (Mode Développement)
```bash
npm start
```
*Le serveur démarrera sur `http://localhost:5001`.*

---

## 💬 Messagerie Temps Réel & Notifications 

Fièrement développée pour cette architecture, la messagerie combine des requêtes HTTP pour la fiabilité à `Socket.io` pour l'instantanéité.

- **Badging dynamique :** Compte le nombre exact d'alertes via l'API.
- **Marquer comme lu :** Implémentation complète de méthodes HTTP `PUT` pour rafraîchir la base de données après clics.
- **Surbrillance automatique :** Au nouvel arrivage d'un message, l'icône, le profil, et le nombre de non-lus s'incrémentent visuellement sans rechargement.

---
*Projet d'examen réalisé par malakfaraj.*