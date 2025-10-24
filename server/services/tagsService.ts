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
