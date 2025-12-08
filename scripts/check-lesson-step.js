const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

console.log('Using DB:', process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  // First, list all lessons to see what exists
  const { data: allLessons, error: listError } = await supabase
    .from('course_lessons')
    .select('slug, order_index, course_id')
    .order('order_index');

  if (listError) {
    console.error('List Error:', listError);
    return;
  }

  console.log('All lessons:');
  allLessons.forEach(l => console.log('-', l.slug, '(order', l.order_index, ')'));

  // First, find all lessons with "bonjour" or "saluer" in the slug
  const { data: lessons, error: searchError } = await supabase
    .from('course_lessons')
    .select('slug, order_index, course_id')
    .or('slug.ilike.%bonjour%,slug.ilike.%saluer%,slug.ilike.%greet%');

  if (searchError) {
    console.error('Search Error:', searchError);
    return;
  }

  console.log('Lessons found:');
  lessons.forEach(l => console.log('-', l.slug, '(order', l.order_index, ')'));

  // Now get the specific lesson
  const targetSlug = lessons.find(l => l.slug.includes('bonjour'))?.slug || 'bonjour-saluer-prendre-conge';
  console.log('\n=== Analyzing:', targetSlug, '===\n');

  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', targetSlug)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Slug:', data.slug);
  console.log('\n=== Etape 12 (blocks_fr) ===');
  if (data.blocks_fr && data.blocks_fr[11]) {
    console.log(JSON.stringify(data.blocks_fr[11], null, 2));
  } else {
    console.log('Pas d etape 12 trouvee');
  }

  console.log('\n=== TOUTES les etapes (titres et mots-cles) ===');
  data.blocks_fr.forEach((block, index) => {
    const blockStr = JSON.stringify(block).toLowerCase();
    console.log(`\nEtape ${index + 1} (${block.type}):`, block.title || 'Sans titre');

    // Check for mentions of "hote"
    if (blockStr.includes('hote') || blockStr.includes('host')) {
      console.log('  -> CONTIENT "hote"');
    }
  });

  console.log('\n=== ANALYSE ===');
  const step12Index = 11;
  let hoteFoundBefore = false;

  for (let i = 0; i < step12Index; i++) {
    const blockStr = JSON.stringify(data.blocks_fr[i]).toLowerCase();
    if (blockStr.includes('hote') || blockStr.includes('host')) {
      hoteFoundBefore = true;
      console.log(`Le mot "hote" est mentionne a l'etape ${i + 1}`);
    }
  }

  if (!hoteFoundBefore) {
    console.log('PROBLEME CONFIRME: Le mot "hote" apparait pour la première fois a l\'etape 12 sans avoir ete introduit auparavant.');
  }
})();
