Cahier des Charges Technique : Frontend Web (React/Vite)
Instruction pour l'IA : Agis en tant qu'Expert Frontend React. Tu dois créer une application Single Page Application (SPA) moderne pour la plateforme de formation "WindevExpert". Cette app consommera l'API Rust développée précédemment et sera déployée sur Coolify.
1. Stack Technique Imposée
Framework : React (v18+) + TypeScript + Vite.
Styling : Tailwind CSS + clsx + tailwind-merge.
Composants UI : Shadcn/UI (basé sur Radix UI) + Lucide React (Icônes).
State Management :
Server State : TanStack Query (v5) pour le caching et les requêtes API.
Client State : Zustand (pour le panier, le user session, et les préférences player).
Formulaires : React Hook Form + Zod (Validation stricte).
Vidéo : vidstack (Player moderne et accessible) ou react-player.
Routing : React Router DOM v6.
Sécurité XSS : dompurify pour afficher le HTML des descriptions de cours.
2. Design System & UX
Identité : "WindevExpert" - Le design doit inspirer la compétence technique.
Thème : Dark Mode par défaut (Style "IDE" / "VS Code" sombre et épuré), avec possibilité de switch Light.
Layouts :
PublicLayout : Navbar (Logo, Catalog, Login), Footer.
AppLayout : Sidebar collapsable (Mes cours, Profil, Communauté), Topbar (User menu).
PlayerLayout : Mode "Cinéma" pour l'immersion.
Responsive : 100% Mobile Friendly (PWA Ready).
3. Architecture des Dossiers (Feature-First)
Organise le code par domaine métier et non par type de fichier :
src/features/auth (Login, Register, Reset Password)
src/features/courses (Catalog, Detail, Filters)
src/features/player (Video Player, DRM logic, Watermark)
src/features/profile (Edit profile, Public profile)
src/features/community (Reviews, Comments thread)
src/shared (Components UI, Hooks globaux, Utils)
4. Fonctionnalités & Pages à Développer
A. Zone Publique (Vitrine)
Home : Hero section (Promesse "30 ans d'XP"), Featured Courses, Testimonials (Reviews).
Catalogue :
Grid de cartes de cours.
Filtres latéraux : Par version (WinDev, WebDev, Mobile), par Niveau (Débutant -> Expert).
Badge "Compatible WD25, WD26...".
Détail Cours (Page de Vente) :
Header avec Grande Image + Titre + Sous-titre + Vidéo Intro (Public).
Tabs :
"Description" : Rendu HTML sécurisé (dompurify).
"Programme" : Liste des modules/leçons (Accordéons).
"Prérequis & Objectifs" : Listes à puces stylisées.
"Avis" : Liste des reviews + Note moyenne.
Sticky Sidebar (CTA) : Prix, Bouton "Acheter" (Stripe), "Ce cours inclut...".
Auth :
Login / Register / Forgot Password.
Gestion Rôle : Si le JWT contient role: admin, afficher un bouton discret "Admin Dashboard" dans la navbar.
B. Zone Membre (Dashboard)
Mes Cours : Liste des formations achetées avec barre de progression (calculée en local ou via API).
Profil Utilisateur Complet :
Formulaire riche : Avatar (Upload), Bio, Job Title, Liens Sociaux.
Ces infos seront visibles par la communauté dans les commentaires.
C. Le Lecteur Vidéo (Cœur du produit)
L'expérience d'apprentissage doit être parfaite.
Interface : Sidebar à droite avec le sommaire du cours (chapitres).
Sécurité (Watermark Front-end) :
Créer un composant <WatermarkOverlay /> absolu sur la vidéo.
Affiche l'email de l'utilisateur + ID.
Animation : Se déplace aléatoirement toutes les 30s + Opacité faible (ne doit pas gêner mais être lisible).
pointer-events-none pour ne pas bloquer les clics.
Lecture :
Appel à l'API /secure-url pour obtenir le lien temporaire S3.
Gestion de la reprise de lecture (sauvegarder timestamp dans localStorage).
Onglet "Discussions" (Sous la vidéo) :
Système de commentaires hiérarchique (Thread).
Affichage des avatars utilisateurs.
Badge "Formateur" pour vos réponses.
D. Système de Notation
Formulaire modal pour laisser un avis (Note 1-5 + Commentaire) après avoir complété 20% du cours.
5. Intégration API & Securité
Configurer axios ou fetch interceptor :
Injecter Authorization: Bearer <token>.
Gérer le refresh token automatique (si 401).
Stripe : Intégration de Stripe Checkout (redirection simple) ou Stripe Elements (paiement in-app).
6. Exigences Coolify (Docker)
Crée un Dockerfile optimisé pour la production :
Stage 1 (Build) : Node.js image, npm run build.
Stage 2 (Serve) : Nginx Alpine.
Copier le build dans /usr/share/nginx/html.
Configurer nginx.conf pour gérer le routing SPA (rediriger 404 vers index.html).
Variables d'environnement au build : VITE_API_URL, VITE_STRIPE_PUBLIC_KEY.
7. Output Attendu
Code complet du projet React structuré, configuration Tailwind/Shadcn, composants clés (Player, CourseCard, AuthForm, CommentThread), et configuration Docker/Nginx.
