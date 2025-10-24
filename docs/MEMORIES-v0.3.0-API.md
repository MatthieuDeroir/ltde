# v0.3.0 - API Routes & Service Layer

**Date de début**: TBD
**Date de fin**: TBD (Durée: 5 jours)
**Status**: 🔴 Not Started
**Prérequis**: v0.2.0 ✅

---

## 🎯 Objectif

Créer l'API REST complète avec service layer robuste et validations Zod.

**Livrables**:
- ✅ Service layer complet (capsules, chapters, media, tags, likes, comments)
- ✅ API routes REST complètes
- ✅ Schémas Zod pour validations
- ✅ HTTP client unifié
- ✅ Tests unitaires et intégration (80% coverage)

---

## 📋 Checklist Détaillée

### 1. Service Layer - Capsules

**`src/server/services/capsulesService.ts`**
```typescript
import { prisma } from '@/lib/db';
import { CapsuleStatus } from '@prisma/client';

export async function getCapsules(filters: {
  userId?: string;
  status?: CapsuleStatus;
  tags?: string[];
  search?: string;
  limit?: number;
  cursor?: string;
}) {
  const { userId, status, tags, search, limit = 20, cursor } = filters;

  const where: any = {};

  if (userId) where.userId = userId;
  if (status) where.status = status;
  if (tags && tags.length > 0) {
    where.tags = {
      some: {
        tagId: { in: tags },
      },
    };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  const capsules = await prisma.capsule.findMany({
    where,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { publishedAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
        },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  const hasMore = capsules.length > limit;
  const items = hasMore ? capsules.slice(0, -1) : capsules;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { capsules: items, nextCursor };
}

export async function getCapsuleById(capsuleId: string, userId?: string) {
  const capsule = await prisma.capsule.findUnique({
    where: { id: capsuleId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          bio: true,
        },
      },
      media: {
        orderBy: { order: 'asc' },
      },
      chapters: {
        orderBy: { order: 'asc' },
      },
      tags: {
        include: { tag: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!capsule) {
    throw new Error('Capsule not found');
  }

  // Check permissions
  if (capsule.status !== 'PUBLISHED' && capsule.userId !== userId) {
    throw new Error('Not authorized');
  }

  // Check if user liked (if authenticated)
  let isLikedByUser = false;
  if (userId) {
    const like = await prisma.like.findUnique({
      where: {
        userId_capsuleId: {
          userId,
          capsuleId,
        },
      },
    });
    isLikedByUser = !!like;
  }

  return { ...capsule, isLikedByUser };
}

export async function createCapsule(
  userId: string,
  data: {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    status?: CapsuleStatus;
    year?: number;
    location?: string;
    people?: string;
    tagIds?: string[];
  }
) {
  const { tagIds, ...capsuleData } = data;

  const capsule = await prisma.capsule.create({
    data: {
      ...capsuleData,
      userId,
      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  return capsule;
}

export async function updateCapsule(
  capsuleId: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    status?: CapsuleStatus;
    year?: number;
    location?: string;
    people?: string;
    tagIds?: string[];
  }
) {
  // Check ownership
  const existing = await prisma.capsule.findUnique({
    where: { id: capsuleId },
  });

  if (!existing) {
    throw new Error('Capsule not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Not authorized');
  }

  const { tagIds, ...capsuleData } = data;

  // Update tags if provided
  if (tagIds) {
    await prisma.capsuleTag.deleteMany({
      where: { capsuleId },
    });
  }

  const capsule = await prisma.capsule.update({
    where: { id: capsuleId },
    data: {
      ...capsuleData,
      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
  });

  return capsule;
}

export async function deleteCapsule(capsuleId: string, userId: string) {
  // Check ownership
  const existing = await prisma.capsule.findUnique({
    where: { id: capsuleId },
  });

  if (!existing) {
    throw new Error('Capsule not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Not authorized');
  }

  await prisma.capsule.delete({
    where: { id: capsuleId },
  });

  return { success: true };
}

export async function publishCapsule(capsuleId: string, userId: string) {
  const capsule = await prisma.capsule.findUnique({
    where: { id: capsuleId },
  });

  if (!capsule) {
    throw new Error('Capsule not found');
  }

  if (capsule.userId !== userId) {
    throw new Error('Not authorized');
  }

  const updated = await prisma.capsule.update({
    where: { id: capsuleId },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  return updated;
}
```

#### Checklist
- [ ] `capsulesService.ts` créé
- [ ] Fonctions CRUD complètes
- [ ] Pagination avec cursor
- [ ] Filtres (status, tags, search)
- [ ] Permissions vérifiées (ownership)
- [ ] Include relations (user, tags, counts)

---

### 2. Service Layer - Tags

**`src/server/services/tagsService.ts`**
```typescript
import { prisma } from '@/lib/db';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          capsules: true,
        },
      },
    },
  });

  return tags;
}

export async function getTagById(tagId: string) {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
    include: {
      _count: {
        select: {
          capsules: true,
        },
      },
    },
  });

  if (!tag) {
    throw new Error('Tag not found');
  }

  return tag;
}

export async function createTag(data: {
  name: string;
  color?: string;
  description?: string;
}) {
  const slug = slugify(data.name);

  // Check if slug exists
  const existing = await prisma.tag.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new Error('Tag already exists');
  }

  const tag = await prisma.tag.create({
    data: {
      ...data,
      slug,
    },
  });

  return tag;
}

export async function updateTag(
  tagId: string,
  data: {
    name?: string;
    color?: string;
    description?: string;
  }
) {
  const updates: any = { ...data };

  if (data.name) {
    updates.slug = slugify(data.name);

    // Check if slug exists (excluding current tag)
    const existing = await prisma.tag.findFirst({
      where: {
        slug: updates.slug,
        NOT: { id: tagId },
      },
    });

    if (existing) {
      throw new Error('Tag slug already exists');
    }
  }

  const tag = await prisma.tag.update({
    where: { id: tagId },
    data: updates,
  });

  return tag;
}

export async function deleteTag(tagId: string) {
  await prisma.tag.delete({
    where: { id: tagId },
  });

  return { success: true };
}
```

#### Checklist
- [ ] `tagsService.ts` créé
- [ ] Fonction slugify implémentée
- [ ] CRUD tags complet
- [ ] Vérification slug unique
- [ ] Count capsules par tag

---

### 3. Service Layer - Likes & Comments

**`src/server/services/likesService.ts`**
```typescript
import { prisma } from '@/lib/db';

export async function toggleLike(userId: string, capsuleId: string) {
  const existing = await prisma.like.findUnique({
    where: {
      userId_capsuleId: {
        userId,
        capsuleId,
      },
    },
  });

  if (existing) {
    // Unlike
    await prisma.like.delete({
      where: { id: existing.id },
    });

    return { liked: false };
  } else {
    // Like
    await prisma.like.create({
      data: {
        userId,
        capsuleId,
      },
    });

    return { liked: true };
  }
}

export async function getLikesByCapsule(capsuleId: string) {
  const likes = await prisma.like.findMany({
    where: { capsuleId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return likes;
}
```

**`src/server/services/commentsService.ts`**
```typescript
import { prisma } from '@/lib/db';

export async function getCommentsByCapsule(capsuleId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      capsuleId,
      parentId: null, // Top-level comments only
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                },
              },
            },
            where: { isDeleted: false },
          },
        },
        where: { isDeleted: false },
      },
    },
    where: { isDeleted: false },
    orderBy: { createdAt: 'asc' },
  });

  return comments;
}

export async function createComment(
  userId: string,
  data: {
    capsuleId: string;
    content: string;
    parentId?: string;
  }
) {
  const comment = await prisma.comment.create({
    data: {
      userId,
      ...data,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
        },
      },
    },
  });

  return comment;
}

export async function updateComment(
  commentId: string,
  userId: string,
  content: string
) {
  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existing) {
    throw new Error('Comment not found');
  }

  if (existing.userId !== userId) {
    throw new Error('Not authorized');
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
      isEdited: true,
    },
  });

  return comment;
}

export async function deleteComment(commentId: string, userId: string, isAdmin: boolean) {
  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!existing) {
    throw new Error('Comment not found');
  }

  if (existing.userId !== userId && !isAdmin) {
    throw new Error('Not authorized');
  }

  // Soft delete
  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      content: '[supprimé]',
    },
  });

  return comment;
}
```

#### Checklist
- [ ] `likesService.ts` créé
- [ ] Toggle like/unlike
- [ ] Liste likes par capsule
- [ ] `commentsService.ts` créé
- [ ] Threading (max 3 niveaux)
- [ ] Soft delete comments
- [ ] Permissions (owner + admin)

---

### 4. Zod Schemas Validation

**`src/core/schemas/capsule.ts`**
```typescript
import { z } from 'zod';
import { CapsuleStatus } from '@prisma/client';

export const createCapsuleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  status: z.nativeEnum(CapsuleStatus).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  location: z.string().max(200).optional(),
  people: z.string().max(500).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateCapsuleSchema = createCapsuleSchema.partial();

export const getCaps ulesSchema = z.object({
  status: z.nativeEnum(CapsuleStatus).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>;
export type UpdateCapsuleInput = z.infer<typeof updateCapsuleSchema>;
export type GetCapsulesInput = z.infer<typeof getCapsulesSchema>;
```

**`src/core/schemas/tag.ts`**
```typescript
import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  description: z.string().max(200).optional(),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
```

**`src/core/schemas/like.ts`**
```typescript
import { z } from 'zod';

export const toggleLikeSchema = z.object({
  capsuleId: z.string().cuid(),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;
```

**`src/core/schemas/comment.ts`**
```typescript
import { z } from 'zod';

export const createCommentSchema = z.object({
  capsuleId: z.string().cuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().cuid().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
```

#### Checklist
- [ ] Zod installé
- [ ] `capsule.ts` schema créé
- [ ] `tag.ts` schema créé
- [ ] `like.ts` schema créé
- [ ] `comment.ts` schema créé
- [ ] Types exportés

---

### 5. API Routes - Capsules

**`src/app/api/capsules/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { getCapsules, createCapsule } from '@/server/services/capsulesService';
import { createCapsuleSchema, getCapsulesSchema } from '@/core/schemas/capsule';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters = getCapsulesSchema.parse({
      status: searchParams.get('status'),
      tags: searchParams.getAll('tags'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      cursor: searchParams.get('cursor'),
    });

    const result = await getCapsules(filters);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !['EDITOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createCapsuleSchema.parse(body);

    const capsule = await createCapsule(session.user.id, data);

    return NextResponse.json(capsule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

**`src/app/api/capsules/[id]/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import {
  getCapsuleById,
  updateCapsule,
  deleteCapsule,
} from '@/server/services/capsulesService';
import { updateCapsuleSchema } from '@/core/schemas/capsule';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const capsule = await getCapsuleById(params.id, session?.user.id);

    return NextResponse.json(capsule);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateCapsuleSchema.parse(body);

    const capsule = await updateCapsule(params.id, session.user.id, data);

    return NextResponse.json(capsule);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await deleteCapsule(params.id, session.user.id);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

#### Checklist API Capsules
- [ ] `GET /api/capsules` créé (liste)
- [ ] `POST /api/capsules` créé (create, EDITOR+)
- [ ] `GET /api/capsules/[id]` créé (détails)
- [ ] `PUT /api/capsules/[id]` créé (update, owner)
- [ ] `DELETE /api/capsules/[id]` créé (delete, owner)
- [ ] Validations Zod appliquées
- [ ] Permissions vérifiées

---

### 6. API Routes - Tags, Likes, Comments

**Routes Tags**:
- [ ] `GET /api/tags` - Liste tags
- [ ] `POST /api/tags` - Créer tag (EDITOR+)
- [ ] `PUT /api/tags/[id]` - Update tag (ADMIN)
- [ ] `DELETE /api/tags/[id]` - Delete tag (ADMIN)

**Routes Likes**:
- [ ] `POST /api/likes` - Toggle like (READER+)
- [ ] `GET /api/likes?capsuleId=xxx` - Liste likes

**Routes Comments**:
- [ ] `GET /api/comments?capsuleId=xxx` - Liste comments
- [ ] `POST /api/comments` - Créer comment (READER+)
- [ ] `PUT /api/comments/[id]` - Update comment (owner)
- [ ] `DELETE /api/comments/[id]` - Delete comment (owner/ADMIN)

#### Checklist
- [ ] Toutes routes créées
- [ ] Validations Zod appliquées
- [ ] Permissions vérifiées
- [ ] Error handling standardisé

---

### 7. HTTP Client Unifié

**`src/core/api/client.ts`**
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Request failed',
        response.status,
        error
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>(`${endpoint}${query}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export { ApiError };
```

#### Checklist
- [ ] `apiClient` créé
- [ ] Méthodes GET, POST, PUT, DELETE
- [ ] Error handling (ApiError)
- [ ] Headers Content-Type automatiques
- [ ] Query params support

---

### 8. Tests Unitaires Services

**`src/server/services/__tests__/capsulesService.test.ts`**
```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import {
  getCapsules,
  getCapsuleById,
  createCapsule,
  updateCapsule,
  deleteCapsule,
} from '../capsulesService';

const prisma = new PrismaClient();

describe('capsulesService', () => {
  let testUserId: string;
  let testCapsuleId: string;

  beforeEach(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test-capsules@example.com',
        username: 'test-capsules',
        passwordHash: 'hash',
        role: 'EDITOR',
      },
    });
    testUserId = user.id;
  });

  afterEach(async () => {
    // Cleanup
    await prisma.capsule.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });
  });

  describe('createCapsule', () => {
    it('should create a capsule', async () => {
      const capsule = await createCapsule(testUserId, {
        title: 'Test Capsule',
        content: '<p>Test content</p>',
        status: 'DRAFT',
      });

      expect(capsule).toBeDefined();
      expect(capsule.title).toBe('Test Capsule');
      expect(capsule.status).toBe('DRAFT');
      expect(capsule.userId).toBe(testUserId);
    });
  });

  describe('getCapsules', () => {
    it('should get capsules with filters', async () => {
      await createCapsule(testUserId, {
        title: 'Published Capsule',
        content: '<p>Content</p>',
        status: 'PUBLISHED',
      });

      await createCapsule(testUserId, {
        title: 'Draft Capsule',
        content: '<p>Content</p>',
        status: 'DRAFT',
      });

      const result = await getCapsules({ status: 'PUBLISHED' });

      expect(result.capsules.length).toBeGreaterThanOrEqual(1);
      expect(result.capsules.every((c) => c.status === 'PUBLISHED')).toBe(true);
    });
  });

  describe('updateCapsule', () => {
    it('should update capsule', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Original Title',
        content: '<p>Content</p>',
      });

      const updated = await updateCapsule(created.id, testUserId, {
        title: 'Updated Title',
      });

      expect(updated.title).toBe('Updated Title');
    });

    it('should throw error if not owner', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Test',
        content: '<p>Content</p>',
      });

      await expect(
        updateCapsule(created.id, 'other-user-id', { title: 'Hacked' })
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('deleteCapsule', () => {
    it('should delete capsule', async () => {
      const created = await createCapsule(testUserId, {
        title: 'To Delete',
        content: '<p>Content</p>',
      });

      const result = await deleteCapsule(created.id, testUserId);

      expect(result.success).toBe(true);

      await expect(getCapsuleById(created.id)).rejects.toThrow('Capsule not found');
    });
  });
});
```

**Tests similaires pour**:
- [ ] `tagsService.test.ts`
- [ ] `likesService.test.ts`
- [ ] `commentsService.test.ts`

#### Checklist Tests
- [ ] Tests services créés
- [ ] Coverage ≥ 80%
- [ ] Tests CRUD complets
- [ ] Tests permissions
- [ ] Tests erreurs (not found, unauthorized)

---

### 9. Tests Intégration API

**`src/app/api/__tests__/capsules.integration.test.ts`**
```typescript
import { describe, it, expect } from '@jest/globals';

describe('GET /api/capsules', () => {
  it('should return published capsules', async () => {
    const response = await fetch('http://localhost:3000/api/capsules?status=PUBLISHED');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.capsules).toBeDefined();
    expect(Array.isArray(data.capsules)).toBe(true);
  });

  it('should filter by tags', async () => {
    const response = await fetch('http://localhost:3000/api/capsules?tags[]=famille');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.capsules).toBeDefined();
  });
});

describe('POST /api/capsules', () => {
  it('should require authentication', async () => {
    const response = await fetch('http://localhost:3000/api/capsules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test',
        content: '<p>Test</p>',
      }),
    });

    expect(response.status).toBe(401);
  });
});
```

#### Checklist
- [ ] Tests intégration API créés
- [ ] Tests GET, POST, PUT, DELETE
- [ ] Tests authentification
- [ ] Tests permissions (roles)
- [ ] Tests validations (Zod errors)

---

## ✅ Critères de Validation v0.3.0

### Tests Automatiques
```bash
# 1. Tests unitaires
pnpm test src/server/services     # ✅ Coverage ≥ 80%

# 2. Tests intégration
pnpm test src/app/api              # ✅ Tous passent

# 3. Linting
pnpm lint                          # ✅ 0 warnings

# 4. Type check
pnpm type-check                    # ✅ 0 errors

# 5. Build
pnpm build                         # ✅ Succès
```

### Tests Manuels API (Postman/Thunder Client)
- [ ] `GET /api/capsules` - Liste capsules publiées
- [ ] `POST /api/capsules` - Créer capsule (avec auth EDITOR)
- [ ] `GET /api/capsules/[id]` - Détails capsule
- [ ] `PUT /api/capsules/[id]` - Update capsule (owner)
- [ ] `DELETE /api/capsules/[id]` - Delete capsule (owner)
- [ ] `GET /api/tags` - Liste tags
- [ ] `POST /api/likes` - Like capsule (avec auth READER)
- [ ] `POST /api/comments` - Créer comment (avec auth READER)

### Checklist Complète
- [ ] Service layer complet (6 services)
- [ ] Zod schemas créés (4 schemas)
- [ ] API routes complètes (15+ routes)
- [ ] HTTP client unifié fonctionnel
- [ ] Tests unitaires ≥ 80% coverage
- [ ] Tests intégration passent
- [ ] Permissions vérifiées (VISITOR/READER/EDITOR/ADMIN)
- [ ] Error handling standardisé
- [ ] Documentation API (Postman collection ou README)

---

## 📦 Commit & Tag Release

```bash
git checkout dev
git add .
git commit -m "feat(api): implement API routes and service layer

- Complete service layer (capsules, tags, likes, comments)
- Zod validation schemas
- API routes REST (GET, POST, PUT, DELETE)
- HTTP client unifié
- Unit tests (80%+ coverage)
- Integration tests API routes
- Permissions handling (roles)

✅ All tests passing (80%+ coverage)
✅ API fully functional"

git checkout main
git merge dev
git tag -a v0.3.0 -m "Release v0.3.0 - API Routes & Service Layer

✅ Service layer complete
✅ API REST functional
✅ Zod validations
✅ HTTP client unified
✅ Tests passing (80%+ coverage)
✅ Ready for v0.4.0 (UI Components)"

git push origin main dev v0.3.0
```

---

## 🔄 Prochaines Étapes

➡️ **v0.4.0 - Feed Public & Capsule Viewer**
- Composants UI de base
- Page Feed avec pagination infinie
- Page Capsule Viewer
- TanStack Query setup

---

**Version**: v0.3.0
**Status**: 🔴 Not Started
**Durée estimée**: 5 jours
**Prérequis**: v0.2.0 ✅
**Next**: v0.4.0 - Feed Public & Capsule Viewer
