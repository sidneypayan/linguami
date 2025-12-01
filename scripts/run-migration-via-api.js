const https = require('https');

const PROJECT_REF = 'capnpewksfdnllttnvzu';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY';

const migrationSQL = `
ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS blocks_it JSONB;

ALTER TABLE course_lessons
ADD COLUMN IF NOT EXISTS objectives_it TEXT[];
`;

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });

    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('Attempting to run migration via Supabase API...\n');

  // The REST API doesn't support DDL, so we need an alternative
  // Let's try the pg_dump approach or create a function

  console.log('Note: Supabase REST API does not support DDL (ALTER TABLE).');
  console.log('The migration file has been created at:');
  console.log('  supabase/migrations/20251130_add_italian_language.sql\n');

  console.log('To apply it, you can:');
  console.log('1. Go to Supabase Dashboard > SQL Editor');
  console.log('   URL: https://supabase.com/dashboard/project/' + PROJECT_REF + '/sql/new\n');

  console.log('2. Run this SQL:\n');
  console.log(migrationSQL);

  console.log('\n3. Or use supabase CLI with proper authentication:');
  console.log('   npx supabase login');
  console.log('   npx supabase link --project-ref ' + PROJECT_REF);
  console.log('   npx supabase db push\n');
}

main();
