const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function searchLessons() {
  // Search in course_lessons
  const { data: courseLessons, error: error1 } = await supabase
    .from('course_lessons')
    .select('id, slug, title_fr')
    .ilike('slug', '%alphabet%');

  if (error1) console.error('Error in course_lessons:', error1);
  else {
    console.log('=== COURSE_LESSONS ===');
    console.log('Found', courseLessons?.length || 0, 'lessons');
    courseLessons?.forEach(l => console.log(`ID: ${l.id}, Slug: ${l.slug}`));
  }

  // Search in lessons table
  const { data: lessons, error: error2 } = await supabase
    .from('lessons')
    .select('id, slug, title')
    .ilike('slug', '%alphabet%');

  if (error2) console.error('Error in lessons:', error2);
  else {
    console.log('\n=== LESSONS ===');
    console.log('Found', lessons?.length || 0, 'lessons');
    lessons?.forEach(l => console.log(`ID: ${l.id}, Slug: ${l.slug}, Title: ${l.title}`));
  }
}

searchLessons();
