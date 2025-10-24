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
