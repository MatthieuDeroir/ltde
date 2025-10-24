# Architecture Document - Capsules Mémoires (Memories App)

**Date**: 2025-10-23
**Version**: 1.0.0
**Inspiré de**: Flow v0.4.6 Architecture

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Stack Technique](#stack-technique)
3. [Architecture Système](#architecture-système)
4. [Modèle de Données](#modèle-de-données)
5. [Rôles & Permissions](#rôles--permissions)
6. [Features Principales](#features-principales)
7. [Structure du Projet](#structure-du-projet)
8. [Design System](#design-system)
9. [API Routes](#api-routes)
10. [Workflow Développement](#workflow-développement)

---

## 🎯 Vue d'Ensemble

### Objectif
Application web permettant à votre grand-père d'enregistrer et partager ses souvenirs sous forme de "capsules mémoires" enrichies (texte, photos, vidéos, musique).

### Personas

#### 1. Visiteur (Non connecté)
- **Besoin**: Découvrir et lire les souvenirs partagés
- **Actions**: Navigation feed, lecture capsules, filtrage par tags
- **Accès**: Lecture seule
- **Limitations**: Ne peut pas liker ni commenter

#### 2. Lecteur (Connecté - famille/amis)
- **Besoin**: Suivre les souvenirs, interagir avec le contenu
- **Actions**: Tout ce que le visiteur peut faire + liker + commenter
- **Accès**: Lecture + interactions sociales
- **Création compte**: Inscription libre avec email + mot de passe

#### 3. Rédacteur (Grand-père)
- **Besoin**: Créer et éditer ses souvenirs de manière riche et structurée
- **Actions**: CRUD capsules, upload média, gestion tags + interactions sociales
- **Accès**: Ses propres capsules + peut liker/commenter toutes capsules

#### 4. Admin (Vous)
- **Besoin**: Gérer l'application, modérer contenu, gérer utilisateurs
- **Actions**: Toutes permissions, gestion utilisateurs, modération commentaires
- **Accès**: Toutes capsules et paramètres + modération complète

### Différences avec Flow
✅ **Gardé de Flow**:
- Architecture Next.js App Router
- Prisma + SQLite
- TanStack Query pour data fetching
- Design system Radix UI + Tailwind
- Service layer pattern
- Zod validations

❌ **Retiré de Flow**:
- Offline-first (DataCache, SyncQueue, Service Worker)
- Extension Chrome
- Tauri desktop app
- Analytics complexes
- Multi-utilisateurs étendu (seulement 3 rôles)
- Tracking quotidien (mood, sleep, etc.)
- Relax hub & jeux

✨ **Ajouté pour Memories**:
- Rich text editor (TipTap / Lexical)
- Upload & gestion média (images, vidéos, audio)
- Timeline chronologique
- Système de chapitres/sections
- Partage public/privé par capsule
- Export PDF des capsules
- **Inscription visiteurs** (création compte)
- **Système de likes** sur capsules
- **Système de commentaires** sur capsules
- **Interactions sociales** (engagement communautaire)

---

## 🛠️ Stack Technique

### Frontend
| Couche | Technologie | Détails |
|--------|-------------|---------|
| **Framework** | Next.js 15 | App Router, React Server Components |
| **Language** | TypeScript 5.x | Strict mode |
| **Styling** | Tailwind CSS | + Radix UI colors |
| **Components** | Radix UI | Primitives accessibles |
| **Animations** | Framer Motion | Transitions fluides |
| **Rich Text** | TipTap | Éditeur WYSIWYG extensible |
| **Forms** | React Hook Form | + Zod validation |
| **Data Fetching** | TanStack Query v5 | Cache, mutations, optimistic updates |
| **Dates** | date-fns | Manipulation dates françaises |

### Backend
| Couche | Technologie | Détails |
|--------|-------------|---------|
| **Runtime** | Node.js 22+ | Via Next.js API Routes |
| **ORM** | Prisma 6.x | SQLite (migration Postgres future) |
| **Validation** | Zod | Schemas partagés front/back |
| **Auth** | NextAuth.js v5 | JWT, sessions, rôles |
| **Upload** | Uploadthing | Gestion fichiers (images/vidéos/audio) |
| **Storage** | SQLite | Base de données locale |
| **Média Storage** | Uploadthing CDN | Images, vidéos, audio |

### DevOps
| Outil | Usage |
|-------|-------|
| **Package Manager** | pnpm | Workspace, performances |
| **Linting** | ESLint + Prettier | Code quality |
| **Testing** | Jest + Testing Library | Unit + Integration |
| **Type Checking** | TypeScript | Build-time validation |
| **Git Hooks** | Husky | Pre-commit checks |

---

## 🏗️ Architecture Système

### Diagramme Général

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Feed Page   │  │ Capsule Page │  │ Editor Page  │      │
│  │  (Public)    │  │  (Public)    │  │ (Protected)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘               │
│                            │                                  │
│                   ┌────────▼─────────┐                       │
│                   │  TanStack Query  │                       │
│                   │  (Client Cache)  │                       │
│                   └────────┬─────────┘                       │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                    HTTP (fetch)
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                    SERVER (Next.js App Router)                 │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                   API Routes                          │    │
│  │  /api/capsules      /api/media      /api/auth       │    │
│  └───────────────────┬──────────────────────────────────┘    │
│                      │                                        │
│  ┌───────────────────▼──────────────────────────────────┐    │
│  │              Service Layer (Business Logic)           │    │
│  │  capsulesService  mediaService  authService          │    │
│  └───────────────────┬──────────────────────────────────┘    │
│                      │                                        │
│  ┌───────────────────▼──────────────────────────────────┐    │
│  │                  Prisma ORM                           │    │
│  └───────────────────┬──────────────────────────────────┘    │
│                      │                                        │
└──────────────────────┼────────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────────┐
│                    DATABASE (SQLite)                          │
│  Tables: User, Capsule, Media, Tag, CapsuleTag               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                             │
│  Uploadthing CDN (Images, Videos, Audio)                     │
└───────────────────────────────────────────────────────────────┘
```

### Pattern Architectural

**Inspiré de Flow v0.4.6**:
1. **3-Layer Architecture**:
   - **UI Layer** (`app/`, `components/`) - Pages & composants React
   - **API Layer** (`app/api/`) - Routes REST-like
   - **Service Layer** (`server/services/`) - Logique métier + accès DB

2. **Data Flow**:
   ```
   User Interaction
        ↓
   React Component
        ↓
   TanStack Query Hook (useCapsulesQuery)
        ↓
   API Client (@/core/api/client)
        ↓
   API Route (/api/capsules)
        ↓
   Service (capsulesService.ts)
        ↓
   Prisma ORM
        ↓
   SQLite Database
   ```

3. **Type Safety Flow**:
   ```
   Prisma Schema (source of truth)
        ↓
   Generated Prisma Types
        ↓
   Zod Schemas (validation)
        ↓
   TypeScript Types (inference)
        ↓
   API Responses & UI
   ```

---

## 🗄️ Modèle de Données

### Schéma Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ============================================================================
// User & Auth
// ============================================================================

enum UserRole {
  VISITOR   // Non connecté (lecture seule) - pas stocké en DB
  READER    // Lecteur (famille/amis - peut liker et commenter)
  EDITOR    // Rédacteur (grand-père)
  ADMIN     // Administrateur (vous)
}

model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String
  role          UserRole  @default(READER)

  // Metadata
  displayName   String?
  avatar        String?   // URL Uploadthing
  bio           String?

  // Relations
  capsules      Capsule[]
  likes         Like[]
  comments      Comment[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

// ============================================================================
// Capsules (Souvenirs)
// ============================================================================

enum CapsuleStatus {
  DRAFT       // Brouillon (non publié)
  PUBLISHED   // Publié (visible visiteurs)
  ARCHIVED    // Archivé (non visible)
}

model Capsule {
  id            String        @id @default(cuid())
  userId        String

  // Contenu
  title         String
  content       String        // Rich text HTML (TipTap)
  excerpt       String?       // Résumé pour le feed (auto-généré ou manuel)

  // Média principal
  coverImage    String?       // URL Uploadthing (bannière)

  // Organisation
  status        CapsuleStatus @default(DRAFT)
  publishedAt   DateTime?

  // Metadata
  year          Int?          // Année du souvenir (ex: 1965)
  location      String?       // Lieu (ex: "Paris, France")
  people        String?       // Personnes mentionnées (JSON array)

  // Relations
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  media         Media[]
  tags          CapsuleTag[]
  chapters      Chapter[]
  likes         Like[]
  comments      Comment[]

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([userId])
  @@index([status])
  @@index([publishedAt])
  @@map("capsules")
}

// ============================================================================
// Chapitres (Sections)
// ============================================================================

model Chapter {
  id            String    @id @default(cuid())
  capsuleId     String

  title         String
  content       String    // Rich text HTML
  order         Int       // Position dans la capsule

  // Relations
  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([capsuleId])
  @@map("chapters")
}

// ============================================================================
// Média (Images, Vidéos, Audio)
// ============================================================================

enum MediaType {
  IMAGE
  VIDEO
  AUDIO
}

model Media {
  id            String    @id @default(cuid())
  capsuleId     String

  type          MediaType
  url           String    // URL Uploadthing
  filename      String
  mimeType      String
  size          Int       // Bytes

  // Metadata
  caption       String?
  altText       String?
  order         Int?      // Position dans la capsule

  // Relations
  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())

  @@index([capsuleId])
  @@index([type])
  @@map("media")
}

// ============================================================================
// Tags (Thèmes)
// ============================================================================

model Tag {
  id            String        @id @default(cuid())

  name          String        @unique
  slug          String        @unique
  color         String?       // Hex color pour UI
  description   String?

  // Relations
  capsules      CapsuleTag[]

  createdAt     DateTime      @default(now())

  @@map("tags")
}

model CapsuleTag {
  capsuleId     String
  tagId         String

  capsule       Capsule       @relation(fields: [capsuleId], references: [id], onDelete: Cascade)
  tag           Tag           @relation(fields: [tagId], references: [id], onDelete: Cascade)

  createdAt     DateTime      @default(now())

  @@id([capsuleId, tagId])
  @@map("capsule_tags")
}

// ============================================================================
// Interactions Sociales
// ============================================================================

model Like {
  id            String    @id @default(cuid())
  userId        String
  capsuleId     String

  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())

  @@unique([userId, capsuleId])  // Un user ne peut liker qu'une fois
  @@index([capsuleId])
  @@index([userId])
  @@map("likes")
}

model Comment {
  id            String    @id @default(cuid())
  userId        String
  capsuleId     String

  content       String    // Texte du commentaire
  parentId      String?   // ID du commentaire parent (pour réponses)

  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies       Comment[] @relation("CommentReplies")

  // Modération
  isEdited      Boolean   @default(false)
  isDeleted     Boolean   @default(false)  // Soft delete
  deletedAt     DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([capsuleId])
  @@index([userId])
  @@index([parentId])
  @@map("comments")
}

// ============================================================================
// Configuration
// ============================================================================

model AppConfig {
  id            String    @id @default(cuid())

  key           String    @unique
  value         String    // JSON stringified

  updatedAt     DateTime  @updatedAt

  @@map("app_config")
}
```

### Relations

```
User 1──────────* Capsule
User 1──────────* Like
User 1──────────* Comment

Capsule 1───────* Media
Capsule 1───────* Chapter
Capsule 1───────* Like
Capsule 1───────* Comment
Capsule *───────* Tag (via CapsuleTag)

Comment 1───────* Comment (replies - self-referencing)
```

---

## 🔐 Rôles & Permissions

### Matrice de Permissions

| Feature | VISITOR | READER | EDITOR | ADMIN |
|---------|---------|--------|--------|-------|
| **Inscription & Compte** |
| Créer un compte | ✅ | ❌ | ❌ | ❌ |
| Se connecter | ✅ | ✅ | ✅ | ✅ |
| **Capsules** |
| Voir capsules publiées | ✅ | ✅ | ✅ | ✅ |
| Voir brouillons | ❌ | ❌ | ✅ (ses propres) | ✅ (tous) |
| Créer capsule | ❌ | ❌ | ✅ | ✅ |
| Éditer capsule | ❌ | ❌ | ✅ (ses propres) | ✅ (tous) |
| Supprimer capsule | ❌ | ❌ | ✅ (ses propres) | ✅ (tous) |
| Publier capsule | ❌ | ❌ | ✅ | ✅ |
| **Interactions Sociales** |
| Liker capsules | ❌ | ✅ | ✅ | ✅ |
| Retirer son like | ❌ | ✅ | ✅ | ✅ |
| Commenter capsules | ❌ | ✅ | ✅ | ✅ |
| Éditer son commentaire | ❌ | ✅ | ✅ | ✅ |
| Supprimer son commentaire | ❌ | ✅ | ✅ | ✅ |
| Répondre à commentaires | ❌ | ✅ | ✅ | ✅ |
| Supprimer commentaires autres | ❌ | ❌ | ❌ | ✅ |
| Voir likes (qui a liké) | ✅ | ✅ | ✅ | ✅ |
| Voir commentaires | ✅ | ✅ | ✅ | ✅ |
| **Média** |
| Upload fichiers | ❌ | ❌ | ✅ | ✅ |
| Gérer bibliothèque | ❌ | ❌ | ✅ (ses fichiers) | ✅ (tous) |
| **Tags** |
| Voir tags | ✅ | ✅ | ✅ | ✅ |
| Créer tags | ❌ | ❌ | ✅ | ✅ |
| Modifier tags | ❌ | ❌ | ❌ | ✅ |
| Supprimer tags | ❌ | ❌ | ❌ | ✅ |
| **Utilisateurs** |
| Voir profil | ✅ | ✅ | ✅ | ✅ |
| Modifier profil | ❌ | ✅ (le sien) | ✅ (le sien) | ✅ (tous) |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ✅ |
| **Configuration** |
| Voir paramètres | ❌ | ❌ | ❌ | ✅ |
| Modifier paramètres | ❌ | ❌ | ❌ | ✅ |

### Middleware Auth

```typescript
// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/editor/:path*",
    "/admin/:path*",
    "/api/capsules/:path*",
  ],
}
```

### Route Protection

```typescript
// app/editor/layout.tsx
export default async function EditorLayout({ children }) {
  const session = await auth();

  if (!session || session.user.role === 'VISITOR') {
    redirect('/login');
  }

  return <>{children}</>;
}

// app/admin/layout.tsx
export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return <>{children}</>;
}
```

---

## 🎨 Features Principales

### 1. Feed Public (/)

**Pour**: Visiteurs + tous utilisateurs
**Layout**: Timeline chronologique avec cards compactes

#### Composants:
```
<FeedPage>
  ├─ <FeedHeader> (titre, filtres tags)
  ├─ <FeedFilters> (recherche, tri, tags)
  └─ <FeedGrid>
      └─ <CapsuleCard>[] (liste paginée)
```

#### CapsuleCard:
- **Affichage**:
  - Cover image (bannière)
  - Titre
  - Excerpt (résumé 150 chars)
  - Tags (badges colorés)
  - Date/Année
  - Auteur (nom + avatar)
- **Actions**:
  - Click → Ouvre capsule (modal ou page)
  - Hover → Preview plus long

#### Fonctionnalités:
- ✅ Pagination infinie (TanStack Query infinite scroll)
- ✅ Filtres: par tag, année, auteur
- ✅ Tri: date publication, année souvenir, alphabétique
- ✅ **Recherche avancée** (voir section dédiée ci-dessous)
- ✅ Responsive grid (1/2/3 colonnes selon viewport)

---

### 2. Capsule Viewer (/capsule/[id])

**Pour**: Tous utilisateurs
**Layout**: Page complète immersive

#### Composants:
```
<CapsulePage>
  ├─ <CapsuleHeader>
  │   ├─ Cover image (hero banner)
  │   ├─ Titre (H1)
  │   ├─ Metadata (date, lieu, personnes)
  │   └─ Tags
  ├─ <CapsuleContent>
  │   ├─ Rich text content (TipTap read-only)
  │   └─ Embedded media (images/videos inline)
  ├─ <CapsuleChapters>? (si présents)
  │   └─ <ChapterSection>[]
  ├─ <MediaGallery>
  │   └─ <MediaItem>[] (lightbox)
  └─ <MusicPlayer>? (si audio attaché)
      └─ <AudioControls>
```

#### Fonctionnalités:
- ✅ Rendu HTML riche (TipTap content)
- ✅ Galerie images avec lightbox (Photoswipe)
- ✅ Player vidéo intégré (HTML5)
- ✅ Player audio sticky (reste visible en scroll)
- ✅ Table des matières (si chapitres)
- ✅ Scroll spy (highlight chapitre actif)
- ✅ Partage (URL copy, réseaux sociaux)
- ✅ Export PDF (pour ADMIN/EDITOR)
- ✅ Navigation prev/next capsule

---

### 3. Éditeur de Capsules (/editor)

**Pour**: EDITOR + ADMIN
**Layout**: Full-screen editor avec sidebar

#### Composants:
```
<EditorPage>
  ├─ <EditorToolbar>
  │   ├─ Format buttons (bold, italic, headings...)
  │   ├─ Media insert (image, video, audio)
  │   ├─ Link insert
  │   └─ Actions (save, publish, preview)
  ├─ <EditorSidebar>
  │   ├─ <CapsuleSettings>
  │   │   ├─ Titre
  │   │   ├─ Status (draft/published)
  │   │   ├─ Cover image upload
  │   │   ├─ Date/Année
  │   │   ├─ Lieu
  │   │   └─ Personnes
  │   ├─ <TagsManager>
  │   │   └─ Tag selection (autocomplete)
  │   └─ <ChaptersManager>
  │       └─ Chapitres list (reorderable)
  └─ <TipTapEditor>
      └─ Rich text editing area
```

#### TipTap Extensions:
```typescript
const extensions = [
  StarterKit, // Headings, Bold, Italic, Lists, etc.
  Image.configure({ inline: true }),
  Link,
  TextAlign,
  Typography,
  Placeholder,
  CharacterCount,
  Color,
  FontFamily,
  Highlight,
  Underline,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Youtube, // Embed YouTube videos
  CodeBlock,
]
```

#### Fonctionnalités:
- ✅ **Formatage riche**:
  - Titres (H1-H6)
  - Gras, italique, souligné
  - Listes (ordonnées, non-ordonnées)
  - Citations
  - Code blocks
  - Tableaux
- ✅ **Typographie**:
  - Changement de police (serif, sans-serif, mono)
  - Taille de texte
  - Couleurs
  - Alignement (gauche, centre, droite, justifié)
  - Espacement lignes
- ✅ **Média intégré**:
  - Glisser-déposer images
  - Upload vidéos (max 100MB)
  - Upload audio (max 50MB)
  - Embed YouTube/Vimeo
  - Resize & crop images
- ✅ **Chapitres**:
  - Créer sections
  - Réorganiser ordre (drag & drop)
  - Éditer par chapitre
- ✅ **Auto-save**:
  - Sauvegarde automatique toutes les 30s
  - Indicateur "Saved" / "Saving..."
  - Récupération brouillon (localStorage backup)
- ✅ **Preview**:
  - Mode aperçu (WYSIWYG)
  - Mode mobile responsive
- ✅ **Validation**:
  - Titre requis
  - Longueur min/max
  - Taille fichiers
  - Format médias acceptés

---

### 4. Bibliothèque Média (/editor/media)

**Pour**: EDITOR + ADMIN
**Layout**: Grid de médias avec filtres

#### Composants:
```
<MediaLibrary>
  ├─ <MediaHeader>
  │   ├─ Upload button
  │   └─ Filtres (type, date)
  ├─ <MediaGrid>
  │   └─ <MediaCard>[]
  │       ├─ Thumbnail
  │       ├─ Filename
  │       ├─ Type badge
  │       ├─ Size
  │       └─ Actions (insert, delete)
  └─ <MediaUploader>
      └─ Dropzone (Uploadthing)
```

#### Fonctionnalités:
- ✅ Upload multiple files
- ✅ Preview avant upload
- ✅ Barre de progression
- ✅ Filtres: type, date, capsule
- ✅ Recherche par nom
- ✅ Tri: date, taille, nom
- ✅ Sélection multiple
- ✅ Suppression batch
- ✅ Copier URL
- ✅ Insertion directe dans editor

#### Limites Uploadthing:
- Images: JPEG, PNG, GIF, WEBP (max 10MB)
- Vidéos: MP4, WEBM (max 100MB)
- Audio: MP3, WAV, OGG (max 50MB)

---

### 5. Gestion Tags (/editor/tags)

**Pour**: EDITOR (voir/utiliser) + ADMIN (CRUD)

#### Composants:
```
<TagsManager>
  ├─ <TagsHeader>
  │   └─ Create button (ADMIN only)
  ├─ <TagsList>
  │   └─ <TagItem>[]
  │       ├─ Color badge
  │       ├─ Nom
  │       ├─ Description
  │       ├─ Capsules count
  │       └─ Actions (edit, delete - ADMIN only)
  └─ <TagForm> (modal)
      ├─ Nom
      ├─ Slug (auto-généré)
      ├─ Couleur (color picker)
      └─ Description
```

#### Fonctionnalités:
- ✅ CRUD complet (ADMIN)
- ✅ Color picker (Radix UI)
- ✅ Auto-slug generation
- ✅ Usage count
- ✅ Recherche tags
- ✅ Fusion tags (ADMIN)
- ✅ Suppression avec réassignation

---

### 6. Recherche Avancée

**Pour**: Tous utilisateurs
**Localisation**: Barre de recherche dans header + page dédiée

#### Composants:
```
<SearchBar>
  ├─ <SearchInput>
  │   ├─ Icône loupe
  │   ├─ Input texte (placeholder: "Rechercher un souvenir...")
  │   └─ Bouton effacer (×)
  ├─ <SearchSuggestions> (dropdown)
  │   ├─ Résultats récents
  │   ├─ Tags suggérés
  │   └─ Années suggérées
  └─ <SearchResults>
      └─ <CapsuleCard>[] (résultats paginés)
```

#### Fonctionnalités:
- ✅ **Recherche par titre**:
  - Recherche full-text dans titres de capsules
  - Surlignage des mots-clés trouvés
  - Suggestions auto-complètes pendant la frappe
- ✅ **Recherche dans contenu**:
  - Recherche dans excerpt (résumé)
  - Recherche dans contenu complet (chapitres inclus)
  - Recherche dans noms de lieux et personnes
- ✅ **Filtres combinés**:
  - Recherche + filtres tags
  - Recherche + plage d'années
  - Recherche + auteur (si multi-utilisateurs)
- ✅ **Historique de recherche**:
  - Sauvegarde des 10 dernières recherches
  - Clear historique
- ✅ **Raccourcis clavier**:
  - `Ctrl/Cmd + K` : Focus recherche
  - `Esc` : Fermer résultats
- ✅ **Feedback visuel**:
  - Nombre de résultats trouvés
  - Message si aucun résultat
  - Loading state pendant la recherche
  - Tri par pertinence (score)

#### Implémentation technique:
```typescript
// Service de recherche
async function searchCapsules(query: string, filters?: SearchFilters) {
  return await prisma.capsule.findMany({
    where: {
      status: 'PUBLISHED',
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
          ],
        },
        // Filtres additionnels (tags, années, etc.)
      ],
    },
    include: {
      tags: true,
      user: { select: { displayName: true, avatar: true } },
    },
    orderBy: { publishedAt: 'desc' },
  });
}
```

#### UX Grand-père friendly:
- 🎯 **Barre de recherche TRÈS visible** (header, taille XL)
- 🎯 **Texte placeholder explicite** ("Chercher un souvenir par son titre...")
- 🎯 **Suggestions visuelles** avec icônes (🏷️ tags, 📅 années, 📝 titres)
- 🎯 **Résultats avec contexte** (afficher la phrase contenant le mot recherché)

---

### 7. Enregistrement Audio (Narration)

**Pour**: EDITOR + ADMIN
**Localisation**: Intégré dans l'éditeur de capsules

#### Concept
Permettre au grand-père de **s'enregistrer en train de lire** sa capsule ou d'**ajouter des commentaires audio** pour enrichir le souvenir avec sa voix.

#### Composants:
```
<AudioRecorder>
  ├─ <RecorderControls>
  │   ├─ Bouton Record (gros, rouge, icône micro)
  │   ├─ Bouton Pause (jaune)
  │   ├─ Bouton Stop (gris)
  │   └─ Timer (durée enregistrement)
  ├─ <WaveformVisualizer>
  │   └─ Animation onde sonore en temps réel
  ├─ <RecordingPreview>
  │   ├─ Lecteur audio (play, pause, timeline)
  │   ├─ Bouton "Réessayer" (⟲)
  │   └─ Bouton "Utiliser cet enregistrement" (✓)
  └─ <RecordingsList>
      └─ <AudioRecordingCard>[]
          ├─ Titre (ex: "Narration principale")
          ├─ Durée
          ├─ Date création
          └─ Actions (écouter, supprimer, télécharger)
```

#### Fonctionnalités:
- ✅ **Enregistrement direct navigateur**:
  - Web Audio API / MediaRecorder
  - Détection micro automatique
  - Demande permission micro (une seule fois)
  - Indicateur visuel d'enregistrement en cours (rouge pulsant)
- ✅ **Contrôles simples**:
  - 🔴 **Enregistrer** : Lance l'enregistrement
  - ⏸️ **Pause** : Met en pause (reprend à la même position)
  - ⏹️ **Arrêter** : Termine et sauvegarde
  - 🔄 **Recommencer** : Efface et recommence
- ✅ **Visualisation en temps réel**:
  - Waveform animée (onde sonore)
  - Timer visible (00:00 / durée max)
  - Niveau volume (barre)
- ✅ **Preview avant sauvegarde**:
  - Écouter l'enregistrement
  - Voir la waveform complète
  - Option "Recommencer" ou "Valider"
- ✅ **Gestion multiple enregistrements**:
  - Plusieurs enregistrements par capsule possibles
  - Nommer chaque enregistrement (ex: "Introduction", "Chapitre 1", "Anecdote finale")
  - Réordonner par drag & drop
  - Choisir l'enregistrement "principal" (joué automatiquement)
- ✅ **Limites techniques**:
  - Durée max: 30 minutes par enregistrement
  - Format: WAV ou MP3 (compression automatique)
  - Taille max: 50MB par fichier
  - Stockage: Uploadthing (comme images/vidéos)
- ✅ **Détection qualité**:
  - Alerte si micro trop faible
  - Alerte si bruit de fond important
  - Suggestion "Rapprochez-vous du micro"

#### Implémentation technique:
```typescript
// Hook d'enregistrement audio
function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Timer
      const interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error('Erreur accès micro:', error);
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setIsPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setIsPaused(false);
  };

  return {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
}
```

#### UX Grand-père friendly:
- 🎯 **Boutons TRÈS GROS** (min 80px hauteur)
- 🎯 **Icônes + Labels clairs** ("Enregistrer ma voix", pas juste un icône micro)
- 🎯 **Feedback visuel évident**:
  - Micro qui pulse en rouge pendant l'enregistrement
  - Message "Enregistrement en cours..." bien visible
  - Timer avec gros chiffres (24px+)
- 🎯 **Instructions pas-à-pas**:
  - Tooltip "Cliquez ici pour enregistrer votre voix"
  - Guide vocal (optionnel): "Prêt? Cliquez sur Enregistrer"
- 🎯 **Validation claire**:
  - "Voulez-vous garder cet enregistrement?" (Oui/Non)
  - Preview obligatoire avant validation
- 🎯 **Pas de jargon technique**:
  - "Enregistrer ma voix" au lieu de "Record audio"
  - "Recommencer" au lieu de "Reset"
  - "Écouter" au lieu de "Play"

#### Placement dans l'éditeur:
```
<EditorPage>
  ├─ <EditorToolbar> (en haut)
  │   └─ Bouton "🎤 Enregistrer ma voix" (destacado)
  ├─ <EditorSidebar> (à droite)
  │   ├─ <CapsuleSettings>
  │   ├─ <AudioRecorder> ← ICI (section dédiée)
  │   │   └─ Liste enregistrements + contrôles
  │   ├─ <TagsManager>
  │   └─ <ChaptersManager>
  └─ <TipTapEditor>
```

---

### 8. Design UX Senior-Friendly

**Objectif**: Interface **accessible et intuitive** pour une personne âgée, même si elle n'est pas familière avec les outils numériques.

#### Principes de Design

##### 1. Typographie & Lisibilité
```typescript
// Tailles de texte augmentées
const seniorTypography = {
  // Texte courant
  base: '18px',      // Au lieu de 16px (standard web)

  // Titres
  h1: '48px',        // Très gros
  h2: '36px',
  h3: '28px',

  // Boutons
  button: '20px',    // Labels boutons bien lisibles

  // Hints/tooltips
  hint: '16px',      // Pas trop petit

  // Line-height généreux
  lineHeight: 1.8,   // Plus d'espace entre lignes
}

// Police sans-serif lisible
fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'

// Poids léger à moyen (éviter bold excessif)
fontWeight: 400 (normal) ou 500 (medium)
```

##### 2. Contraste & Couleurs
```typescript
// Contrastes élevés (WCAG AAA)
const seniorColors = {
  // Texte sur fond blanc
  textPrimary: '#1a1a1a',        // Presque noir
  textSecondary: '#4a4a4a',      // Gris foncé

  // Fond
  background: '#ffffff',          // Blanc pur

  // Boutons primaires
  primary: {
    background: '#2563eb',        // Bleu vif
    text: '#ffffff',              // Blanc
    hover: '#1e40af',             // Bleu plus foncé
  },

  // Boutons danger
  danger: {
    background: '#dc2626',        // Rouge vif
    text: '#ffffff',
  },

  // Success
  success: {
    background: '#16a34a',        // Vert vif
    text: '#ffffff',
  },

  // Éviter les couleurs pastel (faible contraste)
  // Éviter les gris clairs pour le texte
}
```

##### 3. Taille des Zones Cliquables
```typescript
// Boutons et liens
const minTouchTarget = {
  width: '48px',     // Min WCAG
  height: '48px',    // Min WCAG

  // Idéalement pour seniors
  ideal: '60px',     // Plus confortable

  // Espacement entre cibles
  margin: '16px',    // Éviter clics accidentels
}

// Exemple bouton
<Button>
  min-height: 60px
  min-width: 120px
  padding: 16px 32px
  font-size: 20px
  gap: 12px (entre icône et texte)
</Button>
```

##### 4. Feedback Visuel Évident
```typescript
// États interactifs
const visualFeedback = {
  // Hover
  hover: {
    background: 'lighten 10%',
    border: '3px solid primary',   // Border épaisse
    cursor: 'pointer',
    transform: 'scale(1.02)',      // Léger zoom
  },

  // Active/Focus
  focus: {
    outline: '4px solid #2563eb',  // Outline TRÈS visible
    outlineOffset: '4px',
  },

  // Loading
  loading: {
    opacity: 0.6,
    cursor: 'wait',
    spinner: 'gros (32px)',
  },

  // Disabled
  disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    background: '#e5e5e5',
  },
}
```

##### 5. Navigation Simplifiée
```typescript
// Structure plate (éviter multi-niveaux)
const navigation = {
  // Max 1 niveau de profondeur
  primary: [
    'Accueil',        // Feed
    'Mes Souvenirs',  // Liste capsules éditeur
    'Nouveau',        // Créer capsule
    'Rechercher',     // Recherche
  ],

  // Breadcrumb visible en permanence
  breadcrumb: 'Accueil > Mes Souvenirs > Modifier "Titre capsule"',

  // Bouton retour TOUJOURS visible
  backButton: {
    position: 'top-left',
    size: 'large',
    label: '← Retour',  // Pas juste icône
  },
}
```

##### 6. Messages & Instructions
```typescript
const messaging = {
  // Langage clair et direct
  labels: {
    // ✅ BON
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',

    // ❌ ÉVITER
    submit: 'Soumettre',
    abort: 'Aborter',
    discard: 'Rejeter',
  },

  // Confirmations explicites
  confirmations: {
    delete: 'Êtes-vous sûr de vouloir supprimer ce souvenir? Cette action est irréversible.',
    unsaved: 'Vous avez des modifications non enregistrées. Voulez-vous les enregistrer avant de quitter?',
  },

  // Messages d'aide contextuels
  hints: {
    visible: true,              // Toujours visibles
    dismissable: false,         // Pas cachés par défaut
    icon: '💡',                 // Icône reconnaissable
    style: 'info box',          // Encadré coloré
  },
}
```

##### 7. Réduction de la Complexité
```typescript
// Mode "Basique" par défaut
const editorModes = {
  basic: {
    toolbar: [
      'Gras',
      'Italique',
      'Titre',
      'Photo',
      'Enregistrer',
    ],
    visible: true,  // Par défaut
  },

  advanced: {
    toolbar: [
      ...basic,
      'Lien',
      'Tableau',
      'Couleur',
      'Police',
      'Alignement',
    ],
    visible: false,  // Caché par défaut
    toggle: 'Options avancées ⚙️',  // Bouton pour afficher
  },
}

// Wizard pour actions complexes
const wizards = {
  createCapsule: {
    steps: [
      { title: '1. Donnez un titre', component: TitleForm },
      { title: '2. Écrivez votre texte', component: Editor },
      { title: '3. Ajoutez des photos (optionnel)', component: MediaUpload },
      { title: '4. Enregistrez votre voix (optionnel)', component: AudioRecorder },
      { title: '5. Publier', component: PublishConfirm },
    ],
    navigation: {
      prev: 'Étape précédente',
      next: 'Étape suivante',
      finish: 'Publier mon souvenir',
    },
  },
}
```

##### 8. Aide & Tutoriels Intégrés
```typescript
const helpSystem = {
  // Tour guidé au premier lancement
  onboarding: {
    steps: [
      'Bienvenue! Cliquez ici pour créer votre premier souvenir.',
      'Écrivez votre texte ici. Vous pouvez le formater avec les boutons du haut.',
      'Ajoutez des photos en cliquant ici.',
      'Enregistrez votre voix pour accompagner votre souvenir.',
      'Quand vous êtes prêt, cliquez sur "Publier".',
    ],
    skippable: true,
    replay: 'Voir le guide à nouveau',
  },

  // Tooltips contextuels
  tooltips: {
    style: 'large',         // Gros tooltips
    delay: 500,             // Apparaissent rapidement
    position: 'top',        // Au-dessus par défaut
    arrow: true,            // Flèche pointant vers élément
  },

  // Bouton aide permanent
  helpButton: {
    position: 'bottom-right',
    size: 'large (60px)',
    icon: '❓',
    label: 'Aide',
    modal: {
      title: 'Besoin d\'aide?',
      content: [
        'FAQ',
        'Tutoriels vidéo',
        'Contact support (vous)',
      ],
    },
  },
}
```

#### Checklist UX Senior-Friendly

**Général**:
- ✅ Texte min 18px
- ✅ Contraste AAA (4.5:1 minimum)
- ✅ Boutons min 60px
- ✅ Espacement généreux (16px+)
- ✅ Police sans-serif lisible

**Navigation**:
- ✅ Bouton retour TOUJOURS visible
- ✅ Breadcrumb claire
- ✅ Max 1 niveau de profondeur
- ✅ Menu simple (4-5 entrées max)

**Formulaires**:
- ✅ Labels au-dessus des champs (pas à côté)
- ✅ Champs larges (min 400px)
- ✅ Messages d'erreur visibles et explicites
- ✅ Validation en temps réel
- ✅ Bouton "Enregistrer" toujours accessible

**Feedback**:
- ✅ Loading spinners gros et visibles
- ✅ Messages de succès persistants (5s+)
- ✅ Confirmations avant actions destructrices
- ✅ Undo/Redo évident

**Éditeur**:
- ✅ Mode "Basique" par défaut
- ✅ Toolbar icônes + labels
- ✅ Auto-save avec indicateur
- ✅ Preview évident
- ✅ Pas de raccourcis clavier obligatoires

**Aide**:
- ✅ Tour guidé au premier lancement
- ✅ Tooltips généreux
- ✅ Bouton aide permanent
- ✅ FAQ accessible
- ✅ Contact direct (email/téléphone vous)

---

### 9. Administration (/admin)

**Pour**: ADMIN uniquement

#### Sections:
```
<AdminDashboard>
  ├─ <StatsOverview>
  │   ├─ Total capsules
  │   ├─ Total média
  │   ├─ Utilisateurs
  │   └─ Tags count
  ├─ <UsersManager>
  │   └─ CRUD utilisateurs
  ├─ <CapsulesManager>
  │   └─ Modération capsules
  ├─ <MediaManager>
  │   └─ Gestion stockage
  └─ <AppSettings>
      ├─ Site title
      ├─ SEO metadata
      └─ Feature flags
```

#### Fonctionnalités:
- ✅ Dashboard analytics
- ✅ Gestion utilisateurs (CRUD, rôles)
- ✅ **Modération commentaires** (nouveau)
  - Voir tous les commentaires
  - Supprimer commentaires inappropriés
  - Ban utilisateurs
  - Historique modération
- ✅ Modération capsules
- ✅ Gestion stockage média
- ✅ Logs d'activité
- ✅ Export données (JSON, CSV)
- ✅ Backup database

---

### 10. Inscription & Authentification

**Routes**:
- `/signup` - Créer un compte (READER par défaut)
- `/login` - Se connecter
- `/logout` - Se déconnecter

#### Composants d'Inscription:
```
<SignupPage>
  ├─ <SignupForm>
  │   ├─ Email (required, unique)
  │   ├─ Username (required, unique)
  │   ├─ Password (min 8 chars)
  │   ├─ Confirm Password
  │   ├─ Display Name (optionnel)
  │   └─ Avatar upload (optionnel)
  ├─ <ValidationMessages>
  └─ <LoginLink> ("Déjà un compte? Connectez-vous")
```

#### Fonctionnalités:
- ✅ **Inscription simple**:
  - Email + username + mot de passe
  - Validation temps réel (email valide, username disponible)
  - Hashing mot de passe (bcrypt)
  - Rôle READER par défaut
  - Pas de confirmation email (pour simplicité)
- ✅ **Login**:
  - Email ou username + mot de passe
  - Session JWT (NextAuth)
  - Remember me (30 jours)
  - Redirect vers page d'origine
- ✅ **Sécurité**:
  - Rate limiting (5 tentatives / 15 min)
  - CSRF protection
  - Password minimum 8 caractères
  - Pas d'emails stockés en clair

#### UX:
- 🎯 Formulaire simple (3 champs minimum)
- 🎯 Messages d'erreur clairs
- 🎯 Feedback immédiat (username pris, email invalide)
- 🎯 Bouton "S'inscrire" évident (gros, coloré)
- 🎯 Option "Se connecter avec Google" (optionnel v2)

---

### 11. Système de Likes

**Pour**: READER, EDITOR, ADMIN

#### Composants:
```
<LikeButton>
  ├─ Icône coeur (vide ou rempli)
  ├─ Nombre de likes
  └─ Animation (coeur qui pulse au click)

<LikesList> (modal)
  └─ <LikeUserItem>[]
      ├─ Avatar
      ├─ Display name
      └─ Date du like
```

#### Fonctionnalités:
- ✅ **Like/Unlike**:
  - Toggle instantané (optimistic update)
  - Animation coeur
  - Update count en temps réel
- ✅ **Voir qui a liké**:
  - Click sur le compteur de likes
  - Liste des utilisateurs (avatar + nom)
  - Triée par date (plus récents d'abord)
- ✅ **Persistance**:
  - Sauvegarde DB immédiate
  - Synchronisation multi-onglets
- ✅ **Restrictions**:
  - 1 like par user par capsule (unique constraint)
  - Besoin d'être connecté (READER+)
  - Modal login si non connecté

#### Implémentation:
```typescript
// API Routes
POST   /api/likes        // Créer un like
DELETE /api/likes/[id]   // Retirer un like
GET    /api/likes?capsuleId=xxx  // Liste likes d'une capsule

// Hook
function useLikeCapsule(capsuleId: string) {
  const mutation = useMutation({
    mutationFn: async () => {
      const isLiked = checkIfLiked();
      if (isLiked) {
        return apiClient.delete(`/likes/${likeId}`);
      } else {
        return apiClient.post('/likes', { capsuleId });
      }
    },
    onMutate: async () => {
      // Optimistic update
      queryClient.setQueryData(['capsule', capsuleId], (old) => ({
        ...old,
        likesCount: old.likesCount + (isLiked ? -1 : 1),
        isLikedByUser: !isLiked,
      }));
    },
  });
}
```

#### UX:
- 🎯 Bouton like TRÈS visible
- 🎯 Animation satisfaisante (coeur rouge qui pulse)
- 🎯 Feedback immédiat (pas d'attente serveur)
- 🎯 Count toujours visible
- 🎯 Tooltip "Vous aimez" / "Vous et X autres personnes"

---

### 12. Système de Commentaires

**Pour**: READER, EDITOR, ADMIN

#### Composants:
```
<CommentsSection>
  ├─ <CommentsHeader>
  │   └─ "X commentaires"
  ├─ <CommentForm>
  │   ├─ Textarea (placeholder: "Ajouter un commentaire...")
  │   ├─ Bouton "Publier"
  │   └─ Login prompt (si non connecté)
  └─ <CommentsList>
      └─ <CommentItem>[]
          ├─ <CommentHeader>
          │   ├─ Avatar
          │   ├─ Display name
          │   ├─ Date (relative: "il y a 2h")
          │   └─ Actions (edit, delete si owner/admin)
          ├─ <CommentContent>
          │   └─ Texte (multiline, auto-link URLs)
          ├─ <CommentActions>
          │   └─ Bouton "Répondre"
          └─ <CommentReplies>
              └─ <CommentItem>[] (récursif, max 3 niveaux)
```

#### Fonctionnalités:
- ✅ **Créer commentaire**:
  - Textarea expansible
  - Preview optionnel (pas de markdown pour simplicité)
  - Limite: 2000 caractères
  - Anti-spam: 1 commentaire / 30 secondes
- ✅ **Réponses (threads)**:
  - Bouton "Répondre" sous chaque commentaire
  - Indentation visuelle (max 3 niveaux)
  - Mention automatique "@username"
- ✅ **Éditer commentaire**:
  - Bouton "Modifier" (owner uniquement)
  - Edit inline
  - Indicateur "modifié"
- ✅ **Supprimer commentaire**:
  - Bouton "Supprimer" (owner + admin)
  - Confirmation modale
  - Soft delete (isDeleted=true, content remplacé par "[supprimé]")
  - Réponses préservées
- ✅ **Modération (ADMIN)**:
  - Supprimer n'importe quel commentaire
  - Ban utilisateur (désactive compte)
  - Dashboard modération
- ✅ **Tri**:
  - Par défaut: Anciens d'abord (chronologique)
  - Option: Plus récents d'abord
- ✅ **Pagination**:
  - Charger 10 commentaires à la fois
  - Bouton "Voir plus"

#### Implémentation:
```typescript
// API Routes
GET    /api/comments?capsuleId=xxx  // Liste commentaires
POST   /api/comments                // Créer commentaire
PUT    /api/comments/[id]           // Éditer commentaire
DELETE /api/comments/[id]           // Supprimer commentaire

// Hook
function useComments(capsuleId: string) {
  return useQuery({
    queryKey: ['comments', capsuleId],
    queryFn: () => apiClient.get(`/comments?capsuleId=${capsuleId}`),
  });
}

function useCreateComment() {
  return useMutation({
    mutationFn: (data: CreateCommentInput) =>
      apiClient.post('/comments', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
    },
  });
}
```

#### Validation:
```typescript
const createCommentSchema = z.object({
  capsuleId: z.string().cuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().cuid().optional(),
});
```

#### UX Grand-père friendly:
- 🎯 Zone de commentaire bien visible
- 🎯 Placeholder: "Partagez votre réaction à ce souvenir..."
- 🎯 Bouton "Publier" gros et évident
- 🎯 Notifications: "X nouveau commentaire sur votre souvenir"
- 🎯 Email (optionnel): Notification nouveau commentaire
- 🎯 Pas de markdown (trop complexe)
- 🎯 Auto-link URLs (convertir texte → liens)
- 🎯 Emojis supportés (copier-coller standards)

#### Anti-Spam:
- ✅ Rate limiting: 1 commentaire / 30s
- ✅ Longueur min: 1 caractère
- ✅ Détection spam (optionnel v2): URLs multiples
- ✅ Modération ADMIN

---

## 📁 Structure du Projet

### Arborescence

```
memories-app/
├── prisma/
│   ├── schema.prisma           # Schéma DB
│   ├── migrations/             # Migrations Prisma
│   └── seed.ts                 # Données de test
├── public/
│   ├── fonts/                  # Polices custom
│   └── images/                 # Assets statiques
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Routes publiques
│   │   │   ├── page.tsx        # Feed (/)
│   │   │   └── capsule/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── (protected)/        # Routes protégées
│   │   │   ├── editor/
│   │   │   │   ├── page.tsx    # Liste capsules
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── media/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── tags/
│   │   │   │       └── page.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── users/
│   │   │       ├── capsules/
│   │   │       └── settings/
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── capsules/
│   │   │   │   ├── route.ts    # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts # GET, PUT, DELETE
│   │   │   ├── chapters/
│   │   │   │   └── route.ts
│   │   │   ├── media/
│   │   │   │   └── route.ts
│   │   │   ├── tags/
│   │   │   │   └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Styles globaux
│   ├── components/             # Composants React
│   │   ├── ui/                 # Radix UI wrappers
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── capsules/           # Composants capsules
│   │   │   ├── CapsuleCard.tsx
│   │   │   ├── CapsuleViewer.tsx
│   │   │   └── CapsuleForm.tsx
│   │   ├── editor/             # Composants éditeur
│   │   │   ├── TipTapEditor.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── EditorSidebar.tsx
│   │   │   └── MediaUploader.tsx
│   │   ├── media/              # Composants média
│   │   │   ├── MediaGrid.tsx
│   │   │   ├── MediaCard.tsx
│   │   │   └── MediaLightbox.tsx
│   │   ├── tags/               # Composants tags
│   │   │   ├── TagBadge.tsx
│   │   │   ├── TagSelector.tsx
│   │   │   └── TagManager.tsx
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── core/                   # Architecture unifiée
│   │   ├── api/                # API client
│   │   │   ├── client.ts       # HTTP client unifié
│   │   │   ├── capsules/
│   │   │   │   ├── capsules.queries.ts
│   │   │   │   └── capsules.mutations.ts
│   │   │   ├── media/
│   │   │   ├── tags/
│   │   │   └── users/
│   │   ├── schemas/            # Zod schemas
│   │   │   ├── capsule.ts
│   │   │   ├── chapter.ts
│   │   │   ├── media.ts
│   │   │   ├── tag.ts
│   │   │   └── user.ts
│   │   └── design-system/      # Design tokens
│   │       ├── colors.ts
│   │       ├── typography.ts
│   │       └── spacing.ts
│   ├── server/                 # Server-side code
│   │   ├── services/           # Business logic
│   │   │   ├── capsulesService.ts
│   │   │   ├── chaptersService.ts
│   │   │   ├── mediaService.ts
│   │   │   ├── tagsService.ts
│   │   │   └── usersService.ts
│   │   └── auth.ts             # NextAuth config
│   ├── lib/                    # Utilities
│   │   ├── db.ts               # Prisma client
│   │   ├── auth.ts             # Auth helpers
│   │   ├── uploadthing.ts      # Upload config
│   │   ├── utils.ts            # Generic utils
│   │   └── constants.ts
│   ├── hooks/                  # React hooks
│   │   ├── useCapsules.ts
│   │   ├── useMedia.ts
│   │   ├── useTags.ts
│   │   └── useAuth.ts
│   └── types/                  # TypeScript types
│       ├── capsule.ts
│       ├── media.ts
│       └── api.ts
├── .env                        # Environment variables
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 🎨 Design System

### Inspiré de Flow

#### Couleurs (Radix Colors)
```typescript
// src/core/design-system/colors.ts
export const colors = {
  // Primary (accent)
  primary: {
    50: 'var(--indigo-1)',
    100: 'var(--indigo-2)',
    // ... jusqu'à 900
  },

  // Neutral (gray)
  neutral: {
    50: 'var(--slate-1)',
    // ...
  },

  // Semantic
  success: 'var(--green-9)',
  warning: 'var(--amber-9)',
  error: 'var(--red-9)',
  info: 'var(--blue-9)',
}
```

#### Typographie
```typescript
// src/core/design-system/typography.ts
export const typography = {
  fonts: {
    sans: 'var(--font-inter)', // Inter
    serif: 'var(--font-literata)', // Literata (pour contenu)
    mono: 'var(--font-jetbrains-mono)',
  },

  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}
```

#### Spacing (Tailwind default)
```
spacing: 4px base unit (0.25rem)
p-4 = 1rem = 16px
```

#### Composants UI (Radix)
- **Button**: Primary, Secondary, Outline, Ghost
- **Input**: Text, Textarea, Select
- **Dialog**: Modal, Sheet
- **Dropdown**: Menu, Select
- **Toast**: Notifications
- **Tabs**: Navigation
- **Badge**: Tags, status
- **Card**: Container
- **Separator**: Divider
- **Tooltip**: Info

### Thème

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Radix Slate (neutral)
        slate: { ... },
        // Radix Indigo (primary)
        indigo: { ... },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-literata)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
    },
  },
}
```

---

## 🌐 API Routes

### Routes Publiques

```typescript
// GET /api/capsules
// Query: status=PUBLISHED, tags=[], search="", limit=20, cursor=""
Response: {
  capsules: Capsule[],
  nextCursor: string | null,
}

// GET /api/capsules/[id]
Response: {
  capsule: Capsule & { chapters: Chapter[], media: Media[], tags: Tag[] }
}

// GET /api/tags
Response: {
  tags: Tag[]
}
```

### Routes Protégées (EDITOR/ADMIN)

```typescript
// POST /api/capsules
Body: CreateCapsuleInput
Response: { capsule: Capsule }

// PUT /api/capsules/[id]
Body: UpdateCapsuleInput
Response: { capsule: Capsule }

// DELETE /api/capsules/[id]
Response: { success: true }

// POST /api/media/upload
Body: FormData (multipart)
Response: { media: Media }

// DELETE /api/media/[id]
Response: { success: true }

// POST /api/chapters
Body: CreateChapterInput
Response: { chapter: Chapter }

// PUT /api/chapters/[id]
Body: UpdateChapterInput
Response: { chapter: Chapter }

// DELETE /api/chapters/[id]
Response: { success: true }
```

### Routes Admin

```typescript
// GET /api/users
Response: { users: User[] }

// PUT /api/users/[id]
Body: UpdateUserInput
Response: { user: User }

// DELETE /api/users/[id]
Response: { success: true }

// GET /api/admin/stats
Response: {
  capsules: { total, published, draft },
  media: { total, sizeGB },
  users: { total, byRole },
  tags: { total }
}
```

---

## 🔄 Workflow Développement

### Conventions (de Flow)

#### Git Flow
```bash
main          # Production (tags releases)
dev           # Development (default branch)
feature/*     # Nouvelles fonctionnalités
fix/*         # Bug fixes
refactor/*    # Refactoring
```

#### Commits
```
feat(capsules): add rich text editor
fix(auth): resolve login redirect issue
refactor(api): migrate to service layer pattern
docs(readme): update setup instructions
test(capsules): add integration tests
```

#### Branches
```bash
# Nouvelle feature
git checkout -b feature/rich-text-editor

# Bug fix
git checkout -b fix/upload-validation

# Refactor
git checkout -b refactor/api-client
```

### Testing Strategy

```typescript
// Jest + Testing Library

// Unit tests (services)
src/server/services/__tests__/capsulesService.test.ts

// Integration tests (API routes)
src/app/api/__tests__/capsules.integration.test.ts

// Component tests
src/components/__tests__/CapsuleCard.test.tsx

// E2E (Playwright - optionnel)
e2e/capsules.spec.ts
```

### Code Quality

```bash
# Linting
pnpm lint

# Type checking
pnpm type-check

# Tests
pnpm test

# Coverage
pnpm test:coverage

# Pre-commit hook (Husky)
- pnpm lint-staged
- pnpm type-check
- pnpm test (changed files)
```

---

## 🚀 Roadmap MVP

### Phase 1 - Fondations (2 semaines)
- ✅ Setup Next.js + Prisma + Auth
- ✅ Schéma DB + migrations
- ✅ Service layer (capsules, users, auth)
- ✅ API routes de base
- ✅ Design system (Radix + Tailwind)

### Phase 2 - Feed & Viewer (2 semaines)
- ✅ Feed public avec filtres
- ✅ Capsule viewer (lecture)
- ✅ Navigation & routing
- ✅ Responsive design

### Phase 3 - Éditeur (3 semaines)
- ✅ TipTap integration
- ✅ Rich text toolbar complet
- ✅ Upload média (Uploadthing)
- ✅ Auto-save
- ✅ Preview mode

### Phase 4 - Média & Tags (1 semaine)
- ✅ Bibliothèque média
- ✅ Gestion tags
- ✅ Intégration média dans éditeur

### Phase 5 - Admin (1 semaine)
- ✅ Dashboard admin
- ✅ Gestion utilisateurs
- ✅ Modération capsules

### Phase 6 - Polish & Launch (1 semaine)
- ✅ Tests complets
- ✅ SEO optimization
- ✅ Performance audit
- ✅ Déploiement production

**Total estimé**: ~10 semaines

---

## 📝 Notes Finales

### Simplifications vs Flow

**Retiré** (pas nécessaire pour Memories):
- ❌ Offline-first (pas de DataCache/SyncQueue)
- ❌ Service Worker
- ❌ Extension Chrome
- ❌ Tauri desktop
- ❌ Analytics complexes
- ❌ Multi-DB contexts
- ❌ Tracking quotidien
- ❌ Jeux & Relax features

**Gardé** (architecture solide):
- ✅ 3-layer architecture (UI/API/Service)
- ✅ TanStack Query pour data fetching
- ✅ Zod validations partagées
- ✅ Prisma ORM
- ✅ Design system Radix + Tailwind
- ✅ TypeScript strict
- ✅ Service layer pattern

**Ajouté** (spécifique Memories):
- ✨ Rich text editor (TipTap)
- ✨ Upload média (Uploadthing)
- ✨ Timeline chronologique
- ✨ Système chapitres
- ✨ Export PDF

### Évolutions Futures

**v2.0** (après MVP):
- 🔮 Comments sur capsules (famille)
- 🔮 Partage privé par lien
- 🔮 Notifications email
- 🔮 Timeline interactive (carte temporelle)
- 🔮 Recherche full-text avancée (Algolia?)
- 🔮 Transcription audio → texte (OpenAI Whisper)
- 🔮 Génération résumés AI
- 🔮 Migration SQLite → PostgreSQL
- 🔮 Déploiement Vercel/Railway

---

**Document créé**: 2025-10-23
**Auteur**: Claude (inspiré de Flow v0.4.6)
**Status**: Architecture initiale - Prêt pour développement MVP
