require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findLessons() {
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, title_ru, slug, course_id, display_order')
    .or('title.ilike.%bonjour%,title.ilike.%salut%,title_ru.ilike.%привет%,slug.ilike.%bonjour%,slug.ilike.%salut%')
    .order('display_order');

  console.log('=== LESSONS ABOUT GREETINGS ===\n');

  if (lessons && lessons.length > 0) {
    lessons.forEach(lesson => {
      console.log(`Lesson ${lesson.id}:`);
      console.log(`  Title: ${lesson.title}`);
      console.log(`  Title RU: ${lesson.title_ru}`);
      console.log(`  Slug: ${lesson.slug}`);
      console.log(`  Display order: ${lesson.display_order}`);
      console.log('');
    });
  } else {
    console.log('No greeting lessons found. Showing first 10 lessons:');

    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id, title, title_ru, slug, display_order, lang')
      .limit(10)
      .order('id');

    if (allLessons) {
      allLessons.forEach(lesson => {
        console.log(`${lesson.id}: [${lesson.lang}] ${lesson.title} (${lesson.slug})`);
      });
    }
  }
}

findLessons()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
