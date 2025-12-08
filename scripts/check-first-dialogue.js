const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('blocks_fr')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== ÉTAPE 1 - Premier dialogue ===\n');
  console.log(JSON.stringify(data.blocks_fr[0], null, 2));

  console.log('\n\n=== ÉTAPE 12 - Conversation actuelle ===\n');
  console.log(JSON.stringify(data.blocks_fr[11], null, 2));
})();
