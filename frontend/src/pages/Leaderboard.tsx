import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [wallsLeaderboard, setWallsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [passThroughLeaderboard, setPassThroughLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    setIsLoading(true);
    try {
      const [walls, passThrough] = await Promise.all([
        api.getLeaderboard('walls'),
        api.getLeaderboard('pass-through'),
      ]);
      setWallsLeaderboard(walls);
      setPassThroughLeaderboard(passThrough);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-primary" />;
    if (index === 1) return <Medal className="w-5 h-5 text-accent" />;
    if (index === 2) return <Award className="w-5 h-5 text-secondary" />;
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-bold">{index + 1}</span>;
  };

  const LeaderboardTable = ({ entries, mode }: { entries: LeaderboardEntry[]; mode: GameMode }) => (
    <div className="space-y-2">
      {entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No entries yet. Be the first to set a record!
        </div>
      ) : (
        entries.map((entry, index) => (
          <div
            key={`${entry.userId}-${entry.timestamp}`}
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="flex-shrink-0">
              {getRankIcon(index)}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-foreground">{entry.username}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-game text-primary glow-primary">
                {entry.score}
              </div>
              <div className="text-xs text-muted-foreground">POINTS</div>
            </div>
          </div>
        ))
      )}
    </div>
  );

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

          <h1 className="text-3xl font-game text-primary glow-primary">LEADERBOARD</h1>

          <Button
            variant="outline"
            size="sm"
            onClick={loadLeaderboards}
          >
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Players</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="walls" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="walls">Walls Mode</TabsTrigger>
                <TabsTrigger value="pass-through">Pass-Through Mode</TabsTrigger>
              </TabsList>

              <TabsContent value="walls" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                  <LeaderboardTable entries={wallsLeaderboard} mode="walls" />
                )}
              </TabsContent>

              <TabsContent value="pass-through" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                  <LeaderboardTable entries={passThroughLeaderboard} mode="pass-through" />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
