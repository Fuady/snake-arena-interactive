import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/password.js';

const prisma = new PrismaClient();

/**
 * Reset database - delete all data
 */
export async function resetDatabase(): Promise<void> {
    await prisma.leaderboardEntry.deleteMany({});
    await prisma.gameSession.deleteMany({});
    await prisma.user.deleteMany({});
}

/**
 * Seed test users
 */
export async function seedUsers() {
    const password = await hashPassword('password123');

    const user1 = await prisma.user.create({
        data: {
            userId: 'test-user-1',
            username: 'testuser1',
            password,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            userId: 'test-user-2',
            username: 'testuser2',
            password,
        },
    });

    return { user1, user2 };
}

/**
 * Seed test leaderboard entries
 */
export async function seedLeaderboard() {
    const entries = await prisma.leaderboardEntry.createMany({
        data: [
            {
                userId: 'test-user-1',
                username: 'testuser1',
                score: 2500,
                gameMode: 'walls',
                timestamp: BigInt(Date.now() - 3600000),
            },
            {
                userId: 'test-user-2',
                username: 'testuser2',
                score: 2000,
                gameMode: 'walls',
                timestamp: BigInt(Date.now() - 7200000),
            },
            {
                userId: 'test-user-1',
                username: 'testuser1',
                score: 1800,
                gameMode: 'pass-through',
                timestamp: BigInt(Date.now() - 10800000),
            },
        ],
    });

    return entries;
}

/**
 * Seed test game sessions
 */
export async function seedSessions() {
    const session1 = await prisma.gameSession.create({
        data: {
            sessionId: 'test-session-1',
            userId: 'test-user-1',
            username: 'testuser1',
            gameMode: 'walls',
            score: 1500,
            isActive: true,
            startedAt: BigInt(Date.now() - 120000),
        },
    });

    const session2 = await prisma.gameSession.create({
        data: {
            sessionId: 'test-session-2',
            userId: 'test-user-2',
            username: 'testuser2',
            gameMode: 'pass-through',
            score: 1000,
            isActive: true,
            startedAt: BigInt(Date.now() - 60000),
        },
    });

    return { session1, session2 };
}

/**
 * Get Prisma client for tests
 */
export function getTestPrismaClient(): PrismaClient {
    return prisma;
}

/**
 * Disconnect from database
 */
export async function disconnectTestDb(): Promise<void> {
    await prisma.$disconnect();
}
