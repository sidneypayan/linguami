require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function searchAllTables() {
  // Get list of all tables
  const { data: tables } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');

  console.log('Searching in all tables for "Comment allez-vous" phrases...\n');

  for (const table of tables || []) {
    const tableName = table.tablename;
    
    try {
      // Try to get all columns
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1000);

      if (data && data.length > 0) {
        // Search in all columns for our phrases
        const matches = data.filter(row => {
          const rowStr = JSON.stringify(row).toLowerCase();
          return rowStr.includes('comment allez') || 
                 rowStr.includes('comment vas') || 
                 rowStr.includes('ca va') ||
                 rowStr.includes('ça va') ||
                 rowStr.includes('как поживаете') ||
                 rowStr.includes('как поживаешь');
        });

        if (matches.length > 0) {
          console.log(`\n=== TABLE: ${tableName} (${matches.length} matches) ===`);
          matches.slice(0, 3).forEach(match => {
            console.log(JSON.stringify(match, null, 2).substring(0, 500));
          });
        }
      }
    } catch (err) {
      // Skip tables we can't access
    }
  }
}

searchAllTables()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
