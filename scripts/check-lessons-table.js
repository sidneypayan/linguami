const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLessons() {
  try {
    console.log('🔍 Checking lessons table...\n');

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, slug, title_fr')
      .order('id')
      .limit(10);

    if (error) throw error;

    if (!lessons || lessons.length === 0) {
      console.log('❌ No lessons found in lessons table');
      return;
    }

    console.log(`✅ Found ${lessons.length} lessons:\n`);
    lessons.forEach(lesson => {
      console.log(`ID: ${lesson.id} | Slug: ${lesson.slug}`);
      console.log(`   Title: ${lesson.title_fr}`);
      console.log('-'.repeat(70));
    });

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkLessons();
