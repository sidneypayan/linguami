const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  // Tous les chapitres
  const { data: allChapters } = await supabase
    .from('materials')
    .select('id, title, book_id, chapter_number, lang')
    .eq('section', 'book-chapters')
    .order('book_id, chapter_number');

  // Grouper par book_id
  const byBook = {};
  allChapters.forEach(ch => {
    if (!byBook[ch.book_id]) {
      byBook[ch.book_id] = {
        chapters: [],
        lang: ch.lang
      };
    }
    byBook[ch.book_id].chapters.push(ch);
  });

  console.log('=== ANALYSE COMPLÈTE DES BOOKS/CHAPTERS ===\n');

  for (const [bookId, info] of Object.entries(byBook)) {
    const { data: parentMaterial } = await supabase
      .from('materials')
      .select('id, title, section')
      .eq('id', bookId)
      .single();

    console.log('📚 book_id', bookId + ':');
    console.log('  ➜ Parent:', parentMaterial?.title || '❌ INTROUVABLE');
    console.log('  ➜ Section du parent:', parentMaterial?.section || 'N/A');
    console.log('  ➜ Nombre de chapitres:', info.chapters.length);
    console.log('  ➜ Langue:', info.lang);
    console.log('  ➜ Premier chapitre:', info.chapters[0]?.title.substring(0, 60) + '...');
    console.log('');
  }

  console.log('\n=== PROBLÈMES IDENTIFIÉS ===');
  console.log('1. Aucun material avec section="books" n\'existe');
  console.log('2. Les book_id pointent vers des materials d\'autres sections (movie-trailers, etc.)');
  console.log('3. Le système est hybride et incohérent');
})();
