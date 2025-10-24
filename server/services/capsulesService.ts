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
