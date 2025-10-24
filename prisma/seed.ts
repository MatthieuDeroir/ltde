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

  console.log('✅ Users created:', {
    admin: admin.email,
    editor: editor.email,
    reader1: reader1.email,
    reader2: reader2.email,
  });

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
        description: "Souvenirs d'enfance",
      },
    }),
  ]);

  console.log('✅ Tags created:', tags.length);

  // 3. Create sample capsule (by editor)
  const capsule = await prisma.capsule.create({
    data: {
      userId: editor.id,
      title: 'Mon premier souvenir',
      content:
        "<p>Ceci est mon premier souvenir enregistré dans l'application. C'était en 1965, à Paris...</p>",
      excerpt: "Ceci est mon premier souvenir enregistré dans l'application...",
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
