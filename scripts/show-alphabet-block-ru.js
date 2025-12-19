const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function showAlphabetBlock() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, slug, title_fr, target_language, blocks_ru')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== Lesson Info ===');
  console.log('ID:', lesson.id);
  console.log('Slug:', lesson.slug);
  console.log('Title FR:', lesson.title_fr);
  console.log('Target Language:', lesson.target_language);

  // Find alphabetGrid block
  const alphabetBlock = lesson.blocks_ru?.find(b => b.type === 'alphabetGrid');

  if (!alphabetBlock) {
    console.log('\n⚠️ No alphabetGrid block found');
    console.log('Available block types:', lesson.blocks_ru?.map(b => b.type).join(', '));
    return;
  }

  console.log('\n=== AlphabetGrid Block (blocks_ru) ===');
  console.log('Title:', alphabetBlock.title);
  console.log('\nLetters (first 10):');
  alphabetBlock.letters?.slice(0, 10).forEach(l => {
    console.log(`  ${l.letter} - ${l.word} ${l.emoji} ${l.pronunciation}`);
  });

  console.log('\n... and', (alphabetBlock.letters?.length - 10), 'more letters');

  // Save to file for reference
  fs.writeFileSync('alphabet-block-ru.json', JSON.stringify(alphabetBlock, null, 2));
  console.log('\n✅ Full block saved to alphabet-block-ru.json');
}

showAlphabetBlock();
