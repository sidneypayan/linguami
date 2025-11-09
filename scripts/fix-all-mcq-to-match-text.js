const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const corrections = {
  // Material 114: Озеро Байкал
  25: {
    title: 'Озеро Байкал',
    questions: [
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
  },
  // Material 115: Долина Гейзеров - Fixing the "90 geysers" question
  28: {
    title: 'Долина Гейзеров',
    questions: [
      {
        id: 1,
        question: 'Где находится Долина Гейзеров?',
        question_en: 'Where is the Valley of Geysers located?',
        question_fr: 'Où se trouve la Vallée des Geysers?',
        options: [
          { key: 'A', text: 'На Камчатке', text_en: 'In Kamchatka', text_fr: 'Au Kamtchatka' },
          { key: 'B', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
          { key: 'C', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' },
          { key: 'D', text: 'На Алтае', text_en: 'In Altai', text_fr: 'Dans l\'Altaï' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст начинается: "Долина Гейзеров – волшебное место на Камчатке".',
        explanation_en: 'The text begins: "The Valley of Geysers is a magical place in Kamchatka".',
        explanation_fr: 'Le texte commence : "La Vallée des Geysers est un endroit magique au Kamtchatka".'
      },
      {
        id: 2,
        question: 'Сколько примерно гейзеров находится в долине?',
        question_en: 'Approximately how many geysers are in the valley?',
        question_fr: 'Combien de geysers se trouvent approximativement dans la vallée?',
        options: [
          { key: 'A', text: 'Около 20', text_en: 'About 20', text_fr: 'Environ 20' },
          { key: 'B', text: 'Около 100', text_en: 'About 100', text_fr: 'Environ 100' },
          { key: 'C', text: 'Более 200', text_en: 'More than 200', text_fr: 'Plus de 200' },
          { key: 'D', text: 'Около 50', text_en: 'About 50', text_fr: 'Environ 50' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте указано: "в долине около 20 гейзеров".',
        explanation_en: 'The text states: "there are about 20 geysers in the valley".',
        explanation_fr: 'Le texte indique : "il y a environ 20 geysers dans la vallée".'
      },
      {
        id: 3,
        question: 'Когда была открыта Долина Гейзеров?',
        question_en: 'When was the Valley of Geysers discovered?',
        question_fr: 'Quand la Vallée des Geysers a-t-elle été découverte?',
        options: [
          { key: 'A', text: 'В 1941 году', text_en: 'In 1941', text_fr: 'En 1941' },
          { key: 'B', text: 'В 1950 году', text_en: 'In 1950', text_fr: 'En 1950' },
          { key: 'C', text: 'В 1920 году', text_en: 'In 1920', text_fr: 'En 1920' },
          { key: 'D', text: 'В 1975 году', text_en: 'In 1975', text_fr: 'En 1975' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст говорит: "которое было открыто в 1941 году".',
        explanation_en: 'The text says: "which was discovered in 1941".',
        explanation_fr: 'Le texte dit : "qui a été découvert en 1941".'
      },
      {
        id: 4,
        question: 'Как называется самый большой гейзер долины?',
        question_en: 'What is the name of the largest geyser in the valley?',
        question_fr: 'Comment s\'appelle le plus grand geyser de la vallée?',
        options: [
          { key: 'A', text: 'Великан', text_en: 'Giant', text_fr: 'Géant' },
          { key: 'B', text: 'Богатырь', text_en: 'Bogatyr', text_fr: 'Bogatyr' },
          { key: 'C', text: 'Исполин', text_en: 'Colossus', text_fr: 'Colosse' },
          { key: 'D', text: 'Гигант', text_en: 'Gigant', text_fr: 'Gigant' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст указывает: "самого большого и сильного гейзера... называется соответствующе – «Великан»".',
        explanation_en: 'The text states: "the largest and strongest geyser... is appropriately called «Giant»".',
        explanation_fr: 'Le texte indique : "le geyser le plus grand et le plus fort... s\'appelle de manière appropriée «Géant»".'
      },
      {
        id: 5,
        question: 'Какова высота фонтана самого большого гейзера?',
        question_en: 'What is the height of the fountain of the largest geyser?',
        question_fr: 'Quelle est la hauteur du jet du plus grand geyser?',
        options: [
          { key: 'A', text: '30 метров', text_en: '30 meters', text_fr: '30 mètres' },
          { key: 'B', text: '50 метров', text_en: '50 meters', text_fr: '50 mètres' },
          { key: 'C', text: '10 метров', text_en: '10 meters', text_fr: '10 mètres' },
          { key: 'D', text: '100 метров', text_en: '100 meters', text_fr: '100 mètres' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте сказано: "Фонтан самого большого и сильного гейзера достигает в высоту 30 метров".',
        explanation_en: 'The text says: "The fountain of the largest and strongest geyser reaches a height of 30 meters".',
        explanation_fr: 'Le texte dit : "Le jet du geyser le plus grand et le plus fort atteint une hauteur de 30 mètres".'
      },
      {
        id: 6,
        question: 'Чем является Долина Гейзеров?',
        question_en: 'What is the Valley of Geysers?',
        question_fr: 'Qu\'est-ce que la Vallée des Geysers?',
        options: [
          { key: 'A', text: 'Единственное гейзерное поле в Евразии', text_en: 'The only geyser field in Eurasia', text_fr: 'Le seul champ de geysers en Eurasie' },
          { key: 'B', text: 'Крупнейшее гейзерное поле в мире', text_en: 'The largest geyser field in the world', text_fr: 'Le plus grand champ de geysers au monde' },
          { key: 'C', text: 'Самое старое гейзерное поле', text_en: 'The oldest geyser field', text_fr: 'Le plus ancien champ de geysers' },
          { key: 'D', text: 'Самое маленькое гейзерное поле', text_en: 'The smallest geyser field', text_fr: 'Le plus petit champ de geysers' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст говорит: "Это единственное гейзерное поле в Евразии и одно из самых крупных во всём мире".',
        explanation_en: 'The text says: "This is the only geyser field in Eurasia and one of the largest in the world".',
        explanation_fr: 'Le texte dit : "C\'est le seul champ de geysers en Eurasie et l\'un des plus grands au monde".'
      }
    ]
  }
}

// Continue with more materials...
