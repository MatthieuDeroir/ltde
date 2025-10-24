import { prisma } from '@/lib/db';
import { MediaType } from '@prisma/client';

interface CreateMediaData {
  capsuleId: string;
  type: MediaType;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  caption?: string;
  altText?: string;
  order?: number;
}

interface UpdateMediaData {
  caption?: string;
  altText?: string;
  order?: number;
}

export async function createMedia(data: CreateMediaData) {
  return await prisma.media.create({
    data,
  });
}

export async function getMediaById(id: string) {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      capsule: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!media) {
    throw new Error('Media not found');
  }

  return media;
}

export async function getMediaByCapsuleId(capsuleId: string) {
  return await prisma.media.findMany({
    where: { capsuleId },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function getAllMedia(filters?: {
  type?: MediaType;
  limit?: number;
  cursor?: string;
}) {
  const { type, limit = 50, cursor } = filters || {};

  return await prisma.media.findMany({
    where: {
      ...(type && { type }),
    },
    take: limit,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: 'desc' },
    include: {
      capsule: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function updateMedia(id: string, data: UpdateMediaData) {
  const media = await prisma.media.findUnique({ where: { id } });

  if (!media) {
    throw new Error('Media not found');
  }

  return await prisma.media.update({
    where: { id },
    data,
  });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });

  if (!media) {
    throw new Error('Media not found');
  }

  await prisma.media.delete({ where: { id } });

  return { success: true, id };
}
