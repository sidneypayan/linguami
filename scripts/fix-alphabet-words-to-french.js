const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Alphabet français avec mots en FRANÇAIS (pas en russe!)
const alphabetDataFrench = [
  { letter: 'A', word: 'Avion', emoji: '✈️', pronunciation: '[а]' },
  { letter: 'B', word: 'Ballon', emoji: '⚽', pronunciation: '[бе]' },
  { letter: 'C', word: 'Chat', emoji: '🐱', pronunciation: '[се]' },
  { letter: 'D', word: 'Dauphin', emoji: '🐬', pronunciation: '[де]' },
  { letter: 'E', word: 'Éléphant', emoji: '🐘', pronunciation: '[ё]' },
  { letter: 'F', word: 'Fleur', emoji: '🌸', pronunciation: '[эф]' },
  { letter: 'G', word: 'Girafe', emoji: '🦒', pronunciation: '[же]' },
  { letter: 'H', word: 'Hélicoptère', emoji: '🚁', pronunciation: '[аш]' },
  { letter: 'I', word: 'Île', emoji: '🏝️', pronunciation: '[и]' },
  { letter: 'J', word: 'Jardin', emoji: '🏡', pronunciation: '[жи]' },
  { letter: 'K', word: 'Kangourou', emoji: '🦘', pronunciation: '[ка]' },
  { letter: 'L', word: 'Lion', emoji: '🦁', pronunciation: '[эль]' },
  { letter: 'M', word: 'Maison', emoji: '🏠', pronunciation: '[эм]' },
  { letter: 'N', word: 'Nuage', emoji: '☁️', pronunciation: '[эн]' },
  { letter: 'O', word: 'Oiseau', emoji: '🐦', pronunciation: '[о]' },
  { letter: 'P', word: 'Pomme', emoji: '🍎', pronunciation: '[пе]' },
  { letter: 'Q', word: 'Queue', emoji: '🦎', pronunciation: '[кю]' },
  { letter: 'R', word: 'Rose', emoji: '🌹', pronunciation: '[эр]' },
  { letter: 'S', word: 'Soleil', emoji: '☀️', pronunciation: '[эс]' },
  { letter: 'T', word: 'Train', emoji: '🚂', pronunciation: '[те]' },
  { letter: 'U', word: 'Usine', emoji: '🏭', pronunciation: '[ю]' },
  { letter: 'V', word: 'Voiture', emoji: '🚗', pronunciation: '[ве]' },
  { letter: 'W', word: 'Wagon', emoji: '🚃', pronunciation: '[дубльве]' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', pronunciation: '[икс]' },
  { letter: 'Y', word: 'Yaourt', emoji: '🥛', pronunciation: '[игрэк]' },
  { letter: 'Z', word: 'Zèbre', emoji: '🦓', pronunciation: '[зэд]' }
];

async function fixAlphabetWords() {
  console.log('Récupération de la leçon...');

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Leçon trouvée:', lesson.title_fr);

  // Trouver le bloc alphabetGrid dans blocks_ru
  const blockIndex = lesson.blocks_ru.findIndex(b => b.type === 'alphabetGrid');

  if (blockIndex === -1) {
    console.error('❌ Bloc alphabetGrid non trouvé dans blocks_ru');
    return;
  }

  console.log('\n📝 Mise à jour du bloc alphabetGrid...');
  console.log('   Ancien titre:', lesson.blocks_ru[blockIndex].title);
  console.log('   Premières lettres avant:');
  lesson.blocks_ru[blockIndex].letters.slice(0, 3).forEach(l => {
    console.log(`     ${l.letter} - ${l.word} ${l.emoji}`);
  });

  // Remplacer les lettres avec les mots en français
  lesson.blocks_ru[blockIndex] = {
    type: 'alphabetGrid',
    title: 'Французский алфавит с иллюстрациями',  // Titre en russe : "L'alphabet français illustré"
    letters: alphabetDataFrench
  };

  console.log('\n   Nouvelles lettres (français):');
  lesson.blocks_ru[blockIndex].letters.slice(0, 3).forEach(l => {
    console.log(`     ${l.letter} - ${l.word} ${l.emoji}`);
  });

  // Mettre à jour la leçon
  const { data: updated, error: updateError } = await supabase
    .from('lessons')
    .update({ blocks_ru: lesson.blocks_ru })
    .eq('id', 1)
    .select();

  if (updateError) {
    console.error('❌ Erreur lors de la mise à jour:', updateError);
    return;
  }

  console.log('\n✅ Leçon mise à jour avec succès!');
  console.log('   Les mots sont maintenant en FRANÇAIS pour tous les apprenants russophones');
}

fixAlphabetWords();
