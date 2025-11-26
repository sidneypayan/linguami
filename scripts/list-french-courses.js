const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Get courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, level, lang, slug')
    .eq('lang', 'fr')
    .order('level')
    .order('title');

  console.log('=== COURS DE FRANCAIS EXISTANTS ===\n');
  courses?.forEach(c => console.log(`[${c.level}] ${c.title} (slug: ${c.slug})`));

  // Get lessons count per course
  console.log('\n=== DETAIL DES LECONS ===\n');
  for (const course of courses || []) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, slug')
      .eq('course_id', course.id)
      .order('order_index');

    console.log(`\n[${course.level}] ${course.title} - ${lessons?.length || 0} lecon(s)`);
    lessons?.forEach((l, i) => console.log(`   ${i+1}. ${l.title}`));
  }

  // Summary
  console.log('\n=== RESUME ===');
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  for (const level of levels) {
    const levelCourses = courses?.filter(c => c.level === level) || [];
    console.log(`${level}: ${levelCourses.length} cours`);
  }
}

main();
