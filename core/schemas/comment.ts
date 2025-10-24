import { z } from 'zod';

export const createCommentSchema = z.object({
  capsuleId: z.string().cuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().cuid().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
