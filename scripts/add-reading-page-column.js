const { createClient } = require('@supabase/supabase-js');

async function addColumn(envFile, dbName) {
  require('dotenv').config({ path: envFile, override: true });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(`\nAdding reading_page column to ${dbName}...`);

  // Add reading_page column (default 1)
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE user_materials
      ADD COLUMN IF NOT EXISTS reading_page INTEGER DEFAULT 1;
    `
  });

  if (error) {
    // Try direct SQL if rpc doesn't work
    console.log('RPC failed, trying direct approach...');

    // Check if column exists by trying to select it
    const { data, error: selectError } = await supabase
      .from('user_materials')
      .select('reading_page')
      .limit(1);

    if (selectError && selectError.message.includes('does not exist')) {
      console.log(`Column doesn't exist in ${dbName}. Please run this SQL manually:`);
      console.log(`ALTER TABLE user_materials ADD COLUMN reading_page INTEGER DEFAULT 1;`);
    } else if (!selectError) {
      console.log(`Column reading_page already exists in ${dbName}`);
    } else {
      console.log(`Error checking column: ${selectError.message}`);
    }
  } else {
    console.log(`Successfully added reading_page column to ${dbName}`);
  }
}

async function main() {
  // Dev DB
  await addColumn('.env.local', 'DEV');

  // Prod DB
  await addColumn('.env.production', 'PROD');
}

main();
