// API client service for backend communication
import { GameMode, GameSession, LeaderboardEntry, User } from '@/types/game';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Token management
const TOKEN_KEY = 'snake_arena_token';

const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

// API Response types
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface AuthResponse {
    success: boolean;
    user: User;
    token: string;
}

interface SubmitScoreResponse {
    success: boolean;
    entry: LeaderboardEntry;
}

interface CreateSessionResponse {
    success: boolean;
    session: GameSession;
}

interface MessageResponse {
    success: boolean;
    message: string;
}

// HTTP client with error handling
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}

export const api = {
    // Authentication
    async login(username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
        try {
            const response = await fetchApi<AuthResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            if (response.token) {
                setToken(response.token);
            }

            return {
                success: response.success,
                user: response.user,
                token: response.token,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Login failed',
            };
        }
    },

    async signup(username: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
        try {
            const response = await fetchApi<AuthResponse>('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            if (response.token) {
                setToken(response.token);
            }

            return {
                success: response.success,
                user: response.user,
                token: response.token,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Signup failed',
            };
        }
    },

    async logout(): Promise<void> {
        try {
            await fetchApi<MessageResponse>('/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            removeToken();
        }
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const token = getToken();
            if (!token) {
                return null;
            }

            const user = await fetchApi<User>('/auth/me');
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            removeToken();
            return null;
        }
    },

    // Leaderboard
    async getLeaderboard(gameMode?: GameMode, limit: number = 10): Promise<LeaderboardEntry[]> {
        try {
            const params = new URLSearchParams();
            if (gameMode) {
                params.append('gameMode', gameMode);
            }
            params.append('limit', limit.toString());

            const entries = await fetchApi<LeaderboardEntry[]>(`/leaderboard?${params.toString()}`);
            return entries;
        } catch (error) {
            console.error('Get leaderboard error:', error);
            return [];
        }
    },

    async submitScore(score: number, gameMode: GameMode): Promise<{ success: boolean; entry?: LeaderboardEntry }> {
        try {
            const response = await fetchApi<SubmitScoreResponse>('/leaderboard/submit', {
                method: 'POST',
                body: JSON.stringify({ score, gameMode }),
            });

            return {
                success: response.success,
                entry: response.entry,
            };
        } catch (error) {
            console.error('Submit score error:', error);
            return { success: false };
        }
    },

    // Sessions (Spectating)
    async getActiveSessions(gameMode?: GameMode): Promise<GameSession[]> {
        try {
            const params = new URLSearchParams();
            if (gameMode) {
                params.append('gameMode', gameMode);
            }

            const sessions = await fetchApi<GameSession[]>(`/sessions?${params.toString()}`);
            return sessions;
        } catch (error) {
            console.error('Get active sessions error:', error);
            return [];
        }
    },

    async watchSession(sessionId: string): Promise<GameSession | null> {
        try {
            const session = await fetchApi<GameSession>(`/sessions/${sessionId}`);
            return session;
        } catch (error) {
            console.error('Watch session error:', error);
            return null;
        }
    },

    async createSession(gameMode: GameMode): Promise<{ success: boolean; session?: GameSession }> {
        try {
            const response = await fetchApi<CreateSessionResponse>('/sessions/create', {
                method: 'POST',
                body: JSON.stringify({ gameMode }),
            });

            return {
                success: response.success,
                session: response.session,
            };
        } catch (error) {
            console.error('Create session error:', error);
            return { success: false };
        }
    },

    async endSession(sessionId: string, finalScore: number): Promise<{ success: boolean }> {
        try {
            const response = await fetchApi<MessageResponse>(`/sessions/${sessionId}/end`, {
                method: 'POST',
                body: JSON.stringify({ finalScore }),
            });

            return { success: response.success };
        } catch (error) {
            console.error('End session error:', error);
            return { success: false };
        }
    },

    // Helper to check if user is authenticated
    isAuthenticated(): boolean {
        return getToken() !== null;
    },

    // Helper to get token (for debugging or external use)
    getAuthToken(): string | null {
        return getToken();
    },
};
