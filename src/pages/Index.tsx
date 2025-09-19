import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModuleCard } from "@/components/ModuleCard";
import { StatsCard } from "@/components/StatsCard";
import { QuizCard } from "@/components/QuizCard";
import { 
  Shield, 
  Zap, 
  Waves, 
  Flame, 
  Wind, 
  Snowflake, 
  Users, 
  BookOpen, 
  Award, 
  Target,
  Play,
  CheckCircle,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import heroImage from "@/assets/hero-emergency.jpg";

const sampleQuizQuestions = [
  {
    id: "1",
    question: "What is the first thing you should do during an earthquake?",
    options: [
      "Run outside to an open area",
      "Drop, cover, and hold on",
      "Stand in a doorway", 
      "Look for a safe place to hide"
    ],
    correctAnswer: 1,
    explanation: "Drop, Cover, and Hold On is the internationally recommended action during earthquake shaking. Drop to hands and knees, take cover under a desk or table, and hold on to protect yourself from falling debris."
  },
  {
    id: "2", 
    question: "How long should an emergency food supply last?",
    options: [
      "24 hours",
      "3 days",
      "1 week",
      "2 weeks"
    ],
    correctAnswer: 1,
    explanation: "Emergency preparedness experts recommend maintaining at least a 3-day supply of non-perishable food for each person in your household. This accounts for potential delays in emergency services and supply chain disruptions."
  }
];

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const handleModuleStart = (moduleId: string) => {
    if (moduleId === "earthquake") {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    setCompletedModules(prev => new Set(prev).add("earthquake"));
    // Here you could show a success message or redirect to achievements
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="container mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowQuiz(false)}
            className="mb-6"
          >
            ← Back to Modules
          </Button>
          <QuizCard
            title="Earthquake Preparedness Quiz"
            description="Test your knowledge of earthquake safety procedures"
            questions={sampleQuizQuestions}
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="w-fit emergency-transition">
                    <Shield className="w-4 h-4 mr-2" />
                    DisasterPrep Learn
                  </Badge>
                  <h1 className="text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                    Master Emergency
                    <span className="block">Preparedness</span>
                  </h1>
                  <p className="text-xl text-primary-foreground/90 max-w-lg">
                    Interactive learning modules to help you prepare for disasters, protect your community, and save lives through proper emergency response training.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" variant="secondary" className="font-semibold">
                    <Play className="w-5 h-5 mr-2" />
                    Start Learning
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Modules
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Emergency preparedness training"
                  className="rounded-2xl emergency-glow emergency-transition hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Active Learners"
              value="2,847"
              description="Students currently enrolled"
              icon={<Users className="w-6 h-6" />}
              trend={{ value: "12%", isPositive: true }}
              color="emergency"
            />
            <StatsCard
              title="Modules Completed"
              value="15,293"
              description="Total learning achievements"
              icon={<CheckCircle className="w-6 h-6" />}
              trend={{ value: "8%", isPositive: true }}
              color="success"
            />
            <StatsCard
              title="Success Rate"
              value="94%"
              description="Average quiz completion"
              icon={<Target className="w-6 h-6" />}
              color="warning"
            />
            <StatsCard
              title="Preparedness Level"
              value="87%"
              description="Community readiness score"
              icon={<TrendingUp className="w-6 h-6" />}
              trend={{ value: "5%", isPositive: true }}
              color="success"
            />
          </div>
        </div>
      </section>

      {/* Learning Modules Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold">Emergency Preparedness Modules</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive training programs covering essential disaster scenarios and emergency response protocols.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              title="Earthquake Safety"
              description="Learn drop, cover, and hold techniques, evacuation procedures, and post-earthquake safety protocols."
              difficulty="Beginner"
              duration="45 mins"
              progress={completedModules.has("earthquake") ? 100 : 0}
              icon={<Zap className="w-6 h-6" />}
              color="emergency"
              enrolled={1247}
              onStart={() => handleModuleStart("earthquake")}
            />
            
            <ModuleCard
              title="Flood Preparedness"
              description="Understand flood risks, emergency kits, evacuation routes, and water safety measures."
              difficulty="Beginner"
              duration="40 mins"
              progress={0}
              icon={<Waves className="w-6 h-6" />}
              color="emergency"
              enrolled={983}
              onStart={() => handleModuleStart("flood")}
            />
            
            <ModuleCard
              title="Fire Safety & Prevention"
              description="Fire prevention strategies, evacuation plans, smoke detector maintenance, and emergency response."
              difficulty="Intermediate"
              duration="60 mins"
              progress={0}
              icon={<Flame className="w-6 h-6" />}
              color="destructive"
              enrolled={1456}
              onStart={() => handleModuleStart("fire")}
            />
            
            <ModuleCard
              title="Severe Weather Response"
              description="Tornado, hurricane, and severe storm preparedness including shelter procedures and emergency communication."
              difficulty="Intermediate"
              duration="50 mins"
              progress={0}
              icon={<Wind className="w-6 h-6" />}
              color="warning"
              enrolled={892}
              onStart={() => handleModuleStart("weather")}
            />
            
            <ModuleCard
              title="Winter Storm Safety"
              description="Cold weather preparedness, power outage protocols, and winter driving safety measures."
              difficulty="Beginner"
              duration="35 mins"
              progress={0}
              icon={<Snowflake className="w-6 h-6" />}
              color="emergency"
              enrolled={654}
              onStart={() => handleModuleStart("winter")}
            />
            
            <ModuleCard
              title="Cybersecurity Threats"
              description="Digital security best practices, data protection, and emergency communication during cyber incidents."
              difficulty="Advanced"
              duration="75 mins"
              progress={0}
              icon={<AlertTriangle className="w-6 h-6" />}
              color="warning"
              enrolled={478}
              onStart={() => handleModuleStart("cyber")}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 emergency-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-primary-foreground">
              Ready to Become Emergency Prepared?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of learners who have strengthened their communities through proper disaster preparedness training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="font-semibold">
                <Award className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                View All Courses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
