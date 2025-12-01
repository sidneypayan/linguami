const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

async function getLessonContent() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('id, slug, blocks_fr, objectives_fr')
    .eq('slug', 'saluer-prendre-conge')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Lesson ID:', data.id);
  console.log('Slug:', data.slug);
  console.log('Title:', data.title);
  console.log('\n=== BLOCKS_FR ===\n');
  console.log(JSON.stringify(data.blocks_fr, null, 2));
  console.log('\n=== OBJECTIVES_FR ===\n');
  console.log(JSON.stringify(data.objectives_fr, null, 2));
}

getLessonContent();
