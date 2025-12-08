const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Total blocks_fr:', data.blocks_fr.length);
    console.log('\nBlocks types:');
    data.blocks_fr.forEach((block, i) => {
      console.log(`Block ${i}: type=${block.type}, exerciseType=${block.exerciseType || 'N/A'}, title=${block.title}`);
    });

    console.log('\n\n=== Block 2 (should be first drag and drop) ===');
    console.log(JSON.stringify(data.blocks_fr[2], null, 2));
  }
})();
