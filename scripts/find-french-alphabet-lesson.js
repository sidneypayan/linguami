const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findLesson() {
  // Chercher la leçon avec le slug alphabet-sons-et-accents
  const { data: lessons, error } = await supabase
    .from('course_lessons')
    .select('id, slug, title_fr, title_en, title_ru')
    .or('slug.eq.alphabet-sons-et-accents,slug.ilike.%alphabet%');

  if (error) {
    console.error('Error searching lessons:', error);
    return;
  }

  console.log('=== Lessons found ===');
  console.log(JSON.stringify(lessons, null, 2));

  if (lessons.length > 0) {
    // Récupérer les blocks_ru de la première leçon
    const { data: lesson, error: err2 } = await supabase
      .from('course_lessons')
      .select('blocks_ru')
      .eq('id', lessons[0].id)
      .single();

    if (err2) {
      console.error('Error getting blocks:', err2);
      return;
    }

    // Trouver le bloc alphabetGrid
    const alphabetBlock = lesson.blocks_ru?.find(b => b.type === 'alphabetGrid');

    if (alphabetBlock) {
      console.log('\n=== AlphabetGrid Block Found ===');
      console.log('Title:', alphabetBlock.title);
      console.log('\nFirst 5 letters:');
      alphabetBlock.letters?.slice(0, 5).forEach(l => {
        console.log(`${l.letter} - ${l.word} ${l.emoji} ${l.pronunciation}`);
      });
    } else {
      console.log('\n⚠️ No alphabetGrid block found in blocks_ru');
      console.log('Block types present:', lesson.blocks_ru?.map(b => b.type).join(', '));
    }
  }
}

findLesson();
