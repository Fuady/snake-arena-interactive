// Centralized mock API service for all backend calls
import { GameMode, GameSession, LeaderboardEntry, User } from '@/types/game';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user storage
let currentUser: User | null = null;
const mockUsers: Map<string, { username: string; password: string; userId: string }> = new Map();

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { userId: '1', username: 'SnakeKing', score: 2450, gameMode: 'walls', timestamp: Date.now() - 3600000 },
  { userId: '2', username: 'CyberViper', score: 2100, gameMode: 'walls', timestamp: Date.now() - 7200000 },
  { userId: '3', username: 'NeonCrawler', score: 1890, gameMode: 'pass-through', timestamp: Date.now() - 10800000 },
  { userId: '4', username: 'GridMaster', score: 1750, gameMode: 'walls', timestamp: Date.now() - 14400000 },
  { userId: '5', username: 'PixelHunter', score: 1520, gameMode: 'pass-through', timestamp: Date.now() - 18000000 },
];

// Mock active game sessions for spectating
const mockActiveSessions: Map<string, GameSession> = new Map();

export const mockApi = {
  // Authentication
  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(500);
    
    const stored = mockUsers.get(username);
    if (stored && stored.password === password) {
      currentUser = { userId: stored.userId, username };
      return { success: true, user: currentUser };
    }
    
    return { success: false, error: 'Invalid username or password' };
  },

  async signup(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await delay(500);
    
    if (mockUsers.has(username)) {
      return { success: false, error: 'Username already exists' };
    }
    
    const userId = `user-${Date.now()}`;
    mockUsers.set(username, { username, password, userId });
    currentUser = { userId, username };
    
    return { success: true, user: currentUser };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
  },

  getCurrentUser(): User | null {
    return currentUser;
  },

  // Leaderboard
  async getLeaderboard(gameMode?: GameMode): Promise<LeaderboardEntry[]> {
    await delay(300);
    
    let leaderboard = [...mockLeaderboard];
    if (gameMode) {
      leaderboard = leaderboard.filter(entry => entry.gameMode === gameMode);
    }
    
    return leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
  },

  async submitScore(score: number, gameMode: GameMode): Promise<{ success: boolean }> {
    await delay(400);
    
    if (!currentUser) {
      return { success: false };
    }
    
    const entry: LeaderboardEntry = {
      userId: currentUser.userId,
      username: currentUser.username,
      score,
      gameMode,
      timestamp: Date.now(),
    };
    
    mockLeaderboard.push(entry);
    return { success: true };
  },

  // Spectating
  async getActiveSessions(): Promise<GameSession[]> {
    await delay(300);
    
    // Generate mock active sessions
    const sessions: GameSession[] = [
      {
        sessionId: 'session-1',
        userId: '2',
        username: 'CyberViper',
        gameMode: 'walls',
        score: 1250,
        isActive: true,
        startedAt: Date.now() - 120000,
      },
      {
        sessionId: 'session-2',
        userId: '3',
        username: 'NeonCrawler',
        gameMode: 'pass-through',
        score: 890,
        isActive: true,
        startedAt: Date.now() - 90000,
      },
      {
        sessionId: 'session-3',
        userId: '5',
        username: 'PixelHunter',
        gameMode: 'walls',
        score: 650,
        isActive: true,
        startedAt: Date.now() - 60000,
      },
    ];
    
    return sessions;
  },

  async watchSession(sessionId: string): Promise<GameSession | null> {
    await delay(200);
    
    const sessions = await this.getActiveSessions();
    return sessions.find(s => s.sessionId === sessionId) || null;
  },
};
