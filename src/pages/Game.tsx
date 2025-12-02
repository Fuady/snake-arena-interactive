import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GameBoard } from '@/components/GameBoard';
import { GameHUD } from '@/components/GameHUD';
import { Button } from '@/components/ui/button';
import { SnakeGame, GRID_SIZE } from '@/lib/gameEngine';
import { GameMode, Direction } from '@/types/game';
import { mockApi } from '@/services/mockApi';
import { toast } from 'sonner';
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react';

const Game = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get('mode') as GameMode) || 'walls';
  
  const [game] = useState(() => new SnakeGame(GRID_SIZE, mode));
  const [gameState, setGameState] = useState(() => game.createInitialState());
  const [speed, setSpeed] = useState(150);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState.isGameOver) return;

    const keyMap: Record<string, Direction> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      s: 'DOWN',
      a: 'LEFT',
      d: 'RIGHT',
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      setGameState(prev => game.moveSnake(prev, direction));
    }

    if (e.key === ' ') {
      e.preventDefault();
      setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    }
  }, [game, gameState.isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const interval = setInterval(() => {
      setGameState(prev => game.moveSnake(prev));
    }, speed);

    return () => clearInterval(interval);
  }, [game, speed, gameState.isGameOver, gameState.isPaused]);

  useEffect(() => {
    if (gameState.isGameOver) {
      const submitGameScore = async () => {
        const result = await mockApi.submitScore(gameState.score, mode);
        if (result.success) {
          toast.success(`Score ${gameState.score} submitted to leaderboard!`);
        }
      };
      submitGameScore();
    }
  }, [gameState.isGameOver, gameState.score, mode]);

  const handleRestart = () => {
    setGameState(game.createInitialState());
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Button>
          
          <h1 className="text-3xl font-game text-primary glow-primary">SNAKE ARCADE</h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePause}
              disabled={gameState.isGameOver}
            >
              {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <GameHUD
            score={gameState.score}
            gameMode={mode}
            isGameOver={gameState.isGameOver}
            isPaused={gameState.isPaused}
          />

          <div className="flex justify-center">
            <GameBoard gameState={gameState} gridSize={GRID_SIZE} />
          </div>

          <div className="text-center text-muted-foreground text-sm">
            <p>Use Arrow Keys or WASD to move • Space to pause</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
