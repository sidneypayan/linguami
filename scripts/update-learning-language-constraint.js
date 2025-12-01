const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'
);

console.log(`
=============================================================
CONSTRAINT UPDATE REQUIRED
=============================================================

The error "check_learning_language" indicates there's a CHECK
constraint on the users_profile table that needs to be updated.

Please run this SQL in Supabase Dashboard (SQL Editor):
https://supabase.com/dashboard/project/capnpewksfdnllttnvzu/sql/new

=============================================================
SQL TO RUN:
=============================================================

-- Drop the old constraint
ALTER TABLE users_profile
DROP CONSTRAINT IF EXISTS check_learning_language;

-- Add the new constraint with Italian included
ALTER TABLE users_profile
ADD CONSTRAINT check_learning_language
CHECK (learning_language IN ('fr', 'ru', 'en', 'it'));

=============================================================
`);
