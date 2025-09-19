import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, CheckCircle, Book, Brain, Shield } from "lucide-react";

interface ProgressStats {
  theoryProgress: number;
  quizScore: number | null;
  drillsCompleted: number;
  totalTimeSpent: string;
  currentStreak: number;
  badges: string[];
}

interface ProgressTrackerProps {
  stats: ProgressStats;
  moduleTitle: string;
}

export function ProgressTracker({ stats, moduleTitle }: ProgressTrackerProps) {
  const overallProgress = Math.round(
    (stats.theoryProgress + (stats.quizScore || 0) + (stats.drillsCompleted * 20)) / 3
  );

  const badgeIcons = {
    'theory_master': Book,
    'quiz_ace': Brain, 
    'drill_champion': Shield,
    'quick_learner': Clock,
    'perfect_score': Trophy,
  };

  return (
    <Card className="emergency-transition hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg emergency-gradient text-primary-foreground">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-lg">Learning Progress</CardTitle>
            <CardDescription>{moduleTitle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{overallProgress}% Complete</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Individual Progress Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Theory Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Theory Content</span>
            </div>
            <Progress value={stats.theoryProgress} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {stats.theoryProgress}% completed
            </span>
          </div>

          {/* Quiz Score */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Quiz Performance</span>
            </div>
            {stats.quizScore !== null ? (
              <>
                <Progress value={stats.quizScore} className="h-2" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Score: {stats.quizScore}%
                  </span>
                  {stats.quizScore >= 80 && (
                    <CheckCircle className="w-3 h-3 text-success" />
                  )}
                </div>
              </>
            ) : (
              <div className="text-xs text-muted-foreground">Not started</div>
            )}
          </div>

          {/* Drills Completed */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Virtual Drills</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{stats.drillsCompleted}</span>
              <span className="text-muted-foreground"> completed</span>
            </div>
          </div>

          {/* Time Spent */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Time Invested</span>
            </div>
            <div className="text-sm font-medium">{stats.totalTimeSpent}</div>
          </div>
        </div>

        {/* Current Streak */}
        {stats.currentStreak > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <Trophy className="w-5 h-5 text-warning" />
            <div>
              <div className="font-medium text-sm">Learning Streak</div>
              <div className="text-xs text-muted-foreground">
                {stats.currentStreak} days in a row!
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        {stats.badges.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Earned Badges</h4>
            <div className="flex flex-wrap gap-2">
              {stats.badges.map((badge) => {
                const IconComponent = badgeIcons[badge as keyof typeof badgeIcons] || Trophy;
                return (
                  <Badge key={badge} variant="secondary" className="flex items-center gap-1">
                    <IconComponent className="w-3 h-3" />
                    {badge.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}