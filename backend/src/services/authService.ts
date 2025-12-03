import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { User, AuthResponse } from '../types/index.js';

const prisma = new PrismaClient();

export const authService = {
    async signup(username: string, password: string): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return {
                success: false,
                error: 'Username already exists',
            };
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const userId = `user-${Date.now()}`;
        const user = await prisma.user.create({
            data: {
                userId,
                username,
                password: passwordHash,
            },
        });

        // Generate token
        const token = generateToken({ userId: user.userId, username: user.username });

        return {
            success: true,
            user: {
                userId: user.userId,
                username: user.username,
            },
            token,
        };
    },

    async login(username: string, password: string): Promise<AuthResponse> {
        // Find user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return {
                success: false,
                error: 'Invalid username or password',
            };
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                error: 'Invalid username or password',
            };
        }

        // Generate token
        const token = generateToken({ userId: user.userId, username: user.username });

        return {
            success: true,
            user: {
                userId: user.userId,
                username: user.username,
            },
            token,
        };
    },

    async getCurrentUser(userId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { userId },
            select: {
                userId: true,
                username: true,
            },
        });

        return user;
    },
};
