import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import officeScenario from "@/assets/earthquake-office-scenario.jpg";
import kitchenScenario from "@/assets/earthquake-kitchen-scenario.jpg";
import outdoorScenario from "@/assets/earthquake-outdoor-scenario.jpg";

interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Scenario {
  id: string;
  title: string;
  image: string;
  description: string;
  situation: string;
  options: ScenarioOption[];
  timeLimit: number;
}

interface InteractiveScenariosProps {
  onComplete?: (score: number) => void;
}

const scenarios: Scenario[] = [
  {
    id: "office-earthquake",
    title: "Office Building Emergency",
    image: officeScenario,
    description: "You're working at your desk on the 5th floor when strong earthquake shaking begins.",
    situation: "Your desk is near a large window and there are tall filing cabinets nearby. What should you do?",
    timeLimit: 15,
    options: [
      {
        id: "drop-cover",
        text: "Drop under my desk, cover my head, and hold on",
        isCorrect: true,
        explanation: "Correct! Drop, Cover, and Hold On protects you from falling objects and glass. Stay away from windows."
      },
      {
        id: "run-outside",
        text: "Run outside immediately",
        isCorrect: false,
        explanation: "Incorrect. Running during shaking is dangerous. Most injuries occur from falling debris near building exits."
      },
      {
        id: "stand-doorway",
        text: "Stand in the doorway",
        isCorrect: false,
        explanation: "Incorrect. Modern doorways aren't reinforced. Drop, Cover, and Hold On under a desk is safer."
      },
      {
        id: "near-window",
        text: "Move closer to the window for light",
        isCorrect: false,
        explanation: "Incorrect. Windows can shatter during earthquakes. Always move away from glass."
      }
    ]
  },
  {
    id: "kitchen-earthquake",
    title: "Home Kitchen Emergency",
    image: kitchenScenario,
    description: "You're cooking dinner when earthquake shaking starts.",
    situation: "You're near the stove with boiling water and there are cabinets with dishes above you. What's your first action?",
    timeLimit: 12,
    options: [
      {
        id: "turn-off-stove",
        text: "Turn off the stove first, then take cover",
        isCorrect: true,
        explanation: "Correct! Quickly turn off heat sources if safe to do so, then Drop, Cover, and Hold On away from cabinets."
      },
      {
        id: "stay-cooking",
        text: "Continue cooking and hold onto the counter",
        isCorrect: false,
        explanation: "Incorrect. Hot liquids and falling objects from cabinets pose serious injury risks during shaking."
      },
      {
        id: "run-outside",
        text: "Run outside immediately",
        isCorrect: false,
        explanation: "Incorrect. Running during shaking increases injury risk. Take cover first."
      },
      {
        id: "hide-cabinet",
        text: "Take cover under the overhead cabinets",
        isCorrect: false,
        explanation: "Incorrect. Overhead cabinets can fall and cause injury. Move away from them."
      }
    ]
  },
  {
    id: "outdoor-earthquake",
    title: "Downtown Street Emergency",
    image: outdoorScenario,
    description: "You're walking on a busy downtown sidewalk when shaking begins.",
    situation: "There are tall buildings with glass windows on both sides and construction scaffolding nearby. What should you do?",
    timeLimit: 10,
    options: [
      {
        id: "open-area",
        text: "Move quickly to the nearest open area away from buildings",
        isCorrect: true,
        explanation: "Correct! When outdoors, move away from buildings, power lines, and other hazards to an open area."
      },
      {
        id: "building-entrance",
        text: "Run into the nearest building for shelter",
        isCorrect: false,
        explanation: "Incorrect. Building entrances are dangerous due to falling debris and glass."
      },
      {
        id: "against-building",
        text: "Press yourself against the building wall",
        isCorrect: false,
        explanation: "Incorrect. Stay away from buildings as glass and debris can fall from upper floors."
      },
      {
        id: "under-scaffolding",
        text: "Take cover under the construction scaffolding",
        isCorrect: false,
        explanation: "Incorrect. Construction areas are unstable and dangerous during earthquakes."
      }
    ]
  }
];

export function InteractiveScenarios({ onComplete }: InteractiveScenariosProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const startScenario = () => {
    setIsActive(true);
    setTimeLeft(scenarios[currentScenario].timeLimit);
    setSelectedOption(null);
    setShowResult(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (!selectedOption) {
      setShowResult(true);
      toast({
        title: "Time's up!",
        description: "Remember to act quickly during earthquakes.",
        variant: "destructive",
      });
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (timeLeft === null || timeLeft === 0) return;
    
    setSelectedOption(optionId);
    setShowResult(true);
    
    const scenario = scenarios[currentScenario];
    const option = scenario.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: option.explanation,
      });
    } else {
      toast({
        title: "Incorrect",
        description: option?.explanation,
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    const nextScenario = currentScenario + 1;
    setCompletedScenarios(prev => prev + 1);
    
    if (nextScenario < scenarios.length) {
      setCurrentScenario(nextScenario);
      setIsActive(false);
      setTimeLeft(null);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round((score / scenarios.length) * 100);
      onComplete?.(finalScore);
      toast({
        title: "Scenarios Complete!",
        description: `You scored ${score}/${scenarios.length} correct responses!`,
      });
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setScore(0);
    setCompletedScenarios(0);
    setIsActive(false);
    setTimeLeft(null);
    setSelectedOption(null);
    setShowResult(false);
  };

  const scenario = scenarios[currentScenario];

  if (!isActive) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Interactive Earthquake Scenarios
                <Badge variant="outline">Scenario {currentScenario + 1}/{scenarios.length}</Badge>
              </CardTitle>
              <CardDescription>
                Practice emergency response in realistic earthquake situations
              </CardDescription>
            </div>
            {completedScenarios > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className="text-2xl font-bold text-primary">{score}/{completedScenarios}</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <img 
              src={scenario.image} 
              alt={scenario.title}
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{scenario.title}</h3>
            <p className="text-muted-foreground">{scenario.description}</p>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{scenario.situation}</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button onClick={startScenario} size="lg">
              <Clock className="w-4 h-4 mr-2" />
              Start Scenario ({scenario.timeLimit}s)
            </Button>
            {completedScenarios > 0 && (
              <Button variant="outline" onClick={handleRestart}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {scenario.title}
            <Badge variant="outline">Scenario {currentScenario + 1}/{scenarios.length}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className={`text-lg font-bold ${timeLeft && timeLeft <= 5 ? 'text-destructive' : 'text-primary'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <img 
            src={scenario.image} 
            alt={scenario.title}
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium text-center">{scenario.situation}</p>
        </div>
        
        <div className="grid gap-3">
          {scenario.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedOption === option.id ? (option.isCorrect ? "default" : "destructive") : "outline"}
              className="justify-start text-left h-auto p-4"
              onClick={() => handleOptionSelect(option.id)}
              disabled={showResult || timeLeft === 0}
            >
              <div className="flex items-center gap-3 w-full">
                {showResult && selectedOption === option.id && (
                  option.isCorrect ? 
                    <CheckCircle className="w-5 h-5 text-green-500" /> : 
                    <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className="flex-1">{option.text}</span>
              </div>
            </Button>
          ))}
        </div>
        
        {showResult && selectedOption && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm">
                {scenarios[currentScenario].options.find(o => o.id === selectedOption)?.explanation}
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleNext}>
                {currentScenario + 1 < scenarios.length ? 'Next Scenario' : 'Complete Training'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}