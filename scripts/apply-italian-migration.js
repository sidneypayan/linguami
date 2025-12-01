const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

async function applyMigration() {
  console.log('Applying Italian language migration via Supabase SQL function...\n');

  // Use Supabase's built-in SQL execution via Edge Function or direct query
  // Since we can't run DDL directly, we'll create a database function first

  const migrationSQL = `
    DO $$
    BEGIN
      -- Add blocks_it column if not exists
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'course_lessons' AND column_name = 'blocks_it'
      ) THEN
        ALTER TABLE course_lessons ADD COLUMN blocks_it JSONB;
        COMMENT ON COLUMN course_lessons.blocks_it IS 'Lesson content blocks in Italian (JSONB)';
        RAISE NOTICE 'Added blocks_it column';
      ELSE
        RAISE NOTICE 'blocks_it column already exists';
      END IF;

      -- Add objectives_it column if not exists
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'course_lessons' AND column_name = 'objectives_it'
      ) THEN
        ALTER TABLE course_lessons ADD COLUMN objectives_it TEXT[];
        COMMENT ON COLUMN course_lessons.objectives_it IS 'Lesson objectives in Italian';
        RAISE NOTICE 'Added objectives_it column';
      ELSE
        RAISE NOTICE 'objectives_it column already exists';
      END IF;
    END $$;
  `;

  // Try using postgres function if available
  const { data, error } = await supabase.rpc('exec_sql', { query: migrationSQL });

  if (error) {
    console.log('RPC exec_sql not available:', error.message);
    console.log('\n--- Alternative: Use fetch to Supabase REST API ---\n');

    // Try using the PostgREST endpoint with raw SQL
    // This won't work for DDL, but let's try anyway

    console.log('The Supabase JS client cannot execute DDL statements directly.');
    console.log('Please use one of these methods:\n');

    console.log('Option 1: Supabase Dashboard');
    console.log('Go to: https://supabase.com/dashboard/project/capnpewksfdnllttnvzu/sql');
    console.log('And run the following SQL:\n');
    console.log(`
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_it JSONB;

ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS objectives_it TEXT[];

COMMENT ON COLUMN course_lessons.blocks_it IS 'Lesson content blocks in Italian (JSONB)';
COMMENT ON COLUMN course_lessons.objectives_it IS 'Lesson objectives in Italian';
    `);

    console.log('\nOption 2: Use supabase CLI with link');
    console.log('npx supabase link --project-ref capnpewksfdnllttnvzu');
    console.log('npx supabase db push');

  } else {
    console.log('Migration applied successfully!', data);
  }
}

applyMigration();
