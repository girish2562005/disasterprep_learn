-- Insert earthquake safety learning module
INSERT INTO public.learning_modules (
  id,
  title,
  description,
  content,
  module_type,
  difficulty_level,
  order_index,
  passing_score,
  is_active
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Earthquake Safety',
  'Learn essential earthquake safety procedures and preparedness techniques',
  'This comprehensive module covers earthquake safety fundamentals, emergency procedures, and practical preparedness strategies.',
  'emergency',
  'beginner',
  1,
  80,
  true
);

-- Insert quiz questions for earthquake module
INSERT INTO public.quiz_questions (
  id,
  module_id,
  question,
  options,
  correct_answer,
  explanation,
  order_index
) VALUES 
(
  'q1111111-1111-1111-1111-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'What should you do immediately when you feel an earthquake?',
  '["Run outside as fast as possible", "Drop, Cover, and Hold On", "Stand in a doorway", "Look for the nearest exit"]',
  1,
  'The correct response is "Drop, Cover, and Hold On" - drop to your hands and knees, take cover under a desk or table, and hold on to protect yourself from falling objects.',
  0
),
(
  'q2222222-2222-2222-2222-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Where is the safest place to be during an earthquake if you are indoors?',
  '["Under a sturdy desk or table", "In a doorway", "Near a window", "In the center of the room"]',
  0,
  'Under a sturdy desk or table provides the best protection from falling objects and debris during an earthquake.',
  1
),
(
  'q3333333-3333-3333-3333-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'How long should you stay in your protective position during an earthquake?',
  '["Until the shaking stops completely", "For exactly 30 seconds", "Until someone tells you to move", "For 1 minute"]',
  0,
  'You should maintain your protective position until the shaking stops completely to avoid injury from ongoing ground movement.',
  2
),
(
  'q4444444-4444-4444-4444-444444444444',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'What should you do if you are outdoors during an earthquake?',
  '["Run to the nearest building", "Stay away from buildings, trees, and power lines", "Lie flat on the ground", "Find the nearest car"]',
  1,
  'When outdoors, move away from buildings, trees, streetlights, and power lines that could fall and cause injury.',
  3
),
(
  'q5555555-5555-5555-5555-555555555555',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'What is the most important item to have in an earthquake emergency kit?',
  '["Flashlight", "Water", "First aid kit", "Radio"]',
  1,
  'Water is the most critical item - you need at least 1 gallon per person per day for at least 3 days for drinking and sanitation.',
  4
);