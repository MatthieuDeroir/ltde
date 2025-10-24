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
