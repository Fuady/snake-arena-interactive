import { z } from 'zod';

export const gameModeSchema = z.enum(['walls', 'pass-through']);

export const submitScoreSchema = z.object({
    score: z.number().int().min(0, 'Score must be a non-negative integer'),
    gameMode: gameModeSchema,
});

export const getLeaderboardQuerySchema = z.object({
    gameMode: gameModeSchema.optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
});
