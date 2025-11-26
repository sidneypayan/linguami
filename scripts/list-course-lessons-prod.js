const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://psomseputtsdizmmqugy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzb21zZXB1dHRzZGl6bW1xdWd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk0NTkzOSwiZXhwIjoyMDU1NTIxOTM5fQ.4fCtRWcobxYPt2_egoqGyD9u82G_LdgIOfi8u28VvSs'
);

async function main() {
  // Get courses first
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title_fr, target_language, level_id')
    .order('target_language')
    .order('level_id');

  console.log('=== COURS ===\n');
  courses?.forEach(c => console.log('ID ' + c.id + ': ' + c.title_fr + ' (target: ' + c.target_language + ')'));

  // Get course_lessons
  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('id, course_id, title_fr, slug, order_index, is_published')
    .order('course_id')
    .order('order_index');

  console.log('\n=== LECONS DE LA METHODE (' + (lessons?.length || 0) + ' total) ===\n');

  // Group by course
  const byCourse = {};
  lessons?.forEach(l => {
    if (!byCourse[l.course_id]) byCourse[l.course_id] = [];
    byCourse[l.course_id].push(l);
  });

  for (const [courseId, list] of Object.entries(byCourse)) {
    const course = courses?.find(c => c.id === parseInt(courseId));
    const courseName = course ? course.title_fr + ' (' + course.target_language + ')' : 'Course ID ' + courseId;
    console.log(courseName + ' - ' + list.length + ' lecons:');
    list.forEach((l, i) => {
      const status = l.is_published ? '✓' : '○';
      console.log('   ' + status + ' ' + (i + 1) + '. ' + l.title_fr);
    });
    console.log('');
  }

  // Summary
  console.log('=== RESUME ===');
  console.log('Total lecons: ' + (lessons?.length || 0));
  console.log('Publiees: ' + (lessons?.filter(l => l.is_published).length || 0));
  console.log('Non publiees: ' + (lessons?.filter(l => !l.is_published).length || 0));
}

main();
