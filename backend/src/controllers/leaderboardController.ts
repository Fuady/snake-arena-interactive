import { Request, Response } from 'express';
import { leaderboardService } from '../services/leaderboardService.js';
import {
    submitScoreSchema,
    getLeaderboardQuerySchema,
} from '../validators/leaderboardValidators.js';

export const leaderboardController = {
    async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const { gameMode, limit } = getLeaderboardQuerySchema.parse(req.query);
            const leaderboard = await leaderboardService.getLeaderboard(gameMode, limit);

            res.status(200).json(leaderboard);
        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    error: 'Validation error',
                    details: error.message,
                });
                return;
            }
            throw error;
        }
    },

    async submitScore(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const { score, gameMode } = submitScoreSchema.parse(req.body);
            const entry = await leaderboardService.submitScore(
                req.user.userId,
                req.user.username,
                score,
                gameMode
            );

            res.status(201).json({
                success: true,
                entry,
            });
        } catch (error) {
            if (error instanceof Error && error.name === 'ZodError') {
                res.status(400).json({
                    success: false,
                    error: 'Validation error',
                    details: error.message,
                });
                return;
            }
            throw error;
        }
    },
};
