const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listBlocks() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('blocks_fr')
    .eq('slug', 'alphabet-sons-et-accents')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Block types in alphabet-sons-et-accents:');
  console.log('==========================================\n');

  const blockTypes = new Set();
  lesson.blocks_fr.forEach((block, index) => {
    blockTypes.add(block.type);
    console.log(`${index + 1}. ${block.type}`);
    if (block.title) {
      console.log(`   Title: ${block.title}`);
    }
    console.log('');
  });

  console.log('\nUnique block types:');
  console.log('===================');
  console.log(Array.from(blockTypes).sort().join('\n'));
}

listBlocks();
