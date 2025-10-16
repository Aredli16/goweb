# 🏗️ Goweb – Formulaire de qualification de chantier

## 🚀 Présentation

Ce projet est une application **Full Stack TypeScript** permettant de **qualifier un chantier de dépannage** via un **formulaire dynamique**.  
L’utilisateur répond à une série de questions dont le déroulement dépend de ses réponses précédentes.  
À la fin du parcours, il peut saisir ses coordonnées pour être recontacté par un artisan.

L’objectif du projet est d’offrir une **expérience fluide, robuste et sécurisée**, tant pour le client que pour l’artisan.

---

## ⚙️ Fonctionnement général

- **Frontend (React + TypeScript)** :  
  Interface utilisateur moderne, responsive et conforme aux maquettes Figma.  
  Le formulaire guide l’utilisateur via un **système de questions/réponses dynamique**, avec :
    - Validation des champs (Zod)
    - Navigation avant/arrière
    - Soumission finale avec envoi des coordonnées

- **Backend (Node.js + Express + TypeScript)** :  
  API RESTful gérant :
    - La création et la gestion des **sessions**
    - Le calcul des **questions suivantes ou précédentes**
    - La sauvegarde des réponses
    - L’envoi d’un email de notification à l’artisan

- **Module commun (`common/`)** :  
  Contient les **types partagés** entre le frontend et le backend.  
  ⚠️ **Ce module doit être build avant de lancer le projet**, sinon les types ne seront pas disponibles.

---

## 🔁 Interactions client/serveur

1. **Création de session**  
   Le frontend appelle le service `SessionService` pour créer une nouvelle session.  
   Le backend initialise la session avec la première question du formulaire.

2. **Navigation dynamique**
    - Le frontend envoie la réponse sélectionnée.
    - Le backend renvoie la **question suivante**, calculée dynamiquement selon la logique métier.
    - L’utilisateur peut revenir en arrière grâce à la gestion de l’historique stocké via MongoDB

3. **Soumission finale**
    - À la fin du parcours, le frontend envoie les coordonnés du client et le backend se charge de les envoyer ainsi que les réponses qui ont été enregistré.
    - Le backend sauvegarde les données et **envoie un email à l’artisan** (capturé par Mailhog en dev).

---

## 🧱 Choix technologiques

| Composant           | Technologie                    | Raison du choix                                           |
|---------------------|--------------------------------|-----------------------------------------------------------|
| **Frontend**        | React + TypeScript + Vite      | Rapidité, modularité, typage fort                         |
| **Backend**         | Node.js + Express + Typescript | Simplicité, typage fort, performance et écosystème mature |
| **Base de données** | MongoDB                        | Stockage flexible des sessions et réponses                |
| **Typage partagé**  | Common (TypeScript)            | Cohérence entre front et back                             |
| **Validation**      | Zod                            | Validation forte des formulaires côté client              |
| **Tests**           | Jest                           | Vérification de la logique backend                        |
| **Docker**          | Docker Compose                 | Environnement reproductible pour le dev (Mongo, Mailhog)  |

---

## 🧩 Structure du projet
```
goweb/
├── common/ # Types et utilitaires partagés (doit être build)
├── server/ # Backend Node.js / Express
├── web/ # Frontend React + TypeScript
├── docker-compose.yml
└── README.md
```

---

## 🧰 Prérequis

- Node.js >= 22
- npm >= 11
- Docker & Docker Compose (pour environnement complet)

---

## 🚀 Installation et exécution

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/Aredli16/goweb.git
cd goweb
```

### 2️⃣ Build du module common
```bash
cd common
npm install
npm run build
cd ..
```

### 3️⃣ Lancer le backend
```bash
cd server
npm install
npm run dev
```
Le backend écoute par défaut sur http://localhost:3000

### 4️⃣ Lancer le frontend
```bash
cd ../web
npm install
npm run dev
```
Le frontend est accessible sur http://localhost:5173

### 🐳 Lancer avec Docker (environnement complet de dev)
Ce mode exécute :
- Une base MongoDB
- Un serveur Mailhog pour capturer les emails

```bash
cd ..
docker-compose up
```
Accès rapides :
- Mailhog (interface email) : http://localhost:8025

---

## 🧪 Tests
Pour exécuter les tests backend :
```bash
cd server
npm run test
```

---

## 🧠 Points clés de l’implémentation
- **Gestion des sessions** :

    Toutes les interactions passent par un service central `SessionService` qui :
  - Gère la progression (questions suivantes / précédentes)
  - Maintient l’état de la session 
  - Orchestration complète du parcours utilisateur 
- **Système de questions dynamique** :

    Les questions et conditions sont définies en JSON pour simplifier la maintenance. 

    Le backend détermine la suite logique à chaque réponse.

- **Validation front (Zod)** :

  Chaque champ est validé avant envoi, évitant les erreurs côté serveur.

- **Navigation bidirectionnelle** :

  L’utilisateur peut avancer, revenir ou modifier ses réponses sans perdre son historique.

- **Envoi d’email simulé (Mailhog)** :

  En environnement de dev, les emails sont interceptés par Mailhog pour test.

---

## 🧭 Ressources
[🎨 Maquettes Figma](https://www.figma.com/design/59DE7dy5Y9dkYsLtFdrVuS/GOWEB---Test-de-comp%C3%A9tences-dev?node-id=1-892&t=Ul4Spwn8xmAT3bXi-1)

---

### 🧩 Axes d’amélioration
> Ces pistes démontrent une réflexion critique et une volonté d’évolution continue du projet.

1. Historisation des sessions

   Conserver les anciennes réponses et les rejouer pour analyse ou relancer l'artisan.

2. Intégration réelle d’un service mail

   Remplacer Mailhog par SendGrid, Postmark ou AWS SES en production.

3. Interface d’administration
   
   Permettre aux artisans de visualiser les soumissions, filtrer les chantiers et relancer les clients.

4. Optimisation des performances
- Caching des questions et logique côté backend 
- Lazy loading du front pour les étapes non encore atteintes

5. Accessibilité et SEO

   Améliorer la navigation clavier et la compatibilité lecteurs d’écran.

---

## 👨‍💻 Auteur
Projet réalisé dans le cadre du test technique Full Stack JavaScript – Goweb par [@aredli16](https://github.com/Aredli16)
