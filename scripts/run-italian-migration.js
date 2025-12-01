const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

async function runMigration() {
  console.log('Running Italian language migration...\n');

  // Supabase JS client cannot run DDL directly
  // But we can check if columns exist by trying to query them

  // Test if blocks_it column exists
  const { data, error } = await supabase
    .from('course_lessons')
    .select('id, blocks_it, objectives_it')
    .limit(1);

  if (error) {
    if (error.message.includes('blocks_it') || error.message.includes('objectives_it')) {
      console.log('❌ Columns blocks_it and/or objectives_it do not exist yet.');
      console.log('\nPlease run this SQL in Supabase Dashboard (SQL Editor):\n');
      console.log(`
-- Add blocks_it column to course_lessons for Italian lesson content
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_it JSONB;

COMMENT ON COLUMN course_lessons.blocks_it IS 'Lesson content blocks in Italian (JSONB)';

-- Add objectives_it column to course_lessons for Italian objectives
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS objectives_it TEXT[];

COMMENT ON COLUMN course_lessons.objectives_it IS 'Lesson objectives in Italian';
      `);
    } else {
      console.log('Error:', error.message);
    }
  } else {
    console.log('✓ Columns blocks_it and objectives_it already exist!');
    console.log('Data:', data);
  }
}

runMigration();
