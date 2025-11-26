const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://psomseputtsdizmmqugy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21zZXB1dHRzZGl6bW1xdWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NTkzOSwiZXhwIjoyMDU1NTIxOTM5fQ.4fCtRWcobxYPt2_egoqGyD9u82G_LdgIOfi8u28VvSs'
);

async function main() {
  // Get levels
  const { data: levels } = await supabase.from('levels').select('*');
  console.log('=== NIVEAUX ===');
  levels?.forEach(l => console.log(l.id + ': ' + l.name));

  // Get courses with level info
  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, title_fr, target_language, level_id, is_published')
    .order('target_language')
    .order('level_id');

  console.log('\n=== COURS (PROD) ===\n');

  const byTarget = {};
  courses?.forEach(c => {
    if (!byTarget[c.target_language]) byTarget[c.target_language] = [];
    const level = levels?.find(l => l.id === c.level_id);
    byTarget[c.target_language].push({ ...c, levelName: level?.name || 'N/A' });
  });

  for (const [target, list] of Object.entries(byTarget)) {
    console.log('Cours pour apprendre le ' + target.toUpperCase() + ':');
    list.forEach(c => console.log('  [' + c.levelName + '] ' + c.title_fr + ' (published: ' + c.is_published + ')'));
    console.log('');
  }

  // Get lessons for each course
  console.log('=== DETAIL DES LECONS ===\n');
  for (const course of courses || []) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title_fr, slug')
      .eq('course_id', course.id)
      .order('order_index');

    const level = levels?.find(l => l.id === course.level_id);
    console.log('[' + course.target_language.toUpperCase() + ' ' + (level?.name || 'N/A') + '] ' + course.title_fr + ' - ' + (lessons?.length || 0) + ' lecon(s)');
    lessons?.forEach((l, i) => console.log('   ' + (i + 1) + '. ' + l.title_fr));
    console.log('');
  }
}

main();
