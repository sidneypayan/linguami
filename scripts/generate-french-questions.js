require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Compact vocabulary data: [french_word, english_meaning, russian_meaning]
const vocabulary = {
  greetings: {
    icon: '👋',
    labels: { fr: 'Salutations', en: 'Greetings', ru: 'Приветствия' },
    words: [
      ['Bonjour', 'hello', 'привет'],
      ['Au revoir', 'goodbye', 'до свидания'],
      ['Merci', 'thank you', 'спасибо'],
      ["S'il vous plaît", 'please', 'пожалуйста'],
      ['Oui', 'yes', 'да'],
    ],
  },
  numbers: {
    icon: '🔢',
    labels: { fr: 'Nombres', en: 'Numbers', ru: 'Числа' },
    words: [
      ['un', 'one', 'один'],
      ['deux', 'two', 'два'],
      ['trois', 'three', 'три'],
      ['dix', 'ten', 'десять'],
      ['vingt', 'twenty', 'двадцать'],
    ],
  },
  family: {
    icon: '👨‍👩‍👧‍👦',
    labels: { fr: 'Famille', en: 'Family', ru: 'Семья' },
    words: [
      ['mère', 'mother', 'мать'],
      ['père', 'father', 'отец'],
      ['frère', 'brother', 'брат'],
      ['sœur', 'sister', 'сестра'],
      ['enfant', 'child', 'ребёнок'],
    ],
  },
  food: {
    icon: '🍎',
    labels: { fr: 'Nourriture', en: 'Food', ru: 'Еда' },
    words: [
      ['pain', 'bread', 'хлеб'],
      ['eau', 'water', 'вода'],
      ['fromage', 'cheese', 'сыр'],
      ['pomme', 'apple', 'яблоко'],
      ['viande', 'meat', 'мясо'],
    ],
  },
  colors: {
    icon: '🎨',
    labels: { fr: 'Couleurs', en: 'Colors', ru: 'Цвета' },
    words: [
      ['rouge', 'red', 'красный'],
      ['bleu', 'blue', 'синий'],
      ['vert', 'green', 'зелёный'],
      ['jaune', 'yellow', 'жёлтый'],
      ['noir', 'black', 'чёрный'],
    ],
  },
  animals: {
    icon: '🐾',
    labels: { fr: 'Animaux', en: 'Animals', ru: 'Животные' },
    words: [
      ['chien', 'dog', 'собака'],
      ['chat', 'cat', 'кошка'],
      ['oiseau', 'bird', 'птица'],
      ['poisson', 'fish', 'рыба'],
      ['cheval', 'horse', 'лошадь'],
    ],
  },
  body: {
    icon: '🫀',
    labels: { fr: 'Corps humain', en: 'Body parts', ru: 'Части тела' },
    words: [
      ['tête', 'head', 'голова'],
      ['main', 'hand', 'рука'],
      ['pied', 'foot', 'нога'],
      ['œil', 'eye', 'глаз'],
      ['cœur', 'heart', 'сердце'],
    ],
  },
  clothes: {
    icon: '👕',
    labels: { fr: 'Vêtements', en: 'Clothes', ru: 'Одежда' },
    words: [
      ['chemise', 'shirt', 'рубашка'],
      ['pantalon', 'pants', 'брюки'],
      ['robe', 'dress', 'платье'],
      ['chaussure', 'shoe', 'туфля'],
      ['manteau', 'coat', 'пальто'],
    ],
  },
  time: {
    icon: '🕐',
    labels: { fr: 'Temps', en: 'Time', ru: 'Время' },
    words: [
      ['heure', 'hour', 'час'],
      ["aujourd'hui", 'today', 'сегодня'],
      ['demain', 'tomorrow', 'завтра'],
      ['hier', 'yesterday', 'вчера'],
      ['maintenant', 'now', 'сейчас'],
    ],
  },
  days: {
    icon: '📅',
    labels: { fr: 'Jours et mois', en: 'Days & months', ru: 'Дни и месяцы' },
    words: [
      ['lundi', 'Monday', 'понедельник'],
      ['dimanche', 'Sunday', 'воскресенье'],
      ['janvier', 'January', 'январь'],
      ['juillet', 'July', 'июль'],
      ['samedi', 'Saturday', 'суббота'],
    ],
  },
  places: {
    icon: '🏪',
    labels: { fr: 'Lieux', en: 'Places', ru: 'Места' },
    words: [
      ['maison', 'house', 'дом'],
      ['école', 'school', 'школа'],
      ['restaurant', 'restaurant', 'ресторан'],
      ['hôpital', 'hospital', 'больница'],
      ['magasin', 'store', 'магазин'],
    ],
  },
  professions: {
    icon: '👨‍⚕️',
    labels: { fr: 'Métiers', en: 'Professions', ru: 'Профессии' },
    words: [
      ['médecin', 'doctor', 'врач'],
      ['professeur', 'teacher', 'учитель'],
      ['ingénieur', 'engineer', 'инженер'],
      ['cuisinier', 'cook', 'повар'],
      ['artiste', 'artist', 'художник'],
    ],
  },
  house: {
    icon: '🏠',
    labels: { fr: 'Maison', en: 'House', ru: 'Дом' },
    words: [
      ['cuisine', 'kitchen', 'кухня'],
      ['chambre', 'bedroom', 'спальня'],
      ['fenêtre', 'window', 'окно'],
      ['porte', 'door', 'дверь'],
      ['table', 'table', 'стол'],
    ],
  },
  transport: {
    icon: '🚗',
    labels: { fr: 'Transports', en: 'Transport', ru: 'Транспорт' },
    words: [
      ['voiture', 'car', 'машина'],
      ['train', 'train', 'поезд'],
      ['vélo', 'bicycle', 'велосипед'],
      ['avion', 'plane', 'самолёт'],
      ['bateau', 'boat', 'лодка'],
    ],
  },
  adjectives: {
    icon: '✨',
    labels: { fr: 'Adjectifs', en: 'Adjectives', ru: 'Прилагательные' },
    words: [
      ['grand', 'big', 'большой'],
      ['petit', 'small', 'маленький'],
      ['bon', 'good', 'хороший'],
      ['beau', 'beautiful', 'красивый'],
      ['nouveau', 'new', 'новый'],
    ],
  },
  weather: {
    icon: '🌤️',
    labels: { fr: 'Météo', en: 'Weather', ru: 'Погода' },
    words: [
      ['soleil', 'sun', 'солнце'],
      ['pluie', 'rain', 'дождь'],
      ['neige', 'snow', 'снег'],
      ['vent', 'wind', 'ветер'],
      ['froid', 'cold', 'холодно'],
    ],
  },
  emotions: {
    icon: '💭',
    labels: { fr: 'Émotions', en: 'Emotions', ru: 'Эмоции' },
    words: [
      ['heureux', 'happy', 'счастливый'],
      ['triste', 'sad', 'грустный'],
      ['en colère', 'angry', 'злой'],
      ['fatigué', 'tired', 'уставший'],
      ['content', 'glad', 'довольный'],
    ],
  },
  hobbies: {
    icon: '🎮',
    labels: { fr: 'Loisirs', en: 'Hobbies', ru: 'Хобби' },
    words: [
      ['musique', 'music', 'музыка'],
      ['sport', 'sport', 'спорт'],
      ['lecture', 'reading', 'чтение'],
      ['danse', 'dance', 'танец'],
      ['jeu', 'game', 'игра'],
    ],
  },
  school: {
    icon: '📚',
    labels: { fr: 'École', en: 'School', ru: 'Школа' },
    words: [
      ['livre', 'book', 'книга'],
      ['stylo', 'pen', 'ручка'],
      ['étudiant', 'student', 'студент'],
      ['examen', 'exam', 'экзамен'],
      ['devoir', 'homework', 'домашнее задание'],
    ],
  },
  nature: {
    icon: '🌳',
    labels: { fr: 'Nature', en: 'Nature', ru: 'Природа' },
    words: [
      ['arbre', 'tree', 'дерево'],
      ['fleur', 'flower', 'цветок'],
      ['montagne', 'mountain', 'гора'],
      ['mer', 'sea', 'море'],
      ['forêt', 'forest', 'лес'],
    ],
  },
  drinks: {
    icon: '☕',
    labels: { fr: 'Boissons', en: 'Drinks', ru: 'Напитки' },
    words: [
      ['café', 'coffee', 'кофе'],
      ['thé', 'tea', 'чай'],
      ['lait', 'milk', 'молоко'],
      ['jus', 'juice', 'сок'],
      ['vin', 'wine', 'вино'],
    ],
  },
};

// Get all French words for distractors
const allFrenchWords = Object.values(vocabulary)
  .flatMap(theme => theme.words.map(w => w[0]));

function getDistractors(correctWord, count = 3) {
  const available = allFrenchWords.filter(w => w !== correctWord);
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateQuestion(frenchWord, englishMeaning, russianMeaning) {
  const distractors = getDistractors(frenchWord, 3);
  const options = [frenchWord, ...distractors].sort(() => Math.random() - 0.5);
  const correctAnswer = options.indexOf(frenchWord);

  return {
    question_ru: `Как сказать "${russianMeaning}" по-французски?`,
    question_en: `How do you say "${englishMeaning}" in French?`,
    question_fr: `Comment dit-on "${englishMeaning}" en français ?`,
    options,
    correct_answer: correctAnswer,
    explanation_ru: `${frenchWord} = ${russianMeaning}`,
    explanation_en: `${frenchWord} = ${englishMeaning}`,
    explanation_fr: `${frenchWord} = ${englishMeaning}`,
  };
}

async function createAllContent() {
  console.log('🚀 Generating French training content...\n');

  let themesCreated = 0;
  let questionsCreated = 0;

  for (const [themeKey, themeData] of Object.entries(vocabulary)) {
    console.log(`📝 Creating theme: ${themeKey}...`);

    // Create theme
    const { data: theme, error: themeError } = await supabase
      .from('training_themes')
      .insert({
        lang: 'fr',
        level: 'beginner',
        key: themeKey,
        icon: themeData.icon,
        label_fr: themeData.labels.fr,
        label_en: themeData.labels.en,
        label_ru: themeData.labels.ru,
        display_order: themesCreated,
        is_active: true,
      })
      .select()
      .single();

    if (themeError) {
      console.error(`  ❌ Error:`, themeError.message);
      continue;
    }

    themesCreated++;
    console.log(`  ✅ Theme created (ID: ${theme.id})`);

    // Generate questions
    const questions = themeData.words.map(([fr, en, ru]) =>
      generateQuestion(fr, en, ru)
    );

    const questionsToInsert = questions.map(q => ({
      theme_id: theme.id,
      type: 'mcq',
      ...q,
      difficulty: 1,
      is_active: true,
    }));

    const { data: insertedQuestions, error: qError } = await supabase
      .from('training_questions')
      .insert(questionsToInsert)
      .select();

    if (qError) {
      console.error(`  ❌ Questions error:`, qError.message);
    } else {
      questionsCreated += insertedQuestions.length;
      console.log(`  ✅ Created ${insertedQuestions.length} questions`);
      console.log(`     Sample options: ${JSON.stringify(insertedQuestions[0].options.slice(0, 3))}`);
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Themes created: ${themesCreated}`);
  console.log(`✅ Questions created: ${questionsCreated}`);
}

createAllContent()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
  });
