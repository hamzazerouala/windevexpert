Cahier des Charges Technique : API Backend (Rust/Axum)
Instruction pour l'IA : Agis en tant qu'Architecte Senior Rust. Tu dois générer le code pour une API REST haute performance qui servira de backend pour une plateforme de formation (SaaS) nommée "WindevExpert". Le déploiement se fera via Coolify (Docker).
1. Stack Technique Imposée
Langage : Rust (Edition 2021)
Framework Web : Axum (Dernière version stable)
Base de Données : PostgreSQL
ORM/Query Builder : SQLx (Async, avec vérification au moment de la compilation)
Authentification : JWT (Argon2 pour le hachage des mots de passe)
Paiement : Crate async-stripe ou stripe-rust (Gestion des abonnements et webhooks)
Mailing : Crate lettre (Client SMTP asynchrone) pour les emails transactionnels.
Stockage & Protection Vidéo : Crate aws-sdk-s3 (ou rust-s3) compatible S3/R2 pour générer des Presigned URLs.
Sécurité & Utils :
tower-http (Cors, Trace, Timeout).
tracing + tracing-subscriber (Logs structurés).
governor (Rate Limiting pour protéger le login).
Déploiement : Dockerfile optimisé (Multi-stage build) pour Coolify
2. Architecture du Projet
Utilise une architecture en couches propre :
/src/api : Handlers (Routes)
/src/domain : Modèles de données (Structs)
/src/repository : Logique SQLx
/src/service : Logique métier (Business Logic, dont email_service.rs et video_service.rs)
/src/utils : Configuration, Erreurs, JWT
3. Fonctionnalités Requises (MVP)
A. Sécurité & Middleware (Critique)
CORS : Configurer CorsLayer pour n'accepter que les requêtes venant du domaine du Frontend (variable d'env FRONTEND_URL).
Rate Limiting : Limiter les requêtes sur /auth/login (ex: 5 essais par minute par IP).
Tracing : Logger chaque requête HTTP.
B. Authentification & Profil Utilisateur Complet
Stratégie "Shadow Admin" : Login unifié (Env Vars pour Admin, DB pour Users).
Profil Utilisateur Enrichi (PUT /api/profile) :
L'utilisateur doit pouvoir renseigner un maximum d'infos pour la communauté : Bio, Entreprise, Poste, Ville, Pays, Liens Réseaux (LinkedIn, Site Web), Niveau d'expérience PC Soft.
Gestion de l'avatar (Upload S3).
C. Gestion du Contenu Pédagogique (Admin)
Structure "Cours Professionnel" :
Le CRUD cours doit gérer des champs riches : Sous-titre, HTML description, versions compatibles (WD25, WB26...), prérequis, objectifs pédagogiques ("Ce que vous allez apprendre").
Ressources Téléchargeables : Possibilité d'attacher des fichiers (PDF, ZIP Projets, PPT) au niveau du cours ou de la leçon.
Gestion Vidéo Sécurisée :
Admin upload -> S3 -> API stocke la clé.
Présentation/Intro : Vidéo publique.
Leçons : Vidéos protégées.
D. Interactions & Social (Nouveau)
Système d'Évaluation (Reviews) :
Les étudiants peuvent noter un cours (1-5 étoiles) et laisser un témoignage écrit.
Calcul automatique de la moyenne (rating_average) et du nombre de notes.
Espace Commentaires / Q&A :
Sous chaque leçon, un fil de discussion hiérarchique (Thread).
L'Admin (Formateur) est notifié des nouvelles questions.
L'Admin peut répondre, épingler une réponse "officielle".
E. Paiement & Abonnements (Stripe)
Checkout & Portail : Génération des sessions Stripe.
Webhooks : Gestion du cycle de vie des abonnements.
F. Livraison de Contenu & DRM
Endpoint /api/v1/videos/:lesson_id/secure-url :
Vérifie Token + Abonnement Actif + Droits d'accès.
Génère Presigned URL (validité 5 min).
4. Modèle de Données (PostgreSQL)
Crée les migrations SQL pour ces tables enrichies :
users
Essentiel : id, email, password_hash, role, stripe_customer_id.
Profil : full_name, bio (text), avatar_url, job_title, company, city, country, linkedin_url, website_url, pcsoft_experience (enum: beginner, intermediate, expert), phone_number.
Meta : created_at, updated_at, last_login_at.
courses
Identité : id, title, subtitle, slug (unique), is_published.
Présentation : description_short (text), description_long (html), thumbnail_url (vignette carrée), header_image_url (bannière large), intro_video_url (public).
Pédagogie : * level (enum: beginner, intermediate, advanced, expert).
compatibility_versions (JSONB array: ["WD25", "WB25", "WM25"]).
prerequisites (JSONB array of strings).
learning_objectives (JSONB array of strings).
Stats : price (decimal), rating_average (float, default 0), rating_count (int, default 0), students_count (int, default 0).
modules (Sections du cours)
id, course_id, title, description, position.
lessons
id, module_id, title, description, video_s3_key, duration_seconds, is_free_preview (bool), position.
resources (Fichiers joints)
id, course_id (nullable), lesson_id (nullable), title, type (enum: pdf, project_source, slide, other), s3_key, file_size.
reviews (Témoignages)
id, user_id, course_id, rating (1-5), comment (text), created_at.
Contrainte : Un seul avis par user par cours.
comments (Q&A sous les leçons)
id, user_id, lesson_id, parent_id (nullable, pour les réponses), content, created_at, is_pinned (bool).
subscriptions (inchangé)
id, user_id, stripe_subscription_id, plan_type, status, current_period_end.
5. Exigences Coolify (Déploiement)
Génère un Dockerfile qui compile le binaire Rust en mode release.
Utilise distroless ou debian:slim.
Variables d'environnement obligatoires : DATABASE_URL, JWT_SECRET, PORT, STRIPE_KEYS, ADMIN_AUTH, SMTP_CONFIG, S3_CONFIG, FRONTEND_URL.
Ajoute un fichier docker-compose.yml complet.
6. Output Attendu
Génère l'arborescence, le Cargo.toml (package: windevexpert), le code Rust complet, et les fichiers Docker. Le code doit compiler du premier coup.
