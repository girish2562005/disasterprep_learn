import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Play, CheckCircle, AlertTriangle, Timer, Star } from "lucide-react";

interface DrillStep {
  id: string;
  title: string;
  description: string;
  action: string;
  timeLimit: number; // seconds
  correctFeedback: string;
  incorrectFeedback: string;
}

interface VirtualDrillProps {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  steps: DrillStep[];
  onComplete: (score: number, timeSpent: number) => void;
}

export function VirtualDrill({
  title,
  description,
  difficulty,
  estimatedTime,
  steps,
  onComplete,
}: VirtualDrillProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAction, setUserAction] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const difficultyColors = {
    Easy: "success",
    Medium: "warning",
    Hard: "destructive"
  } as const;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const startDrill = () => {
    setIsActive(true);
    setStartTime(Date.now());
    setTimeLeft(currentStepData.timeLimit);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    setIsCorrect(false);
    setShowFeedback(true);
  };

  const handleAction = (action: string) => {
    setUserAction(action);
    const correct = action.toLowerCase().includes(currentStepData.action.toLowerCase());
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + Math.round((timeLeft / currentStepData.timeLimit) * 100));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowFeedback(false);
      setUserAction("");
      setTimeLeft(steps[currentStep + 1].timeLimit);
    } else {
      const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;
      onComplete(Math.round(score / steps.length), totalTime);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsActive(false);
    setShowFeedback(false);
    setUserAction("");
    setScore(0);
    setStartTime(null);
  };

  if (!isActive) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg emergency-gradient text-primary-foreground">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-lg">{description}</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <Badge variant={difficultyColors[difficulty] === "success" ? "secondary" : "outline"}>
              {difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Timer className="w-4 h-4" />
              {estimatedTime}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-4 h-4" />
              {steps.length} scenarios
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
            <h4 className="font-semibold mb-2">What to Expect:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Real-time earthquake simulation scenarios</li>
              <li>• Time-pressured decision making</li>
              <li>• Immediate feedback on your actions</li>
              <li>• Score based on speed and accuracy</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={startDrill} size="lg" variant="hero" className="font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Start Virtual Drill
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                Scenario {currentStep + 1} of {steps.length}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Timer className="w-4 h-4" />
                {timeLeft}s remaining
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Score</div>
            <div className="text-2xl font-bold text-primary">{Math.round(score / (currentStep + 1))}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!showFeedback ? (
          <>
            <div className="p-6 rounded-lg emergency-gradient text-primary-foreground">
              <h3 className="text-lg font-semibold mb-2">Emergency Scenario</h3>
              <p className="text-primary-foreground/90">{currentStepData.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => handleAction("Drop, Cover, Hold")}
                variant="outline"
                className="p-4 h-auto text-left justify-start"
              >
                <div>
                  <div className="font-medium">Drop, Cover, and Hold On</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Get under desk/table, protect head and neck
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAction("Run Outside")}
                variant="outline"
                className="p-4 h-auto text-left justify-start"
              >
                <div>
                  <div className="font-medium">Run Outside</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Quickly exit the building to open area
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAction("Stand in Doorway")}
                variant="outline"
                className="p-4 h-auto text-left justify-start"
              >
                <div>
                  <div className="font-medium">Stand in Doorway</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Position yourself in a doorframe
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleAction("Hide Under Stairs")}
                variant="outline"
                className="p-4 h-auto text-left justify-start"
              >
                <div>
                  <div className="font-medium">Seek Other Shelter</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Find alternative protection
                  </div>
                </div>
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-l-4 ${
              isCorrect 
                ? "bg-success/10 border-success text-success-foreground" 
                : "bg-destructive/10 border-destructive text-destructive-foreground"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                )}
                <span className="font-semibold">
                  {isCorrect ? "Correct Action!" : "Incorrect Action"}
                </span>
              </div>
              <p className="text-sm">
                {isCorrect ? currentStepData.correctFeedback : currentStepData.incorrectFeedback}
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={handleRestart} variant="outline">
                Restart Drill
              </Button>
              
              <Button onClick={handleNext} variant="hero">
                {currentStep < steps.length - 1 ? "Next Scenario" : "Complete Drill"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}