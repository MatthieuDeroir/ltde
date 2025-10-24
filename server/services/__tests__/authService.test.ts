import { PrismaClient } from '@prisma/client';
import { createUser, getUserById, updateUser, deleteUser } from '../authService';

const prisma = new PrismaClient();

const TEST_USER = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
  displayName: 'Test User',
};

describe('authService', () => {
  afterEach(async () => {
    // Cleanup
    await prisma.user.deleteMany({
      where: { email: TEST_USER.email },
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = await createUser(TEST_USER);

      expect(user).toBeDefined();
      expect(user.email).toBe(TEST_USER.email);
      expect(user.username).toBe(TEST_USER.username);
      expect(user.displayName).toBe(TEST_USER.displayName);
      expect(user.role).toBe('READER'); // Default
    });

    it('should throw error if user already exists', async () => {
      await createUser(TEST_USER);

      await expect(createUser(TEST_USER)).rejects.toThrow('User already exists');
    });

    it('should hash password', async () => {
      const user = await createUser(TEST_USER);

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(dbUser?.passwordHash).toBeDefined();
      expect(dbUser?.passwordHash).not.toBe(TEST_USER.password);
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const created = await createUser(TEST_USER);
      const fetched = await getUserById(created.id);

      expect(fetched).toBeDefined();
      expect(fetched.id).toBe(created.id);
      expect(fetched.email).toBe(TEST_USER.email);
    });

    it('should throw error if user not found', async () => {
      await expect(getUserById('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user profile', async () => {
      const created = await createUser(TEST_USER);
      const updated = await updateUser(created.id, {
        displayName: 'Updated Name',
        bio: 'New bio',
      });

      expect(updated.displayName).toBe('Updated Name');
      expect(updated.bio).toBe('New bio');
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const created = await createUser(TEST_USER);
      const result = await deleteUser(created.id);

      expect(result.success).toBe(true);

      await expect(getUserById(created.id)).rejects.toThrow('User not found');
    });
  });
});
