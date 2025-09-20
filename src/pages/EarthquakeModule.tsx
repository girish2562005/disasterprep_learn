import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TheoryContent } from "@/components/TheoryContent";
import { SecureQuizCard } from "@/components/SecureQuizCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { VirtualDrill } from "@/components/VirtualDrill";
import { InteractiveScenarios } from "@/components/InteractiveScenarios";
import { VideoLearning } from "@/components/VideoLearning";
import { BadgeReward } from "@/components/BadgeReward";
import { ArrowLeft, BookOpen, Brain, Shield, Trophy, Play, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data - in real app this would come from Supabase
const theorySections = [
  {
    id: "understanding-earthquakes",
    title: "Understanding Earthquakes",
    content: `Earthquakes are sudden shaking of the ground caused by the movement of rock beneath the Earth's surface. They occur when stress that has built up along a fault is suddenly released.

Key Points:
• Earthquakes can happen anywhere, but are more common along fault lines
• The magnitude is measured on the Richter scale from 1-10
• Most earthquakes last less than a minute
• Aftershocks can continue for days or weeks after the main event

Understanding the science behind earthquakes helps us prepare better and respond appropriately when they occur.`,
    estimatedTime: "5 mins"
  },
  {
    id: "drop-cover-hold",
    title: "Drop, Cover, and Hold On",
    content: `"Drop, Cover, and Hold On" is the internationally recommended immediate response to earthquake shaking.

DROP: Immediately drop to your hands and knees
• This prevents you from being knocked over
• Gets you low to the ground quickly
• Protects you from falling objects

COVER: Take cover under a desk, table, or against an interior wall
• Protect your head and neck with your arms if no shelter available
• Stay away from windows, mirrors, and heavy objects that could fall
• Don't run outside during shaking - most injuries occur from falling debris

HOLD ON: Hold onto your shelter and be prepared to move with it
• If under a desk, hold the legs and be ready to move
• If against a wall, protect your head and neck
• Stay in position until shaking completely stops

This technique has saved countless lives and is your best protection during earthquake shaking.`,
    estimatedTime: "8 mins"
  },
  {
    id: "emergency-supplies",
    title: "Emergency Preparedness Kit",
    content: `A well-stocked emergency kit is essential for earthquake preparedness. Your kit should sustain your family for at least 72 hours.

Water:
• 1 gallon per person per day for at least 3 days
• Additional water for pets
• Water purification tablets as backup

Food:
• Non-perishable food for at least 3 days
• Can opener and eating utensils
• Special dietary needs (baby formula, medications)

First Aid & Safety:
• Comprehensive first aid kit
• Prescription medications (7-day supply)
• Flashlights and extra batteries
• Battery-powered or hand-crank radio
• Whistle for signaling help

Important Documents:
• Copies of important family documents in waterproof container
• Cash in small bills
• Emergency contact information

Tools & Supplies:
• Multi-purpose tool or Swiss Army knife
• Plastic sheeting and duct tape
• Matches in waterproof container
• Fire extinguisher
• Local maps

Store your kit in an easily accessible location and check expiration dates regularly.`,
    estimatedTime: "10 mins"
  }
];


const virtualDrillSteps = [
  {
    id: "office-scenario",
    title: "Office Building - 5th Floor",
    description: "You're working at your desk in a high-rise office building when strong shaking begins. Your desk is near a large window and there are filing cabinets nearby.",
    action: "Drop, Cover, Hold",
    timeLimit: 15,
    correctFeedback: "Excellent! You correctly dropped under your desk, away from the window and filing cabinets. This protects you from falling objects and glass.",
    incorrectFeedback: "Running outside during shaking is dangerous. Drop, Cover, and Hold On under your desk is the safest action in this scenario."
  },
  {
    id: "home-kitchen",
    title: "Home Kitchen",
    description: "You're cooking dinner when earthquake shaking starts. You're standing near the stove with a pot of boiling water, and there are cabinets with dishes above you.",
    action: "Drop, Cover, Hold",
    timeLimit: 12,
    correctFeedback: "Perfect response! Moving away from the stove and taking cover protects you from hot liquids and falling dishes from cabinets.",
    incorrectFeedback: "Standing in place near hazards is dangerous. You should move away from the stove and take cover immediately."
  },
  {
    id: "outdoor-scenario",
    title: "Downtown Sidewalk",
    description: "You're walking on a busy downtown sidewalk when shaking begins. There are tall buildings on both sides with glass windows and some construction scaffolding nearby.",
    action: "Move to open area",
    timeLimit: 10,
    correctFeedback: "Great thinking! Moving away from buildings to an open area protects you from falling glass and debris - the main outdoor hazards.",
    incorrectFeedback: "When outdoors, move away from buildings, power lines, and other hazards to an open area if possible."
  }
];

const availableBadges = [
  {
    id: "theory-master",
    title: "Theory Master",
    description: "Completed all theory sections",
    icon: "trophy",
    rarity: "rare" as const,
    points: 100
  },
  {
    id: "quiz-ace",
    title: "Quiz Ace", 
    description: "Scored 80% or higher on quiz",
    icon: "star",
    rarity: "epic" as const,
    points: 150
  },
  {
    id: "drill-champion",
    title: "Drill Champion",
    description: "Completed virtual drill perfectly",
    icon: "shield",
    rarity: "legendary" as const,
    points: 200
  }
];

export default function EarthquakeModule() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("progress");
  const [completedTheorySections, setCompletedTheorySections] = useState<Set<string>>(new Set());
  const [currentTheorySection, setCurrentTheorySection] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [drillsCompleted, setDrillsCompleted] = useState(0);
  const [scenarioScore, setScenarioScore] = useState<number | null>(null);
  const [videosWatched, setVideosWatched] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showBadgeReward, setShowBadgeReward] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string;
    question: string;
    options: string[];
    order_index: number;
  }>>([]);
  const { toast } = useToast();

  // Load quiz questions securely from database
  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_questions_student_view')
          .select('*')
          .order('order_index');

        if (error) {
          console.error('Error loading quiz questions:', error);
          toast({
            title: "Error",
            description: "Failed to load quiz questions",
            variant: "destructive"
          });
          return;
        }

        // Map the database data to the expected format
        const formattedQuestions = (data || []).map(item => ({
          id: item.id,
          question: item.question,
          options: Array.isArray(item.options) ? (item.options as string[]) : [],
          order_index: item.order_index
        }));
        
        setQuizQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error loading quiz questions:', error);
      }
    };

    loadQuizQuestions();
  }, [toast]);

  const progressStats = {
    theoryProgress: (completedTheorySections.size / theorySections.length) * 100,
    quizScore,
    drillsCompleted,
    scenarioScore,
    videosWatched,
    totalTimeSpent: "2h 15m",
    currentStreak: 3,
    badges: earnedBadges
  };

  const handleTheorySectionComplete = (sectionId: string) => {
    setCompletedTheorySections(prev => new Set(prev).add(sectionId));
    toast({
      title: "Section Completed!",
      description: "Great job completing this theory section.",
    });
  };

  const handleTheoryComplete = () => {
    setActiveTab("quiz");
    checkForBadge("theory-master");
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setActiveTab("drills");
    if (score >= 80) {
      checkForBadge("quiz-ace");
    }
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score}%! ${score >= 80 ? "Excellent work!" : "You can retake the quiz to improve your score."}`,
    });
  };

  const handleDrillComplete = (score: number, timeSpent: number) => {
    setDrillsCompleted(prev => prev + 1);
    if (score >= 90) {
      checkForBadge("drill-champion");
    }
    toast({
      title: "Virtual Drill Completed!",
      description: `Excellent response time! Score: ${score}%`,
    });
  };

  const handleScenarioComplete = (score: number) => {
    setScenarioScore(score);
    toast({
      title: "Interactive Scenarios Completed!",
      description: `You scored ${score}%! Great job practicing emergency responses.`,
    });
  };

  const handleVideoComplete = (videoId: string) => {
    setVideosWatched(prev => prev + 1);
  };

  const checkForBadge = (badgeId: string) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges(prev => [...prev, badgeId]);
      setShowBadgeReward(badgeId);
    }
  };

  const handleClaimBadge = () => {
    setShowBadgeReward(null);
    toast({
      title: "Badge Claimed!",
      description: "Badge has been added to your collection.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Earthquake Safety Training</h1>
            <p className="text-muted-foreground">
              Complete theory, quiz, and virtual drills to master earthquake preparedness
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Theory
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Quiz
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="drills" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Virtual Drills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <ProgressTracker
              stats={progressStats}
              moduleTitle="Earthquake Safety"
            />
          </TabsContent>

          <TabsContent value="theory">
            <TheoryContent
              title="Earthquake Safety Theory"
              description="Learn the fundamental principles of earthquake preparedness and response"
              sections={theorySections}
              currentSection={currentTheorySection}
              onSectionComplete={handleTheorySectionComplete}
              onComplete={handleTheoryComplete}
              completedSections={completedTheorySections}
            />
          </TabsContent>

          <TabsContent value="quiz">
            <SecureQuizCard
              title="Earthquake Safety Quiz"
              description="Test your knowledge of earthquake safety procedures"
              questions={quizQuestions}
              moduleId="earthquake-safety"
              onComplete={handleQuizComplete}
            />
          </TabsContent>

          <TabsContent value="scenarios">
            <InteractiveScenarios onComplete={handleScenarioComplete} />
          </TabsContent>

          <TabsContent value="videos">
            <VideoLearning onVideoComplete={handleVideoComplete} />
          </TabsContent>

          <TabsContent value="drills">
            <VirtualDrill
              title="Earthquake Response Drill"
              description="Practice emergency response in realistic earthquake scenarios"
              difficulty="Medium"
              estimatedTime="10-15 mins"
              steps={virtualDrillSteps}
              onComplete={handleDrillComplete}
            />
          </TabsContent>
        </Tabs>

        {/* Badge Reward Modal */}
        {showBadgeReward && (
          <BadgeReward
            badge={availableBadges.find(b => b.id === showBadgeReward)!}
            isNewlyEarned={true}
            onClaim={handleClaimBadge}
            onClose={() => setShowBadgeReward(null)}
          />
        )}
      </div>
    </div>
  );
}