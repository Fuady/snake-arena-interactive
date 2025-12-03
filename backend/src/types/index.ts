export type GameMode = 'walls' | 'pass-through';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
    x: number;
    y: number;
}

export interface User {
    userId: string;
    username: string;
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    gameMode: GameMode;
    timestamp: number;
}

export interface GameSession {
    sessionId: string;
    userId: string;
    username: string;
    gameMode: GameMode;
    score: number;
    isActive: boolean;
    startedAt: number;
    endedAt?: number;
}

export interface GameState {
    snake: Position[];
    food: Position;
    direction: Direction;
    score: number;
    isGameOver: boolean;
    isPaused: boolean;
}

// Request types
export interface SignupRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SubmitScoreRequest {
    score: number;
    gameMode: GameMode;
}

export interface CreateSessionRequest {
    gameMode: GameMode;
}

export interface EndSessionRequest {
    finalScore: number;
}

// Response types
export interface AuthResponse {
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
}

export interface SuccessResponse {
    success: boolean;
    message?: string;
}

export interface ErrorResponse {
    success: false;
    error: string;
}

// JWT Payload
export interface JwtPayload {
    userId: string;
    username: string;
}

// Express Request extension
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
