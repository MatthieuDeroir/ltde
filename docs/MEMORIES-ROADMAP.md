# Roadmap - Capsules Mémoires (Memories App)

**Date de création**: 2025-10-23
**Dernière mise à jour**: 2025-10-23
**Version actuelle**: v0.0.0 (Setup)
**Version cible**: v1.0.0 (Production Ready)

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Philosophie de Développement](#philosophie-de-développement)
3. [Timeline & Phases](#timeline--phases)
4. [Versions Détaillées](#versions-détaillées)
5. [Critères de Validation](#critères-de-validation)
6. [Post-v1.0.0](#post-v100)

---

## 🎯 Vue d'Ensemble

### Objectif Final
Application web production-ready permettant à votre grand-père de créer, gérer et partager ses souvenirs sous forme de capsules mémoires enrichies, avec une interface simple et accessible.

### Scope v1.0.0
- ✅ Authentification multi-rôles (VISITOR, READER, EDITOR, ADMIN)
- ✅ Éditeur riche (TipTap) avec enregistrement audio
- ✅ Gestion média complète (images, vidéos, audio)
- ✅ Système social (likes, commentaires)
- ✅ Recherche avancée (titre, contenu, tags)
- ✅ Interface senior-friendly (grandes polices, contrastes élevés)
- ✅ Administration complète
- ✅ Tests complets (80% coverage minimum)
- ✅ Déploiement production (Vercel)

### Hors Scope v1.0.0
- ❌ Notifications email
- ❌ Partage privé par lien
- ❌ Timeline interactive (carte temporelle)
- ❌ Transcription audio → texte (AI)
- ❌ Génération résumés AI
- ❌ Migration PostgreSQL (v1.0.0 reste sur SQLite)

---

## 🧭 Philosophie de Développement

### Principes (Inspirés de Flow)
1. **Test-Driven Development**: Tests écrits AVANT le code
2. **Itérations courtes**: Releases fréquentes (1-2 semaines)
3. **Validation continue**: Chaque version testée en situation réelle avec grand-père
4. **Architecture solide**: Service layer, type safety, validations
5. **Documentation vivante**: README et docs mis à jour à chaque version

### Approche Incrémentale
- **v0.x.x**: Itérations MVP (fondations → features → polish)
- **v1.0.0**: Production-ready (stable, testé, déployé)
- **v1.x.x**: Post-release (améliorations, nouvelles features)

### Critères de Passage à la Version Suivante
Pour chaque version :
- ✅ Toutes les features listées implémentées
- ✅ Tests passent (100% pass rate)
- ✅ Documentation mise à jour
- ✅ Validation utilisateur (grand-père teste et approuve)
- ✅ Commit avec tag release

---

## 📅 Timeline & Phases

### Vue Globale
```
v0.1.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ v1.0.0
│                                                              │
│ PHASE 1: FONDATIONS    │ PHASE 2: CORE FEATURES │ PHASE 3: POLISH & RELEASE
│ (4 semaines)           │ (4 semaines)            │ (2 semaines)
│                        │                         │
v0.1 ━ v0.2 ━ v0.3 ━ v0.4 ━ v0.5 ━ v0.6 ━ v0.7 ━ v0.8 ━ v0.9 ━ v1.0
```

**Durée totale estimée**: 10 semaines (~2.5 mois)

---

## 🏗️ PHASE 1 - FONDATIONS (v0.1.0 → v0.5.0)

**Durée**: 4 semaines
**Objectif**: Poser les bases techniques et créer le MVP fonctionnel

### v0.1.0 - Setup & Infrastructure
**Durée**: 3 jours
**Objectif**: Initialiser le projet avec stack technique complète

#### Tâches
- [ ] Initialiser Next.js 15 + TypeScript
- [ ] Setup Prisma + SQLite
- [ ] Configurer Tailwind CSS + Radix UI
- [ ] Setup ESLint + Prettier
- [ ] Configurer Jest + Testing Library
- [ ] Setup Git + branches (main, dev)
- [ ] Créer structure dossiers (app/, components/, core/, server/)
- [ ] Configuration environment variables
- [ ] Setup Husky (pre-commit hooks)
- [ ] Créer README.md initial

#### Critères de Validation
- ✅ `pnpm dev` démarre sans erreur
- ✅ `pnpm lint` passe sans warning
- ✅ `pnpm test` exécute les tests (même vides)
- ✅ `pnpm type-check` passe
- ✅ Structure dossiers complète
- ✅ Documentation README complète

#### Livrables
- Projet Next.js fonctionnel
- Configuration complète (linting, testing, types)
- Documentation initiale

---

### v0.2.0 - Database & Auth
**Durée**: 5 jours
**Objectif**: Modèle de données et authentification fonctionnels

#### Tâches
- [ ] Définir schéma Prisma complet (User, Capsule, Media, Tag, Like, Comment)
- [ ] Créer migrations initiales
- [ ] Seed database avec données de test
- [ ] Setup NextAuth.js v5
- [ ] Implémenter authentification (login/signup)
- [ ] Créer service layer: `authService.ts`, `usersService.ts`
- [ ] Middleware protection routes
- [ ] Tests unitaires services auth
- [ ] Page login (/login)
- [ ] Page signup (/signup)

#### Critères de Validation
- ✅ Schéma Prisma valide et migré
- ✅ Signup fonctionne (création compte READER)
- ✅ Login fonctionne (session NextAuth)
- ✅ Middleware protège routes /editor, /admin
- ✅ Tests services auth passent (100%)
- ✅ Hashing password (bcrypt) vérifié
- ✅ Seeds créent utilisateurs test (VISITOR, READER, EDITOR, ADMIN)

#### Livrables
- Database SQLite avec schéma complet
- Authentification fonctionnelle
- Services auth testés
- Pages login/signup

---

### v0.3.0 - API Routes & Service Layer
**Durée**: 5 jours
**Objectif**: API REST complète avec service layer

#### Tâches
- [ ] Créer service layer complet:
  - `capsulesService.ts` (CRUD)
  - `chaptersService.ts` (CRUD)
  - `mediaService.ts` (upload, delete)
  - `tagsService.ts` (CRUD)
  - `likesService.ts` (toggle)
  - `commentsService.ts` (CRUD + threading)
- [ ] Créer API routes:
  - `/api/capsules` (GET, POST)
  - `/api/capsules/[id]` (GET, PUT, DELETE)
  - `/api/chapters` (POST, PUT, DELETE)
  - `/api/media` (POST, DELETE)
  - `/api/tags` (GET, POST, PUT, DELETE)
  - `/api/likes` (POST, DELETE)
  - `/api/comments` (GET, POST, PUT, DELETE)
- [ ] Créer schémas Zod validation (src/core/schemas/)
- [ ] Implémenter HTTP client (src/core/api/client.ts)
- [ ] Tests intégration API routes
- [ ] Tests unitaires services

#### Critères de Validation
- ✅ Toutes les routes API implémentées
- ✅ Validations Zod en place
- ✅ Service layer testé (80% coverage min)
- ✅ API routes testées (integration tests)
- ✅ HTTP client unifié fonctionnel
- ✅ Gestion erreurs standardisée
- ✅ Documentation API (Swagger ou Postman collection)

#### Livrables
- API REST complète
- Service layer robuste et testé
- HTTP client unifié
- Documentation API

---

### v0.4.0 - Feed Public & Capsule Viewer
**Durée**: 5 jours
**Objectif**: Pages publiques fonctionnelles (lecture)

#### Tâches
- [ ] Créer composants UI de base (src/components/ui/):
  - Button, Input, Card, Badge, Dialog, Tooltip
- [ ] Page Feed (/) :
  - Composant `<FeedGrid>` avec `<CapsuleCard>`
  - Pagination infinie (TanStack Query)
  - Filtres par tags
  - Tri (date, titre)
- [ ] Page Capsule Viewer (/capsule/[id]):
  - Composant `<CapsuleViewer>`
  - Rendu contenu riche (HTML)
  - Galerie images (lightbox)
  - Player vidéo
  - Player audio sticky
- [ ] Navigation header/footer
- [ ] Composant `<SearchBar>` (non fonctionnel encore)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Tests composants UI

#### Critères de Validation
- ✅ Feed affiche capsules publiées
- ✅ Pagination infinie fonctionne
- ✅ Filtres tags fonctionnels
- ✅ Viewer affiche capsule complète
- ✅ Médias (images/vidéos) affichés correctement
- ✅ Navigation fonctionnelle
- ✅ Responsive sur mobile/tablet/desktop
- ✅ Tests composants passent
- ✅ Performance (Lighthouse score > 80)

#### Livrables
- Feed public fonctionnel
- Capsule viewer complet
- Navigation responsive
- Composants UI testés

---

### v0.5.0 - Design System & UX Senior-Friendly
**Durée**: 4 jours
**Objectif**: Design system complet + adaptations UX pour grand-père

#### Tâches
- [ ] Créer design tokens (src/core/design-system/):
  - `colors.ts` (Radix colors, contrastes AAA)
  - `typography.ts` (tailles 18px+, line-height 1.8)
  - `spacing.ts`
  - `animations.ts`
- [ ] Configurer Tailwind avec tokens
- [ ] Appliquer typographie senior-friendly:
  - Texte min 18px
  - Boutons min 60px hauteur
  - Espacement généreux (16px+)
- [ ] Améliorer contrastes (WCAG AAA):
  - Texte #1a1a1a sur fond #ffffff
  - Boutons avec couleurs vives
- [ ] Feedback visuel évident:
  - Hover states prononcés
  - Focus outlines épaisses (4px)
  - Loading spinners gros (32px)
- [ ] Créer composant `<HelpButton>` permanent
- [ ] Créer système tooltips larges
- [ ] Tests accessibilité (axe-core)
- [ ] Documentation design system

#### Critères de Validation
- ✅ Design tokens définis et appliqués
- ✅ Typographie min 18px partout
- ✅ Boutons min 60px hauteur
- ✅ Contrastes WCAG AAA (4.5:1 min)
- ✅ Tests accessibilité passent
- ✅ Feedback visuel évident (hover, focus, loading)
- ✅ Grand-père valide l'interface (test utilisateur)
- ✅ Documentation design system complète

#### Livrables
- Design system complet
- Interface senior-friendly validée
- Tokens Tailwind configurés
- Documentation design

---

## 🚀 PHASE 2 - CORE FEATURES (v0.6.0 → v0.8.0)

**Durée**: 4 semaines
**Objectif**: Implémenter toutes les fonctionnalités principales

### v0.6.0 - Éditeur de Capsules (TipTap)
**Durée**: 7 jours
**Objectif**: Éditeur riche fonctionnel

#### Tâches
- [ ] Setup TipTap avec extensions:
  - StarterKit (headings, bold, italic, lists)
  - Image, Link, TextAlign, Typography
  - Color, Highlight, Underline
  - Table, Youtube, CodeBlock
- [ ] Créer composant `<TipTapEditor>`
- [ ] Créer `<EditorToolbar>`:
  - Mode "Basique" (5 boutons: Gras, Italique, Titre, Photo, Enregistrer)
  - Mode "Avancé" (toggleable)
- [ ] Créer `<EditorSidebar>`:
  - Capsule settings (titre, status, cover, date, lieu)
  - Tags manager
  - Chapters manager (drag & drop reorder)
- [ ] Implémenter auto-save (30s)
- [ ] Implémenter preview mode
- [ ] Page Editor (/editor/new, /editor/[id])
- [ ] Tests éditeur

#### Critères de Validation
- ✅ TipTap éditeur fonctionnel
- ✅ Toolbar basique/avancée toggle fonctionne
- ✅ Auto-save fonctionne (indicateur visible)
- ✅ Preview mode affiche rendu final
- ✅ Sauvegarde brouillon (localStorage backup)
- ✅ Grand-père peut créer une capsule complète
- ✅ Tests éditeur passent
- ✅ Validation formulaire (titre requis, etc.)

#### Livrables
- Éditeur TipTap complet
- Auto-save fonctionnel
- Interface éditeur testée
- Grand-père crée sa première capsule ✨

---

### v0.7.0 - Upload Média & Bibliothèque
**Durée**: 5 jours
**Objectif**: Gestion complète des médias

#### Tâches
- [ ] Setup Uploadthing:
  - Configuration API keys
  - Route upload `/api/uploadthing`
  - Limites (images 10MB, vidéos 100MB, audio 50MB)
- [ ] Créer composant `<MediaUploader>`:
  - Dropzone drag & drop
  - Preview avant upload
  - Barre de progression
  - Multi-upload
- [ ] Page Media Library (/editor/media):
  - Grid avec `<MediaCard>`
  - Filtres (type, date)
  - Recherche par nom
  - Tri (date, taille, nom)
  - Sélection multiple
  - Actions (insert, delete, copy URL)
- [ ] Intégration éditeur:
  - Bouton "Insérer image" ouvre media library
  - Glisser-déposer dans éditeur
  - Resize & crop images
- [ ] Tests upload média

#### Critères de Validation
- ✅ Upload images fonctionne
- ✅ Upload vidéos fonctionne
- ✅ Upload audio fonctionne
- ✅ Media library affiche tous les médias
- ✅ Filtres et recherche fonctionnent
- ✅ Insertion dans éditeur fonctionne
- ✅ Glisser-déposer dans éditeur fonctionne
- ✅ Grand-père peut ajouter photos facilement
- ✅ Tests upload passent

#### Livrables
- Upload média fonctionnel
- Media library complète
- Intégration éditeur
- Tests upload

---

### v0.8.0 - Enregistrement Audio (Narration)
**Durée**: 5 jours
**Objectif**: Enregistrement audio intégré dans éditeur

#### Tâches
- [ ] Créer hook `useAudioRecorder`:
  - MediaRecorder API
  - Gestion permissions micro
  - Timer
  - Pause/Resume
  - Stop & save blob
- [ ] Créer composant `<AudioRecorder>`:
  - Boutons GROS (80px hauteur):
    - 🔴 Enregistrer (rouge)
    - ⏸️ Pause (jaune)
    - ⏹️ Arrêter (gris)
  - Timer visible (24px+)
  - Waveform visualizer (animation)
  - Niveau volume (barre)
- [ ] Créer `<RecordingPreview>`:
  - Player audio
  - Bouton "Réessayer"
  - Bouton "Valider"
- [ ] Intégration éditeur:
  - Section dans sidebar
  - Liste enregistrements
  - Upload vers Uploadthing
  - Attachment à capsule
- [ ] Détection qualité audio:
  - Alerte micro trop faible
  - Alerte bruit de fond
- [ ] Tests enregistrement audio

#### Critères de Validation
- ✅ Enregistrement audio fonctionne (Chrome/Firefox/Safari)
- ✅ Permissions micro demandées correctement
- ✅ Waveform s'affiche en temps réel
- ✅ Preview fonctionne avant sauvegarde
- ✅ Upload vers Uploadthing réussit
- ✅ Audio attaché à capsule
- ✅ Grand-père enregistre sa première narration
- ✅ Interface TRÈS simple (3 gros boutons)
- ✅ Tests enregistrement passent

#### Livrables
- Enregistrement audio fonctionnel
- Interface ultra-simple
- Tests audio
- Grand-père enregistre sa voix ✨

---

## 🎨 PHASE 3 - POLISH & RELEASE (v0.9.0 → v1.0.0)

**Durée**: 2 semaines
**Objectif**: Features sociales, recherche, admin, tests, déploiement

### v0.9.0 - Features Sociales (Likes & Comments)
**Durée**: 5 jours
**Objectif**: Système social complet

#### Tâches
- [ ] Système Likes:
  - Composant `<LikeButton>` avec animation coeur
  - Hook `useLikeCapsule` avec optimistic updates
  - API routes `/api/likes` (POST, DELETE)
  - Modal "Qui a liké" (`<LikesList>`)
- [ ] Système Comments:
  - Composant `<CommentsSection>`
  - `<CommentForm>` (textarea + bouton "Publier")
  - `<CommentsList>` avec threading (max 3 niveaux)
  - Hook `useComments`, `useCreateComment`, `useDeleteComment`
  - API routes `/api/comments` (GET, POST, PUT, DELETE)
  - Soft delete (isDeleted flag)
  - Anti-spam (1 comment / 30s)
- [ ] Intégration Capsule Viewer:
  - Section likes en haut
  - Section comments en bas
  - Notifications "X a commenté votre souvenir"
- [ ] Tests système social

#### Critères de Validation
- ✅ Like/unlike fonctionne instantanément
- ✅ Animation coeur satisfaisante
- ✅ Modal "Qui a liké" affiche users
- ✅ Commenter fonctionne
- ✅ Réponses (threads) fonctionnent
- ✅ Éditer/supprimer son commentaire fonctionne
- ✅ Soft delete préserve structure threads
- ✅ Anti-spam empêche spam
- ✅ Famille peut liker et commenter facilement
- ✅ Tests social passent

#### Livrables
- Système likes complet
- Système comments avec threading
- Tests social
- Famille interagit avec capsules ✨

---

### v0.10.0 - Recherche Avancée & Tags
**Durée**: 4 jours
**Objectif**: Recherche complète + gestion tags

#### Tâches
- [ ] Recherche Avancée:
  - Composant `<SearchBar>` dans header
  - Hook `useSearch` (debounce 300ms)
  - API `/api/search?q=...` (full-text search)
  - Recherche dans: titre, excerpt, contenu, lieu, personnes
  - Dropdown suggestions (tags, années, titres)
  - Page résultats (/search?q=...)
  - Historique recherches (localStorage)
  - Raccourci Cmd/Ctrl+K
- [ ] Gestion Tags:
  - Page Tags Manager (/editor/tags)
  - Composant `<TagForm>` (nom, slug, couleur, description)
  - Color picker (Radix UI)
  - Auto-slug generation
  - CRUD tags (ADMIN uniquement)
  - Composant `<TagSelector>` (autocomplete)
- [ ] Tests recherche et tags

#### Critères de Validation
- ✅ Recherche par titre fonctionne
- ✅ Recherche dans contenu fonctionne
- ✅ Suggestions s'affichent pendant frappe
- ✅ Filtres combinés fonctionnent (recherche + tags + années)
- ✅ Historique recherches sauvegardé
- ✅ Cmd/Ctrl+K focus recherche
- ✅ Tags CRUD fonctionne (ADMIN)
- ✅ TagSelector autocomplete fonctionne
- ✅ Grand-père trouve capsules par recherche
- ✅ Tests recherche passent

#### Livrables
- Recherche avancée complète
- Gestion tags ADMIN
- Tests recherche
- Recherche intuitive ✨

---

### v0.11.0 - Administration
**Durée**: 4 jours
**Objectif**: Dashboard admin complet

#### Tâches
- [ ] Page Admin Dashboard (/admin):
  - `<StatsOverview>` (capsules, média, users, tags)
  - Charts (Chart.js ou Recharts)
- [ ] Users Manager (/admin/users):
  - Table users avec filtres
  - Actions: Éditer rôle, Ban, Supprimer
  - Modal édition user
- [ ] Capsules Manager (/admin/capsules):
  - Liste toutes capsules (draft, published, archived)
  - Actions: Voir, Éditer, Supprimer, Changer status
- [ ] Comments Moderation (/admin/comments):
  - Liste tous commentaires
  - Filtres: Par capsule, par user, signalés
  - Actions: Supprimer, Ban user
  - Historique modération
- [ ] Media Manager (/admin/media):
  - Statistiques stockage
  - Liste tous médias
  - Actions: Voir, Supprimer
- [ ] App Settings (/admin/settings):
  - Site title, description
  - SEO metadata
  - Feature flags (optionnel)
- [ ] Tests admin

#### Critères de Validation
- ✅ Dashboard affiche stats correctes
- ✅ Users CRUD fonctionne
- ✅ Modération capsules fonctionne
- ✅ Modération comments fonctionne
- ✅ Media manager affiche stockage
- ✅ Settings éditables
- ✅ Permissions ADMIN vérifiées (autres rôles n'accèdent pas)
- ✅ Tests admin passent

#### Livrables
- Dashboard admin complet
- Modération users/capsules/comments
- Tests admin
- Admin fonctionnel ✨

---

### v0.12.0 - Tests & Code Quality
**Durée**: 4 jours
**Objectif**: Coverage 80%+ et code quality

#### Tâches
- [ ] Audit coverage actuel
- [ ] Écrire tests manquants:
  - Unit tests (services)
  - Integration tests (API routes)
  - Component tests (UI)
- [ ] Tests E2E critiques (Playwright):
  - Signup → Login → Create Capsule → Publish
  - Search → View Capsule → Like → Comment
  - Upload Media → Insert in Editor
  - Record Audio → Attach to Capsule
- [ ] Audit code quality:
  - ESLint warnings → 0
  - TypeScript errors → 0
  - Unused code cleanup
  - Code duplication refactor
- [ ] Performance audit:
  - Lighthouse scores > 90 (toutes métriques)
  - Bundle size optimization
  - Image optimization (next/image)
  - Lazy loading
- [ ] Security audit:
  - SQL injection prevention (Prisma ✅)
  - XSS prevention (React ✅, sanitize HTML rich text)
  - CSRF protection (NextAuth ✅)
  - Rate limiting (API routes)
  - Password hashing (bcrypt ✅)

#### Critères de Validation
- ✅ Test coverage ≥ 80%
- ✅ Tous tests passent (100%)
- ✅ ESLint warnings = 0
- ✅ TypeScript errors = 0
- ✅ Tests E2E passent (scénarios critiques)
- ✅ Lighthouse scores > 90 (perf, a11y, best practices, SEO)
- ✅ Bundle size optimisé (< 300KB initial JS)
- ✅ Security audit complet
- ✅ Rate limiting en place

#### Livrables
- Coverage 80%+
- Tests E2E
- Code quality haute
- Performance optimisée
- Sécurité validée

---

### v1.0.0 - Production Release 🚀
**Durée**: 5 jours
**Objectif**: Déploiement production et documentation finale

#### Tâches
- [ ] Documentation finale:
  - README.md complet (setup, dev, deploy)
  - ARCHITECTURE.md détaillé
  - API.md (documentation routes)
  - USER-GUIDE.md (guide utilisateur grand-père)
  - CHANGELOG.md (historique versions)
  - CONTRIBUTING.md
- [ ] Setup déploiement Vercel:
  - Connexion repo GitHub
  - Configuration variables environnement
  - Setup Uploadthing production
  - Configuration domaine custom (optionnel)
- [ ] Migration production:
  - Setup database production (SQLite sur Vercel ou Turso)
  - Seed production avec données initiales
  - Migration utilisateurs test → production
- [ ] Monitoring & Analytics:
  - Setup Sentry (error tracking)
  - Setup Vercel Analytics
  - Setup Plausible/Google Analytics (optionnel)
- [ ] Backup strategy:
  - Script backup automatique DB
  - Script export données (JSON, CSV)
- [ ] Onboarding grand-père:
  - Tour guidé intégré (react-joyride)
  - Vidéo tutoriel (enregistrée par vous)
  - FAQ intégrée
  - Contact support (email, téléphone)
- [ ] Release notes v1.0.0
- [ ] Tag release GitHub
- [ ] Annonce famille (email, etc.)

#### Critères de Validation v1.0.0
- ✅ Application déployée sur Vercel (accessible via URL)
- ✅ Domaine custom configuré (optionnel)
- ✅ Database production fonctionnelle
- ✅ Uploadthing production configuré
- ✅ Monitoring actif (Sentry, Analytics)
- ✅ Backup automatique en place
- ✅ Documentation complète (README, USER-GUIDE, etc.)
- ✅ Onboarding grand-père testé et approuvé
- ✅ Release notes publiées
- ✅ Tag v1.0.0 créé sur GitHub
- ✅ Toutes features MVP fonctionnelles en production
- ✅ Tests passent (100%)
- ✅ Grand-père utilise l'app quotidiennement ✨
- ✅ Famille interagit (likes, comments)

#### Livrables v1.0.0
- **Application production-ready** 🎉
- URL publique fonctionnelle
- Documentation complète
- Monitoring actif
- Grand-père et famille utilisent l'app
- **MISSION ACCOMPLIE** ✅

---

## ✅ Critères de Validation Globaux

### Pour Chaque Version
1. **Code Quality**:
   - ✅ 0 erreurs TypeScript
   - ✅ 0 warnings ESLint
   - ✅ Code formatté (Prettier)
   - ✅ Pas de console.log oubliés

2. **Tests**:
   - ✅ Tous tests passent (100%)
   - ✅ Coverage ≥ 80% (v0.12.0+)
   - ✅ Tests E2E critiques passent (v0.12.0+)

3. **Documentation**:
   - ✅ README mis à jour
   - ✅ CHANGELOG mis à jour
   - ✅ Documentation code (JSDoc)

4. **Git**:
   - ✅ Commit propres (conventional commits)
   - ✅ Tag release créé
   - ✅ Branch mergée dans main

5. **Validation Utilisateur**:
   - ✅ Grand-père teste la version
   - ✅ Feedback positif
   - ✅ Bugs critiques résolus

### Checklist Pré-Release (Avant chaque tag)
```bash
# 1. Tests
pnpm test              # Tous passent
pnpm test:coverage     # ≥ 80%
pnpm lint              # 0 warnings
pnpm type-check        # 0 errors

# 2. Build
pnpm build             # Succès

# 3. Documentation
# - README.md à jour
# - CHANGELOG.md à jour
# - Roadmap mise à jour

# 4. Git
git status             # Rien de non commité
git tag vX.X.X         # Tag release
git push origin vX.X.X # Push tag

# 5. Validation utilisateur
# - Grand-père a testé
# - Feedback positif
```

---

## 🔮 Post-v1.0.0 (Évolutions Futures)

### v1.1.0 - Notifications Email
- Email nouveau commentaire
- Email nouveau like (digest quotidien)
- Email hebdomadaire (résumé activité)
- Setup SendGrid/Resend

### v1.2.0 - Partage Privé
- Générer lien partage temporaire
- Partage capsule par email
- Partage avec mot de passe
- Expiration automatique

### v1.3.0 - Timeline Interactive
- Carte temporelle (années, décennies)
- Navigation visuelle
- Zoom années
- Filtres géographiques

### v1.4.0 - IA & Transcription
- Transcription audio → texte (OpenAI Whisper)
- Génération résumés automatiques (GPT-4)
- Suggestions tags automatiques
- Détection personnes/lieux dans texte

### v1.5.0 - Migration PostgreSQL
- Migration SQLite → PostgreSQL
- Setup Supabase/Railway
- Backups automatisés cloud
- Performance scaling

### v2.0.0 - Édition Collaborative
- Multi-éditeurs simultanés
- Commentaires inline (Google Docs-like)
- Suggestions d'édition
- Historique versions (git-like)

---

## 📊 Métriques de Succès

### Techniques
- ✅ Test coverage ≥ 80%
- ✅ Lighthouse scores ≥ 90
- ✅ Zero critical bugs
- ✅ Uptime ≥ 99% (production)
- ✅ Page load < 2s

### Utilisateur (Grand-père)
- ✅ Crée minimum 1 capsule/semaine
- ✅ Enregistre sa voix sur 50%+ capsules
- ✅ Satisfaction élevée (feedback positif)
- ✅ Utilisation autonome (sans aide)

### Famille
- ✅ Minimum 5 comptes READER créés
- ✅ Likes réguliers (≥10/semaine)
- ✅ Commentaires réguliers (≥5/semaine)
- ✅ Engagement soutenu (visits hebdomadaires)

---

## 📝 Notes & Conventions

### Versioning (Semantic Versioning)
```
vMAJOR.MINOR.PATCH

v0.1.0 → v0.2.0 → ... → v1.0.0 → v1.1.0 → v2.0.0

- MAJOR: Breaking changes (v1 → v2)
- MINOR: New features (v0.1 → v0.2)
- PATCH: Bug fixes (v0.1.0 → v0.1.1)
```

### Branches
```bash
main        # Production (tagged releases)
dev         # Development (default)
feature/*   # New features
fix/*       # Bug fixes
```

### Commits (Conventional Commits)
```bash
feat(capsules): add rich text editor
fix(auth): resolve login redirect issue
refactor(api): migrate to service layer
docs(readme): update setup instructions
test(capsules): add integration tests
chore(deps): update dependencies
```

### Documentation
- `README.md`: Setup, dev, deploy
- `docs/ARCHITECTURE.md`: Architecture détaillée
- `docs/API.md`: Documentation API routes
- `docs/USER-GUIDE.md`: Guide utilisateur grand-père
- `docs/ROADMAP.md`: Ce document (roadmap)
- `CHANGELOG.md`: Historique versions
- `CONTRIBUTING.md`: Guide contribution

---

## 🎯 Prochaines Étapes Immédiates

1. **Valider cette roadmap** avec vous (Michel)
2. **Créer le projet** (v0.1.0 - Setup)
3. **Initialiser Git** + branches (main, dev)
4. **Commencer v0.1.0** (voir fiches détaillées)

---

**Document créé**: 2025-10-23
**Auteur**: Claude & Michel
**Status**: Roadmap initiale - Prête pour démarrage projet
**Version cible**: v1.0.0 (Production Ready)
**Durée estimée**: 10 semaines (~2.5 mois)

---

**LET'S BUILD SOMETHING AMAZING FOR GRAND-PÈRE** ✨👴📖
