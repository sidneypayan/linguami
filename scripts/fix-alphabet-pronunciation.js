const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Alphabet français avec prononciation API française (PAS cyrillique!)
const alphabetDataFrench = [
  { letter: 'A', word: 'Avion', emoji: '✈️', pronunciation: '[a]' },
  { letter: 'B', word: 'Ballon', emoji: '⚽', pronunciation: '[be]' },
  { letter: 'C', word: 'Chat', emoji: '🐱', pronunciation: '[se]' },
  { letter: 'D', word: 'Dauphin', emoji: '🐬', pronunciation: '[de]' },
  { letter: 'E', word: 'Éléphant', emoji: '🐘', pronunciation: '[ə]' },
  { letter: 'F', word: 'Fleur', emoji: '🌸', pronunciation: '[ɛf]' },
  { letter: 'G', word: 'Girafe', emoji: '🦒', pronunciation: '[ʒe]' },
  { letter: 'H', word: 'Hélicoptère', emoji: '🚁', pronunciation: '[aʃ]' },
  { letter: 'I', word: 'Île', emoji: '🏝️', pronunciation: '[i]' },
  { letter: 'J', word: 'Jardin', emoji: '🏡', pronunciation: '[ʒi]' },
  { letter: 'K', word: 'Kangourou', emoji: '🦘', pronunciation: '[ka]' },
  { letter: 'L', word: 'Lion', emoji: '🦁', pronunciation: '[ɛl]' },
  { letter: 'M', word: 'Maison', emoji: '🏠', pronunciation: '[ɛm]' },
  { letter: 'N', word: 'Nuage', emoji: '☁️', pronunciation: '[ɛn]' },
  { letter: 'O', word: 'Oiseau', emoji: '🐦', pronunciation: '[o]' },
  { letter: 'P', word: 'Pomme', emoji: '🍎', pronunciation: '[pe]' },
  { letter: 'Q', word: 'Queue', emoji: '🦎', pronunciation: '[ky]' },
  { letter: 'R', word: 'Rose', emoji: '🌹', pronunciation: '[ɛʁ]' },
  { letter: 'S', word: 'Soleil', emoji: '☀️', pronunciation: '[ɛs]' },
  { letter: 'T', word: 'Train', emoji: '🚂', pronunciation: '[te]' },
  { letter: 'U', word: 'Usine', emoji: '🏭', pronunciation: '[y]' },
  { letter: 'V', word: 'Voiture', emoji: '🚗', pronunciation: '[ve]' },
  { letter: 'W', word: 'Wagon', emoji: '🚃', pronunciation: '[dublə ve]' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', pronunciation: '[iks]' },
  { letter: 'Y', word: 'Yaourt', emoji: '🥛', pronunciation: '[iɡʁɛk]' },
  { letter: 'Z', word: 'Zèbre', emoji: '🦓', pronunciation: '[zɛd]' }
];

async function fixPronunciation() {
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

  // Trouver le bloc alphabetGrid dans blocks_ru
  const blockIndex = lesson.blocks_ru.findIndex(b => b.type === 'alphabetGrid');

  if (blockIndex === -1) {
    console.error('❌ Bloc alphabetGrid non trouvé');
    return;
  }

  console.log('📝 Comparaison avant/après:');
  console.log('\nAVANT (cyrillique):');
  lesson.blocks_ru[blockIndex].letters.slice(0, 5).forEach(l => {
    console.log(`  ${l.letter} - ${l.word} - ${l.pronunciation}`);
  });

  // Mettre à jour avec la prononciation API française
  lesson.blocks_ru[blockIndex].letters = alphabetDataFrench;

  console.log('\nAPRÈS (API française):');
  lesson.blocks_ru[blockIndex].letters.slice(0, 5).forEach(l => {
    console.log(`  ${l.letter} - ${l.word} - ${l.pronunciation}`);
  });

  // Mettre à jour la leçon
  const { error: updateError } = await supabase
    .from('lessons')
    .update({ blocks_ru: lesson.blocks_ru })
    .eq('id', 1);

  if (updateError) {
    console.error('❌ Erreur:', updateError);
    return;
  }

  console.log('\n✅ Transcriptions cyrilliques remplacées par API française!');
}

fixPronunciation();
