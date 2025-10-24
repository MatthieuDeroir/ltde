import { prisma } from '@/lib/db';

export async function getCommentsByCapsule(capsuleId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      capsuleId,
      parentId: null, // Top-level comments only
      isDeleted: false,
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
