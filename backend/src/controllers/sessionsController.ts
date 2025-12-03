import { Request, Response } from 'express';
import { sessionsService } from '../services/sessionsService.js';
import {
    createSessionSchema,
    endSessionSchema,
    getSessionsQuerySchema,
} from '../validators/sessionValidators.js';

export const sessionsController = {
    async getActiveSessions(req: Request, res: Response): Promise<void> {
        try {
            const { gameMode } = getSessionsQuerySchema.parse(req.query);
            const sessions = await sessionsService.getActiveSessions(gameMode);

            res.status(200).json(sessions);
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

    async getSessionById(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.params;
        const session = await sessionsService.getSessionById(sessionId);

        if (!session) {
            res.status(404).json({
                success: false,
                error: 'Session not found',
            });
            return;
        }

        res.status(200).json(session);
    },

    async createSession(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const { gameMode } = createSessionSchema.parse(req.body);
            const session = await sessionsService.createSession(
                req.user.userId,
                req.user.username,
                gameMode
            );

            res.status(201).json({
                success: true,
                session,
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

    async endSession(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required',
                });
                return;
            }

            const { sessionId } = req.params;
            const { finalScore } = endSessionSchema.parse(req.body);

            await sessionsService.endSession(sessionId, req.user.userId, finalScore);

            res.status(200).json({
                success: true,
                message: 'Session ended successfully',
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'ZodError') {
                    res.status(400).json({
                        success: false,
                        error: 'Validation error',
                        details: error.message,
                    });
                    return;
                }

                if (error.message === 'Session not found') {
                    res.status(404).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }

                if (error.message === 'Not authorized to end this session') {
                    res.status(403).json({
                        success: false,
                        error: error.message,
                    });
                    return;
                }
            }
            throw error;
        }
    },
};
