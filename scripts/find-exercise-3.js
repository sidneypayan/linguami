const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findExercise3() {
  // Get lesson ID for alphabet-sons-et-accents
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('slug', 'alphabet-sons-et-accents')
    .single();

  if (lessonError) {
    console.error('Error fetching lesson:', lessonError);
    return;
  }

  console.log('Lesson ID:', lesson.id);

  // Get all exercises for this lesson
  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('*')
    .eq('parent_id', lesson.id)
    .eq('parent_type', 'lesson')
    .order('id');

  if (exercisesError) {
    console.error('Error fetching exercises:', exercisesError);
    return;
  }

  console.log(`\nFound ${exercises.length} exercises:\n`);

  exercises.forEach((ex, index) => {
    console.log(`Exercise ${index + 1}:`);
    console.log(`  ID: ${ex.id}`);
    console.log(`  Type: ${ex.exercise_type}`);
    console.log(`  Position: ${ex.position}`);

    if (ex.data && ex.data.questions) {
      console.log(`  Questions: ${ex.data.questions.length}`);
      ex.data.questions.forEach((q, qIndex) => {
        if (q.hint) {
          console.log(`    Question ${qIndex + 1} hint: "${q.hint}"`);
        }
        if (q.explanation) {
          console.log(`    Question ${qIndex + 1} explanation: "${q.explanation}"`);
        }
      });
    }
    console.log('');
  });

  // Show exercise 3 in detail
  if (exercises[2]) {
    console.log('\n=== EXERCISE 3 DETAIL ===');
    console.log(JSON.stringify(exercises[2], null, 2));
  }
}

findExercise3();
