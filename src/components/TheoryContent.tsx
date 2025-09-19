import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle, ArrowRight } from "lucide-react";

interface TheorySection {
  id: string;
  title: string;
  content: string;
  estimatedTime: string;
}

interface TheoryContentProps {
  title: string;
  description: string;
  sections: TheorySection[];
  currentSection: number;
  onSectionComplete: (sectionId: string) => void;
  onComplete: () => void;
  completedSections: Set<string>;
}

export function TheoryContent({
  title,
  description,
  sections,
  currentSection,
  onSectionComplete,
  onComplete,
  completedSections,
}: TheoryContentProps) {
  const currentSectionData = sections[currentSection];
  const progress = (completedSections.size / sections.length) * 100;
  const isAllComplete = completedSections.size === sections.length;

  const handleSectionComplete = () => {
    onSectionComplete(currentSectionData.id);
    if (currentSection === sections.length - 1 && !isAllComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="emergency-gradient text-primary-foreground">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-primary-foreground/20" />
          </div>
        </CardHeader>
      </Card>

      {/* Section Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`p-3 rounded-lg border emergency-transition cursor-pointer ${
                  index === currentSection
                    ? "emergency-gradient text-primary-foreground"
                    : completedSections.has(section.id)
                    ? "bg-success/10 border-success/20"
                    : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {completedSections.has(section.id) && (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )}
                  <span className="font-medium text-sm">{section.title}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 opacity-70" />
                  <span className="text-xs opacity-70">{section.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Section Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentSectionData.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  Section {currentSection + 1} of {sections.length}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-3 h-3" />
                  {currentSectionData.estimatedTime}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {currentSectionData.content}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {completedSections.has(currentSectionData.id) ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-4 h-4" />
                  Section Completed
                </div>
              ) : (
                "Read through the content to continue"
              )}
            </div>
            
            <div className="flex gap-3">
              {!completedSections.has(currentSectionData.id) && (
                <Button onClick={handleSectionComplete} variant="hero">
                  Mark as Complete
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {isAllComplete && (
                <Button onClick={onComplete} variant="hero" size="lg">
                  Start Quiz
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}