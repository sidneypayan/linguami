const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixBaikalMCQ() {
  try {
    const newQuestions = [
      {
        id: 1,
        question: 'Где находится озеро Байкал?',
        question_en: 'Where is Lake Baikal located?',
        question_fr: 'Où se trouve le lac Baïkal?',
        options: [
          { key: 'A', text: 'В южной части Восточной Сибири', text_en: 'In the southern part of Eastern Siberia', text_fr: 'Dans la partie sud de la Sibérie orientale' },
          { key: 'B', text: 'В Западной Сибири', text_en: 'In Western Siberia', text_fr: 'En Sibérie occidentale' },
          { key: 'C', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' },
          { key: 'D', text: 'На Дальнем Востоке', text_en: 'In the Far East', text_fr: 'En Extrême-Orient' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте сказано: "Байкал – озеро в южной части Восточной Сибири".',
        explanation_en: 'The text states: "Baikal is a lake in the southern part of Eastern Siberia".',
        explanation_fr: 'Le texte indique : "Le Baïkal est un lac dans la partie sud de la Sibérie orientale".'
      },
      {
        id: 2,
        question: 'Какая особенность характеризует Байкал?',
        question_en: 'What characteristic defines Baikal?',
        question_fr: 'Quelle caractéristique définit le Baïkal?',
        options: [
          { key: 'A', text: 'Самое глубокое озеро на планете с пресной водой', text_en: 'The deepest freshwater lake on the planet', text_fr: 'Le lac d\'eau douce le plus profond de la planète' },
          { key: 'B', text: 'Самое большое озеро в мире', text_en: 'The largest lake in the world', text_fr: 'Le plus grand lac du monde' },
          { key: 'C', text: 'Самое холодное озеро', text_en: 'The coldest lake', text_fr: 'Le lac le plus froid' },
          { key: 'D', text: 'Самое солёное озеро', text_en: 'The saltiest lake', text_fr: 'Le lac le plus salé' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст указывает: "самое глубокое озеро на планете с пресной водой".',
        explanation_en: 'The text states: "the deepest freshwater lake on the planet".',
        explanation_fr: 'Le texte indique : "le lac d\'eau douce le plus profond de la planète".'
      },
      {
        id: 3,
        question: 'С площадью каких стран примерно равна площадь Байкала?',
        question_en: 'Which countries\' area is approximately equal to Baikal\'s area?',
        question_fr: 'La superficie du Baïkal est approximativement égale à celle de quels pays?',
        options: [
          { key: 'A', text: 'Бельгия или Нидерланды', text_en: 'Belgium or Netherlands', text_fr: 'Belgique ou Pays-Bas' },
          { key: 'B', text: 'Франция или Германия', text_en: 'France or Germany', text_fr: 'France ou Allemagne' },
          { key: 'C', text: 'Италия или Испания', text_en: 'Italy or Spain', text_fr: 'Italie ou Espagne' },
          { key: 'D', text: 'Польша или Румыния', text_en: 'Poland or Romania', text_fr: 'Pologne ou Roumanie' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте сказано: "Площадь Байкала примерно равна площади таких стран как Бельгия или Нидерланды".',
        explanation_en: 'The text says: "The area of Baikal is approximately equal to countries like Belgium or Netherlands".',
        explanation_fr: 'Le texte dit : "La superficie du Baïkal est approximativement égale à celle de pays comme la Belgique ou les Pays-Bas".'
      },
      {
        id: 4,
        question: 'Какой высоты могут достигать волны на Байкале во время штормов?',
        question_en: 'How high can waves on Baikal reach during storms?',
        question_fr: 'Quelle hauteur peuvent atteindre les vagues sur le Baïkal pendant les tempêtes?',
        options: [
          { key: 'A', text: '4-5 метров', text_en: '4-5 meters', text_fr: '4-5 mètres' },
          { key: 'B', text: '10 метров', text_en: '10 meters', text_fr: '10 mètres' },
          { key: 'C', text: '1-2 метра', text_en: '1-2 meters', text_fr: '1-2 mètres' },
          { key: 'D', text: '15 метров', text_en: '15 meters', text_fr: '15 mètres' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст указывает: "Иногда во время штормов волны на озере достигают 4-5 метров в высоту".',
        explanation_en: 'The text states: "Sometimes during storms waves on the lake reach 4-5 meters in height".',
        explanation_fr: 'Le texte indique : "Parfois, lors de tempêtes, les vagues sur le lac atteignent 4-5 mètres de hauteur".'
      },
      {
        id: 5,
        question: 'На какую глубину можно видеть дно в Байкале благодаря прозрачности воды?',
        question_en: 'To what depth can you see the bottom in Baikal thanks to water transparency?',
        question_fr: 'À quelle profondeur peut-on voir le fond du Baïkal grâce à la transparence de l\'eau?',
        options: [
          { key: 'A', text: 'На глубине 38 метров', text_en: 'At a depth of 38 meters', text_fr: 'À une profondeur de 38 mètres' },
          { key: 'B', text: 'На глубине 10 метров', text_en: 'At a depth of 10 meters', text_fr: 'À une profondeur de 10 mètres' },
          { key: 'C', text: 'На глубине 100 метров', text_en: 'At a depth of 100 meters', text_fr: 'À une profondeur de 100 mètres' },
          { key: 'D', text: 'На глубине 5 метров', text_en: 'At a depth of 5 meters', text_fr: 'À une profondeur de 5 mètres' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте сказано: "можно видеть дно на глубине 38 метров".',
        explanation_en: 'The text says: "you can see the bottom at a depth of 38 meters".',
        explanation_fr: 'Le texte dit : "on peut voir le fond à une profondeur de 38 mètres".'
      },
      {
        id: 6,
        question: 'Что происходит с Байкалом зимой, несмотря на его огромные размеры?',
        question_en: 'What happens to Baikal in winter despite its huge size?',
        question_fr: 'Qu\'arrive-t-il au Baïkal en hiver malgré sa taille immense?',
        options: [
          { key: 'A', text: 'Он полностью замерзает', text_en: 'It freezes completely', text_fr: 'Il gèle complètement' },
          { key: 'B', text: 'Он остаётся тёплым', text_en: 'It stays warm', text_fr: 'Il reste chaud' },
          { key: 'C', text: 'Его уровень понижается', text_en: 'Its level drops', text_fr: 'Son niveau baisse' },
          { key: 'D', text: 'Он никогда не замерзает', text_en: 'It never freezes', text_fr: 'Il ne gèle jamais' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст говорит: "Несмотря на свои огромные размеры, зимой Байкал полностью замерзает".',
        explanation_en: 'The text says: "Despite its huge size, in winter Baikal freezes completely".',
        explanation_fr: 'Le texte dit : "Malgré sa taille immense, en hiver le Baïkal gèle complètement".'
      }
    ]

    const { error } = await supabase
      .from('exercises')
      .update({
        data: { questions: newQuestions }
      })
      .eq('id', 25) // Exercise ID for Baikal MCQ

    if (error) throw error

    console.log('✅ Fixed Озеро Байкал MCQ!')
    console.log('All 6 questions now based on text content:')
    console.log('1. Location in Eastern Siberia')
    console.log('2. Deepest freshwater lake')
    console.log('3. Area equal to Belgium/Netherlands')
    console.log('4. Waves 4-5 meters')
    console.log('5. Transparency 38 meters')
    console.log('6. Freezes completely in winter')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

fixBaikalMCQ()
