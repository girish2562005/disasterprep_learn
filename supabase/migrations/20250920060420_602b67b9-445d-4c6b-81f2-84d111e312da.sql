-- Fix the security definer view issue

-- Recreate the view without security definer properties
DROP VIEW IF EXISTS public.quiz_questions_student_view;

CREATE VIEW public.quiz_questions_student_view AS
SELECT 
  id,
  module_id,
  question,
  options,
  order_index,
  created_at
FROM public.quiz_questions;

-- Grant SELECT permissions on the view
GRANT SELECT ON public.quiz_questions_student_view TO authenticated, anon;