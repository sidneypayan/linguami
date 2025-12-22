const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listLessons() {
  try {
    console.log('🔍 Fetching all lessons...\n');

    const { data: lessons, error } = await supabase
      .from('course_lessons')
      .select('id, slug, title_fr, course_id, status')
      .order('id', { ascending: true })
      .limit(20);

    if (error) throw error;

    if (!lessons || lessons.length === 0) {
      console.log('❌ No lessons found');
      return;
    }

    console.log(`✅ Found ${lessons.length} lessons:\n`);
    lessons.forEach(lesson => {
      console.log(`ID: ${lesson.id} | Slug: ${lesson.slug} | Course: ${lesson.course_id} | Status: ${lesson.status}`);
      console.log(`   Title FR: ${lesson.title_fr}`);
      console.log('-'.repeat(80));
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

listLessons();
