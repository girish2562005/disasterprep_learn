-- Fix quiz security vulnerability by restricting student access to sensitive columns

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Students can view questions without sensitive data" ON public.quiz_questions;
DROP POLICY IF EXISTS "Students can view questions without answers" ON public.quiz_questions;

-- Create a secure view for students that excludes sensitive data
CREATE OR REPLACE VIEW public.quiz_questions_student_view AS
SELECT 
  id,
  module_id,
  question,
  options,
  order_index,
  created_at
FROM public.quiz_questions;

-- Grant usage on the view to authenticated users and anon
GRANT SELECT ON public.quiz_questions_student_view TO authenticated, anon;

-- Create a restrictive policy that prevents direct student access to sensitive columns
CREATE POLICY "Students cannot access quiz table directly" 
ON public.quiz_questions 
FOR SELECT 
USING (
  -- Only allow admin and teacher roles to access the table directly
  get_current_user_role() = ANY (ARRAY['admin'::text, 'teacher'::text])
);

-- Update the search_path for existing functions to fix linter warnings
CREATE OR REPLACE FUNCTION public.validate_quiz_answer(question_id uuid, user_answer integer)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  correct_answer INTEGER;
  explanation TEXT;
  question_text TEXT;
  result JSON;
BEGIN
  -- Get the correct answer and explanation (only this function can access sensitive data)
  SELECT 
    quiz_questions.correct_answer, 
    quiz_questions.explanation,
    quiz_questions.question
  INTO correct_answer, explanation, question_text
  FROM public.quiz_questions 
  WHERE id = question_id;
  
  -- Return validation result without exposing the correct answer
  result := json_build_object(
    'is_correct', user_answer = correct_answer,
    'explanation', explanation,
    'question', question_text
  );
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.submit_quiz_answers(module_id uuid, answers json)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  question_record RECORD;
  user_answer INTEGER;
  correct_count INTEGER := 0;
  total_questions INTEGER := 0;
  score INTEGER;
  result JSON;
BEGIN
  -- Validate that user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to submit quiz';
  END IF;
  
  -- Count total questions for this module
  SELECT COUNT(*) INTO total_questions
  FROM public.quiz_questions 
  WHERE quiz_questions.module_id = submit_quiz_answers.module_id;
  
  -- Validate each answer
  FOR question_record IN 
    SELECT id, correct_answer, order_index
    FROM public.quiz_questions 
    WHERE quiz_questions.module_id = submit_quiz_answers.module_id
    ORDER BY order_index
  LOOP
    -- Get user's answer for this question
    user_answer := (answers->>(question_record.order_index::text))::INTEGER;
    
    -- Check if answer is correct
    IF user_answer = question_record.correct_answer THEN
      correct_count := correct_count + 1;
    END IF;
    
    total_questions := total_questions;
  END LOOP;
  
  -- Calculate score percentage
  score := (correct_count * 100) / NULLIF(total_questions, 0);
  
  -- Update or insert user progress
  INSERT INTO public.user_progress (user_id, module_id, score, is_completed, completed_at, attempts)
  VALUES (
    auth.uid(), 
    submit_quiz_answers.module_id, 
    score, 
    score >= 80, -- Passing score of 80%
    CASE WHEN score >= 80 THEN NOW() ELSE NULL END,
    1
  )
  ON CONFLICT (user_id, module_id) 
  DO UPDATE SET 
    score = GREATEST(user_progress.score, EXCLUDED.score),
    is_completed = CASE WHEN EXCLUDED.score >= 80 THEN true ELSE user_progress.is_completed END,
    completed_at = CASE WHEN EXCLUDED.score >= 80 AND user_progress.completed_at IS NULL THEN NOW() ELSE user_progress.completed_at END,
    attempts = user_progress.attempts + 1,
    updated_at = NOW();
  
  -- Return results
  result := json_build_object(
    'score', score,
    'correct_answers', correct_count,
    'total_questions', total_questions,
    'passed', score >= 80
  );
  
  RETURN result;
END;
$function$;