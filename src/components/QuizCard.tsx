import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizCardProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function QuizCard({ title, description, questions, onComplete }: QuizCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1]);
        setShowResult(false);
      } else {
        // Quiz completed
        const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0);
        onComplete(finalScore);
      }
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <Card className="max-w-2xl mx-auto emergency-transition">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {currentQuestion + 1} / {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQ.question}</h3>
          
          <div className="grid gap-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-4 text-left rounded-lg border emergency-transition ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQ.correctAnswer
                        ? 'bg-success/10 border-success text-success-foreground'
                        : 'bg-destructive/10 border-destructive text-destructive-foreground'
                      : 'bg-primary/10 border-primary'
                    : showResult && index === currentQ.correctAnswer
                    ? 'bg-success/10 border-success'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <div>
                      {index === currentQ.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="w-5 h-5 text-destructive" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <div className={`p-4 rounded-lg ${
            isCorrect ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
          }`}>
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <h4 className={`font-semibold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{currentQ.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={selectedAnswer === null || showResult}
            onClick={handleShowResult}
          >
            Check Answer
          </Button>
          
          <Button
            variant={showResult ? "hero" : "outline"}
            disabled={selectedAnswer === null || !showResult}
            onClick={handleNext}
          >
            {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}