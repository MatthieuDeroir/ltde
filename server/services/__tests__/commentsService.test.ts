import { PrismaClient } from '@prisma/client';
import {
  getCommentsByCapsule,
  createComment,
  updateComment,
  deleteComment,
} from '../commentsService';
import { createCapsule } from '../capsulesService';

const prisma = new PrismaClient();

describe('commentsService', () => {
  let testUserId: string;
  let testCapsuleId: string;

  beforeEach(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test-comments@example.com',
        username: 'test-comments',
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
    await prisma.comment.deleteMany({ where: { userId: testUserId } });
    await prisma.capsule.deleteMany({ where: { id: testCapsuleId } });
    await prisma.user.delete({ where: { id: testUserId } });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const comment = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Test comment',
      });

      expect(comment).toBeDefined();
      expect(comment.content).toBe('Test comment');
      expect(comment.userId).toBe(testUserId);
      expect(comment.capsuleId).toBe(testCapsuleId);
    });

    it('should create a reply', async () => {
      const parent = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Parent comment',
      });

      const reply = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Reply comment',
        parentId: parent.id,
      });

      expect(reply).toBeDefined();
      expect(reply.parentId).toBe(parent.id);
    });
  });

  describe('getCommentsByCapsule', () => {
    it('should get comments for a capsule', async () => {
      await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Comment 1',
      });

      await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Comment 2',
      });

      const comments = await getCommentsByCapsule(testCapsuleId);

      expect(comments).toBeDefined();
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(2);
    });

    it('should include nested replies', async () => {
      const parent = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Parent comment',
      });

      await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Reply comment',
        parentId: parent.id,
      });

      const comments = await getCommentsByCapsule(testCapsuleId);

      expect(comments.length).toBe(1);
      expect(comments[0].replies.length).toBe(1);
    });

    it('should not show deleted comments', async () => {
      const comment = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'To be deleted',
      });

      await deleteComment(comment.id, testUserId, false);

      const comments = await getCommentsByCapsule(testCapsuleId);

      expect(comments.length).toBe(0);
    });
  });

  describe('updateComment', () => {
    it('should update comment', async () => {
      const created = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Original content',
      });

      const updated = await updateComment(created.id, testUserId, 'Updated content');

      expect(updated.content).toBe('Updated content');
      expect(updated.isEdited).toBe(true);
    });

    it('should throw error if not owner', async () => {
      const created = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Test comment',
      });

      await expect(
        updateComment(created.id, 'other-user-id', 'Hacked')
      ).rejects.toThrow('Not authorized');
    });
  });

  describe('deleteComment', () => {
    it('should soft delete comment', async () => {
      const created = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'To delete',
      });

      const deleted = await deleteComment(created.id, testUserId, false);

      expect(deleted.isDeleted).toBe(true);
      expect(deleted.content).toBe('[supprimé]');
      expect(deleted.deletedAt).toBeDefined();
    });

    it('should allow admin to delete any comment', async () => {
      const created = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Test comment',
      });

      const deleted = await deleteComment(created.id, 'admin-user-id', true);

      expect(deleted.isDeleted).toBe(true);
    });

    it('should throw error if not owner and not admin', async () => {
      const created = await createComment(testUserId, {
        capsuleId: testCapsuleId,
        content: 'Test comment',
      });

      await expect(
        deleteComment(created.id, 'other-user-id', false)
      ).rejects.toThrow('Not authorized');
    });
  });
});
