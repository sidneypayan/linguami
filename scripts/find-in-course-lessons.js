require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findLesson() {
  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('*')
    .or('slug.eq.bonjour-saluer-prendre-conge,title_fr.ilike.%bonjour%,title_fr.ilike.%salut%')
    .limit(5);

  console.log('Found lessons:', lessons ? lessons.length : 0, '\n');

  if (lessons && lessons.length > 0) {
    lessons.forEach(lesson => {
      console.log('=== LESSON ===');
      console.log('ID:', lesson.id);
      console.log('Title FR:', lesson.title_fr);
      console.log('Title RU:', lesson.title_ru);
      console.log('Slug:', lesson.slug);
      console.log('Step:', lesson.step);

      // Show full blocks
      if (lesson.blocks_fr) {
        console.log('\n--- BLOCKS FR ---');
        console.log(JSON.stringify(lesson.blocks_fr, null, 2));
      }

      if (lesson.blocks_ru) {
        console.log('\n--- BLOCKS RU ---');
        console.log(JSON.stringify(lesson.blocks_ru, null, 2));
      }

      console.log('\n' + '='.repeat(80) + '\n');
    });
  } else {
    console.log('No lessons found');
  }
}

findLesson()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
