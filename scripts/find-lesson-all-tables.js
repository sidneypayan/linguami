const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findLesson() {
  console.log('=== Searching in course_lessons ===');
  const { data: courseLessons, error: error1 } = await supabase
    .from('course_lessons')
    .select('id, slug, title_fr')
    .limit(10);

  if (error1) {
    console.error('Error in course_lessons:', error1);
  } else {
    console.log('Total lessons in course_lessons:', courseLessons?.length);
    courseLessons?.forEach(l => console.log(`  - ${l.slug} (${l.title_fr})`));
  }

  console.log('\n=== Searching in lessons ===');
  const { data: lessons, error: error2 } = await supabase
    .from('lessons')
    .select('id, slug, title')
    .ilike('slug', '%alphabet%');

  if (error2) {
    console.error('Error in lessons:', error2);
  } else {
    console.log('Alphabet lessons found:', lessons?.length);
    lessons?.forEach(l => console.log(`  - ID: ${l.id}, Slug: ${l.slug}, Title: ${l.title}`));

    if (lessons && lessons.length > 0) {
      // Get detailed info about first alphabet lesson
      const { data: detail, error: error3 } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessons[0].id)
        .single();

      if (error3) {
        console.error('Error getting details:', error3);
      } else {
        console.log('\n=== Lesson Details ===');
        console.log('ID:', detail.id);
        console.log('Slug:', detail.slug);
        console.log('Title:', detail.title);
        console.log('Lang:', detail.lang);

        // Check for alphabetGrid block
        const alphabetBlock = detail.blocks_ru?.find(b => b.type === 'alphabetGrid');
        if (alphabetBlock) {
          console.log('\n✅ AlphabetGrid block found in blocks_ru');
          console.log('Title:', alphabetBlock.title);
          console.log('\nFirst 3 letters:');
          alphabetBlock.letters?.slice(0, 3).forEach(l => {
            console.log(`  ${l.letter} - ${l.word} ${l.emoji}`);
          });
        } else {
          console.log('\n⚠️ No alphabetGrid block in blocks_ru');
        }
      }
    }
  }
}

findLesson();
