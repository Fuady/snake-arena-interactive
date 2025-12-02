import { describe, it, expect, beforeEach } from 'vitest';
import { SnakeGame } from '../gameEngine';
import { GameState } from '@/types/game';

describe('SnakeGame', () => {
  let game: SnakeGame;

  beforeEach(() => {
    game = new SnakeGame(20, 'walls');
  });

  describe('createInitialState', () => {
    it('should create initial game state with snake in center', () => {
      const state = game.createInitialState();
      
      expect(state.snake).toHaveLength(3);
      expect(state.snake[0].x).toBe(10);
      expect(state.snake[0].y).toBe(10);
      expect(state.direction).toBe('RIGHT');
      expect(state.score).toBe(0);
      expect(state.isGameOver).toBe(false);
    });
  });

  describe('moveSnake', () => {
    it('should move snake forward in current direction', () => {
      const state = game.createInitialState();
      const newState = game.moveSnake(state);
      
      expect(newState.snake[0].x).toBe(state.snake[0].x + 1);
    });

    it('should grow snake when eating food', () => {
      const state = game.createInitialState();
      // Place food directly in front of snake
      const stateWithFood: GameState = {
        ...state,
        food: { x: state.snake[0].x + 1, y: state.snake[0].y },
      };
      
      const newState = game.moveSnake(stateWithFood);
      
      expect(newState.snake.length).toBe(state.snake.length + 1);
      expect(newState.score).toBe(state.score + 10);
    });

    it('should detect wall collision in walls mode', () => {
      const state: GameState = {
        snake: [{ x: 0, y: 0 }],
        food: { x: 5, y: 5 },
        direction: 'LEFT',
        score: 0,
        isGameOver: false,
        isPaused: false,
      };
      
      const newState = game.moveSnake(state);
      
      expect(newState.isGameOver).toBe(true);
    });

    it('should wrap around in pass-through mode', () => {
      const passGame = new SnakeGame(20, 'pass-through');
      const state: GameState = {
        snake: [{ x: 0, y: 10 }],
        food: { x: 5, y: 5 },
        direction: 'LEFT',
        score: 0,
        isGameOver: false,
        isPaused: false,
      };
      
      const newState = passGame.moveSnake(state);
      
      expect(newState.snake[0].x).toBe(19);
      expect(newState.isGameOver).toBe(false);
    });

    it('should detect self collision', () => {
      const state: GameState = {
        snake: [
          { x: 5, y: 5 },
          { x: 4, y: 5 },
          { x: 4, y: 6 },
          { x: 5, y: 6 },
        ],
        food: { x: 10, y: 10 },
        direction: 'DOWN',
        score: 0,
        isGameOver: false,
        isPaused: false,
      };
      
      const newState = game.moveSnake(state);
      
      expect(newState.isGameOver).toBe(true);
    });
  });

  describe('isValidDirectionChange', () => {
    it('should allow perpendicular direction changes', () => {
      expect(game.isValidDirectionChange('UP', 'LEFT')).toBe(true);
      expect(game.isValidDirectionChange('UP', 'RIGHT')).toBe(true);
    });

    it('should prevent opposite direction changes', () => {
      expect(game.isValidDirectionChange('UP', 'DOWN')).toBe(false);
      expect(game.isValidDirectionChange('LEFT', 'RIGHT')).toBe(false);
    });
  });

  describe('generateFood', () => {
    it('should generate food not on snake', () => {
      const snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
      const food = game.generateFood(snake);
      
      expect(snake.some(s => s.x === food.x && s.y === food.y)).toBe(false);
    });
  });
});
