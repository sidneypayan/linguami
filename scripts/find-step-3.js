require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findStep3() {
  // Search in lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .or('title.ilike.%step 3%,title_ru.ilike.%step 3%')
    .limit(5);

  console.log('=== LESSONS WITH "STEP 3" ===');
  if (lessons && lessons.length > 0) {
    lessons.forEach(lesson => {
      console.log(`\nLesson ${lesson.id}:`);
      console.log(`  Title FR: ${lesson.title}`);
      console.log(`  Title RU: ${lesson.title_ru}`);
      console.log(`  Course: ${lesson.course_id}`);
    });
  } else {
    console.log('No lessons found with "step 3"');
  }

  // Search in course_blocks
  const { data: blocks } = await supabase
    .from('course_blocks')
    .select('*')
    .or('content_fr.ilike.%Comment allez-vous%,content_ru.ilike.%Как поживаете%')
    .limit(10);

  console.log('\n\n=== BLOCKS WITH "Comment allez-vous" ===');
  if (blocks && blocks.length > 0) {
    blocks.forEach(block => {
      console.log(`\nBlock ${block.id} (Lesson: ${block.lesson_id}):`);
      console.log(`  Type: ${block.block_type}`);
      console.log(`  Content FR: ${block.content_fr?.substring(0, 100)}`);
      console.log(`  Content RU: ${block.content_ru?.substring(0, 100)}`);
    });
  } else {
    console.log('No blocks found');
  }

  // Check lessons by order/step
  const { data: orderedLessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('display_order', 2)
    .limit(5);

  console.log('\n\n=== LESSONS WITH display_order = 2 (Step 3) ===');
  if (orderedLessons && orderedLessons.length > 0) {
    orderedLessons.forEach(lesson => {
      console.log(`\nLesson ${lesson.id}:`);
      console.log(`  Title FR: ${lesson.title}`);
      console.log(`  Title RU: ${lesson.title_ru}`);
      console.log(`  Course: ${lesson.course_id}`);
    });
  }
}

findStep3()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
