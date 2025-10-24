# v0.2.0 - Database & Auth

**Date de début**: TBD
**Date de fin**: TBD (Durée: 5 jours)
**Status**: 🔴 Not Started
**Prérequis**: v0.1.0 ✅

---

## 🎯 Objectif

Implémenter le modèle de données complet et le système d'authentification avec NextAuth.js.

**Livrables**:
- ✅ Schéma Prisma complet (User, Capsule, Media, Tag, Like, Comment)
- ✅ Migrations database
- ✅ NextAuth.js configuré
- ✅ Pages login/signup fonctionnelles
- ✅ Service layer auth testé

---

## 📋 Checklist Détaillée

### 1. Schéma Prisma Complet

**`prisma/schema.prisma`** (Version complète)
```prisma
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
  VISITOR   // Non connecté (pas stocké en DB)
  READER    // Lecteur (famille/amis)
  EDITOR    // Rédacteur (grand-père)
  ADMIN     // Administrateur
}

model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String
  role          UserRole  @default(READER)

  // Metadata
  displayName   String?
  avatar        String?
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
// Capsules
// ============================================================================

enum CapsuleStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Capsule {
  id            String        @id @default(cuid())
  userId        String

  title         String
  content       String
  excerpt       String?
  coverImage    String?

  status        CapsuleStatus @default(DRAFT)
  publishedAt   DateTime?

  year          Int?
  location      String?
  people        String?

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
// Chapters
// ============================================================================

model Chapter {
  id            String    @id @default(cuid())
  capsuleId     String

  title         String
  content       String
  order         Int

  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([capsuleId])
  @@map("chapters")
}

// ============================================================================
// Media
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
  url           String
  filename      String
  mimeType      String
  size          Int

  caption       String?
  altText       String?
  order         Int?

  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())

  @@index([capsuleId])
  @@index([type])
  @@map("media")
}

// ============================================================================
// Tags
// ============================================================================

model Tag {
  id            String        @id @default(cuid())

  name          String        @unique
  slug          String        @unique
  color         String?
  description   String?

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
// Social
// ============================================================================

model Like {
  id            String    @id @default(cuid())
  userId        String
  capsuleId     String

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())

  @@unique([userId, capsuleId])
  @@index([capsuleId])
  @@index([userId])
  @@map("likes")
}

model Comment {
  id            String    @id @default(cuid())
  userId        String
  capsuleId     String

  content       String
  parentId      String?

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  capsule       Capsule   @relation(fields: [capsuleId], references: [id], onDelete: Cascade)
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies       Comment[] @relation("CommentReplies")

  isEdited      Boolean   @default(false)
  isDeleted     Boolean   @default(false)
  deletedAt     DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([capsuleId])
  @@index([userId])
  @@index([parentId])
  @@map("comments")
}

// ============================================================================
// Config
// ============================================================================

model AppConfig {
  id            String    @id @default(cuid())

  key           String    @unique
  value         String

  updatedAt     DateTime  @updatedAt

  @@map("app_config")
}
```

#### Checklist
- [ ] Schéma Prisma complet copié
- [ ] Migration créée: `pnpm exec prisma migrate dev --name complete-schema`
- [ ] Prisma client re-généré: `pnpm exec prisma generate`
- [ ] Schema valide sans erreur

---

### 2. Seed Database

**`prisma/seed.ts`**
```typescript
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password helper
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  // 1. Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@memories.app' },
    update: {},
    create: {
      email: 'admin@memories.app',
      username: 'admin',
      passwordHash: await hashPassword('admin123'),
      role: UserRole.ADMIN,
      displayName: 'Admin',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'grandpere@memories.app' },
    update: {},
    create: {
      email: 'grandpere@memories.app',
      username: 'grandpere',
      passwordHash: await hashPassword('grandpere123'),
      role: UserRole.EDITOR,
      displayName: 'Grand-père',
    },
  });

  const reader1 = await prisma.user.upsert({
    where: { email: 'marie@memories.app' },
    update: {},
    create: {
      email: 'marie@memories.app',
      username: 'marie',
      passwordHash: await hashPassword('reader123'),
      role: UserRole.READER,
      displayName: 'Marie (Petite-fille)',
    },
  });

  const reader2 = await prisma.user.upsert({
    where: { email: 'jean@memories.app' },
    update: {},
    create: {
      email: 'jean@memories.app',
      username: 'jean',
      passwordHash: await hashPassword('reader123'),
      role: UserRole.READER,
      displayName: 'Jean (Petit-fils)',
    },
  });

  console.log('✅ Users created:', { admin, editor, reader1, reader2 });

  // 2. Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'famille' },
      update: {},
      create: {
        name: 'Famille',
        slug: 'famille',
        color: '#3b82f6',
        description: 'Souvenirs de famille',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'voyage' },
      update: {},
      create: {
        name: 'Voyage',
        slug: 'voyage',
        color: '#10b981',
        description: 'Voyages et aventures',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'enfance' },
      update: {},
      create: {
        name: 'Enfance',
        slug: 'enfance',
        color: '#f59e0b',
        description: 'Souvenirs d\'enfance',
      },
    }),
  ]);

  console.log('✅ Tags created:', tags.length);

  // 3. Create sample capsule (by editor)
  const capsule = await prisma.capsule.create({
    data: {
      userId: editor.id,
      title: 'Mon premier souvenir',
      content: '<p>Ceci est mon premier souvenir enregistré dans l\'application...</p>',
      excerpt: 'Ceci est mon premier souvenir enregistré dans l\'application...',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      year: 1965,
      location: 'Paris, France',
      tags: {
        create: [
          { tagId: tags[0].id }, // Famille
        ],
      },
    },
  });

  console.log('✅ Sample capsule created:', capsule.id);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**`package.json`** (ajout script seed)
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

```bash
# Installer dependencies
pnpm add -D ts-node
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

#### Checklist
- [ ] `prisma/seed.ts` créé
- [ ] bcryptjs installé
- [ ] ts-node installé
- [ ] Script seed ajouté à `package.json`
- [ ] Seed exécuté: `pnpm exec prisma db seed`
- [ ] Seed crée 4 users (admin, editor, 2 readers)
- [ ] Seed crée 3 tags
- [ ] Seed crée 1 capsule exemple
- [ ] Prisma Studio affiche données: `pnpm exec prisma studio`

---

### 3. Setup NextAuth.js v5

```bash
# Installer NextAuth.js v5
pnpm add next-auth@beta
pnpm add @auth/prisma-adapter
```

**`src/server/auth.ts`** (NextAuth config)
```typescript
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.displayName || user.username,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
```

**`src/app/api/auth/[...nextauth]/route.ts`**
```typescript
import { handlers } from '@/server/auth';

export const { GET, POST } = handlers;
```

**`src/types/next-auth.d.ts`** (Type augmentation)
```typescript
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
```

**`.env`** (ajout NextAuth variables)
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

```bash
# Générer secret
openssl rand -base64 32
```

#### Checklist
- [ ] NextAuth.js v5 installé
- [ ] `src/server/auth.ts` créé
- [ ] Route API `/api/auth/[...nextauth]` créée
- [ ] Types NextAuth augmentés
- [ ] NEXTAUTH_SECRET généré et ajouté à `.env`
- [ ] Zod installé: `pnpm add zod`

---

### 4. Service Layer Auth

**`src/server/services/authService.ts`**
```typescript
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export async function createUser(data: {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  role?: UserRole;
}) {
  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      displayName: data.displayName || data.username,
      role: data.role || UserRole.READER,
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export async function updateUser(
  userId: string,
  data: {
    displayName?: string;
    avatar?: string;
    bio?: string;
  }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      role: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });

  return { success: true };
}
```

**`src/server/services/usersService.ts`**
```typescript
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          capsules: true,
          comments: true,
          likes: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  return user;
}
```

#### Checklist
- [ ] `authService.ts` créé
- [ ] `usersService.ts` créé
- [ ] Fonctions CRUD users implémentées
- [ ] Password hashing avec bcrypt
- [ ] Sélection safe (pas de passwordHash exposé)

---

### 5. Tests Service Layer

**`src/server/services/__tests__/authService.test.ts`**
```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { createUser, getUserById, updateUser, deleteUser } from '../authService';

const prisma = new PrismaClient();

const TEST_USER = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
  displayName: 'Test User',
};

describe('authService', () => {
  afterEach(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: TEST_USER.email },
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await createUser(TEST_USER);

      expect(user).toBeDefined();
      expect(user.email).toBe(TEST_USER.email);
      expect(user.username).toBe(TEST_USER.username);
      expect(user.displayName).toBe(TEST_USER.displayName);
      expect(user.role).toBe('READER'); // Default
      expect(user).not.toHaveProperty('passwordHash'); // Should not be exposed
    });

    it('should throw error if user already exists', async () => {
      await createUser(TEST_USER);

      await expect(createUser(TEST_USER)).rejects.toThrow('User already exists');
    });

    it('should hash password', async () => {
      const user = await createUser(TEST_USER);

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(dbUser?.passwordHash).toBeDefined();
      expect(dbUser?.passwordHash).not.toBe(TEST_USER.password);
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const created = await createUser(TEST_USER);
      const fetched = await getUserById(created.id);

      expect(fetched).toBeDefined();
      expect(fetched.id).toBe(created.id);
      expect(fetched.email).toBe(TEST_USER.email);
    });

    it('should throw error if user not found', async () => {
      await expect(getUserById('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const created = await createUser(TEST_USER);
      const updated = await updateUser(created.id, {
        displayName: 'Updated Name',
        bio: 'New bio',
      });

      expect(updated.displayName).toBe('Updated Name');
      expect(updated.bio).toBe('New bio');
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const created = await createUser(TEST_USER);
      const result = await deleteUser(created.id);

      expect(result.success).toBe(true);

      await expect(getUserById(created.id)).rejects.toThrow('User not found');
    });
  });
});
```

```bash
# Exécuter tests
pnpm test src/server/services/__tests__/authService.test.ts
```

#### Checklist
- [ ] Tests authService créés
- [ ] Tests passent (100%)
- [ ] Coverage createUser
- [ ] Coverage getUserById
- [ ] Coverage updateUser
- [ ] Coverage deleteUser
- [ ] Tests vérifient hashing password
- [ ] Tests vérifient erreurs (user exists, not found)

---

### 6. Pages Login/Signup

**`src/app/login/page.tsx`**
```typescript
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Connexion</h1>
        <LoginForm />
      </div>
    </div>
  );
}
```

**`src/components/auth/LoginForm.tsx`** (Client component)
```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-8 shadow">
      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Pas encore de compte?{' '}
        <Link href="/signup" className="text-indigo-600 hover:underline">
          S'inscrire
        </Link>
      </p>
    </form>
  );
}
```

**`src/app/signup/page.tsx`** + `src/components/auth/SignupForm.tsx`** (similaire)

#### Checklist
- [ ] Page `/login` créée
- [ ] Composant `<LoginForm>` créé
- [ ] Page `/signup` créée
- [ ] Composant `<SignupForm>` créé
- [ ] Formulaires fonctionnels
- [ ] Validation côté client
- [ ] Messages d'erreur clairs
- [ ] Redirections après login/signup

---

### 7. Middleware Protection

**`middleware.ts`** (root)
```typescript
export { auth as middleware } from '@/server/auth';

export const config = {
  matcher: ['/editor/:path*', '/admin/:path*'],
};
```

#### Checklist
- [ ] Middleware créé
- [ ] Routes `/editor/*` protégées
- [ ] Routes `/admin/*` protégées
- [ ] Redirect vers `/login` si non authentifié
- [ ] Test accès routes protégées sans login (doit redirect)

---

## ✅ Critères de Validation v0.2.0

### Tests Automatiques
```bash
# 1. Tests services
pnpm test src/server/services     # ✅ Tous passent

# 2. Linting
pnpm lint                          # ✅ 0 warnings

# 3. Type check
pnpm type-check                    # ✅ 0 errors

# 4. Build
pnpm build                         # ✅ Succès
```

### Tests Manuels
- [ ] Signup: Créer compte READER
- [ ] Login: Se connecter avec compte créé
- [ ] Session: Session persiste après refresh
- [ ] Logout: Se déconnecter fonctionne
- [ ] Protection: Accès `/editor` sans login redirect `/login`
- [ ] Prisma Studio: Voir données (users, capsules, tags)
- [ ] Seed: `pnpm exec prisma db seed` crée données test

### Validation Database
- [ ] Schéma Prisma complet et migré
- [ ] Seed crée 4 users (admin, editor, 2 readers)
- [ ] Seed crée 3 tags (famille, voyage, enfance)
- [ ] Seed crée 1 capsule exemple (published)
- [ ] Relations fonctionnent (user → capsules, capsule → tags)

---

## 📦 Commit & Tag Release

```bash
git checkout dev
git add .
git commit -m "feat(auth): implement database schema and authentication

- Complete Prisma schema (User, Capsule, Media, Tag, Like, Comment)
- NextAuth.js v5 setup with credentials provider
- Service layer (authService, usersService)
- Login/Signup pages
- Middleware route protection
- Database seed with test data
- Unit tests (authService)

✅ All tests passing
✅ Authentication functional"

git checkout main
git merge dev
git tag -a v0.2.0 -m "Release v0.2.0 - Database & Auth

✅ Database schema complete
✅ NextAuth.js configured
✅ Login/Signup functional
✅ Service layer tested
✅ Ready for v0.3.0 (API Routes)"

git push origin main dev v0.2.0
```

---

## 🔄 Prochaines Étapes

➡️ **v0.3.0 - API Routes & Service Layer**
- API routes complètes (capsules, media, tags, likes, comments)
- HTTP client unifié
- Zod schemas validation
- Tests intégration API

---

**Version**: v0.2.0
**Status**: 🔴 Not Started
**Durée estimée**: 5 jours
**Prérequis**: v0.1.0 ✅
**Next**: v0.3.0 - API Routes & Service Layer
