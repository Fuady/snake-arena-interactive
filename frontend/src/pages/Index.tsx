import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Gamepad2, Trophy, Eye, LogOut, LogIn } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-game text-primary glow-primary mb-4 animate-pulse-glow">
            SNAKE ARCADE
          </h1>
          <p className="text-xl text-muted-foreground">
            Enter the neon grid and dominate the leaderboard
          </p>

          {user ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-accent font-semibold">Logged in as: {user.username}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <Button variant="outline" onClick={() => navigate('/auth')} className="gap-2">
                <LogIn className="w-4 h-4" />
                Login / Sign Up
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                Play Game
              </CardTitle>
              <CardDescription>Choose your game mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                onClick={() => navigate('/game?mode=walls')}
              >
                <span className="mr-2">🧱</span>
                Walls Mode
              </Button>
              <Button
                className="w-full justify-start"
                variant="secondary"
                onClick={() => navigate('/game?mode=pass-through')}
              >
                <span className="mr-2">🌀</span>
                Pass-Through Mode
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Leaderboard
              </CardTitle>
              <CardDescription>See top players and rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate('/leaderboard')}
              >
                View Leaderboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 hover:border-secondary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary" />
              Watch Live Games
            </CardTitle>
            <CardDescription>Spectate other players in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => navigate('/watch')}
            >
              Watch Players
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">Game Controls:</p>
          <p>Arrow Keys or WASD to move • Space to pause</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
