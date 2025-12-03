import { PrismaClient } from '@prisma/client';
import { GameSession, GameMode } from '../types/index.js';

const prisma = new PrismaClient();

export const sessionsService = {
    async getActiveSessions(gameMode?: GameMode): Promise<GameSession[]> {
        const sessions = await prisma.gameSession.findMany({
            where: {
                isActive: true,
                ...(gameMode && { gameMode }),
            },
            orderBy: { startedAt: 'desc' },
            select: {
                sessionId: true,
                userId: true,
                username: true,
                gameMode: true,
                score: true,
                isActive: true,
                startedAt: true,
                endedAt: true,
            },
        });

        return sessions.map((session) => ({
            sessionId: session.sessionId,
            userId: session.userId,
            username: session.username,
            gameMode: session.gameMode as GameMode,
            score: session.score,
            isActive: session.isActive,
            startedAt: Number(session.startedAt),
            endedAt: session.endedAt ? Number(session.endedAt) : undefined,
        }));
    },

    async getSessionById(sessionId: string): Promise<GameSession | null> {
        const session = await prisma.gameSession.findUnique({
            where: { sessionId },
            select: {
                sessionId: true,
                userId: true,
                username: true,
                gameMode: true,
                score: true,
                isActive: true,
                startedAt: true,
                endedAt: true,
            },
        });

        if (!session) {
            return null;
        }

        return {
            sessionId: session.sessionId,
            userId: session.userId,
            username: session.username,
            gameMode: session.gameMode as GameMode,
            score: session.score,
            isActive: session.isActive,
            startedAt: Number(session.startedAt),
            endedAt: session.endedAt ? Number(session.endedAt) : undefined,
        };
    },

    async createSession(
        userId: string,
        username: string,
        gameMode: GameMode
    ): Promise<GameSession> {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const startedAt = Date.now();

        const session = await prisma.gameSession.create({
            data: {
                sessionId,
                userId,
                username,
                gameMode,
                score: 0,
                isActive: true,
                startedAt: BigInt(startedAt),
            },
            select: {
                sessionId: true,
                userId: true,
                username: true,
                gameMode: true,
                score: true,
                isActive: true,
                startedAt: true,
                endedAt: true,
            },
        });

        return {
            sessionId: session.sessionId,
            userId: session.userId,
            username: session.username,
            gameMode: session.gameMode as GameMode,
            score: session.score,
            isActive: session.isActive,
            startedAt: Number(session.startedAt),
            endedAt: session.endedAt ? Number(session.endedAt) : undefined,
        };
    },

    async endSession(
        sessionId: string,
        userId: string,
        finalScore: number
    ): Promise<boolean> {
        // Check if session exists and belongs to user
        const session = await prisma.gameSession.findUnique({
            where: { sessionId },
        });

        if (!session) {
            throw new Error('Session not found');
        }

        if (session.userId !== userId) {
            throw new Error('Not authorized to end this session');
        }

        if (!session.isActive) {
            throw new Error('Session is already ended');
        }

        // End the session
        await prisma.gameSession.update({
            where: { sessionId },
            data: {
                isActive: false,
                score: finalScore,
                endedAt: BigInt(Date.now()),
            },
        });

        return true;
    },
};
