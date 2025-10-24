# Memories App - Context Claude

**Dernière mise à jour**: 2025-10-23
**Version actuelle**: v0.0.0 (Projet non démarré)
**Version cible**: v1.0.0 (Production Ready)

---

## 🎯 Contexte du Projet

### Objectif Principal

Application web permettant au **grand-père** de créer et partager ses souvenirs sous forme de **capsules mémoires enrichies** (texte riche, photos, vidéos, narration audio).

### Utilisateurs Cibles

1. **Grand-père** (EDITOR) - Créateur principal des capsules
2. **Famille** (READER) - Lecture, likes, commentaires
3. **Visiteurs** (VISITOR) - Lecture seule sans compte
4. **Admin** (ADMIN) - Gestion complète de l'app

### Contrainte Clé: **UX Senior-Friendly**

**Note**: Grand-père est à l'aise avec les outils numériques, donc on garde l'interface simple et claire mais pas infantilisante.

- Texte minimum **18px** (vs 16px standard)
- Boutons minimum **60px** de hauteur
- Contrastes élevés (WCAG AAA: 4.5:1 minimum)
- Feedback visuel évident (gros spinners, borders épaisses, animations claires)
- Navigation simplifiée (max 1 niveau de profondeur)
- Messages clairs (pas de jargon technique)
- Mode "Basique" par défaut (éditeur simplifié)
- Aide permanente (bouton aide toujours visible)

---

## 🛠️ Stack Technique

### Frontend

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS + Radix UI colors
- **Components**: Radix UI (primitives accessibles)
- **Rich Text**: TipTap (éditeur WYSIWYG)
- **Data Fetching**: TanStack Query v5 (cache, mutations, optimistic updates)
- **Forms**: React Hook Form + Zod validation
- **Dates**: date-fns

### Backend

- **Runtime**: Node.js 22+ (via Next.js API Routes)
- **ORM**: Prisma 6.x + **SQLite (définitif - pas de migration Postgres)**
- **Auth**: NextAuth.js v5 (JWT, sessions, rôles)
- **Upload**: Uploadthing (images 10MB, vidéos 100MB, audio 50MB)
- **Validation**: Zod (schemas partagés front/back)

### DevOps

- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + Testing Library
- **Git Hooks**: Husky (pre-commit checks)
- **Deployment**: Vercel (prévu pour v1.0.0)

---

## 🏗️ Architecture

### Pattern 3-Layer (Inspiré de Flow v0.4.6)

```
UI Layer (app/, components/)
    ↓
API Layer (app/api/)
    ↓
Service Layer (server/services/)
    ↓
Prisma ORM
    ↓
SQLite Database
```

### Data Flow

```
User Interaction
    → React Component
    → TanStack Query Hook (useCapsulesQuery)
    → API Client (@/core/api/client)
    → API Route (/api/capsules)
    → Service (capsulesService.ts)
    → Prisma ORM
    → SQLite Database
```

### Type Safety Flow

```
Prisma Schema (source of truth)
    → Generated Prisma Types
    → Zod Schemas (validation)
    → TypeScript Types (inference)
    → API Responses & UI
```

---

## 📊 Modèle de Données

### Entités Principales

- **User** (id, email, username, passwordHash, role, displayName, avatar, bio)
- **Capsule** (id, userId, title, content, excerpt, coverImage, status, publishedAt, year, location, people)
- **Chapter** (id, capsuleId, title, content, order)
- **Media** (id, capsuleId, type, url, filename, mimeType, size, caption, altText, order)
- **Tag** (id, name, slug, color, description)
- **Like** (id, userId, capsuleId) - Unique constraint [userId, capsuleId]
- **Comment** (id, userId, capsuleId, content, parentId, isEdited, isDeleted, deletedAt)
- **AppConfig** (id, key, value)

### Relations Clés

- User 1→\* Capsule, Like, Comment
- Capsule 1→\* Media, Chapter, Like, Comment
- Capsule _→_ Tag (via CapsuleTag)
- Comment 1→\* Comment (self-referencing pour threads, max 3 niveaux)

---

## 📅 Roadmap

### Timeline Globale (10 semaines)

```
v0.1.0 → v0.2.0 → v0.3.0 → v0.4.0 → v0.5.0 → ... → v1.0.0
│                                                         │
│ PHASE 1: FONDATIONS    │ PHASE 2: FEATURES │ PHASE 3: RELEASE
│ (4 semaines)           │ (3 semaines)      │ (3 semaines)
```

### Phase 1 - Fondations (v0.1.0 → v0.5.0)

- **v0.1.0** (3j): Setup & Infrastructure (Next.js, Prisma, tests, linting)
- **v0.2.0** (5j): Database & Auth (schéma complet, NextAuth, login/signup)
- **v0.3.0** (5j): API Routes & Service Layer (CRUD, validations Zod, tests)
- **v0.4.0** (5j): Feed Public & Capsule Viewer (UI, pagination infinie, responsive)
- **v0.5.0** (4j): Design System & UX Senior-Friendly (tokens, accessibilité AAA)

### Phase 2 - Core Features (v0.6.0 → v0.8.0)

- **v0.6.0** (7j): Éditeur TipTap (rich text, auto-save, preview, chapitres)
- **v0.7.0** (5j): Upload Média & Bibliothèque (Uploadthing, drag & drop)
- **v0.8.0** (5j): Enregistrement Audio (narration, waveform visualizer, interface ultra-simple)

### Phase 3 - Polish & Release (v0.9.0 → v1.0.0)

- **v0.9.0** (5j): Features Sociales (likes, comments, threading)
- **v0.10.0** (4j): Recherche Avancée & Tags (full-text, suggestions, autocomplete)
- **v0.11.0** (4j): Administration (dashboard, modération, users manager)
- **v0.12.0** (4j): Tests & Code Quality (coverage 80%+, E2E, Lighthouse >90)
- **v1.0.0** (5j): Production Release (déploiement Vercel, onboarding, monitoring)

---

## 🎨 Features Principales

### 1. Feed Public (/)

- Timeline capsules publiées
- Pagination infinie (TanStack Query)
- Filtres: tags, année, auteur
- Recherche avancée (titre, contenu, lieu, personnes)
- Responsive (mobile, tablet, desktop)

### 2. Capsule Viewer (/capsule/[id])

- Rendu HTML riche (TipTap read-only)
- Galerie images (lightbox)
- Player vidéo intégré
- Player audio sticky (narration)
- Table des matières (si chapitres)
- Likes & Comments

### 3. Éditeur de Capsules (/editor)

- TipTap avec extensions (StarterKit, Image, Link, Table, Youtube, etc.)
- Mode Basique/Avancé (toggle)
- Auto-save (30s)
- Preview mode
- Upload média (drag & drop)
- Enregistrement audio intégré
- Gestion chapitres (drag & drop reorder)

### 4. Système Social

- **Likes**: Toggle instantané, optimistic updates, animation coeur
- **Comments**: Threading (max 3 niveaux), édition, soft delete, anti-spam (1 comment/30s)

### 5. Recherche Avancée

- Full-text search (titre, contenu, lieu, personnes)
- Suggestions auto-complètes
- Historique recherches
- Raccourci Cmd/Ctrl+K

### 6. Administration (/admin)

- Dashboard stats (capsules, médias, users, tags)
- Users Manager (CRUD, roles, ban)
- Modération capsules
- Modération comments
- Media Manager (stockage, cleanup)
- App Settings (site title, SEO)

---

## 🔐 Rôles & Permissions

| Feature                | VISITOR | READER | EDITOR           | ADMIN     |
| ---------------------- | ------- | ------ | ---------------- | --------- |
| Voir capsules publiées | ✅      | ✅     | ✅               | ✅        |
| S'inscrire             | ✅      | ❌     | ❌               | ❌        |
| Liker capsules         | ❌      | ✅     | ✅               | ✅        |
| Commenter              | ❌      | ✅     | ✅               | ✅        |
| Créer capsules         | ❌      | ❌     | ✅               | ✅        |
| Éditer capsules        | ❌      | ❌     | ✅ (ses propres) | ✅ (tous) |
| Supprimer capsules     | ❌      | ❌     | ✅ (ses propres) | ✅ (tous) |
| Créer tags             | ❌      | ❌     | ✅               | ✅        |
| Modifier tags          | ❌      | ❌     | ❌               | ✅        |
| Gérer utilisateurs     | ❌      | ❌     | ❌               | ✅        |
| Modérer comments       | ❌      | ❌     | ❌               | ✅        |

---

## 📁 Structure Projet

```
memories-app/
├── prisma/
│   ├── schema.prisma           # Schéma DB complet
│   ├── migrations/             # Migrations Prisma
│   └── seed.ts                 # Données test (4 users, 3 tags, 1 capsule)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Routes publiques (Feed, Capsule Viewer)
│   │   ├── (protected)/        # Routes protégées (Editor, Admin)
│   │   ├── api/                # API Routes REST
│   │   ├── login/              # Page login
│   │   ├── signup/             # Page signup
│   │   └── layout.tsx
│   ├── components/             # Composants React
│   │   ├── ui/                 # Radix UI wrappers (Button, Input, Dialog, etc.)
│   │   ├── capsules/           # CapsuleCard, CapsuleViewer, CapsuleForm
│   │   ├── editor/             # TipTapEditor, EditorToolbar, EditorSidebar
│   │   ├── media/              # MediaGrid, MediaCard, MediaLightbox
│   │   ├── tags/               # TagBadge, TagSelector, TagManager
│   │   └── layout/             # Header, Footer, Sidebar
│   ├── core/                   # Architecture unifiée
│   │   ├── api/                # HTTP client + TanStack Query hooks
│   │   ├── schemas/            # Zod schemas (capsule, tag, like, comment)
│   │   └── design-system/      # Design tokens (colors, typography, spacing)
│   ├── server/                 # Server-side code
│   │   ├── services/           # Service layer (capsulesService, tagsService, etc.)
│   │   └── auth.ts             # NextAuth config
│   ├── lib/                    # Utilities
│   │   ├── db.ts               # Prisma client singleton
│   │   ├── utils.ts            # cn(), etc.
│   │   └── constants.ts
│   ├── hooks/                  # React hooks (useCapsules, useMedia, useTags, etc.)
│   └── types/                  # TypeScript types
├── docs/                       # Documentation projet
│   ├── MEMORIES-INDEX.md
│   ├── MEMORIES-APP-ARCHITECTURE.md
│   ├── MEMORIES-ROADMAP.md
│   ├── MEMORIES-v0.1.0-SETUP.md
│   ├── MEMORIES-v0.2.0-AUTH.md
│   ├── MEMORIES-v0.3.0-API.md
│   ├── MEMORIES-v0.4.0-UI.md
│   └── MEMORIES-v0.5.0-DESIGN.md
├── .env                        # Variables environnement (DATABASE_URL, NEXTAUTH_SECRET, etc.)
├── package.json
└── README.md
```

---

## 🧭 Principes de Développement

### 1. Test-Driven Development (TDD)

- Tests écrits **AVANT** le code
- Coverage minimum **80%** (requis à partir de v0.12.0)
- Tests unitaires (services) + intégration (API routes) + E2E (Playwright)

### 2. Itérations Courtes

- Releases fréquentes (1-2 semaines par version)
- Validation continue avec grand-père à chaque version UI/UX

### 3. Type Safety

- TypeScript strict mode
- Zod validations partagées front/back
- Prisma types générés automatiquement

### 4. Code Quality

- ESLint 0 warnings
- Prettier formatting
- Husky pre-commit hooks
- Code reviews avant merge

### 5. Documentation Vivante

- README mis à jour à chaque version
- CHANGELOG détaillé
- Code comments (JSDoc)
- Documentation API

---

## ⚠️ Règles Importantes

### 🔴 CRITIQUE: Gestion Base de Données

**FAIS TOUJOURS UN BACKUP DE LA DB AVANT DE LA MODIFIER. LA PERTE DE DONNEES N'EST PAS ACCEPTABLE.**

```bash
# Backup DB avant migration
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d-%H%M%S)

# Migration Prisma
pnpm exec prisma migrate dev --name nom-migration

# En cas d'erreur, restore
cp prisma/dev.db.backup-YYYYMMDD-HHMMSS prisma/dev.db
```

### 📦 Workflow Git

**Repository**: https://github.com/MatthieuDeroir/ltde.git

**Branches**:

- `main` - Branche principale (production, releases taggées)
- `dev` - Branche de développement (default)
- `feature/*` - Branches de features (depuis dev)
- `fix/*` - Branches de fixes (depuis dev)

**Workflow**:

1. Créer feature branch depuis `dev`
2. Développer et tester
3. Merge dans `dev`
4. Tester sur `dev`
5. Merge `dev` → `main`
6. Tag release depuis `main`
7. Push branches + tags

### 🔴 IMPORTANT: Build & Dev Server

**Quand tu builds, ça casse le serveur de dev. Il faut le relancer.**

```bash
# Après build
pnpm build

# Relancer dev server
pnpm dev
```

---

## 📊 État Actuel du Projet

### Version Actuelle: v0.0.0

- ❌ Projet **non encore initialisé**
- ❌ Aucun code écrit
- ✅ Documentation complète (roadmap, architecture, fiches versions)

### Prochaine Étape: v0.1.0 - Setup & Infrastructure

**Durée estimée**: 3 jours

**Tâches principales**:

- Initialiser Next.js 15 + TypeScript
- Setup Prisma + SQLite
- Configurer Tailwind CSS + Radix UI
- Setup Jest + Testing Library
- Configurer ESLint + Prettier + Husky
- Créer structure dossiers complète
- Documentation initiale (README)

**Critères de validation**:

- `pnpm dev` démarre sans erreur
- `pnpm lint` passe sans warning
- `pnpm test` exécute tests
- `pnpm type-check` passe
- Structure dossiers créée
- README complet

---

## 🎯 Métriques de Succès v1.0.0

### Techniques

- ✅ Test coverage ≥ 80%
- ✅ Lighthouse scores ≥ 90 (perf, a11y, best practices, SEO)
- ✅ Zero critical bugs
- ✅ Page load < 2s
- ✅ Uptime ≥ 99%

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

## 🔮 Post-v1.0.0 (Futures Évolutions)

- **v1.1.0**: Notifications Email (nouveau comment/like, résumé hebdomadaire)
- **v1.2.0**: Partage Privé (lien temporaire, mot de passe, expiration)
- **v1.3.0**: Timeline Interactive (carte temporelle, navigation visuelle)
- **v1.4.0**: IA & Transcription (Whisper audio→texte, GPT-4 résumés)
- **v1.5.0**: Améliorations Performance & Scalabilité

---

## 📝 Conventions

### Commits (Conventional Commits)

```bash
feat(capsules): add rich text editor
fix(auth): resolve login redirect issue
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
✅ Ready for next version"
```

---

**Dernière mise à jour**: 2025-10-23
**Créé par**: Claude & Michel
**Contact**: Michel Deroir
