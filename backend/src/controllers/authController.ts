import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { signupSchema, loginSchema } from '../validators/authValidators.js';

export const authController = {
    async signup(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = signupSchema.parse(req.body);
            const result = await authService.signup(username, password);

            if (!result.success) {
                res.status(result.error === 'Username already exists' ? 409 : 400).json(result);
                return;
            }

            res.status(201).json(result);
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

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = loginSchema.parse(req.body);
            const result = await authService.login(username, password);

            if (!result.success) {
                res.status(401).json(result);
                return;
            }

            res.status(200).json(result);
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

    async logout(req: Request, res: Response): Promise<void> {
        // In a stateless JWT system, logout is handled client-side
        // The client should remove the token
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    },

    async getCurrentUser(req: Request, res: Response): Promise<void> {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }

        const user = await authService.getCurrentUser(req.user.userId);

        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }

        res.status(200).json(user);
    },
};
