import { z } from 'zod';
import { gameModeSchema } from './leaderboardValidators.js';

export const createSessionSchema = z.object({
    gameMode: gameModeSchema,
});

export const endSessionSchema = z.object({
    finalScore: z.number().int().min(0, 'Final score must be a non-negative integer'),
});

export const getSessionsQuerySchema = z.object({
    gameMode: gameModeSchema.optional(),
});
