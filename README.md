# Tableaux d'une exposition

Application web pour créer et partager des souvenirs enrichis avec la famille.

**Version actuelle**: v0.0.0 (En développement)
**Version cible**: v1.0.0 (Production Ready)

---

## 🎯 À Propos

**Tableaux d'une exposition** (en référence à l'œuvre de Moussorgski) est une application web conçue pour permettre à Papiak de créer, enregistrer et partager ses souvenirs sous forme de **capsules mémoires enrichies**. Chaque capsule peut contenir :
- **Texte riche** (formatage, titres, listes, etc.)
- **Photos et vidéos**
- **Narration audio** (la voix du Papiak)
- **Chapitres** (pour structurer les longs récits)
- **Tags** (thèmes: famille, voyage, enfance, etc.)
- **Métadonnées** (année, lieu, personnes mentionnées)

L'application permet aussi à la famille de **liker et commenter** les capsules.

---

## 🛠️ Stack Technique

### Frontend
- **Framework**: Next.js 15 (App Router, React 19, TypeScript 5)
- **Styling**: Tailwind CSS + Radix UI (primitives accessibles)
- **Rich Text**: TipTap (éditeur WYSIWYG)
- **Data Fetching**: TanStack Query v5
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 22+ (Next.js API Routes)
- **Database**: Prisma 6 + SQLite (définitif)
- **Auth**: NextAuth.js v5 (JWT, sessions, rôles)
- **Upload**: Uploadthing (images, vidéos, audio)

### DevOps
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + Testing Library
- **Git Hooks**: Husky (pre-commit checks)

---

## 🚀 Setup Local

### Prérequis
- **Node.js** 22+ ([télécharger](https://nodejs.org))
- **pnpm** 9+ ([installer](https://pnpm.io/installation))

### Installation

```bash
# Clone repository
git clone https://github.com/MatthieuDeroir/ltde.git
cd ltde

# Install dependencies
pnpm install

# Setup database
pnpm exec prisma generate
pnpm exec prisma migrate dev

# Seed database avec données test (4 users, 3 tags, 1 capsule)
pnpm exec prisma db seed

# Start dev server
pnpm dev
```

L'application sera accessible sur **http://localhost:4000**

---

## 📜 Scripts Disponibles

```bash
pnpm dev           # Démarrer serveur dev (http://localhost:4000)
pnpm build         # Build production
pnpm start         # Démarrer production
pnpm lint          # Linter (ESLint)
pnpm lint:fix      # Linter avec auto-fix
pnpm format        # Formatter code (Prettier)
pnpm format:check  # Vérifier formatting
pnpm test          # Tests (Jest)
pnpm test:watch    # Tests en watch mode
pnpm test:coverage # Tests avec coverage
pnpm type-check    # TypeScript check (sans build)
```

---

## 📁 Structure Projet

```
tableaux-exposition/
├── prisma/              # Database schema, migrations, seed
├── app/                 # Next.js App Router (pages, layouts, API routes)
│   ├── (public)/        # Routes publiques (Feed, Capsule Viewer)
│   ├── (protected)/     # Routes protégées (Editor, Admin)
│   ├── api/             # API Routes REST
│   └── login/           # Page login
├── components/          # Composants React
│   ├── ui/              # Radix UI wrappers (Button, Input, Dialog, etc.)
│   ├── capsules/        # CapsuleCard, CapsuleViewer, CapsuleForm
│   ├── editor/          # TipTapEditor, EditorToolbar, EditorSidebar
│   ├── media/           # MediaGrid, MediaCard, MediaLightbox
│   ├── tags/            # TagBadge, TagSelector, TagManager
│   └── layout/          # Header, Footer, Sidebar
├── core/                # Architecture unifiée
│   ├── api/             # HTTP client + TanStack Query hooks
│   ├── schemas/         # Zod schemas (capsule, tag, like, comment)
│   └── design-system/   # Design tokens (colors, typography, spacing)
├── server/              # Server-side code
│   ├── services/        # Service layer (capsulesService, tagsService, etc.)
│   └── auth.ts          # NextAuth config
├── lib/                 # Utilities (db, utils, constants)
├── hooks/               # React hooks (useCapsules, useMedia, useTags)
├── types/               # TypeScript types
└── docs/                # Documentation projet
```

---

## 🔐 Rôles & Permissions

| Feature | VISITOR | READER | EDITOR | ADMIN |
|---------|---------|--------|--------|-------|
| Voir capsules publiées | ✅ | ✅ | ✅ | ✅ |
| S'inscrire | ✅ | ❌ | ❌ | ❌ |
| Liker capsules | ❌ | ✅ | ✅ | ✅ |
| Commenter | ❌ | ✅ | ✅ | ✅ |
| Créer capsules | ❌ | ❌ | ✅ | ✅ |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ✅ |

---

## 📅 Roadmap

### Phase 1 - Fondations (v0.1.0 → v0.5.0) - 4 semaines
- **v0.1.0** (3j): Setup & Infrastructure ✅ **(en cours)**
- **v0.2.0** (5j): Database & Auth
- **v0.3.0** (5j): API Routes & Service Layer
- **v0.4.0** (5j): Design System + Feed Public & Capsule Viewer
- **v0.5.0** (4j): UX Senior-Friendly

### Phase 2 - Core Features (v0.6.0 → v0.8.0) - 3 semaines
- **v0.6.0** (7j): Éditeur TipTap
- **v0.7.0** (5j): Upload Média & Bibliothèque
- **v0.8.0** (5j): Enregistrement Audio (Narration)

### Phase 3 - Polish & Release (v0.9.0 → v1.0.0) - 3 semaines
- **v0.9.0** (5j): Features Sociales (Likes & Comments)
- **v0.10.0** (4j): Recherche Avancée & Tags
- **v0.11.0** (4j): Administration
- **v0.12.0** (4j): Tests & Code Quality (80% coverage, Lighthouse >90)
- **v1.0.0** (5j): Production Release 🚀

**Durée totale**: 10 semaines (~2.5 mois)

Voir [documentation complète](./docs/MEMORIES-ROADMAP.md)

---

## 🧪 Tests

### Comptes Test (Seed Database)

Après avoir exécuté `pnpm exec prisma db seed`, 4 comptes sont créés :

1. **Admin**
   - Email: `admin@tableaux.app`
   - Password: `admin123`
   - Rôle: ADMIN

2. **Papiak (Éditeur)**
   - Email: `grandpere@tableaux.app`
   - Password: `grandpere123`
   - Rôle: EDITOR

3. **Marie (Lectrice)**
   - Email: `marie@tableaux.app`
   - Password: `reader123`
   - Rôle: READER

4. **Jean (Lecteur)**
   - Email: `jean@tableaux.app`
   - Password: `reader123`
   - Rôle: READER

### Accès Prisma Studio

```bash
pnpm exec prisma studio
```

Ouvre une interface web sur http://localhost:5555 pour explorer et éditer la database.

---

## 🎨 Design System - Senior-Friendly

L'interface est conçue pour être **accessible et intuitive** pour les seniors :

- **Texte minimum 18px** (vs 16px standard web)
- **Boutons minimum 60px** de hauteur
- **Contrastes élevés** (WCAG AAA: 4.5:1 minimum)
- **Feedback visuel évident** (gros spinners, borders épaisses, animations claires)
- **Navigation simplifiée** (max 1 niveau de profondeur)
- **Messages clairs** (pas de jargon technique)
- **Mode "Basique"** par défaut (éditeur simplifié)
- **Aide permanente** (bouton aide toujours visible)

---

## 📖 Documentation

- **[Roadmap Complète](./docs/MEMORIES-ROADMAP.md)** - Timeline détaillée v0.1.0 → v1.0.0
- **[Architecture](./docs/MEMORIES-APP-ARCHITECTURE.md)** - Diagrammes, stack, modèle de données
- **[Index](./docs/MEMORIES-INDEX.md)** - Navigation documentation
- **Fiches Versions** (v0.1.0, v0.2.0, v0.3.0, etc.) - Checklists détaillées par version

---

## 🤝 Contribution

Ce projet est développé en collaboration avec **Claude Code** (Anthropic).

### Workflow Git

- **Branche principale**: `main` (production, releases taggées)
- **Branche développement**: `dev` (default)
- **Branches features**: `feature/*` (depuis dev)
- **Branches fixes**: `fix/*` (depuis dev)

### Conventions Commits (Conventional Commits)

```bash
feat(capsules): add rich text editor
fix(auth): resolve login redirect issue
refactor(api): migrate to service layer
docs(readme): update setup instructions
test(capsules): add integration tests
```

---

## 📄 License

MIT License - Copyright (c) 2025 Matthieu Deroir

---

## 🎯 Métriques de Succès v1.0.0

### Techniques
- ✅ Test coverage ≥ 80%
- ✅ Lighthouse scores ≥ 90
- ✅ Zero critical bugs
- ✅ Page load < 2s

### Utilisateur
- ✅ **Papiak crée minimum 1 capsule/semaine**
- ✅ **Papiak enregistre sa voix sur 50%+ capsules**
- ✅ **Famille interagit régulièrement** (likes, comments)
- ✅ **Utilisation autonome** (sans aide technique)

---

**Status**: 🚧 En développement actif (v0.1.0)
**Repository**: https://github.com/MatthieuDeroir/ltde.git
**Créé par**: Matthieu Deroir avec Claude Code
**Date de début**: 2025-10-23
