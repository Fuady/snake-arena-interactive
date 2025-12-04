import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from '../../src/routes/auth.js';
import leaderboardRoutes from '../../src/routes/leaderboard.js';
import sessionsRoutes from '../../src/routes/sessions.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';

/**
 * Create Express app for testing
 */
export function createTestApp(): Express {
    const app = express();

    // Middleware
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/leaderboard', leaderboardRoutes);
    app.use('/api/v1/sessions', sessionsRoutes);

    // Error handler
    app.use(errorHandler);

    return app;
}

/**
 * Helper to extract JWT token from response
 */
export function extractToken(response: any): string | null {
    return response.body?.token || null;
}

/**
 * Helper to create authorization header
 */
export function authHeader(token: string): { Authorization: string } {
    return { Authorization: `Bearer ${token}` };
}
