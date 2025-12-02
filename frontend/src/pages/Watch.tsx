import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameBoard } from '@/components/GameBoard';
import { mockApi } from '@/services/mockApi';
import { GameSession } from '@/types/game';
import { SnakeGame, GRID_SIZE } from '@/lib/gameEngine';
import { ArrowLeft, Eye } from 'lucide-react';

const Watch = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated game for spectating
  const [game] = useState(() => new SnakeGame(GRID_SIZE, 'walls'));
  const [gameState, setGameState] = useState(() => game.createInitialState());

  useEffect(() => {
    loadActiveSessions();
    const interval = setInterval(loadActiveSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadSession(sessionId);
    }
  }, [sessionId]);

  // Simulate AI gameplay
  useEffect(() => {
    if (!selectedSession) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.isGameOver) {
          return game.createInitialState();
        }
        return game.moveSnake(prev);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [selectedSession, game]);

  const loadActiveSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await mockApi.getActiveSessions();
      setActiveSessions(sessions);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (id: string) => {
    const session = await mockApi.watchSession(id);
    if (session) {
      setSelectedSession(session);
      // Set game mode for the session
      game.setGameMode(session.gameMode);
      setGameState(game.createInitialState());
    }
  };

  const watchSession = (session: GameSession) => {
    navigate(`/watch/${session.sessionId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
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
          
          <h1 className="text-3xl font-game text-primary glow-primary">SPECTATE</h1>
          
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Games
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : activeSessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active games
                  </div>
                ) : (
                  activeSessions.map(session => (
                    <button
                      key={session.sessionId}
                      onClick={() => watchSession(session)}
                      className={`w-full p-4 text-left border rounded-lg transition-colors ${
                        selectedSession?.sessionId === session.sessionId
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{session.username}</span>
                        <Badge variant={session.gameMode === 'walls' ? 'default' : 'secondary'} className="text-xs">
                          {session.gameMode === 'walls' ? 'WALLS' : 'PASS'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Score: <span className="text-primary font-game">{session.score}</span>
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Watching: {selectedSession.username}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedSession.gameMode === 'walls' ? 'default' : 'secondary'}>
                          {selectedSession.gameMode === 'walls' ? 'WALLS MODE' : 'PASS-THROUGH'}
                        </Badge>
                        <div className="px-3 py-1 bg-primary/20 rounded-lg">
                          <span className="text-sm text-muted-foreground mr-2">Score:</span>
                          <span className="text-xl font-game text-primary">{gameState.score}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <GameBoard gameState={gameState} gridSize={GRID_SIZE} />
                  </CardContent>
                </Card>

                <div className="text-center text-muted-foreground text-sm">
                  <p>You are spectating a live game</p>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a game to spectate</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
