import { describe, it, expect, beforeEach } from 'vitest';
import { mockApi } from '@/services/mockApi';

describe('mockApi', () => {
  beforeEach(() => {
    // Reset user state
    mockApi.logout();
  });

  describe('authentication', () => {
    it('should signup a new user', async () => {
      const result = await mockApi.signup('testuser', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.user?.username).toBe('testuser');
    });

    it('should prevent duplicate usernames', async () => {
      await mockApi.signup('duplicate', 'pass1');
      const result = await mockApi.signup('duplicate', 'pass2');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
    });

    it('should login with correct credentials', async () => {
      await mockApi.signup('logintest', 'mypassword');
      await mockApi.logout();
      
      const result = await mockApi.login('logintest', 'mypassword');
      
      expect(result.success).toBe(true);
      expect(result.user?.username).toBe('logintest');
    });

    it('should reject invalid credentials', async () => {
      const result = await mockApi.login('nonexistent', 'wrongpass');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password');
    });

    it('should logout user', async () => {
      await mockApi.signup('logouttest', 'pass');
      expect(mockApi.getCurrentUser()).not.toBeNull();
      
      await mockApi.logout();
      
      expect(mockApi.getCurrentUser()).toBeNull();
    });
  });

  describe('leaderboard', () => {
    it('should return leaderboard entries', async () => {
      const leaderboard = await mockApi.getLeaderboard();
      
      expect(leaderboard.length).toBeGreaterThan(0);
      expect(leaderboard[0]).toHaveProperty('username');
      expect(leaderboard[0]).toHaveProperty('score');
    });

    it('should filter leaderboard by game mode', async () => {
      const wallsLeaderboard = await mockApi.getLeaderboard('walls');
      
      wallsLeaderboard.forEach(entry => {
        expect(entry.gameMode).toBe('walls');
      });
    });

    it('should sort leaderboard by score descending', async () => {
      const leaderboard = await mockApi.getLeaderboard();
      
      for (let i = 1; i < leaderboard.length; i++) {
        expect(leaderboard[i - 1].score).toBeGreaterThanOrEqual(leaderboard[i].score);
      }
    });

    it('should submit score when logged in', async () => {
      await mockApi.signup('scorer', 'pass');
      
      const result = await mockApi.submitScore(1000, 'walls');
      
      expect(result.success).toBe(true);
    });

    it('should fail to submit score when not logged in', async () => {
      await mockApi.logout();
      
      const result = await mockApi.submitScore(1000, 'walls');
      
      expect(result.success).toBe(false);
    });
  });

  describe('spectating', () => {
    it('should return active sessions', async () => {
      const sessions = await mockApi.getActiveSessions();
      
      expect(sessions.length).toBeGreaterThan(0);
      expect(sessions[0]).toHaveProperty('sessionId');
      expect(sessions[0]).toHaveProperty('username');
      expect(sessions[0].isActive).toBe(true);
    });

    it('should watch a specific session', async () => {
      const sessions = await mockApi.getActiveSessions();
      const session = await mockApi.watchSession(sessions[0].sessionId);
      
      expect(session).not.toBeNull();
      expect(session?.sessionId).toBe(sessions[0].sessionId);
    });

    it('should return null for invalid session', async () => {
      const session = await mockApi.watchSession('invalid-session-id');
      
      expect(session).toBeNull();
    });
  });
});
