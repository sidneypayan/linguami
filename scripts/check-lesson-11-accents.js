require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAccents() {
  const { data: lesson } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('id', 11)
    .single();

  console.log('=== LESSON 11: Bonjour ! - Saluer et prendre congé ===\n');
  console.log('Title FR:', lesson.title_fr);
  console.log('Title RU:', lesson.title_ru);
  console.log('Slug:', lesson.slug);
  console.log('\n=== BLOCKS FR ===\n');
  console.log(JSON.stringify(lesson.blocks_fr, null, 2));
  console.log('\n=== BLOCKS RU ===\n');
  console.log(JSON.stringify(lesson.blocks_ru, null, 2));
}

checkAccents()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
