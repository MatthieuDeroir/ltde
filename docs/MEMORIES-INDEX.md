# Index - Documentation Tableaux d'une exposition

**Date**: 2025-10-23
**Version actuelle**: v0.5.0
**Version cible**: v1.0.0

---

## 📚 Documents Principaux

### Architecture & Vue d'Ensemble
- **[MEMORIES-APP-ARCHITECTURE.md](./MEMORIES-APP-ARCHITECTURE.md)** - Architecture complète de l'application (2141 lignes)
  - Stack technique
  - Modèle de données (Prisma)
  - Features détaillées
  - Design UX senior-friendly

- **[MEMORIES-ROADMAP.md](./MEMORIES-ROADMAP.md)** - Roadmap complète v0.1.0 → v1.0.0
  - Vue d'ensemble
  - Timeline & phases
  - Critères de validation
  - Post-v1.0.0

---

## 🏗️ PHASE 1 - FONDATIONS (v0.1.0 → v0.5.0)

**Durée**: 4 semaines | **Objectif**: Bases techniques + MVP lecture

### v0.1.0 - Setup & Infrastructure (3 jours)
**[MEMORIES-v0.1.0-SETUP.md](./MEMORIES-v0.1.0-SETUP.md)**
- Initialisation Next.js 15 + TypeScript
- Setup Prisma + SQLite
- Configuration Tailwind CSS + Radix UI
- Jest + Testing Library
- ESLint + Prettier + Husky
- Structure dossiers complète

**Critères**: `pnpm dev` démarre, `pnpm lint` passe, structure créée

---

### v0.2.0 - Database & Auth (5 jours)
**[MEMORIES-v0.2.0-AUTH.md](./MEMORIES-v0.2.0-AUTH.md)**
- Schéma Prisma complet (User, Capsule, Media, Tag, Like, Comment)
- Migrations database
- NextAuth.js v5 setup
- Pages login/signup
- Service layer auth
- Tests unitaires (authService, usersService)

**Critères**: Signup/login fonctionnent, seed crée données test, tests passent (80%+)

---

### v0.3.0 - API Routes & Service Layer (5 jours)
**[MEMORIES-v0.3.0-API.md](./MEMORIES-v0.3.0-API.md)**
- Service layer complet (capsules, tags, likes, comments)
- Zod schemas validation
- API routes REST (GET, POST, PUT, DELETE)
- HTTP client unifié (`@/core/api/client`)
- Tests intégration API
- Permissions handling (roles)

**Critères**: API complète testée (80%+ coverage), Postman collection documentée

---

### v0.4.0 - Feed Public & Capsule Viewer (5 jours)
**[MEMORIES-v0.4.0-UI.md](./MEMORIES-v0.4.0-UI.md)**
- Composants UI de base (Button, Card, Badge, Input, Dialog, Tooltip)
- TanStack Query hooks (useCapsules, useInfiniteCapsules, useCapsule)
- Page Feed avec pagination infinie
- Page Capsule Viewer (cover, contenu, médias)
- Layout responsive (Header, Footer)
- Filtres tags

**Critères**: Feed affiche capsules, pagination fonctionne, responsive, Lighthouse > 80

---

### v0.5.0 - Design System & UX Senior-Friendly (4 jours)
**[MEMORIES-v0.5.0-DESIGN.md](./MEMORIES-v0.5.0-DESIGN.md)**
- Design tokens (colors, typography, spacing)
- Configuration Tailwind senior-friendly (18px base, 60px boutons)
- Redesign composants UI (grandes tailles, contrastes élevés)
- Tests accessibilité (WCAG AAA)
- Composant aide permanent (`<HelpButton>`)
- **Validation grand-père** ✨

**Critères**: Texte 18px+, boutons 60px+, contrastes AAA, grand-père approuve

---

## 🚀 PHASE 2 - CORE FEATURES (v0.6.0 → v0.8.0)

**Durée**: 3 semaines | **Objectif**: Features principales (éditeur, upload, audio)

### v0.6.0 - Éditeur TipTap (7 jours)
**[MEMORIES-v0.6.0-EDITOR.md](./MEMORIES-v0.6.0-EDITOR.md)** *(À créer)*
- Setup TipTap + extensions (StarterKit, Image, Link, Table, Youtube, etc.)
- Composant `<TipTapEditor>` avec toolbar
- Mode Basique/Avancé (toggle)
- Sidebar éditeur (settings, tags, chapters)
- Auto-save (30s)
- Preview mode
- Pages `/editor/new` et `/editor/[id]`

**Critères**: Éditeur fonctionnel, auto-save, grand-père crée première capsule

---

### v0.7.0 - Upload Média & Bibliothèque (5 jours)
**[MEMORIES-v0.7.0-MEDIA.md](./MEMORIES-v0.7.0-MEDIA.md)** *(À créer)*
- Setup Uploadthing (images 10MB, vidéos 100MB, audio 50MB)
- Composant `<MediaUploader>` (dropzone, preview, progress)
- Page `/editor/media` (grid, filtres, recherche)
- Intégration éditeur (bouton insert, drag & drop)
- Tests upload

**Critères**: Upload fonctionne, media library, insertion dans éditeur, grand-père ajoute photos

---

### v0.8.0 - Enregistrement Audio (Narration) (5 jours)
**[MEMORIES-v0.8.0-AUDIO.md](./MEMORIES-v0.8.0-AUDIO.md)** *(À créer)*
- Hook `useAudioRecorder` (MediaRecorder API)
- Composant `<AudioRecorder>` (boutons GROS: Record, Pause, Stop)
- Waveform visualizer temps réel
- Preview avant sauvegarde
- Upload vers Uploadthing
- Intégration sidebar éditeur

**Critères**: Enregistrement fonctionne, grand-père enregistre sa voix, interface ultra-simple

---

## 🎨 PHASE 3 - POLISH & RELEASE (v0.9.0 → v1.0.0)

**Durée**: 3 semaines | **Objectif**: Features sociales, admin, tests, déploiement

### v0.9.0 - Features Sociales (Likes & Comments) (5 jours)
**[MEMORIES-v0.9.0-SOCIAL.md](./MEMORIES-v0.9.0-SOCIAL.md)** *(À créer)*
- Système Likes: `<LikeButton>`, hook `useLikeCapsule`, optimistic updates
- Système Comments: `<CommentsSection>`, threading (max 3 niveaux), soft delete
- API routes `/api/likes` et `/api/comments`
- Intégration Capsule Viewer
- Tests social

**Critères**: Like/unlike instantané, commenter fonctionne, threading, famille interagit

---

### v0.10.0 - Recherche Avancée & Tags (4 jours)
**[MEMORIES-v0.10.0-SEARCH.md](./MEMORIES-v0.10.0-SEARCH.md)** *(À créer)*
- Composant `<SearchBar>` header (debounce 300ms)
- Hook `useSearch` (full-text search)
- API `/api/search?q=...`
- Recherche dans titre, contenu, lieu, personnes
- Dropdown suggestions (tags, années, titres)
- Page `/search`
- Gestion Tags admin (`/editor/tags`)

**Critères**: Recherche fonctionne, suggestions, filtres combinés, grand-père trouve capsules

---

### v0.11.0 - Administration (4 jours)
**[MEMORIES-v0.11.0-ADMIN.md](./MEMORIES-v0.11.0-ADMIN.md)** *(À créer)*
- Page `/admin` (dashboard avec stats)
- Users Manager (CRUD, roles, ban)
- Capsules Manager (modération, delete)
- Comments Moderation (supprimer, ban user)
- Media Manager (stockage, cleanup)
- App Settings (site title, SEO)

**Critères**: Dashboard stats, modération fonctionne, permissions ADMIN vérifiées

---

### v0.12.0 - Tests & Code Quality (4 jours)
**[MEMORIES-v0.12.0-TESTS.md](./MEMORIES-v0.12.0-TESTS.md)** *(À créer)*
- Audit coverage (atteindre 80%+)
- Tests E2E critiques (Playwright): Signup → Create Capsule → Publish
- Audit code quality (ESLint 0 warnings, unused code cleanup)
- Performance audit (Lighthouse > 90)
- Security audit (XSS, CSRF, rate limiting)

**Critères**: Coverage ≥ 80%, E2E passent, Lighthouse > 90, sécurité validée

---

### v1.0.0 - Production Release 🚀 (5 jours)
**[MEMORIES-v1.0.0-RELEASE.md](./MEMORIES-v1.0.0-RELEASE.md)** *(À créer)*
- Documentation finale (README, ARCHITECTURE, USER-GUIDE, CHANGELOG)
- Setup déploiement Vercel
- Migration database production (SQLite/Turso)
- Monitoring (Sentry, Vercel Analytics)
- Backup automatique
- Onboarding grand-père (tour guidé)
- Release notes & tag v1.0.0

**Critères**: Déployé sur Vercel, grand-père utilise quotidiennement, famille interagit

---

## 📊 Timeline Récapitulatif

```
v0.1.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ v1.0.0
│                                                         │
│ PHASE 1: FONDATIONS  │ PHASE 2: FEATURES │ PHASE 3: RELEASE
│ 4 semaines           │ 3 semaines        │ 3 semaines
│                      │                   │
v0.1 ━ v0.2 ━ v0.3 ━ v0.4 ━ v0.5 ━ v0.6 ━ v0.7 ━ v0.8 ━ v0.9 ━ v0.10 ━ v0.11 ━ v0.12 ━ v1.0
3j    5j    5j    5j    4j    7j    5j    5j    5j    4j     4j     4j     5j
```

**Durée totale**: 10 semaines (~2.5 mois)

---

## 🔍 Navigation Rapide

### Par Phase
- [Phase 1 - Fondations](#phase-1---fondations-v010--v050) (v0.1.0 → v0.5.0)
- [Phase 2 - Core Features](#phase-2---core-features-v060--v080) (v0.6.0 → v0.8.0)
- [Phase 3 - Polish & Release](#phase-3---polish--release-v090--v100) (v0.9.0 → v1.0.0)

### Par Thème
**Backend**:
- [v0.2.0 - Database & Auth](./MEMORIES-v0.2.0-AUTH.md)
- [v0.3.0 - API Routes](./MEMORIES-v0.3.0-API.md)

**Frontend**:
- [v0.4.0 - UI Components & Feed](./MEMORIES-v0.4.0-UI.md)
- [v0.5.0 - Design System](./MEMORIES-v0.5.0-DESIGN.md)
- [v0.6.0 - Éditeur TipTap](./MEMORIES-v0.6.0-EDITOR.md)

**Features**:
- [v0.7.0 - Upload Média](./MEMORIES-v0.7.0-MEDIA.md)
- [v0.8.0 - Enregistrement Audio](./MEMORIES-v0.8.0-AUDIO.md)
- [v0.9.0 - Social (Likes & Comments)](./MEMORIES-v0.9.0-SOCIAL.md)
- [v0.10.0 - Recherche](./MEMORIES-v0.10.0-SEARCH.md)

**Admin & Quality**:
- [v0.11.0 - Administration](./MEMORIES-v0.11.0-ADMIN.md)
- [v0.12.0 - Tests & Quality](./MEMORIES-v0.12.0-TESTS.md)

**Release**:
- [v1.0.0 - Production](./MEMORIES-v1.0.0-RELEASE.md)

---

## 📝 Conventions

### Versioning
- **vMAJOR.MINOR.PATCH** (Semantic Versioning)
- v0.x.x = Itérations MVP
- v1.0.0 = Production-ready
- v1.x.x = Post-release features

### Commits
```bash
feat(capsules): add rich text editor
fix(auth): resolve login redirect
refactor(api): migrate to service layer
docs(readme): update setup instructions
test(capsules): add integration tests
```

### Branches
```
main        # Production (tagged releases)
dev         # Development (default)
feature/*   # New features
fix/*       # Bug fixes
```

### Tags Release
```bash
git tag -a vX.X.X -m "Release vX.X.X - Title

✅ Feature 1
✅ Feature 2
✅ Ready for vX.X.X"

git push origin vX.X.X
```

---

## ✅ Checklist Pré-Release (Chaque version)

```bash
# 1. Tests
pnpm test              # ✅ Tous passent
pnpm test:coverage     # ✅ ≥ 80% (à partir de v0.12.0)
pnpm lint              # ✅ 0 warnings
pnpm type-check        # ✅ 0 errors

# 2. Build
pnpm build             # ✅ Succès

# 3. Documentation
# ✅ README.md à jour
# ✅ CHANGELOG.md à jour
# ✅ Version roadmap cochée

# 4. Git
git status             # ✅ Rien de non commité
git tag vX.X.X         # ✅ Tag créé
git push origin vX.X.X # ✅ Tag poussé

# 5. Validation utilisateur
# ✅ Grand-père a testé (versions UI/UX)
# ✅ Feedback positif
```

---

## 🎯 Métriques de Succès v1.0.0

### Techniques
- ✅ Test coverage ≥ 80%
- ✅ Lighthouse scores ≥ 90
- ✅ Zero critical bugs
- ✅ Uptime ≥ 99%
- ✅ Page load < 2s

### Utilisateur (Grand-père)
- ✅ Crée minimum 1 capsule/semaine
- ✅ Enregistre sa voix sur 50%+ capsules
- ✅ Utilisation autonome (sans aide)
- ✅ Satisfaction élevée

### Famille
- ✅ Minimum 5 comptes READER créés
- ✅ Likes réguliers (≥10/semaine)
- ✅ Commentaires réguliers (≥5/semaine)
- ✅ Engagement soutenu

---

## 🔮 Post-v1.0.0 (Roadmap Futures)

### v1.1.0 - Notifications Email
- Email nouveau commentaire/like
- Email hebdomadaire (résumé activité)

### v1.2.0 - Partage Privé
- Lien partage temporaire
- Partage avec mot de passe

### v1.3.0 - Timeline Interactive
- Carte temporelle (années, décennies)
- Navigation visuelle

### v1.4.0 - IA & Transcription
- Transcription audio → texte (Whisper)
- Génération résumés (GPT-4)

### v1.5.0 - PostgreSQL
- Migration SQLite → PostgreSQL
- Supabase/Railway

---

**Document créé**: 2025-10-23
**Status**: Index complet - Navigation roadmap
**Versions**: v0.1.0 → v1.0.0
