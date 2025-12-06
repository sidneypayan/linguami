require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findLesson() {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single();

  if (!lesson) {
    console.log('Lesson not found');
    return;
  }

  console.log('=== LESSON ===');
  console.log(`ID: ${lesson.id}`);
  console.log(`Title: ${lesson.title}`);
  console.log(`Slug: ${lesson.slug}`);

  // Get blocks for this lesson
  const { data: blocks } = await supabase
    .from('course_blocks')
    .select('*')
    .eq('lesson_id', lesson.id)
    .order('display_order');

  console.log(`\n=== BLOCKS (${blocks.length} total) ===\n`);
  
  blocks.forEach(block => {
    const contentFr = JSON.stringify(block.content_fr || {}).substring(0, 200);
    const contentRu = JSON.stringify(block.content_ru || {}).substring(0, 200);
    
    // Check if this block contains our phrases
    const hasPhrases = contentFr.includes('Comment allez') || 
                      contentFr.includes('Comment vas') || 
                      contentFr.includes('Ca va') ||
                      contentFr.includes('Ça va');
    
    if (hasPhrases) {
      console.log(`\n*** BLOCK ${block.id} (Order: ${block.display_order}) ***`);
      console.log(`Type: ${block.block_type}`);
      console.log(`Content FR: ${contentFr}`);
      console.log(`Content RU: ${contentRu}`);
      console.log('---');
    }
  });
}

findLesson()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
