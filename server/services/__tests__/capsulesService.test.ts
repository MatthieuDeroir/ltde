import { PrismaClient } from '@prisma/client';
import {
  getCapsules,
  getCapsuleById,
  createCapsule,
  updateCapsule,
  deleteCapsule,
  publishCapsule,
} from '../capsulesService';

const prisma = new PrismaClient();

describe('capsulesService', () => {
  let testUserId: string;

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

    it('should create capsule with tags', async () => {
      // Create a tag first
      const tag = await prisma.tag.create({
        data: {
          name: 'Test Tag',
          slug: 'test-tag',
        },
      });

      const capsule = await createCapsule(testUserId, {
        title: 'Test Capsule with Tags',
        content: '<p>Test content</p>',
        tagIds: [tag.id],
      });

      expect(capsule.tags).toBeDefined();
      expect(capsule.tags.length).toBe(1);

      // Cleanup tag
      await prisma.tag.delete({ where: { id: tag.id } });
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

    it('should paginate results', async () => {
      // Create multiple capsules
      for (let i = 0; i < 5; i++) {
        await createCapsule(testUserId, {
          title: `Capsule ${i}`,
          content: '<p>Content</p>',
          status: 'PUBLISHED',
        });
      }

      const result = await getCapsules({ limit: 3 });

      expect(result.capsules.length).toBeLessThanOrEqual(3);
      expect(result.nextCursor).toBeDefined();
    });
  });

  describe('getCapsuleById', () => {
    it('should get capsule by id', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Test Capsule',
        content: '<p>Content</p>',
        status: 'PUBLISHED',
      });

      const capsule = await getCapsuleById(created.id);

      expect(capsule).toBeDefined();
      expect(capsule.id).toBe(created.id);
      expect(capsule.title).toBe('Test Capsule');
    });

    it('should throw error if capsule not found', async () => {
      await expect(getCapsuleById('invalid-id')).rejects.toThrow('Capsule not found');
    });

    it('should throw error if draft not owned', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Draft Capsule',
        content: '<p>Content</p>',
        status: 'DRAFT',
      });

      await expect(getCapsuleById(created.id, 'other-user-id')).rejects.toThrow('Not authorized');
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

    it('should throw error if not owner', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Test',
        content: '<p>Content</p>',
      });

      await expect(
        deleteCapsule(created.id, 'other-user-id')
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('publishCapsule', () => {
    it('should publish capsule', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Draft Capsule',
        content: '<p>Content</p>',
        status: 'DRAFT',
      });

      const published = await publishCapsule(created.id, testUserId);

      expect(published.status).toBe('PUBLISHED');
      expect(published.publishedAt).toBeDefined();
    });

    it('should throw error if not owner', async () => {
      const created = await createCapsule(testUserId, {
        title: 'Test',
        content: '<p>Content</p>',
      });

      await expect(
        publishCapsule(created.id, 'other-user-id')
      ).rejects.toThrow('Not authorized');
    });
  });
});
