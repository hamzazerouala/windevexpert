# WinDevExpert

WinDevExpert est une plateforme complète de formation en ligne, conçue pour offrir une expérience d'apprentissage fluide et interactive. Ce projet combine une architecture backend robuste en Rust avec une interface frontend moderne en React.

## 🚀 Fonctionnalités

*   **Authentification Sécurisée** : Inscription, connexion, et gestion de profil sécurisées (JWT, Argon2).
*   **Catalogue de Cours** : Exploration des cours disponibles avec filtrage et recherche.
*   **Tableau de Bord Étudiant** : Suivi de la progression, accès aux cours inscrits.
*   **Lecteur Vidéo Avancé** : Expérience de visionnage optimisée pour les cours vidéo.
*   **Paiements** : Intégration pour la gestion des abonnements ou achats de cours (Stripe).
*   **Design Responsif** : Interface utilisateur adaptative pour tous les appareils.

## 🛠 Technologies

### Backend (Rust)
*   **Framework** : [Axum](https://github.com/tokio-rs/axum) - Framework web ergonomique et modulaire.
*   **Base de données** : [SQLx](https://github.com/launchbadge/sqlx) - Toolkit SQL asynchrone (PostgreSQL).
*   **Authentification** : JSON Web Tokens (JWT) & Argon2 pour le hachage des mots de passe.
*   **Emailing** : [Lettre](https://github.com/lettre/lettre) - Bibliothèque d'envoi d'emails.
*   **Runtime** : [Tokio](https://tokio.rs/) - Runtime asynchrone pour Rust.

### Frontend (React)
*   **Framework** : React avec TypeScript & Vite.
*   **Styling** : Tailwind CSS & Radix UI pour des composants accessibles et stylés.
*   **State Management** : Zustand & React Query (@tanstack/react-query).
*   **Routing** : React Router v7.
*   **Vidéo** : Vidstack pour le lecteur vidéo.
*   **Intégrations** : Supabase (client), Stripe (paiements).

### DevOps & Outils
*   **Conteneurisation** : Docker & Docker Compose.
*   **Base de données** : PostgreSQL.

## 📂 Structure du Projet

```
windevexpert/
├── doc/                # Documentation du projet (API, Architecture, Design)
├── frontend/           # Code source de l'application React
├── migrations/         # Fichiers de migration SQL
├── src/                # Code source du backend Rust
│   ├── api/            # Contrôleurs et routes API
│   ├── repository/     # Couche d'accès aux données
│   ├── service/        # Logique métier
│   └── utils/          # Utilitaires (Config, JWT, Erreurs)
├── Cargo.toml          # Dépendances Rust
├── docker-compose.yml  # Configuration Docker
└── README.md           # Ce fichier
```

## 🏁 Démarrage Rapide

### Prérequis
*   Rust (dernière version stable)
*   Node.js (LTS) & pnpm (ou npm/yarn)
*   Docker & Docker Compose (optionnel mais recommandé pour la DB)
*   PostgreSQL (si pas de Docker)

### Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/hamzazerouala/windevexpert.git
    cd windevexpert
    ```

2.  **Configuration de l'environnement :**
    *   Copiez `.env.example` vers `.env` et remplissez les variables nécessaires (DB_URL, clés API, etc.).

3.  **Lancer avec Docker (Recommandé) :**
    ```bash
    docker-compose up -d
    ```

### Lancement Manuel

1.  **Backend (Rust) :**
    ```bash
    cargo run
    ```

2.  **Frontend (React) :**
    ```bash
    cd frontend
    pnpm install
    pnpm dev
    ```

## 📄 Documentation

La documentation détaillée se trouve dans le dossier `doc/` :
*   [Architecture Frontend](doc/architecture-frontend-redesign.md)
*   [API Documentation](doc/api.md)
*   [Design UI](doc/design/)

## 📝 Licence

Ce projet est sous licence propriétaire.
