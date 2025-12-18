const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Alphabet français avec mots illustrés
const alphabetData = {
  fr: [
    { letter: 'A', word: 'Avion', emoji: '✈️', pronunciation: '[а]' },
    { letter: 'B', word: 'Ballon', emoji: '⚽', pronunciation: '[бе]' },
    { letter: 'C', word: 'Chat', emoji: '🐱', pronunciation: '[сe]' },
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
  ],
  en: [
    { letter: 'A', word: 'Airplane', emoji: '✈️', pronunciation: '[a]' },
    { letter: 'B', word: 'Ball', emoji: '⚽', pronunciation: '[be]' },
    { letter: 'C', word: 'Cat', emoji: '🐱', pronunciation: '[se]' },
    { letter: 'D', word: 'Dolphin', emoji: '🐬', pronunciation: '[de]' },
    { letter: 'E', word: 'Elephant', emoji: '🐘', pronunciation: '[ə]' },
    { letter: 'F', word: 'Flower', emoji: '🌸', pronunciation: '[ɛf]' },
    { letter: 'G', word: 'Giraffe', emoji: '🦒', pronunciation: '[ʒe]' },
    { letter: 'H', word: 'Helicopter', emoji: '🚁', pronunciation: '[aʃ]' },
    { letter: 'I', word: 'Island', emoji: '🏝️', pronunciation: '[i]' },
    { letter: 'J', word: 'Garden', emoji: '🏡', pronunciation: '[ʒi]' },
    { letter: 'K', word: 'Kangaroo', emoji: '🦘', pronunciation: '[ka]' },
    { letter: 'L', word: 'Lion', emoji: '🦁', pronunciation: '[ɛl]' },
    { letter: 'M', word: 'House', emoji: '🏠', pronunciation: '[ɛm]' },
    { letter: 'N', word: 'Cloud', emoji: '☁️', pronunciation: '[ɛn]' },
    { letter: 'O', word: 'Bird', emoji: '🐦', pronunciation: '[o]' },
    { letter: 'P', word: 'Apple', emoji: '🍎', pronunciation: '[pe]' },
    { letter: 'Q', word: 'Tail', emoji: '🦎', pronunciation: '[ky]' },
    { letter: 'R', word: 'Rose', emoji: '🌹', pronunciation: '[ɛʁ]' },
    { letter: 'S', word: 'Sun', emoji: '☀️', pronunciation: '[ɛs]' },
    { letter: 'T', word: 'Train', emoji: '🚂', pronunciation: '[te]' },
    { letter: 'U', word: 'Factory', emoji: '🏭', pronunciation: '[y]' },
    { letter: 'V', word: 'Car', emoji: '🚗', pronunciation: '[ve]' },
    { letter: 'W', word: 'Wagon', emoji: '🚃', pronunciation: '[dublve]' },
    { letter: 'X', word: 'Xylophone', emoji: '🎵', pronunciation: '[iks]' },
    { letter: 'Y', word: 'Yogurt', emoji: '🥛', pronunciation: '[igrɛk]' },
    { letter: 'Z', word: 'Zebra', emoji: '🦓', pronunciation: '[zɛd]' }
  ],
  ru: [
    { letter: 'A', word: 'Самолёт', emoji: '✈️', pronunciation: '[а]' },
    { letter: 'B', word: 'Мяч', emoji: '⚽', pronunciation: '[бе]' },
    { letter: 'C', word: 'Кот', emoji: '🐱', pronunciation: '[се]' },
    { letter: 'D', word: 'Дельфин', emoji: '🐬', pronunciation: '[де]' },
    { letter: 'E', word: 'Слон', emoji: '🐘', pronunciation: '[ё]' },
    { letter: 'F', word: 'Цветок', emoji: '🌸', pronunciation: '[эф]' },
    { letter: 'G', word: 'Жираф', emoji: '🦒', pronunciation: '[же]' },
    { letter: 'H', word: 'Вертолёт', emoji: '🚁', pronunciation: '[аш]' },
    { letter: 'I', word: 'Остров', emoji: '🏝️', pronunciation: '[и]' },
    { letter: 'J', word: 'Сад', emoji: '🏡', pronunciation: '[жи]' },
    { letter: 'K', word: 'Кенгуру', emoji: '🦘', pronunciation: '[ка]' },
    { letter: 'L', word: 'Лев', emoji: '🦁', pronunciation: '[эль]' },
    { letter: 'M', word: 'Дом', emoji: '🏠', pronunciation: '[эм]' },
    { letter: 'N', word: 'Облако', emoji: '☁️', pronunciation: '[эн]' },
    { letter: 'O', word: 'Птица', emoji: '🐦', pronunciation: '[о]' },
    { letter: 'P', word: 'Яблоко', emoji: '🍎', pronunciation: '[пе]' },
    { letter: 'Q', word: 'Хвост', emoji: '🦎', pronunciation: '[кю]' },
    { letter: 'R', word: 'Роза', emoji: '🌹', pronunciation: '[эр]' },
    { letter: 'S', word: 'Солнце', emoji: '☀️', pronunciation: '[эс]' },
    { letter: 'T', word: 'Поезд', emoji: '🚂', pronunciation: '[те]' },
    { letter: 'U', word: 'Завод', emoji: '🏭', pronunciation: '[ю]' },
    { letter: 'V', word: 'Машина', emoji: '🚗', pronunciation: '[ве]' },
    { letter: 'W', word: 'Вагон', emoji: '🚃', pronunciation: '[дубльве]' },
    { letter: 'X', word: 'Ксилофон', emoji: '🎵', pronunciation: '[икс]' },
    { letter: 'Y', word: 'Йогурт', emoji: '🥛', pronunciation: '[игрэк]' },
    { letter: 'Z', word: 'Зебра', emoji: '🦓', pronunciation: '[зэд]' }
  ]
};

// Créer les blocs pour chaque langue
const alphabetBlockFr = {
  type: 'alphabetGrid',
  title: 'L\'alphabet français illustré',
  letters: alphabetData.fr
};

const alphabetBlockEn = {
  type: 'alphabetGrid',
  title: 'The French alphabet illustrated',
  letters: alphabetData.en
};

const alphabetBlockRu = {
  type: 'alphabetGrid',
  title: 'Французский алфавит с иллюстрациями',
  letters: alphabetData.ru
};

async function main() {
  try {
    console.log('Récupération de la leçon...');

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    console.log('Ajout du tableau de l\'alphabet...');

    // Ajouter le nouveau bloc après le premier titre "The French alphabet"
    // On cherche l'index du bloc title "The French alphabet"
    const insertIndexFr = lesson.blocks_fr.findIndex(b =>
      b.type === 'title' && b.text && b.text.includes('alphabet')
    );

    const insertIndexEn = lesson.blocks_en.findIndex(b =>
      b.type === 'title' && b.text && b.text.includes('alphabet')
    );

    const insertIndexRu = lesson.blocks_ru.findIndex(b =>
      b.type === 'title' && b.text && b.text.includes('алфавит')
    );

    // Insérer après le bloc de texte qui suit le titre
    const newBlocksFr = [...lesson.blocks_fr];
    newBlocksFr.splice(insertIndexFr + 2, 0, alphabetBlockFr);

    const newBlocksEn = [...lesson.blocks_en];
    newBlocksEn.splice(insertIndexEn + 2, 0, alphabetBlockEn);

    const newBlocksRu = [...lesson.blocks_ru];
    newBlocksRu.splice(insertIndexRu + 2, 0, alphabetBlockRu);

    // Mettre à jour la leçon
    const { data: updated, error: updateError } = await supabase
      .from('lessons')
      .update({
        blocks_fr: newBlocksFr,
        blocks_en: newBlocksEn,
        blocks_ru: newBlocksRu
      })
      .eq('id', 1)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('✅ Tableau de l\'alphabet ajouté avec succès!');
    console.log(`   - ${alphabetData.fr.length} lettres avec illustrations`);
    console.log(`   - Position: après le titre sur l'alphabet`);

    // Sauvegarder pour vérification
    fs.writeFileSync('lesson-1-with-alphabet.json', JSON.stringify(updated, null, 2));
    console.log('📄 Résultat sauvegardé dans lesson-1-with-alphabet.json');

  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
}

main();
