const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  // Chercher tous les livres
  const { data, error } = await supabase
    .from('materials')
    .select('id, title, image, section, book_id')
    .eq('section', 'books')
    .is('book_id', null)
    .order('title');

  if (error) {
    console.log('Erreur:', error.message);
  } else {
    console.log('Livres audio trouvés:');
    data.forEach(book => {
      const img = book.image || 'pas d\'image';
      console.log(`- ${book.title}: ${img}`);
      if (img.includes('dracula') || img.includes('drakula')) {
        console.log('  ^^^ DRACULA TROUVÉ ^^^');
      }
    });
  }
})();
