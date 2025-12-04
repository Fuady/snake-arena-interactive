import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, extractToken, authHeader } from './helpers/testServer.js';
import { seedUsers } from './helpers/testDb.js';

const app = createTestApp();

describe('Authentication API', () => {
    describe('POST /api/v1/auth/signup', () => {
        it('should create a new user successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: 'newuser',
                    password: 'password123',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toMatchObject({
                username: 'newuser',
            });
            expect(response.body.user.userId).toBeDefined();
            expect(response.body.token).toBeDefined();
        });

        it('should reject duplicate username', async () => {
            await seedUsers();

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('already exists');
        });

        it('should reject invalid username (too short)', async () => {
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: 'ab',
                    password: 'password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should reject invalid password (too short)', async () => {
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    username: 'newuser',
                    password: '12345',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await seedUsers();
        });

        it('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser1',
                    password: 'password123',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toMatchObject({
                username: 'testuser1',
            });
            expect(response.body.token).toBeDefined();
        });

        it('should reject invalid username', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Invalid');
        });

        it('should reject invalid password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    username: 'testuser1',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toContain('Invalid');
        });
    });

    describe('GET /api/v1/auth/me', () => {
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

        it('should return current user with valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set(authHeader(token));

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                username: 'testuser1',
            });
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me');

            expect(response.status).toBe(401);
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me')
                .set(authHeader('invalid-token'));

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/v1/auth/logout', () => {
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

        it('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set(authHeader(token));

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should reject logout without token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout');

            expect(response.status).toBe(401);
        });
    });
});
