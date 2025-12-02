import { Direction, Position, GameMode, GameState } from '@/types/game';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export class SnakeGame {
  private gridSize: number;
  private gameMode: GameMode;
  
  constructor(gridSize: number = GRID_SIZE, gameMode: GameMode = 'walls') {
    this.gridSize = gridSize;
    this.gameMode = gameMode;
  }

  createInitialState(): GameState {
    const centerX = Math.floor(this.gridSize / 2);
    const centerY = Math.floor(this.gridSize / 2);
    
    return {
      snake: [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY },
      ],
      food: this.generateFood([{ x: centerX, y: centerY }]),
      direction: 'RIGHT',
      score: 0,
      isGameOver: false,
      isPaused: false,
    };
  }

  generateFood(snake: Position[]): Position {
    let food: Position;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
      };
      attempts++;
    } while (
      attempts < maxAttempts &&
      snake.some(segment => segment.x === food.x && segment.y === food.y)
    );
    
    return food;
  }

  getNextHeadPosition(head: Position, direction: Direction): Position {
    let newX = head.x;
    let newY = head.y;

    switch (direction) {
      case 'UP':
        newY -= 1;
        break;
      case 'DOWN':
        newY += 1;
        break;
      case 'LEFT':
        newX -= 1;
        break;
      case 'RIGHT':
        newX += 1;
        break;
    }

    // Handle pass-through mode
    if (this.gameMode === 'pass-through') {
      newX = (newX + this.gridSize) % this.gridSize;
      newY = (newY + this.gridSize) % this.gridSize;
    }

    return { x: newX, y: newY };
  }

  checkCollision(head: Position, snake: Position[]): boolean {
    // Check wall collision in walls mode
    if (this.gameMode === 'walls') {
      if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
        return true;
      }
    }

    // Check self collision (excluding the head itself)
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  checkFoodCollision(head: Position, food: Position): boolean {
    return head.x === food.x && head.y === food.y;
  }

  moveSnake(state: GameState, newDirection?: Direction): GameState {
    if (state.isGameOver || state.isPaused) {
      return state;
    }

    // Update direction if provided and valid
    const direction = newDirection && this.isValidDirectionChange(state.direction, newDirection)
      ? newDirection
      : state.direction;

    const head = state.snake[0];
    const newHead = this.getNextHeadPosition(head, direction);

    // Check collision before moving
    if (this.checkCollision(newHead, state.snake)) {
      return {
        ...state,
        isGameOver: true,
      };
    }

    const newSnake = [newHead, ...state.snake];
    let newFood = state.food;
    let newScore = state.score;

    // Check if food is eaten
    if (this.checkFoodCollision(newHead, state.food)) {
      newFood = this.generateFood(newSnake);
      newScore += 10;
    } else {
      // Remove tail if no food eaten
      newSnake.pop();
    }

    return {
      ...state,
      snake: newSnake,
      food: newFood,
      direction,
      score: newScore,
    };
  }

  isValidDirectionChange(currentDirection: Direction, newDirection: Direction): boolean {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    return opposites[currentDirection] !== newDirection;
  }

  setGameMode(mode: GameMode): void {
    this.gameMode = mode;
  }

  getGameMode(): GameMode {
    return this.gameMode;
  }
}
