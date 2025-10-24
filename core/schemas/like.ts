import { z } from 'zod';

export const toggleLikeSchema = z.object({
  capsuleId: z.string().cuid(),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;
