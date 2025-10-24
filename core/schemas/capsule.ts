import { z } from 'zod';
import { CapsuleStatus } from '@prisma/client';

export const createCapsuleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  status: z.nativeEnum(CapsuleStatus).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  location: z.string().max(200).optional(),
  people: z.string().max(500).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateCapsuleSchema = createCapsuleSchema.partial();

export const getCapsulesSchema = z.object({
  status: z.nativeEnum(CapsuleStatus).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>;
export type UpdateCapsuleInput = z.infer<typeof updateCapsuleSchema>;
export type GetCapsulesInput = z.infer<typeof getCapsulesSchema>;
