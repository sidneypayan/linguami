const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateAlphabetLesson() {
  // Fetch current lesson
  const { data: lesson, error: fetchError } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', 'alphabet-sons-et-accents')
    .single();

  if (fetchError) {
    console.error('Error fetching lesson:', fetchError);
    return;
  }

  console.log('Current lesson fetched successfully');

  // --- CEDILLA EXPLANATION BLOCK (FR) ---
  const cedillaExplanationFr = {
    type: 'importantNote',
    title: 'L\'influence de la cédille sur la prononciation',
    content: 'La cédille (ç) transforme le son C en son S devant les voyelles A, O, U.',
    examples: [
      'ça',
      'garçon',
      'français',
      'leçon',
      'façade'
    ],
    note: '⚠️ Sans cédille : ca, co, cu. Avec cédille : ça, ço, çu.',
    audioUrls: {
      'ça': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/ca.mp3',
      'garçon': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/garcon.mp3',
      'français': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/francais.mp3',
      'leçon': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/lecon.mp3',
      'façade': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/facade.mp3'
    }
  };

  // --- CEDILLA EXPLANATION BLOCK (EN) ---
  const cedillaExplanationEn = {
    type: 'importantNote',
    title: 'The cedilla\'s influence on pronunciation',
    content: 'The cedilla (ç) transforms the C sound into an S sound before the vowels A, O, U.',
    examples: [
      'ça',
      'garçon',
      'français',
      'leçon',
      'façade'
    ],
    note: '⚠️ Without cedilla: ca, co, cu. With cedilla: ça, ço, çu.',
    audioUrls: {
      'ça': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/ca.mp3',
      'garçon': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/garcon.mp3',
      'français': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/francais.mp3',
      'leçon': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/lecon.mp3',
      'façade': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/facade.mp3'
    }
  };

  // --- CEDILLA EXPLANATION BLOCK (RU) ---
  const cedillaExplanationRu = {
    type: 'importantNote',
    title: 'Влияние седиля на произношение',
    content: 'Седиль (ç) превращает звук C в звук S перед гласными A, O, U.',
    examples: [
      'ça',
      'garçon',
      'français',
      'leçon',
      'façade'
    ],
    note: '⚠️ Без седиля: ca, co, cu. С седилем: ça, ço, çu.',
    audioUrls: {
      'ça': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/ca.mp3',
      'garçon': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/garcon.mp3',
      'français': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/francais.mp3',
      'leçon': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/lecon.mp3',
      'façade': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/facade.mp3'
    }
  };

  // --- DOUBLE "L" SECTION (FR) ---
  const doubleLSectionFr = {
    type: 'usageList',
    title: 'Le double "l" en français',
    items: [
      {
        usage: 'Prononciation standard',
        examples: [
          'Le double "l" (ll) se prononce généralement comme un seul L',
          'belle',
          'elle',
          'aller',
          'ville'
        ]
      },
      {
        usage: 'Cas particulier : -ill-',
        examples: [
          'Quand "ll" est précédé de "i", il se prononce comme un Y',
          'fille',
          'famille',
          'bouteille',
          'merveille'
        ],
        commonMistake: {
          wrong: 'Prononcer fille comme fil',
          correct: 'Prononcer fille avec un son Y'
        }
      },
      {
        usage: 'Exceptions avec -ill-',
        examples: [
          'Quelques mots gardent la prononciation normale',
          'ville',
          'mille',
          'tranquille',
          'Lille'
        ]
      }
    ],
    audioUrls: {
      'belle': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/belle.mp3',
      'elle': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/elle.mp3',
      'aller': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/aller.mp3',
      'ville': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/ville.mp3',
      'fille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/fille.mp3',
      'famille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/famille.mp3',
      'bouteille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/bouteille.mp3',
      'merveille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/merveille.mp3',
      'mille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/mille.mp3',
      'tranquille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/tranquille.mp3',
      'Lille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/lille.mp3'
    }
  };

  // --- DOUBLE "L" SECTION (EN) ---
  const doubleLSectionEn = {
    type: 'usageList',
    title: 'The double "l" in French',
    items: [
      {
        usage: 'Standard pronunciation',
        examples: [
          'The double "l" (ll) is generally pronounced as a single L',
          'belle',
          'elle',
          'aller',
          'ville'
        ]
      },
      {
        usage: 'Special case: -ill-',
        examples: [
          'When "ll" is preceded by "i", it is pronounced like a Y',
          'fille',
          'famille',
          'bouteille',
          'merveille'
        ],
        commonMistake: {
          wrong: 'Pronouncing fille like feel',
          correct: 'Pronounce fille with a Y sound'
        }
      },
      {
        usage: 'Exceptions with -ill-',
        examples: [
          'Some words keep the normal pronunciation',
          'ville',
          'mille',
          'tranquille',
          'Lille'
        ]
      }
    ],
    audioUrls: {
      'belle': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/belle.mp3',
      'elle': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/elle.mp3',
      'aller': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/aller.mp3',
      'ville': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/ville.mp3',
      'fille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/fille.mp3',
      'famille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/famille.mp3',
      'bouteille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/bouteille.mp3',
      'merveille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/merveille.mp3',
      'mille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/mille.mp3',
      'tranquille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/tranquille.mp3',
      'Lille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/lille.mp3'
    }
  };

  // --- DOUBLE "L" SECTION (RU) ---
  const doubleLSectionRu = {
    type: 'usageList',
    title: 'Двойная "l" во французском',
    items: [
      {
        usage: 'Стандартное произношение',
        examples: [
          'Двойная "l" (ll) обычно произносится как одна L',
          'belle',
          'elle',
          'aller',
          'ville'
        ]
      },
      {
        usage: 'Особый случай: -ill-',
        examples: [
          'Когда перед "ll" стоит "i", она произносится как Y',
          'fille',
          'famille',
          'bouteille',
          'merveille'
        ],
        commonMistake: {
          wrong: 'Произносить fille без звука Y',
          correct: 'Произносить fille со звуком Y'
        }
      },
      {
        usage: 'Исключения с -ill-',
        examples: [
          'Некоторые слова сохраняют обычное произношение',
          'ville',
          'mille',
          'tranquille',
          'Lille'
        ]
      }
    ],
    audioUrls: {
      'belle': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/belle.mp3',
      'elle': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/elle.mp3',
      'aller': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/aller.mp3',
      'ville': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/ville.mp3',
      'fille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/fille.mp3',
      'famille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/famille.mp3',
      'bouteille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/bouteille.mp3',
      'merveille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/merveille.mp3',
      'mille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/mille.mp3',
      'tranquille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/tranquille.mp3',
      'Lille': 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/words/lille.mp3'
    }
  };

  // Find the existing sections and replace them
  const cedillaIndexFr = lesson.blocks_fr.findIndex(
    block => block.title === 'L\'influence de la cédille sur la prononciation'
  );

  const cedillaIndexEn = lesson.blocks_en.findIndex(
    block => block.title === 'The cedilla\'s influence on pronunciation'
  );

  const cedillaIndexRu = lesson.blocks_ru.findIndex(
    block => block.title === 'Влияние седиля на произношение'
  );

  const doubleLIndexFr = lesson.blocks_fr.findIndex(
    block => block.title === 'Le double "l" en français'
  );

  const doubleLIndexEn = lesson.blocks_en.findIndex(
    block => block.title === 'The double "l" in French'
  );

  const doubleLIndexRu = lesson.blocks_ru.findIndex(
    block => block.title === 'Двойная "l" во французском'
  );

  // Replace the sections
  const updatedBlocksFr = [...lesson.blocks_fr];
  updatedBlocksFr[cedillaIndexFr] = cedillaExplanationFr;
  updatedBlocksFr[doubleLIndexFr] = doubleLSectionFr;

  const updatedBlocksEn = [...lesson.blocks_en];
  updatedBlocksEn[cedillaIndexEn] = cedillaExplanationEn;
  updatedBlocksEn[doubleLIndexEn] = doubleLSectionEn;

  const updatedBlocksRu = [...lesson.blocks_ru];
  updatedBlocksRu[cedillaIndexRu] = cedillaExplanationRu;
  updatedBlocksRu[doubleLIndexRu] = doubleLSectionRu;

  // Update the lesson
  const { error: updateError } = await supabase
    .from('lessons')
    .update({
      blocks_fr: updatedBlocksFr,
      blocks_en: updatedBlocksEn,
      blocks_ru: updatedBlocksRu
    })
    .eq('slug', 'alphabet-sons-et-accents');

  if (updateError) {
    console.error('Error updating lesson:', updateError);
    return;
  }

  console.log('✅ Lesson updated successfully!');
  console.log('   - Removed pronunciation comparisons');
  console.log('   - Removed HTML tags');
  console.log('   - Simplified format');
}

updateAlphabetLesson();
