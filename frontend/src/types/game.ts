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
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}
