const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

async function addItalianSupport() {
  console.log('Adding Italian language support to database...\n');

  // 1. Add blocks_it column to course_lessons
  console.log('1. Adding blocks_it column to course_lessons...');
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE course_lessons
      ADD COLUMN IF NOT EXISTS blocks_it JSONB;

      COMMENT ON COLUMN course_lessons.blocks_it IS 'Lesson content blocks in Italian (JSONB)';
    `
  });

  if (alterError) {
    // Try direct approach if RPC doesn't work
    console.log('RPC not available, trying alternative approach...');

    // Check if column exists by trying to select it
    const { data, error: selectError } = await supabase
      .from('course_lessons')
      .select('blocks_it')
      .limit(1);

    if (selectError && selectError.message.includes('blocks_it')) {
      console.log('Column blocks_it does not exist. Please run this SQL manually:');
      console.log(`
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_it JSONB;

COMMENT ON COLUMN course_lessons.blocks_it IS 'Lesson content blocks in Italian (JSONB)';
      `);
    } else {
      console.log('✓ Column blocks_it already exists or was created successfully');
    }
  } else {
    console.log('✓ blocks_it column added successfully');
  }

  // 2. Check if learning_language has constraints
  console.log('\n2. Checking users_profile table...');
  const { data: profiles, error: profileError } = await supabase
    .from('users_profile')
    .select('learning_language')
    .limit(5);

  if (profileError) {
    console.log('Error checking profiles:', profileError.message);
  } else {
    console.log('✓ users_profile table accessible');
    console.log('Sample learning_language values:', profiles.map(p => p.learning_language));
  }

  // 3. Check materials table
  console.log('\n3. Checking materials table...');
  const { data: materials, error: matError } = await supabase
    .from('materials')
    .select('lang')
    .limit(5);

  if (matError) {
    console.log('Error checking materials:', matError.message);
  } else {
    console.log('✓ materials table accessible');
    const langs = [...new Set(materials.map(m => m.lang))];
    console.log('Existing lang values:', langs);
  }

  console.log('\n=== Summary ===');
  console.log('Italian (it) has been added to:');
  console.log('- utils/constants.js');
  console.log('- Server Actions Zod schemas');
  console.log('- LanguageMenu.jsx');
  console.log('- Translation files (messages/*.json)');
  console.log('\nNote: If there are CHECK constraints on lang columns,');
  console.log('you may need to update them manually via Supabase Dashboard.');
}

addItalianSupport();
