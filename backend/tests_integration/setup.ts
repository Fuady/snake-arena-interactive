import { beforeAll, afterEach, afterAll } from 'vitest';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables FIRST before any imports that use Prisma
dotenv.config({ path: path.join(__dirname, '../.env.test') });

// Set DATABASE_URL explicitly for tests
process.env.DATABASE_URL = 'file:./test.db';
process.env.NODE_ENV = 'test';

// Now import database utilities after environment is set
import { resetDatabase, disconnectTestDb } from './helpers/testDb.js';

// Setup hooks
beforeAll(async () => {
    // Ensure we're using test database
    if (!process.env.DATABASE_URL?.includes('test.db')) {
        throw new Error('Test database not configured! DATABASE_URL must point to test.db');
    }

    // Push schema to test database
    try {
        await execAsync('npx prisma db push --skip-generate', {
            cwd: path.join(__dirname, '..'),
            env: { ...process.env, DATABASE_URL: 'file:./test.db' },
        });
    } catch (error) {
        console.error('Failed to push schema to test database:', error);
        throw error;
    }
});

afterEach(async () => {
    // Clean up database after each test
    await resetDatabase();
});

afterAll(async () => {
    // Disconnect from database
    await disconnectTestDb();
});
