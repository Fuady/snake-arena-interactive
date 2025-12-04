import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

/**
 * Get singleton Prisma client instance
 */
export function getPrismaClient(): PrismaClient {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
    }
    return prisma;
}

/**
 * Disconnect from database
 */
export async function disconnectDb(): Promise<void> {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}

/**
 * Reset database (for testing)
 */
export async function resetDatabase(): Promise<void> {
    const client = getPrismaClient();

    // Delete all records in reverse order of dependencies
    await client.leaderboardEntry.deleteMany({});
    await client.gameSession.deleteMany({});
    await client.user.deleteMany({});
}
