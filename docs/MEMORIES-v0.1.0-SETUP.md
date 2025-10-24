# v0.1.0 - Setup & Infrastructure

**Date de début**: TBD
**Date de fin**: TBD (Durée: 3 jours)
**Status**: 🔴 Not Started

---

## 🎯 Objectif

Initialiser le projet Memories App avec la stack technique complète et les outils de développement nécessaires.

**Livrables**:
- ✅ Projet Next.js 15 fonctionnel
- ✅ Configuration complète (linting, testing, types)
- ✅ Structure dossiers organisée
- ✅ Documentation initiale (README)

---

## 📋 Checklist Détaillée

### 1. Initialisation Projet Next.js

```bash
# Créer nouveau projet Next.js
pnpm create next-app@latest memories-app --typescript --tailwind --app --use-pnpm

# Options:
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ App Router
# ✅ import alias (@/*)
# ❌ src/ directory (on va l'ajouter manuellement)

cd memories-app
```

#### Checklist
- [ ] Projet initialisé avec Next.js 15
- [ ] TypeScript configuré (strict mode)
- [ ] Tailwind CSS configuré
- [ ] ESLint configuré (next/core-web-vitals)
- [ ] Prettier configuré
- [ ] Import alias `@/*` configuré

---

### 2. Setup Prisma + SQLite

```bash
# Installer Prisma
pnpm add -D prisma
pnpm add @prisma/client

# Initialiser Prisma
pnpm exec prisma init --datasource-provider sqlite
```

#### Fichiers à créer

**`prisma/schema.prisma`** (Initial - simplifié)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Models complets seront ajoutés en v0.2.0
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())

  @@map("users")
}
```

**`.env`**
```bash
DATABASE_URL="file:./dev.db"
```

**`src/lib/db.ts`** (Prisma client singleton)
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### Checklist
- [ ] Prisma installé
- [ ] Schema initial créé
- [ ] `src/lib/db.ts` créé
- [ ] Migration initiale créée: `pnpm exec prisma migrate dev --name init`
- [ ] Prisma client généré: `pnpm exec prisma generate`
- [ ] Test connexion DB réussit

---

### 3. Configuration Radix UI

```bash
# Installer Radix UI primitives
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-slot
pnpm add @radix-ui/react-tooltip @radix-ui/react-tabs @radix-ui/react-separator
pnpm add @radix-ui/react-label @radix-ui/react-select

# Installer utilities
pnpm add class-variance-authority clsx tailwind-merge
pnpm add lucide-react  # Icônes
```

**`src/lib/utils.ts`** (cn helper)
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Checklist
- [ ] Radix UI primitives installés
- [ ] `cn()` utility créé
- [ ] Lucide React installé
- [ ] Test import Radix components réussit

---

### 4. Configuration Testing (Jest + Testing Library)

```bash
# Installer Jest + Testing Library
pnpm add -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D jest-environment-jsdom @types/jest ts-node
```

**`jest.config.js`**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**`jest.setup.js`**
```javascript
import '@testing-library/jest-dom';
```

**`package.json`** (ajout scripts)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Test Initial
**`src/__tests__/example.test.ts`**
```typescript
describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
```

#### Checklist
- [ ] Jest configuré
- [ ] Testing Library installé
- [ ] `jest.config.js` créé
- [ ] `jest.setup.js` créé
- [ ] Scripts test ajoutés à `package.json`
- [ ] Test exemple passe: `pnpm test`

---

### 5. Configuration ESLint & Prettier

**`.eslintrc.json`** (Extended)
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off"
  }
}
```

**`.prettierrc`**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**`.prettierignore`**
```
node_modules
.next
out
dist
build
coverage
*.lock
pnpm-lock.yaml
```

```bash
# Installer Prettier
pnpm add -D prettier eslint-config-prettier
```

**`package.json`** (ajout scripts)
```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit"
  }
}
```

#### Checklist
- [ ] `.eslintrc.json` étendu
- [ ] Prettier configuré
- [ ] Scripts lint/format ajoutés
- [ ] `pnpm lint` passe sans erreur
- [ ] `pnpm format:check` passe

---

### 6. Configuration Husky (Pre-commit Hooks)

```bash
# Installer Husky + lint-staged
pnpm add -D husky lint-staged

# Initialiser Husky
pnpm exec husky init
```

**`.husky/pre-commit`**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

**`package.json`** (ajout lint-staged config)
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

#### Checklist
- [ ] Husky installé
- [ ] Pre-commit hook configuré
- [ ] lint-staged configuré
- [ ] Test commit déclenche hooks

---

### 7. Structure Dossiers

Créer l'arborescence complète du projet :

```bash
mkdir -p src/{app,components,core,server,lib,hooks,types}
mkdir -p src/components/{ui,capsules,editor,media,tags,layout}
mkdir -p src/core/{api,schemas,design-system}
mkdir -p src/server/services
mkdir -p prisma/migrations
mkdir -p public/{fonts,images}
```

**Arborescence finale**:
```
memories-app/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts (v0.2.0)
├── public/
│   ├── fonts/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/ (v0.3.0)
│   ├── components/
│   │   ├── ui/
│   │   ├── capsules/
│   │   ├── editor/
│   │   ├── media/
│   │   ├── tags/
│   │   └── layout/
│   ├── core/
│   │   ├── api/
│   │   │   └── client.ts (v0.3.0)
│   │   ├── schemas/ (v0.3.0)
│   │   └── design-system/ (v0.5.0)
│   ├── server/
│   │   ├── services/ (v0.3.0)
│   │   └── auth.ts (v0.2.0)
│   ├── lib/
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/ (v0.4.0+)
│   ├── types/ (v0.2.0+)
│   └── __tests__/
├── .env
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── jest.config.js
├── jest.setup.js
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md
```

#### Checklist
- [ ] Structure dossiers créée
- [ ] Tous les dossiers existent
- [ ] `.gitkeep` dans dossiers vides (pour Git)

---

### 8. Configuration Environment Variables

**`.env`**
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth (v0.2.0)
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-here"

# Uploadthing (v0.7.0)
# UPLOADTHING_SECRET=""
# UPLOADTHING_APP_ID=""
```

**`.env.example`** (template pour documentation)
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth (à configurer en v0.2.0)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Uploadthing (à configurer en v0.7.0)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

#### Checklist
- [ ] `.env` créé (avec DATABASE_URL)
- [ ] `.env.example` créé
- [ ] `.gitignore` contient `.env`

---

### 9. Configuration Git

```bash
# Initialiser Git
git init

# Créer branches
git checkout -b main
git checkout -b dev
```

**`.gitignore`** (Extended)
```
# dependencies
node_modules
.pnpm-store

# next.js
/.next/
/out/
/build

# testing
/coverage
*.log

# database
*.db
*.db-journal
prisma/dev.db
prisma/dev.db-journal

# env
.env
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# misc
.DS_Store
*.pem
```

#### Checklist
- [ ] Git initialisé
- [ ] Branches `main` et `dev` créées
- [ ] `.gitignore` complet
- [ ] Commit initial créé

---

### 10. Documentation Initiale

**`README.md`**
```markdown
# Capsules Mémoires (Memories App)

Application web pour créer et partager des souvenirs enrichis.

## Stack Technique

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Prisma, SQLite, NextAuth.js
- **Testing**: Jest, Testing Library
- **Deployment**: Vercel

## Setup Local

### Prérequis
- Node.js 22+
- pnpm 9+

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/your-username/memories-app.git
cd memories-app

# Install dependencies
pnpm install

# Setup database
pnpm exec prisma generate
pnpm exec prisma migrate dev

# Start dev server
pnpm dev
\`\`\`

L'application sera accessible sur http://localhost:3000

## Scripts Disponibles

\`\`\`bash
pnpm dev          # Démarrer serveur dev
pnpm build        # Build production
pnpm start        # Démarrer production
pnpm lint         # Linter
pnpm lint:fix     # Linter avec auto-fix
pnpm format       # Formatter code
pnpm test         # Tests
pnpm test:watch   # Tests en watch mode
pnpm test:coverage # Tests avec coverage
pnpm type-check   # TypeScript check
\`\`\`

## Structure Projet

\`\`\`
src/
├── app/          # Next.js App Router
├── components/   # Composants React
├── core/         # Architecture unifiée
├── server/       # Server-side code
├── lib/          # Utilities
└── hooks/        # React hooks
\`\`\`

## Roadmap

Voir [ROADMAP.md](docs/MEMORIES-ROADMAP.md)

## License

MIT
```

**`CHANGELOG.md`**
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

## [0.1.0] - TBD

### Added
- Next.js 15 project initialization
- TypeScript strict mode configuration
- Tailwind CSS + Radix UI setup
- Prisma + SQLite configuration
- Jest + Testing Library setup
- ESLint + Prettier configuration
- Husky pre-commit hooks
- Project structure
- Initial documentation (README, ROADMAP, CHANGELOG)
```

#### Checklist
- [ ] `README.md` créé
- [ ] `CHANGELOG.md` créé
- [ ] Documentation claire et complète

---

## ✅ Critères de Validation v0.1.0

### Tests Automatiques
```bash
# 1. Linting
pnpm lint              # ✅ 0 erreurs, 0 warnings

# 2. Type checking
pnpm type-check        # ✅ 0 erreurs TypeScript

# 3. Tests
pnpm test              # ✅ Tous tests passent

# 4. Build
pnpm build             # ✅ Build réussit sans erreur

# 5. Dev server
pnpm dev               # ✅ Démarre sur http://localhost:3000
```

### Checklist Manuelle
- [ ] Page d'accueil Next.js s'affiche (localhost:3000)
- [ ] Tailwind CSS fonctionne (styles appliqués)
- [ ] ESLint détecte les erreurs
- [ ] Prettier formate le code
- [ ] Pre-commit hook empêche commit avec erreurs
- [ ] Prisma Studio fonctionne: `pnpm exec prisma studio`
- [ ] Structure dossiers complète
- [ ] README clair et complet
- [ ] `.env.example` documenté
- [ ] Git branches `main` et `dev` créées

### Validation Documentation
- [ ] README explique setup local
- [ ] CHANGELOG initialisé
- [ ] ROADMAP créée et détaillée
- [ ] Architecture documentée

---

## 📦 Commit & Tag Release

```bash
# S'assurer d'être sur dev
git checkout dev

# Commit tous les fichiers
git add .
git commit -m "feat: initialize project with Next.js 15 and full stack setup

- Next.js 15 + TypeScript strict mode
- Tailwind CSS + Radix UI
- Prisma + SQLite
- Jest + Testing Library
- ESLint + Prettier + Husky
- Project structure
- Initial documentation

BREAKING CHANGE: Initial release v0.1.0"

# Merge dans main
git checkout main
git merge dev

# Tag release
git tag -a v0.1.0 -m "Release v0.1.0 - Setup & Infrastructure

✅ Next.js 15 project initialized
✅ Full development environment configured
✅ Documentation created
✅ Ready for v0.2.0 (Database & Auth)"

# Push
git push origin main
git push origin dev
git push origin v0.1.0
```

---

## 🔄 Prochaines Étapes

Une fois v0.1.0 validée et taggée :

➡️ **Passer à v0.2.0 - Database & Auth**
- Schéma Prisma complet
- NextAuth.js setup
- Pages login/signup
- Services auth

---

**Version**: v0.1.0
**Status**: 🔴 Not Started
**Durée estimée**: 3 jours
**Prérequis**: Aucun
**Dépendances**: Aucune
**Next**: v0.2.0 - Database & Auth
