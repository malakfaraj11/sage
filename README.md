# 🚀 Skill Swap App - PFA Project

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://www.mongodb.com/mern-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Symbiose** est une plateforme communautaire d'échange de compétences basée sur le principe du "Time-Banking". L'objectif est de permettre aux utilisateurs de partager leur savoir-faire (cuisine, programmation, langues, etc.) contre d'autres services, sans transaction monétaire.



[Image of MERN stack architecture diagram]


---

## 📖 Sommaire
1. [Fonctionnalités](#-fonctionnalités)
2. [Backlog & User Stories](#-backlog--user-stories)
3. [Technologies utilisées](#-technologies-utilisées)
4. [Structure du Projet](#-structure-du-projet)
5. [Installation](#-installation-et-configuration)
6. [Auteur](#-auteur)

---

## ✨ Fonctionnalités
- **Authentification sécurisée :** Inscription/Connexion via JWT.
- **Gestion de Profil :** Liste des compétences "Offertes" et "Recherchées".
- **Recherche Avancée :** Filtres par catégories et mots-clés.
- **Messagerie Temps Réel :** Chat intégré pour organiser les échanges.
- **Système de Crédits :** Un système où 1 heure donnée = 1 crédit de temps gagné.

---

## 📋 Backlog & User Stories (À intégrer dans GitHub Issues)

### 1. Profil & Authentification
**US#1 : Créer un profil complet**
- **En tant que :** Nouvel utilisateur
- **Je veux :** Créer un compte et renseigner mes compétences
- **Critères d’acceptation :** - Inscription via Email/Pass.
    - Profil avec Nom, Bio, Localisation et Tags de compétences.
    - Upload de photo de profil fonctionnel.

**US#2 : Système de Notation**
- **En tant qu' :** Utilisateur ayant terminé un échange
- **Je veux :** Laisser une note (1-5) et un commentaire
- **Critères d’acceptation :** Accessible uniquement si l'échange est marqué "Terminé".

### 2. Matching & Recherche
**US#3 : Recherche par Compétence**
- **En tant qu' :** Utilisateur
- **Je veux :** Filtrer les profils par tag ou par type (Présentiel/Distanciel)
- **Critères d’acceptation :** Barre de recherche avec auto-complétion et affichage sous forme de cartes.

### 3. Messagerie & Flux d'échange
**US#4 : Messagerie Temps Réel**
- **En tant qu' :** Utilisateur
- **Je veux :** Envoyer un message privé à un partenaire potentiel
- **Critères d’acceptation :** Chat instantané via Socket.io avec historique.

**US#5 : Validation d'Échange**
- **En tant que :** Demandeur
- **Je veux :** Envoyer une demande officielle (date/heure/sujet)
- **Critères d’acceptation :** Statuts `En attente`, `Accepté`, `Refusé`. Mise à jour du solde de crédits à la fin.

---

## 🛠 Technologies utilisées

**Stack MERN :**
- **MongoDB :** Base de données NoSQL (Mongoose ODM).
- **Express.js :** Framework Backend.
- **React.js :** Frontend (Tailwind CSS pour le design).
- **Node.js :** Environnement d'exécution.
- **Socket.io :** Communication bidirectionnelle pour le chat.

---

## 📂 Structure du Projet

```text
skill-swap-app/
├── client/                # React App (Frontend)
│   ├── src/
│   │   ├── components/    # UI & Shared Components
│   │   ├── pages/         # Views
│   │   └── context/       # Auth & Global State
├── server/                # Node.js App (Backend)
│   ├── models/            # Mongoose Schemas (User, Skill, Message)
│   ├── routes/            # API Endpoints
│   └── controllers/       # Business Logic
└── README.md