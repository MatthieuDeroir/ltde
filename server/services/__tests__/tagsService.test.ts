import { PrismaClient } from '@prisma/client';
import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from '../tagsService';

const prisma = new PrismaClient();

describe('tagsService', () => {
  let testTagId: string;

  afterEach(async () => {
    // Cleanup
    if (testTagId) {
      await prisma.tag.delete({ where: { id: testTagId } }).catch(() => {});
    }
  });

  describe('createTag', () => {
    it('should create a tag', async () => {
      const tag = await createTag({
        name: 'Test Tag',
        color: '#FF0000',
        description: 'Test description',
      });

      expect(tag).toBeDefined();
      expect(tag.name).toBe('Test Tag');
      expect(tag.slug).toBe('test-tag');
      expect(tag.color).toBe('#FF0000');
      testTagId = tag.id;
    });

    it('should slugify tag name', async () => {
      const tag = await createTag({
        name: 'Été à Paris',
      });

      expect(tag.slug).toBe('ete-a-paris');
      testTagId = tag.id;
    });

    it('should throw error if tag already exists', async () => {
      await createTag({ name: 'Duplicate Tag' });
      const createdTag = await prisma.tag.findUnique({ where: { slug: 'duplicate-tag' } });
      testTagId = createdTag!.id;

      await expect(createTag({ name: 'Duplicate Tag' })).rejects.toThrow('Tag already exists');
    });
  });

  describe('getAllTags', () => {
    it('should get all tags', async () => {
      const tag = await createTag({ name: 'GetAll Test Tag' });
      testTagId = tag.id;

      const tags = await getAllTags();

      expect(tags).toBeDefined();
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeGreaterThan(0);
    });
  });

  describe('getTagById', () => {
    it('should get tag by id', async () => {
      const created = await createTag({ name: 'GetById Test Tag' });
      testTagId = created.id;

      const tag = await getTagById(created.id);

      expect(tag).toBeDefined();
      expect(tag.id).toBe(created.id);
      expect(tag.name).toBe('GetById Test Tag');
    });

    it('should throw error if tag not found', async () => {
      await expect(getTagById('invalid-id')).rejects.toThrow('Tag not found');
    });
  });

  describe('updateTag', () => {
    it('should update tag', async () => {
      const created = await createTag({ name: 'Original Name' });
      testTagId = created.id;

      const updated = await updateTag(created.id, {
        name: 'Updated Name',
        color: '#00FF00',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.slug).toBe('updated-name');
      expect(updated.color).toBe('#00FF00');
    });

    it('should throw error if slug already exists', async () => {
      const tag1 = await createTag({ name: 'Tag One' });
      const tag2 = await createTag({ name: 'Tag Two' });

      await expect(
        updateTag(tag2.id, { name: 'Tag One' })
      ).rejects.toThrow('Tag slug already exists');

      // Cleanup
      await prisma.tag.delete({ where: { id: tag1.id } });
      testTagId = tag2.id;
    });
  });

  describe('deleteTag', () => {
    it('should delete tag', async () => {
      const created = await createTag({ name: 'To Delete' });
      const tagId = created.id;

      const result = await deleteTag(tagId);

      expect(result.success).toBe(true);

      await expect(getTagById(tagId)).rejects.toThrow('Tag not found');
      testTagId = '';
    });
  });
});
