import { PrismaClient } from '@prisma/client';
import { toggleLike, getLikesByCapsule } from '../likesService';
import { createCapsule } from '../capsulesService';

const prisma = new PrismaClient();

describe('likesService', () => {
  let testUserId: string;
  let testCapsuleId: string;

  beforeEach(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test-likes@example.com',
        username: 'test-likes',
        passwordHash: 'hash',
        role: 'READER',
      },
    });
    testUserId = user.id;

    // Create test capsule
    const capsule = await createCapsule(testUserId, {
      title: 'Test Capsule',
      content: '<p>Test content</p>',
      status: 'PUBLISHED',
    });
    testCapsuleId = capsule.id;
  });

  afterEach(async () => {
    // Cleanup
    await prisma.like.deleteMany({ where: { userId: testUserId } });
    await prisma.capsule.deleteMany({ where: { id: testCapsuleId } });
    await prisma.user.delete({ where: { id: testUserId } });
  });

  describe('toggleLike', () => {
    it('should like a capsule', async () => {
      const result = await toggleLike(testUserId, testCapsuleId);

      expect(result.liked).toBe(true);

      const like = await prisma.like.findUnique({
        where: {
          userId_capsuleId: {
            userId: testUserId,
            capsuleId: testCapsuleId,
          },
        },
      });

      expect(like).toBeDefined();
    });

    it('should unlike a capsule', async () => {
      // First like
      await toggleLike(testUserId, testCapsuleId);

      // Then unlike
      const result = await toggleLike(testUserId, testCapsuleId);

      expect(result.liked).toBe(false);

      const like = await prisma.like.findUnique({
        where: {
          userId_capsuleId: {
            userId: testUserId,
            capsuleId: testCapsuleId,
          },
        },
      });

      expect(like).toBeNull();
    });
  });

  describe('getLikesByCapsule', () => {
    it('should get likes for a capsule', async () => {
      await toggleLike(testUserId, testCapsuleId);

      const likes = await getLikesByCapsule(testCapsuleId);

      expect(likes).toBeDefined();
      expect(Array.isArray(likes)).toBe(true);
      expect(likes.length).toBe(1);
      expect(likes[0].userId).toBe(testUserId);
    });
  });
});
