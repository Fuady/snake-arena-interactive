import { PrismaClient } from '@prisma/client';
import { LeaderboardEntry, GameMode } from '../types/index.js';

const prisma = new PrismaClient();

export const leaderboardService = {
    async getLeaderboard(
        gameMode?: GameMode,
        limit: number = 10
    ): Promise<LeaderboardEntry[]> {
        const entries = await prisma.leaderboardEntry.findMany({
            where: gameMode ? { gameMode } : undefined,
            orderBy: [{ score: 'desc' }, { timestamp: 'desc' }],
            take: limit,
            select: {
                userId: true,
                username: true,
                score: true,
                gameMode: true,
                timestamp: true,
            },
        });

        return entries.map((entry) => ({
            userId: entry.userId,
            username: entry.username,
            score: entry.score,
            gameMode: entry.gameMode as GameMode,
            timestamp: Number(entry.timestamp),
        }));
    },

    async submitScore(
        userId: string,
        username: string,
        score: number,
        gameMode: GameMode
    ): Promise<LeaderboardEntry> {
        const timestamp = Date.now();

        const entry = await prisma.leaderboardEntry.create({
            data: {
                userId,
                username,
                score,
                gameMode,
                timestamp: BigInt(timestamp),
            },
            select: {
                userId: true,
                username: true,
                score: true,
                gameMode: true,
                timestamp: true,
            },
        });

        return {
            userId: entry.userId,
            username: entry.username,
            score: entry.score,
            gameMode: entry.gameMode as GameMode,
            timestamp: Number(entry.timestamp),
        };
    },
};
