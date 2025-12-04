import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, extractToken, authHeader } from './helpers/testServer.js';
import { seedUsers, seedLeaderboard } from './helpers/testDb.js';

const app = createTestApp();

describe('Leaderboard API', () => {
    describe('GET /api/v1/leaderboard', () => {
        beforeEach(async () => {
            await seedUsers();
            await seedLeaderboard();
        });

        it('should get all leaderboard entries', async () => {
            const response = await request(app)
                .get('/api/v1/leaderboard');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('userId');
            expect(response.body[0]).toHaveProperty('username');
            expect(response.body[0]).toHaveProperty('score');
            expect(response.body[0]).toHaveProperty('gameMode');
            expect(response.body[0]).toHaveProperty('timestamp');
        });

        it('should filter leaderboard by game mode (walls)', async () => {
            const response = await request(app)
                .get('/api/v1/leaderboard')
                .query({ gameMode: 'walls' });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((entry: any) => {
                expect(entry.gameMode).toBe('walls');
            });
        });

        it('should filter leaderboard by game mode (pass-through)', async () => {
            const response = await request(app)
                .get('/api/v1/leaderboard')
                .query({ gameMode: 'pass-through' });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((entry: any) => {
                expect(entry.gameMode).toBe('pass-through');
            });
        });

        it('should limit number of entries', async () => {
            const response = await request(app)
                .get('/api/v1/leaderboard')
                .query({ limit: 2 });

            expect(response.status).toBe(200);
            expect(response.body.length).toBeLessThanOrEqual(2);
        });

        it('should return entries sorted by score (descending)', async () => {
            const response = await request(app)
                .get('/api/v1/leaderboard');

            expect(response.status).toBe(200);
            const scores = response.body.map((entry: any) => entry.score);
            const sortedScores = [...scores].sort((a, b) => b - a);
            expect(scores).toEqual(sortedScores);
        });
    });

    describe('POST /api/v1/leaderboard/submit', () => {
        let token: string;

        beforeEach(async () => {
            await seedUsers();
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });
            token = extractToken(loginResponse)!;
        });

        it('should submit score successfully when authenticated', async () => {
            const response = await request(app)
                .post('/api/v1/leaderboard/submit')
                .set(authHeader(token))
                .send({
                    score: 3000,
                    gameMode: 'walls',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.entry).toMatchObject({
                username: 'testuser1',
                score: 3000,
                gameMode: 'walls',
            });
        });

        it('should reject score submission without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/leaderboard/submit')
                .send({
                    score: 3000,
                    gameMode: 'walls',
                });

            expect(response.status).toBe(401);
        });

        it('should reject invalid score (negative)', async () => {
            const response = await request(app)
                .post('/api/v1/leaderboard/submit')
                .set(authHeader(token))
                .send({
                    score: -100,
                    gameMode: 'walls',
                });

            expect(response.status).toBe(400);
        });

        it('should reject invalid game mode', async () => {
            const response = await request(app)
                .post('/api/v1/leaderboard/submit')
                .set(authHeader(token))
                .send({
                    score: 1000,
                    gameMode: 'invalid-mode',
                });

            expect(response.status).toBe(400);
        });
    });
});
