import { GameMode } from '@/types/game';
import { Badge } from './ui/badge';

interface GameHUDProps {
  score: number;
  gameMode: GameMode;
  isGameOver: boolean;
  isPaused: boolean;
}

export const GameHUD = ({ score, gameMode, isGameOver, isPaused }: GameHUDProps) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-6">
        <div>
          <div className="text-sm text-muted-foreground">SCORE</div>
          <div className="text-3xl font-game text-primary glow-primary">{score}</div>
        </div>
        
        <div className="h-12 w-px bg-border" />
        
        <div>
          <div className="text-sm text-muted-foreground">MODE</div>
          <Badge variant={gameMode === 'walls' ? 'default' : 'secondary'} className="mt-1 font-game">
            {gameMode === 'walls' ? 'WALLS' : 'PASS-THROUGH'}
          </Badge>
        </div>
      </div>

      {isGameOver && (
        <div className="text-2xl font-game text-destructive glow-secondary animate-pulse">
          GAME OVER
        </div>
      )}
      
      {isPaused && !isGameOver && (
        <div className="text-2xl font-game text-accent glow-accent">
          PAUSED
        </div>
      )}
    </div>
  );
};
