const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Alphabet français SANS pronunciation
const alphabetDataFrench = [
  { letter: 'A', word: 'Avion', emoji: '✈️' },
  { letter: 'B', word: 'Ballon', emoji: '⚽' },
  { letter: 'C', word: 'Chat', emoji: '🐱' },
  { letter: 'D', word: 'Dauphin', emoji: '🐬' },
  { letter: 'E', word: 'Éléphant', emoji: '🐘' },
  { letter: 'F', word: 'Fleur', emoji: '🌸' },
  { letter: 'G', word: 'Girafe', emoji: '🦒' },
  { letter: 'H', word: 'Hélicoptère', emoji: '🚁' },
  { letter: 'I', word: 'Île', emoji: '🏝️' },
  { letter: 'J', word: 'Jardin', emoji: '🏡' },
  { letter: 'K', word: 'Kangourou', emoji: '🦘' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Maison', emoji: '🏠' },
  { letter: 'N', word: 'Nuage', emoji: '☁️' },
  { letter: 'O', word: 'Oiseau', emoji: '🐦' },
  { letter: 'P', word: 'Pomme', emoji: '🍎' },
  { letter: 'Q', word: 'Queue', emoji: '🦎' },
  { letter: 'R', word: 'Rose', emoji: '🌹' },
  { letter: 'S', word: 'Soleil', emoji: '☀️' },
  { letter: 'T', word: 'Train', emoji: '🚂' },
  { letter: 'U', word: 'Usine', emoji: '🏭' },
  { letter: 'V', word: 'Voiture', emoji: '🚗' },
  { letter: 'W', word: 'Wagon', emoji: '🚃' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵' },
  { letter: 'Y', word: 'Yaourt', emoji: '🥛' },
  { letter: 'Z', word: 'Zèbre', emoji: '🦓' }
];

async function removePronunciation() {
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

  console.log('📝 Suppression des transcriptions phonétiques...');
  console.log('\nAVANT (avec pronunciation):');
  lesson.blocks_ru[blockIndex].letters.slice(0, 3).forEach(l => {
    console.log(`  ${l.letter} - ${l.word} ${l.emoji} - ${l.pronunciation || 'N/A'}`);
  });

  // Mettre à jour SANS pronunciation
  lesson.blocks_ru[blockIndex].letters = alphabetDataFrench;

  console.log('\nAPRÈS (sans pronunciation):');
  lesson.blocks_ru[blockIndex].letters.slice(0, 3).forEach(l => {
    console.log(`  ${l.letter} - ${l.word} ${l.emoji}`);
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

  console.log('\n✅ Transcriptions phonétiques supprimées!');
  console.log('   Il ne reste que: lettre + mot français + emoji');
}

removePronunciation();
