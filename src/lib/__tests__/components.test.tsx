import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GameBoard } from '@/components/GameBoard';
import { GameHUD } from '@/components/GameHUD';
import { GameState } from '@/types/game';

const mockGameState: GameState = {
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  score: 100,
  isGameOver: false,
  isPaused: false,
};

describe('GameBoard', () => {
  it('should render without crashing', () => {
    render(<GameBoard gameState={mockGameState} gridSize={20} />);
  });

  it('should render snake segments', () => {
    const { container } = render(<GameBoard gameState={mockGameState} gridSize={20} />);
    
    // Snake has 3 segments
    const snakeSegments = container.querySelectorAll('[class*="bg-primary"]');
    expect(snakeSegments.length).toBe(3);
  });

  it('should render food', () => {
    const { container } = render(<GameBoard gameState={mockGameState} gridSize={20} />);
    
    const food = container.querySelector('[class*="bg-secondary"]');
    expect(food).not.toBeNull();
  });
});

describe('GameHUD', () => {
  it('should display score', () => {
    const { getByText } = render(
      <GameHUD
        score={100}
        gameMode="walls"
        isGameOver={false}
        isPaused={false}
      />
    );
    
    expect(getByText('100')).toBeTruthy();
  });

  it('should display game mode', () => {
    const { getByText } = render(
      <GameHUD
        score={0}
        gameMode="walls"
        isGameOver={false}
        isPaused={false}
      />
    );
    
    expect(getByText('WALLS')).toBeTruthy();
  });

  it('should show game over message', () => {
    const { getByText } = render(
      <GameHUD
        score={50}
        gameMode="walls"
        isGameOver={true}
        isPaused={false}
      />
    );
    
    expect(getByText('GAME OVER')).toBeTruthy();
  });

  it('should show paused message', () => {
    const { getByText } = render(
      <GameHUD
        score={50}
        gameMode="walls"
        isGameOver={false}
        isPaused={true}
      />
    );
    
    expect(getByText('PAUSED')).toBeTruthy();
  });

  it('should display pass-through mode', () => {
    const { getByText } = render(
      <GameHUD
        score={50}
        gameMode="pass-through"
        isGameOver={false}
        isPaused={false}
      />
    );
    
    expect(getByText('PASS-THROUGH')).toBeTruthy();
  });
});
