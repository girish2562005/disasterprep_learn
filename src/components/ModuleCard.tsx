import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Award, ArrowRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  progress: number;
  icon: React.ReactNode;
  color: "emergency" | "success" | "warning" | "destructive";
  enrolled: number;
  onStart: () => void;
}

const difficultyColors = {
  Beginner: "success",
  Intermediate: "warning", 
  Advanced: "destructive",
} as const;

const moduleColors = {
  emergency: "bg-primary/10 border-primary/20",
  success: "bg-success/10 border-success/20", 
  warning: "bg-warning/10 border-warning/20",
  destructive: "bg-destructive/10 border-destructive/20",
} as const;

export function ModuleCard({
  title,
  description,
  difficulty,
  duration,
  progress,
  icon,
  color,
  enrolled,
  onStart,
}: ModuleCardProps) {
  return (
    <Card className={`emergency-transition hover:scale-105 hover:shadow-lg ${moduleColors[color]}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${color === 'emergency' ? 'emergency-gradient' : color === 'success' ? 'success-gradient' : color === 'warning' ? 'warning-gradient' : 'bg-destructive'} text-white`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={difficultyColors[difficulty] === "success" ? "secondary" : "outline"} className="text-xs">
                  {difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-3 h-3" />
                  {duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">{description}</CardDescription>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Users className="w-4 h-4" />
            {enrolled.toLocaleString()} enrolled
          </div>
          
          <Button 
            onClick={onStart}
            variant={progress > 0 ? "outline" : "hero"}
            size="sm"
            className="group"
          >
            {progress > 0 ? "Continue" : "Start Learning"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 emergency-transition" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}