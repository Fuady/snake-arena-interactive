import { GameState } from '@/types/game';
import { CELL_SIZE } from '@/lib/gameEngine';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  gridSize: number;
}

export const GameBoard = ({ gameState, gridSize }: GameBoardProps) => {
  const { snake, food } = gameState;

  return (
    <div
      className="relative border-2 border-primary shadow-[0_0_20px_rgba(0,255,135,0.3)]"
      style={{
        width: gridSize * CELL_SIZE,
        height: gridSize * CELL_SIZE,
        backgroundColor: 'hsl(var(--game-bg))',
      }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: gridSize + 1 }).map((_, i) => (
          <div key={`h-${i}`}>
            <div
              className="absolute bg-game-grid opacity-20"
              style={{
                left: 0,
                top: i * CELL_SIZE,
                width: '100%',
                height: 1,
              }}
            />
            <div
              className="absolute bg-game-grid opacity-20"
              style={{
                left: i * CELL_SIZE,
                top: 0,
                width: 1,
                height: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={`snake-${index}`}
          className={cn(
            'absolute transition-all duration-75',
            index === 0 
              ? 'bg-primary shadow-[0_0_10px_rgba(0,255,135,0.8)] rounded-sm' 
              : 'bg-primary/80 rounded-sm'
          )}
          style={{
            left: segment.x * CELL_SIZE,
            top: segment.y * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            margin: 1,
          }}
        />
      ))}

      {/* Food */}
      <div
        className="absolute bg-secondary shadow-[0_0_15px_rgba(255,0,255,0.9)] rounded-full animate-pulse-glow"
        style={{
          left: food.x * CELL_SIZE,
          top: food.y * CELL_SIZE,
          width: CELL_SIZE - 4,
          height: CELL_SIZE - 4,
          margin: 2,
        }}
      />
    </div>
  );
};
