import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, extractToken, authHeader } from './helpers/testServer.js';
import { seedUsers, seedSessions } from './helpers/testDb.js';

const app = createTestApp();

describe('Sessions API', () => {
    describe('GET /api/v1/sessions', () => {
        beforeEach(async () => {
            await seedUsers();
            await seedSessions();
        });

        it('should get all active sessions', async () => {
            const response = await request(app)
                .get('/api/v1/sessions');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('sessionId');
            expect(response.body[0]).toHaveProperty('userId');
            expect(response.body[0]).toHaveProperty('username');
            expect(response.body[0]).toHaveProperty('gameMode');
            expect(response.body[0]).toHaveProperty('score');
            expect(response.body[0]).toHaveProperty('isActive');
        });

        it('should filter sessions by game mode', async () => {
            const response = await request(app)
                .get('/api/v1/sessions')
                .query({ gameMode: 'walls' });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((session: any) => {
                expect(session.gameMode).toBe('walls');
            });
        });

        it('should only return active sessions', async () => {
            const response = await request(app)
                .get('/api/v1/sessions');

            expect(response.status).toBe(200);
            response.body.forEach((session: any) => {
                expect(session.isActive).toBe(true);
            });
        });
    });

    describe('GET /api/v1/sessions/:sessionId', () => {
        beforeEach(async () => {
            await seedUsers();
            await seedSessions();
        });

        it('should get specific session by ID', async () => {
            const response = await request(app)
                .get('/api/v1/sessions/test-session-1');

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                sessionId: 'test-session-1',
                username: 'testuser1',
                gameMode: 'walls',
            });
        });

        it('should return 404 for non-existent session', async () => {
            const response = await request(app)
                .get('/api/v1/sessions/non-existent-session');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/sessions/create', () => {
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

        it('should create session successfully when authenticated', async () => {
            const response = await request(app)
                .post('/api/v1/sessions/create')
                .set(authHeader(token))
                .send({
                    gameMode: 'walls',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.session).toMatchObject({
                username: 'testuser1',
                gameMode: 'walls',
                isActive: true,
                score: 0,
            });
            expect(response.body.session.sessionId).toBeDefined();
        });

        it('should reject session creation without authentication', async () => {
            const response = await request(app)
                .post('/api/v1/sessions/create')
                .send({
                    gameMode: 'walls',
                });

            expect(response.status).toBe(401);
        });

        it('should reject invalid game mode', async () => {
            const response = await request(app)
                .post('/api/v1/sessions/create')
                .set(authHeader(token))
                .send({
                    gameMode: 'invalid-mode',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/v1/sessions/:sessionId/end', () => {
        let token: string;
        let sessionId: string;

        beforeEach(async () => {
            await seedUsers();
            const loginResponse = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });
            token = extractToken(loginResponse)!;

            // Create a session
            const createResponse = await request(app)
                .post('/api/v1/sessions/create')
                .set(authHeader(token))
                .send({
                    gameMode: 'walls',
                });
            sessionId = createResponse.body.session.sessionId;
        });

        it('should end session successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/sessions/${sessionId}/end`)
                .set(authHeader(token))
                .send({
                    finalScore: 2500,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should reject ending session without authentication', async () => {
            const response = await request(app)
                .post(`/api/v1/sessions/${sessionId}/end`)
                .send({
                    finalScore: 2500,
                });

            expect(response.status).toBe(401);
        });

        it('should reject ending non-existent session', async () => {
            const response = await request(app)
                .post('/api/v1/sessions/non-existent/end')
                .set(authHeader(token))
                .send({
                    finalScore: 2500,
                });

            expect(response.status).toBe(404);
        });

        it('should reject invalid final score (negative)', async () => {
            const response = await request(app)
                .post(`/api/v1/sessions/${sessionId}/end`)
                .set(authHeader(token))
                .send({
                    finalScore: -100,
                });

            expect(response.status).toBe(400);
        });
    });
});
