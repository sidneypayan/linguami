const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  // Fetch fresh data
  const { data, error } = await supabase
    .from('course_lessons')
    .select('blocks_fr')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('📊 Total blocks:', data.blocks_fr.length);
    console.log('\n=== All blocks ===');
    data.blocks_fr.forEach((block, i) => {
      const type = block.type;
      const exerciseType = block.exerciseType || '';
      const title = block.title || '';
      console.log(`${i}: ${type}${exerciseType ? ` (${exerciseType})` : ''} - ${title}`);
    });
  }
})();
