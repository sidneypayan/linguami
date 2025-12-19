const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('=== Checking lessons table ===');
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .limit(5);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Found', lessons?.length, 'lessons');
    if (lessons && lessons.length > 0) {
      console.log('\nColumns:', Object.keys(lessons[0]));
      console.log('\nFirst lesson:');
      lessons.forEach(l => {
        console.log(`  ID: ${l.id}, Slug: ${l.slug || 'N/A'}`);
      });
    }
  }

  // Search for alphabet in any text field
  console.log('\n=== Searching for "alphabet" in lessons ===');
  const { data: results, error: err2 } = await supabase
    .from('lessons')
    .select('*')
    .or('slug.ilike.%alphabet%,title_fr.ilike.%alphabet%');

  if (err2) {
    console.error('Error searching:', err2);
  } else {
    console.log('Results:', results?.length);
    results?.forEach(r => {
      console.log(`  ID: ${r.id}, Slug: ${r.slug}, Title FR: ${r.title_fr}`);
    });
  }
}

checkTables();
