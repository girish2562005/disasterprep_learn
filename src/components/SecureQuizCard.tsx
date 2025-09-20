import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order_index: number;
}

interface ValidationResult {
  is_correct: boolean;
  explanation: string;
}

interface SubmissionResult {
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
}

interface SecureQuizCardProps {
  title: string;
  description: string;
  moduleId: string;
  onComplete: (score: number) => void;
}

export function SecureQuizCard({ title, description, moduleId, onComplete }: SecureQuizCardProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const { toast } = useToast();

  // Fetch questions securely from the view
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_questions_student_view')
          .select('*')
          .eq('module_id', moduleId)
          .order('order_index');

        if (error) throw error;

        const formattedQuestions = data.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options as string[],
          order_index: q.order_index
        }));

        setQuestions(formattedQuestions);
        setAnswers(new Array(formattedQuestions.length).fill(null));
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [moduleId, toast]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleValidateAnswer = async () => {
    if (selectedAnswer === null) return;
    
    setIsValidating(true);
    try {
      const { data, error } = await supabase.rpc('validate_quiz_answer', {
        question_id: questions[currentQuestion].id,
        user_answer: selectedAnswer
      });

      if (error) throw error;

      setValidationResult(data as unknown as ValidationResult);
      setShowResult(true);
    } catch (error) {
      console.error('Error validating answer:', error);
      toast({
        title: "Error",
        description: "Failed to validate answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowResult(false);
      setValidationResult(null);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Convert answers array to object with order_index as keys
      const answersObject: Record<string, number> = {};
      answers.forEach((answer, index) => {
        if (answer !== null) {
          answersObject[index.toString()] = answer;
        }
      });

      const { data, error } = await supabase.rpc('submit_quiz_answers', {
        module_id: moduleId,
        answers: answersObject
      });

      if (error) throw error;

      const result = data as unknown as SubmissionResult;
      toast({
        title: result.passed ? "Quiz Passed!" : "Quiz Completed",
        description: `Score: ${result.score}% (${result.correct_answers}/${result.total_questions} correct)`,
        variant: result.passed ? "default" : "destructive"
      });

      onComplete(result.score);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto emergency-transition">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading quiz...</span>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto emergency-transition">
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground">No quiz questions available for this module.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
                      ? validationResult?.is_correct && selectedAnswer === index
                        ? 'bg-success/10 border-success text-success-foreground'
                        : !validationResult?.is_correct && selectedAnswer === index
                        ? 'bg-destructive/10 border-destructive text-destructive-foreground'
                        : 'bg-primary/10 border-primary'
                      : 'bg-primary/10 border-primary'
                    : 'bg-background border-border hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && selectedAnswer === index && (
                    <div>
                      {validationResult?.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && validationResult && (
          <div className={`p-4 rounded-lg ${
            validationResult.is_correct ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
          }`}>
            <div className="flex items-start gap-3">
              {validationResult.is_correct ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive mt-0.5" />
              )}
              <div>
                <h4 className={`font-semibold ${validationResult.is_correct ? 'text-success' : 'text-destructive'}`}>
                  {validationResult.is_correct ? 'Correct!' : 'Incorrect'}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{validationResult.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={selectedAnswer === null || showResult || isValidating}
            onClick={handleValidateAnswer}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Answer'
            )}
          </Button>
          
          <Button
            variant={showResult ? "hero" : "outline"}
            disabled={selectedAnswer === null || !showResult || isSubmitting}
            onClick={handleNext}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : currentQuestion === questions.length - 1 ? (
              'Complete Quiz'
            ) : (
              'Next Question'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}