require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Exercise 25 - Material 114: Озеро Байкал
const exercise25Questions = [
  {
    question: "Где находится озеро Байкал?",
    question_en: "Where is Lake Baikal located?",
    question_fr: "Où se trouve le lac Baïkal ?",
    options: [
      {
        text: "В южной части Восточной Сибири",
        text_en: "In the southern part of Eastern Siberia",
        text_fr: "Dans la partie sud de la Sibérie orientale",
        isCorrect: true
      },
      {
        text: "В северной части Западной Сибири",
        text_en: "In the northern part of Western Siberia",
        text_fr: "Dans la partie nord de la Sibérie occidentale",
        isCorrect: false
      },
      {
        text: "На Камчатке",
        text_en: "In Kamchatka",
        text_fr: "Au Kamtchatka",
        isCorrect: false
      },
      {
        text: "На Урале",
        text_en: "In the Urals",
        text_fr: "Dans l'Oural",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано, что Байкал – озеро в южной части Восточной Сибири.",
    explanation_en: "The text states that Baikal is a lake in the southern part of Eastern Siberia.",
    explanation_fr: "Le texte indique que le Baïkal est un lac situé dans la partie sud de la Sibérie orientale."
  },
  {
    question: "Чему примерно равна площадь Байкала?",
    question_en: "What is approximately equal to the area of Baikal?",
    question_fr: "À quoi correspond approximativement la superficie du Baïkal ?",
    options: [
      {
        text: "Площади Бельгии или Нидерландов",
        text_en: "The area of Belgium or the Netherlands",
        text_fr: "La superficie de la Belgique ou des Pays-Bas",
        isCorrect: true
      },
      {
        text: "Площади Франции",
        text_en: "The area of France",
        text_fr: "La superficie de la France",
        isCorrect: false
      },
      {
        text: "Площади Германии",
        text_en: "The area of Germany",
        text_fr: "La superficie de l'Allemagne",
        isCorrect: false
      },
      {
        text: "Площади Испании",
        text_en: "The area of Spain",
        text_fr: "La superficie de l'Espagne",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано, что площадь Байкала примерно равна площади таких стран как Бельгия или Нидерланды.",
    explanation_en: "The text says that the area of Baikal is approximately equal to countries like Belgium or the Netherlands.",
    explanation_fr: "Le texte indique que la superficie du Baïkal est approximativement égale à celle de pays comme la Belgique ou les Pays-Bas."
  },
  {
    question: "Как местные жители традиционно называют Байкал?",
    question_en: "What do local residents traditionally call Baikal?",
    question_fr: "Comment les habitants locaux appellent-ils traditionnellement le Baïkal ?",
    options: [
      {
        text: "Морем",
        text_en: "A sea",
        text_fr: "Une mer",
        isCorrect: true
      },
      {
        text: "Океаном",
        text_en: "An ocean",
        text_fr: "Un océan",
        isCorrect: false
      },
      {
        text: "Великим озером",
        text_en: "The Great Lake",
        text_fr: "Le Grand Lac",
        isCorrect: false
      },
      {
        text: "Синим чудом",
        text_en: "The Blue Wonder",
        text_fr: "La Merveille Bleue",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Из-за огромного размера местные жители традиционно называют Байкал морем.'",
    explanation_en: "The text states: 'Due to its huge size, local residents traditionally call Baikal a sea.'",
    explanation_fr: "Le texte indique : 'En raison de sa taille immense, les habitants locaux appellent traditionnellement le Baïkal une mer.'"
  },
  {
    question: "Какой высоты достигают волны на озере во время штормов?",
    question_en: "What height do the waves reach on the lake during storms?",
    question_fr: "Quelle hauteur atteignent les vagues sur le lac pendant les tempêtes ?",
    options: [
      {
        text: "4-5 метров",
        text_en: "4-5 meters",
        text_fr: "4-5 mètres",
        isCorrect: true
      },
      {
        text: "2-3 метра",
        text_en: "2-3 meters",
        text_fr: "2-3 mètres",
        isCorrect: false
      },
      {
        text: "6-7 метров",
        text_en: "6-7 meters",
        text_fr: "6-7 mètres",
        isCorrect: false
      },
      {
        text: "8-10 метров",
        text_en: "8-10 meters",
        text_fr: "8-10 mètres",
        isCorrect: false
      }
    ],
    explanation: "В тексте говорится: 'Иногда во время штормов волны на озере достигают 4-5 метров в высоту.'",
    explanation_en: "The text says: 'Sometimes during storms, waves on the lake reach 4-5 meters in height.'",
    explanation_fr: "Le texte dit : 'Parfois, pendant les tempêtes, les vagues sur le lac atteignent 4-5 mètres de hauteur.'"
  },
  {
    question: "На какую глубину можно видеть дно в Байкале благодаря прозрачности воды?",
    question_en: "To what depth can you see the bottom in Baikal thanks to water transparency?",
    question_fr: "À quelle profondeur peut-on voir le fond du Baïkal grâce à la transparence de l'eau ?",
    options: [
      {
        text: "На глубине 38 метров",
        text_en: "At a depth of 38 meters",
        text_fr: "À une profondeur de 38 mètres",
        isCorrect: true
      },
      {
        text: "На глубине 20 метров",
        text_en: "At a depth of 20 meters",
        text_fr: "À une profondeur de 20 mètres",
        isCorrect: false
      },
      {
        text: "На глубине 50 метров",
        text_en: "At a depth of 50 meters",
        text_fr: "À une profondeur de 50 mètres",
        isCorrect: false
      },
      {
        text: "На глубине 10 метров",
        text_en: "At a depth of 10 meters",
        text_fr: "À une profondeur de 10 mètres",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Вода в Байкале настолько прозрачная, что можно видеть дно на глубине 38 метров.'",
    explanation_en: "The text states: 'The water in Baikal is so transparent that you can see the bottom at a depth of 38 meters.'",
    explanation_fr: "Le texte indique : 'L'eau du Baïkal est si transparente qu'on peut voir le fond à une profondeur de 38 mètres.'"
  },
  {
    question: "Что происходит с Байкалом зимой?",
    question_en: "What happens to Baikal in winter?",
    question_fr: "Que se passe-t-il avec le Baïkal en hiver ?",
    options: [
      {
        text: "Он полностью замерзает",
        text_en: "It completely freezes",
        text_fr: "Il gèle complètement",
        isCorrect: true
      },
      {
        text: "Он частично замерзает",
        text_en: "It partially freezes",
        text_fr: "Il gèle partiellement",
        isCorrect: false
      },
      {
        text: "Он не замерзает из-за своей глубины",
        text_en: "It doesn't freeze due to its depth",
        text_fr: "Il ne gèle pas en raison de sa profondeur",
        isCorrect: false
      },
      {
        text: "Температура воды повышается",
        text_en: "The water temperature rises",
        text_fr: "La température de l'eau augmente",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Несмотря на свои огромные размеры, зимой Байкал полностью замерзает.'",
    explanation_en: "The text states: 'Despite its huge size, Baikal completely freezes in winter.'",
    explanation_fr: "Le texte indique : 'Malgré sa taille immense, le Baïkal gèle complètement en hiver.'"
  }
];

// Exercise 28 - Material 115: Долина Гейзеров
const exercise28Questions = [
  {
    question: "Где находится Долина Гейзеров?",
    question_en: "Where is the Valley of Geysers located?",
    question_fr: "Où se trouve la Vallée des Geysers ?",
    options: [
      {
        text: "На Камчатке",
        text_en: "In Kamchatka",
        text_fr: "Au Kamtchatka",
        isCorrect: true
      },
      {
        text: "В Сибири",
        text_en: "In Siberia",
        text_fr: "En Sibérie",
        isCorrect: false
      },
      {
        text: "На Урале",
        text_en: "In the Urals",
        text_fr: "Dans l'Oural",
        isCorrect: false
      },
      {
        text: "На Байкале",
        text_en: "At Baikal",
        text_fr: "Au Baïkal",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Долина Гейзеров – волшебное место на Камчатке'.",
    explanation_en: "The text states: 'The Valley of Geysers is a magical place in Kamchatka'.",
    explanation_fr: "Le texte indique : 'La Vallée des Geysers est un lieu magique au Kamtchatka'."
  },
  {
    question: "Когда была открыта Долина Гейзеров?",
    question_en: "When was the Valley of Geysers discovered?",
    question_fr: "Quand la Vallée des Geysers a-t-elle été découverte ?",
    options: [
      {
        text: "В 1941 году",
        text_en: "In 1941",
        text_fr: "En 1941",
        isCorrect: true
      },
      {
        text: "В 1951 году",
        text_en: "In 1951",
        text_fr: "En 1951",
        isCorrect: false
      },
      {
        text: "В 1931 году",
        text_en: "In 1931",
        text_fr: "En 1931",
        isCorrect: false
      },
      {
        text: "В 1961 году",
        text_en: "In 1961",
        text_fr: "En 1961",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Долина Гейзеров – волшебное место на Камчатке, которое было открыто в 1941 году.'",
    explanation_en: "The text says: 'The Valley of Geysers is a magical place in Kamchatka that was discovered in 1941.'",
    explanation_fr: "Le texte dit : 'La Vallée des Geysers est un lieu magique au Kamtchatka qui a été découvert en 1941.'"
  },
  {
    question: "Какова территория Долины Гейзеров?",
    question_en: "What is the area of the Valley of Geysers?",
    question_fr: "Quelle est la superficie de la Vallée des Geysers ?",
    options: [
      {
        text: "Около 6 квадратных километров",
        text_en: "About 6 square kilometers",
        text_fr: "Environ 6 kilomètres carrés",
        isCorrect: true
      },
      {
        text: "Около 10 квадратных километров",
        text_en: "About 10 square kilometers",
        text_fr: "Environ 10 kilomètres carrés",
        isCorrect: false
      },
      {
        text: "Около 3 квадратных километров",
        text_en: "About 3 square kilometers",
        text_fr: "Environ 3 kilomètres carrés",
        isCorrect: false
      },
      {
        text: "Около 15 квадратных километров",
        text_en: "About 15 square kilometers",
        text_fr: "Environ 15 kilomètres carrés",
        isCorrect: false
      }
    ],
    explanation: "В тексте указано: 'Территория долины – всего около 6 квадратных километров'.",
    explanation_en: "The text states: 'The territory of the valley is only about 6 square kilometers'.",
    explanation_fr: "Le texte indique : 'Le territoire de la vallée est seulement d'environ 6 kilomètres carrés'."
  },
  {
    question: "Сколько гейзеров находится в долине?",
    question_en: "How many geysers are in the valley?",
    question_fr: "Combien de geysers y a-t-il dans la vallée ?",
    options: [
      {
        text: "Около 20 гейзеров",
        text_en: "About 20 geysers",
        text_fr: "Environ 20 geysers",
        isCorrect: true
      },
      {
        text: "Около 30 гейзеров",
        text_en: "About 30 geysers",
        text_fr: "Environ 30 geysers",
        isCorrect: false
      },
      {
        text: "Около 10 гейзеров",
        text_en: "About 10 geysers",
        text_fr: "Environ 10 geysers",
        isCorrect: false
      },
      {
        text: "Около 50 гейзеров",
        text_en: "About 50 geysers",
        text_fr: "Environ 50 geysers",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Также в долине около 20 гейзеров, из которых фонтанирует почти кипящая вода.'",
    explanation_en: "The text states: 'Also in the valley there are about 20 geysers from which almost boiling water spurts.'",
    explanation_fr: "Le texte indique : 'Il y a aussi environ 20 geysers dans la vallée d'où jaillit de l'eau presque bouillante.'"
  },
  {
    question: "Какой высоты достигает фонтан самого большого гейзера?",
    question_en: "What height does the fountain of the largest geyser reach?",
    question_fr: "Quelle hauteur atteint le jet du plus grand geyser ?",
    options: [
      {
        text: "30 метров",
        text_en: "30 meters",
        text_fr: "30 mètres",
        isCorrect: true
      },
      {
        text: "20 метров",
        text_en: "20 meters",
        text_fr: "20 mètres",
        isCorrect: false
      },
      {
        text: "40 метров",
        text_en: "40 meters",
        text_fr: "40 mètres",
        isCorrect: false
      },
      {
        text: "50 метров",
        text_en: "50 meters",
        text_fr: "50 mètres",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Фонтан самого большого и сильного гейзера достигает в высоту 30 метров и называется соответствующе – «Великан».'",
    explanation_en: "The text says: 'The fountain of the largest and strongest geyser reaches a height of 30 meters and is appropriately called \"Velikan\" (Giant).'",
    explanation_fr: "Le texte dit : 'Le jet du geyser le plus grand et le plus puissant atteint une hauteur de 30 mètres et s'appelle de manière appropriée \"Velikan\" (Géant).'"
  },
  {
    question: "Чем является Долина Гейзеров для России?",
    question_en: "What is the Valley of Geysers for Russia?",
    question_fr: "Qu'est-ce que la Vallée des Geysers pour la Russie ?",
    options: [
      {
        text: "Одним из семи чудес России",
        text_en: "One of the seven wonders of Russia",
        text_fr: "L'une des sept merveilles de la Russie",
        isCorrect: true
      },
      {
        text: "Самым посещаемым местом",
        text_en: "The most visited place",
        text_fr: "Le lieu le plus visité",
        isCorrect: false
      },
      {
        text: "Крупнейшим заповедником",
        text_en: "The largest nature reserve",
        text_fr: "La plus grande réserve naturelle",
        isCorrect: false
      },
      {
        text: "Главной туристической достопримечательностью",
        text_en: "The main tourist attraction",
        text_fr: "La principale attraction touristique",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Долина Гейзеров является одним из семи чудес России'.",
    explanation_en: "The text states: 'The Valley of Geysers is one of the seven wonders of Russia'.",
    explanation_fr: "Le texte indique : 'La Vallée des Geysers est l'une des sept merveilles de la Russie'."
  }
];

// Exercise 31 - Material 120: Столбы выветривания
const exercise31Questions = [
  {
    question: "Где находятся Столбы выветривания?",
    question_en: "Where are the Weathering Pillars located?",
    question_fr: "Où se trouvent les Piliers de l'érosion ?",
    options: [
      {
        text: "На горе Мань-Пупу-Нер в Республике Коми",
        text_en: "On Mount Man-Pupu-Nyor in the Komi Republic",
        text_fr: "Sur le mont Man-Pupu-Nyor dans la République de Komi",
        isCorrect: true
      },
      {
        text: "На Камчатке",
        text_en: "In Kamchatka",
        text_fr: "Au Kamtchatka",
        isCorrect: false
      },
      {
        text: "На Урале в Башкирии",
        text_en: "In the Urals in Bashkiria",
        text_fr: "Dans l'Oural en Bachkirie",
        isCorrect: false
      },
      {
        text: "В Сибири",
        text_en: "In Siberia",
        text_fr: "En Sibérie",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Это огромные каменные статуи, находящиеся на горе Мань-Пупу-Нер в Республике Коми.'",
    explanation_en: "The text states: 'These are huge stone statues located on Mount Man-Pupu-Nyor in the Komi Republic.'",
    explanation_fr: "Le texte indique : 'Ce sont d'énormes statues de pierre situées sur le mont Man-Pupu-Nyor dans la République de Komi.'"
  },
  {
    question: "Что было на месте столбов около 200 миллионов лет назад?",
    question_en: "What was in place of the pillars about 200 million years ago?",
    question_fr: "Qu'y avait-il à la place des piliers il y a environ 200 millions d'années ?",
    options: [
      {
        text: "Горы",
        text_en: "Mountains",
        text_fr: "Des montagnes",
        isCorrect: true
      },
      {
        text: "Море",
        text_en: "A sea",
        text_fr: "Une mer",
        isCorrect: false
      },
      {
        text: "Пустыня",
        text_en: "A desert",
        text_fr: "Un désert",
        isCorrect: false
      },
      {
        text: "Лес",
        text_en: "A forest",
        text_fr: "Une forêt",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Около 200 миллионов лет назад на месте каменных столбов были горы.'",
    explanation_en: "The text states: 'About 200 million years ago, mountains were in place of the stone pillars.'",
    explanation_fr: "Le texte indique : 'Il y a environ 200 millions d'années, il y avait des montagnes à la place des piliers de pierre.'"
  },
  {
    question: "Какова примерная высота столбов?",
    question_en: "What is the approximate height of the pillars?",
    question_fr: "Quelle est la hauteur approximative des piliers ?",
    options: [
      {
        text: "Около 30 метров",
        text_en: "About 30 meters",
        text_fr: "Environ 30 mètres",
        isCorrect: true
      },
      {
        text: "Около 20 метров",
        text_en: "About 20 meters",
        text_fr: "Environ 20 mètres",
        isCorrect: false
      },
      {
        text: "Около 50 метров",
        text_en: "About 50 meters",
        text_fr: "Environ 50 mètres",
        isCorrect: false
      },
      {
        text: "Около 40 метров",
        text_en: "About 40 meters",
        text_fr: "Environ 40 mètres",
        isCorrect: false
      }
    ],
    explanation: "В тексте указано: 'Твёрдые породы разрушались меньше и сохранились до наших дней в виде столбов, высота которых около 30 метров.'",
    explanation_en: "The text states: 'Hard rocks were destroyed less and have been preserved to this day in the form of pillars, the height of which is about 30 meters.'",
    explanation_fr: "Le texte indique : 'Les roches dures se sont moins détruites et se sont conservées jusqu'à nos jours sous forme de piliers dont la hauteur est d'environ 30 mètres.'"
  },
  {
    question: "На что похож столб, который стоит в стороне от других?",
    question_en: "What does the pillar that stands apart from the others look like?",
    question_fr: "À quoi ressemble le pilier qui se trouve à l'écart des autres ?",
    options: [
      {
        text: "На огромную бутылку, перевёрнутую вверх дном",
        text_en: "A huge bottle turned upside down",
        text_fr: "Une énorme bouteille retournée",
        isCorrect: true
      },
      {
        text: "На гигантского человека",
        text_en: "A giant person",
        text_fr: "Une personne géante",
        isCorrect: false
      },
      {
        text: "На голову лошади",
        text_en: "A horse's head",
        text_fr: "Une tête de cheval",
        isCorrect: false
      },
      {
        text: "На замок",
        text_en: "A castle",
        text_fr: "Un château",
        isCorrect: false
      }
    ],
    explanation: "В тексте говорится: 'Один столб стоит в стороне от других и напоминает огромную бутылку, перевёрнутую вверх дном.'",
    explanation_en: "The text says: 'One pillar stands apart from the others and resembles a huge bottle turned upside down.'",
    explanation_fr: "Le texte dit : 'Un pilier se trouve à l'écart des autres et ressemble à une énorme bouteille retournée.'"
  },
  {
    question: "Сколько столбов расположены в ряд у края обрыва?",
    question_en: "How many pillars are arranged in a row at the edge of the cliff?",
    question_fr: "Combien de piliers sont disposés en rangée au bord de la falaise ?",
    options: [
      {
        text: "Шесть",
        text_en: "Six",
        text_fr: "Six",
        isCorrect: true
      },
      {
        text: "Пять",
        text_en: "Five",
        text_fr: "Cinq",
        isCorrect: false
      },
      {
        text: "Семь",
        text_en: "Seven",
        text_fr: "Sept",
        isCorrect: false
      },
      {
        text: "Восемь",
        text_en: "Eight",
        text_fr: "Huit",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Шесть других расположены в ряд у края обрыва.'",
    explanation_en: "The text states: 'Six others are arranged in a row at the edge of the cliff.'",
    explanation_fr: "Le texte indique : 'Six autres sont disposés en rangée au bord de la falaise.'"
  },
  {
    question: "Как выглядят столбы зимой?",
    question_en: "What do the pillars look like in winter?",
    question_fr: "À quoi ressemblent les piliers en hiver ?",
    options: [
      {
        text: "Совсем белые, как будто сделаны из хрусталя",
        text_en: "Completely white, as if made of crystal",
        text_fr: "Complètement blancs, comme s'ils étaient faits de cristal",
        isCorrect: true
      },
      {
        text: "Покрыты снегом и льдом",
        text_en: "Covered with snow and ice",
        text_fr: "Couverts de neige et de glace",
        isCorrect: false
      },
      {
        text: "Темнее, чем летом",
        text_en: "Darker than in summer",
        text_fr: "Plus sombres qu'en été",
        isCorrect: false
      },
      {
        text: "Блестят на солнце",
        text_en: "Shine in the sun",
        text_fr: "Brillent au soleil",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Зимой столбы совсем белые и выглядят, как будто они сделаны из хрусталя.'",
    explanation_en: "The text says: 'In winter, the pillars are completely white and look as if they are made of crystal.'",
    explanation_fr: "Le texte dit : 'En hiver, les piliers sont complètement blancs et semblent faits de cristal.'"
  }
];

// Exercise 12 - Material 121: Эльбрус
const exercise12Questions = [
  {
    question: "Чем является Эльбрус для России и Европы?",
    question_en: "What is Elbrus for Russia and Europe?",
    question_fr: "Qu'est-ce que l'Elbrouz pour la Russie et l'Europe ?",
    options: [
      {
        text: "Самой высокой горной вершиной",
        text_en: "The highest mountain peak",
        text_fr: "Le plus haut sommet montagneux",
        isCorrect: true
      },
      {
        text: "Самым опасным вулканом",
        text_en: "The most dangerous volcano",
        text_fr: "Le volcan le plus dangereux",
        isCorrect: false
      },
      {
        text: "Самым популярным местом для туристов",
        text_en: "The most popular place for tourists",
        text_fr: "Le lieu le plus populaire pour les touristes",
        isCorrect: false
      },
      {
        text: "Самой древней горой",
        text_en: "The oldest mountain",
        text_fr: "La plus ancienne montagne",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Эльбрус – самая высокая горная вершина России и Европы.'",
    explanation_en: "The text states: 'Elbrus is the highest mountain peak in Russia and Europe.'",
    explanation_fr: "Le texte indique : 'L'Elbrouz est le plus haut sommet montagneux de Russie et d'Europe.'"
  },
  {
    question: "Сколько времени обычно требуется на восхождение?",
    question_en: "How much time does climbing usually take?",
    question_fr: "Combien de temps faut-il généralement pour l'ascension ?",
    options: [
      {
        text: "Около семи дней",
        text_en: "About seven days",
        text_fr: "Environ sept jours",
        isCorrect: true
      },
      {
        text: "Около пяти дней",
        text_en: "About five days",
        text_fr: "Environ cinq jours",
        isCorrect: false
      },
      {
        text: "Около десяти дней",
        text_en: "About ten days",
        text_fr: "Environ dix jours",
        isCorrect: false
      },
      {
        text: "Около трёх дней",
        text_en: "About three days",
        text_fr: "Environ trois jours",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'На восхождение обычно требуется около семи дней'.",
    explanation_en: "The text says: 'Climbing usually takes about seven days'.",
    explanation_fr: "Le texte dit : 'L'ascension prend généralement environ sept jours'."
  },
  {
    question: "Что можно увидеть с горы в хорошую погоду?",
    question_en: "What can be seen from the mountain in good weather?",
    question_fr: "Que peut-on voir depuis la montagne par beau temps ?",
    options: [
      {
        text: "Два моря - Каспийское и Чёрное",
        text_en: "Two seas - the Caspian and the Black Sea",
        text_fr: "Deux mers - la Caspienne et la mer Noire",
        isCorrect: true
      },
      {
        text: "Три моря",
        text_en: "Three seas",
        text_fr: "Trois mers",
        isCorrect: false
      },
      {
        text: "Балтийское море",
        text_en: "The Baltic Sea",
        text_fr: "La mer Baltique",
        isCorrect: false
      },
      {
        text: "Озеро Байкал",
        text_en: "Lake Baikal",
        text_fr: "Le lac Baïkal",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'В хорошую погоду с горы можно увидеть сразу два моря - Каспийское и Чёрное.'",
    explanation_en: "The text states: 'In good weather, you can see two seas from the mountain - the Caspian and the Black Sea.'",
    explanation_fr: "Le texte indique : 'Par beau temps, on peut voir deux mers depuis la montagne - la Caspienne et la mer Noire.'"
  },
  {
    question: "Когда сформировался Эльбрус?",
    question_en: "When was Elbrus formed?",
    question_fr: "Quand l'Elbrouz s'est-il formé ?",
    options: [
      {
        text: "Более миллиона лет назад",
        text_en: "More than a million years ago",
        text_fr: "Il y a plus d'un million d'années",
        isCorrect: true
      },
      {
        text: "Около 500 тысяч лет назад",
        text_en: "About 500 thousand years ago",
        text_fr: "Il y a environ 500 mille ans",
        isCorrect: false
      },
      {
        text: "Около 200 миллионов лет назад",
        text_en: "About 200 million years ago",
        text_fr: "Il y a environ 200 millions d'années",
        isCorrect: false
      },
      {
        text: "Около 100 тысяч лет назад",
        text_en: "About 100 thousand years ago",
        text_fr: "Il y a environ 100 mille ans",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Эльбрус сформировался более миллиона лет назад'.",
    explanation_en: "The text says: 'Elbrus was formed more than a million years ago'.",
    explanation_fr: "Le texte dit : 'L'Elbrouz s'est formé il y a plus d'un million d'années'."
  },
  {
    question: "Чем раньше был Эльбрус?",
    question_en: "What was Elbrus before?",
    question_fr: "Qu'était l'Elbrouz auparavant ?",
    options: [
      {
        text: "Действующим вулканом",
        text_en: "An active volcano",
        text_fr: "Un volcan actif",
        isCorrect: true
      },
      {
        text: "Просто горой",
        text_en: "Just a mountain",
        text_fr: "Simplement une montagne",
        isCorrect: false
      },
      {
        text: "Плато",
        text_en: "A plateau",
        text_fr: "Un plateau",
        isCorrect: false
      },
      {
        text: "Островом",
        text_en: "An island",
        text_fr: "Une île",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Раньше он был действующим вулканом'.",
    explanation_en: "The text states: 'It used to be an active volcano'.",
    explanation_fr: "Le texte indique : 'C'était auparavant un volcan actif'."
  },
  {
    question: "Когда Эльбрус стал называться одним из чудес России?",
    question_en: "When did Elbrus become known as one of the wonders of Russia?",
    question_fr: "Quand l'Elbrouz est-il devenu l'une des merveilles de la Russie ?",
    options: [
      {
        text: "В 2008 году",
        text_en: "In 2008",
        text_fr: "En 2008",
        isCorrect: true
      },
      {
        text: "В 2000 году",
        text_en: "In 2000",
        text_fr: "En 2000",
        isCorrect: false
      },
      {
        text: "В 2010 году",
        text_en: "In 2010",
        text_fr: "En 2010",
        isCorrect: false
      },
      {
        text: "В 2005 году",
        text_en: "In 2005",
        text_fr: "En 2005",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'В 2008 году известная вершина стала заслуженно называться одним из чудес России.'",
    explanation_en: "The text says: 'In 2008, the famous peak deservedly became known as one of the wonders of Russia.'",
    explanation_fr: "Le texte dit : 'En 2008, le sommet célèbre est devenu à juste titre l'une des merveilles de la Russie.'"
  }
];

// Exercise 37 - Material 155: Ленские столбы
const exercise37Questions = [
  {
    question: "Где находятся Ленские столбы?",
    question_en: "Where are the Lena Pillars located?",
    question_fr: "Où se trouvent les Piliers de la Léna ?",
    options: [
      {
        text: "Вдоль берега реки Лена в Якутии",
        text_en: "Along the banks of the Lena River in Yakutia",
        text_fr: "Le long des rives de la rivière Léna en Yakoutie",
        isCorrect: true
      },
      {
        text: "В Сибири возле Байкала",
        text_en: "In Siberia near Baikal",
        text_fr: "En Sibérie près du Baïkal",
        isCorrect: false
      },
      {
        text: "На Камчатке",
        text_en: "In Kamchatka",
        text_fr: "Au Kamtchatka",
        isCorrect: false
      },
      {
        text: "В Республике Коми",
        text_en: "In the Komi Republic",
        text_fr: "Dans la République de Komi",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Ленские столбы – это комплекс вертикально вытянутых скал, растянувшийся на многие километры вдоль берега реки Лена в Якутии.'",
    explanation_en: "The text states: 'The Lena Pillars are a complex of vertically elongated rocks stretching for many kilometers along the banks of the Lena River in Yakutia.'",
    explanation_fr: "Le texte indique : 'Les Piliers de la Léna sont un complexe de rochers verticalement allongés s'étendant sur plusieurs kilomètres le long des rives de la rivière Léna en Yakoutie.'"
  },
  {
    question: "Какую территорию занимает природный парк «Ленские столбы»?",
    question_en: "What area does the Lena Pillars Nature Park occupy?",
    question_fr: "Quelle superficie occupe le parc naturel des Piliers de la Léna ?",
    options: [
      {
        text: "Более 80 тысяч гектар",
        text_en: "More than 80 thousand hectares",
        text_fr: "Plus de 80 mille hectares",
        isCorrect: true
      },
      {
        text: "Более 50 тысяч гектар",
        text_en: "More than 50 thousand hectares",
        text_fr: "Plus de 50 mille hectares",
        isCorrect: false
      },
      {
        text: "Более 100 тысяч гектар",
        text_en: "More than 100 thousand hectares",
        text_fr: "Plus de 100 mille hectares",
        isCorrect: false
      },
      {
        text: "Более 60 тысяч гектар",
        text_en: "More than 60 thousand hectares",
        text_fr: "Plus de 60 mille hectares",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Природный парк «Ленские столбы» занимает огромную территорию – более 80 тысяч гектар.'",
    explanation_en: "The text says: 'The Lena Pillars Nature Park occupies a huge territory - more than 80 thousand hectares.'",
    explanation_fr: "Le texte dit : 'Le parc naturel des Piliers de la Léna occupe un vaste territoire - plus de 80 mille hectares.'"
  },
  {
    question: "Благодаря чему появился этот каменный лес?",
    question_en: "How did this stone forest appear?",
    question_fr: "Comment cette forêt de pierre est-elle apparue ?",
    options: [
      {
        text: "Благодаря эрозии гор",
        text_en: "Thanks to mountain erosion",
        text_fr: "Grâce à l'érosion des montagnes",
        isCorrect: true
      },
      {
        text: "Благодаря вулканической активности",
        text_en: "Thanks to volcanic activity",
        text_fr: "Grâce à l'activité volcanique",
        isCorrect: false
      },
      {
        text: "Благодаря землетрясениям",
        text_en: "Thanks to earthquakes",
        text_fr: "Grâce aux tremblements de terre",
        isCorrect: false
      },
      {
        text: "Благодаря ледникам",
        text_en: "Thanks to glaciers",
        text_fr: "Grâce aux glaciers",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Этот каменный лес появился благодаря эрозии гор.'",
    explanation_en: "The text states: 'This stone forest appeared thanks to mountain erosion.'",
    explanation_fr: "Le texte indique : 'Cette forêt de pierre est apparue grâce à l'érosion des montagnes.'"
  },
  {
    question: "Сколько времени занимает перелёт из Москвы до Якутска?",
    question_en: "How long does the flight from Moscow to Yakutsk take?",
    question_fr: "Combien de temps dure le vol de Moscou à Iakoutsk ?",
    options: [
      {
        text: "Около 7 часов",
        text_en: "About 7 hours",
        text_fr: "Environ 7 heures",
        isCorrect: true
      },
      {
        text: "Около 5 часов",
        text_en: "About 5 hours",
        text_fr: "Environ 5 heures",
        isCorrect: false
      },
      {
        text: "Около 9 часов",
        text_en: "About 9 hours",
        text_fr: "Environ 9 heures",
        isCorrect: false
      },
      {
        text: "Около 10 часов",
        text_en: "About 10 hours",
        text_fr: "Environ 10 heures",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Перелёт до Якутска, столицы Якутии, занимает около 7 часов.'",
    explanation_en: "The text says: 'The flight to Yakutsk, the capital of Yakutia, takes about 7 hours.'",
    explanation_fr: "Le texte dit : 'Le vol vers Iakoutsk, la capitale de la Yakoutie, prend environ 7 heures.'"
  },
  {
    question: "Сколько времени занимает дорога от Якутска до Ленских столбов?",
    question_en: "How long does it take to travel from Yakutsk to the Lena Pillars?",
    question_fr: "Combien de temps faut-il pour aller de Iakoutsk aux Piliers de la Léna ?",
    options: [
      {
        text: "12 часов на катере или теплоходе",
        text_en: "12 hours by boat or ship",
        text_fr: "12 heures en bateau ou en navire",
        isCorrect: true
      },
      {
        text: "8 часов на катере или теплоходе",
        text_en: "8 hours by boat or ship",
        text_fr: "8 heures en bateau ou en navire",
        isCorrect: false
      },
      {
        text: "15 часов на катере или теплоходе",
        text_en: "15 hours by boat or ship",
        text_fr: "15 heures en bateau ou en navire",
        isCorrect: false
      },
      {
        text: "10 часов на катере или теплоходе",
        text_en: "10 hours by boat or ship",
        text_fr: "10 heures en bateau ou en navire",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Из столицы Якутии до Ленских столбов ещё 12 часов на катере или теплоходе.'",
    explanation_en: "The text states: 'From the capital of Yakutia to the Lena Pillars is another 12 hours by boat or ship.'",
    explanation_fr: "Le texte indique : 'De la capitale de la Yakoutie aux Piliers de la Léna, il faut encore 12 heures en bateau ou en navire.'"
  },
  {
    question: "К кому лучше обратиться после прибытия к Ленским столбам?",
    question_en: "Who is it better to turn to after arriving at the Lena Pillars?",
    question_fr: "À qui vaut-il mieux s'adresser après être arrivé aux Piliers de la Léna ?",
    options: [
      {
        text: "К местным жителям",
        text_en: "To local residents",
        text_fr: "Aux habitants locaux",
        isCorrect: true
      },
      {
        text: "К туристическому агентству",
        text_en: "To a tourist agency",
        text_fr: "À une agence touristique",
        isCorrect: false
      },
      {
        text: "К администрации парка",
        text_en: "To the park administration",
        text_fr: "À l'administration du parc",
        isCorrect: false
      },
      {
        text: "К гидам из Москвы",
        text_en: "To guides from Moscow",
        text_fr: "À des guides de Moscou",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Затем лучше обратиться к местным жителям, которые с удовольствием подскажут, куда идти, или проведут интересные экскурсии.'",
    explanation_en: "The text says: 'Then it is better to turn to local residents who will gladly advise where to go or conduct interesting excursions.'",
    explanation_fr: "Le texte dit : 'Il vaut alors mieux s'adresser aux habitants locaux qui vous indiqueront volontiers où aller ou organiseront des excursions intéressantes.'"
  }
];

// Exercise 49 - Material 168: Плато Укок
const exercise49Questions = [
  {
    question: "Где находится плато Укок?",
    question_en: "Where is the Ukok Plateau located?",
    question_fr: "Où se trouve le plateau d'Ukok ?",
    options: [
      {
        text: "На юге республики Алтай",
        text_en: "In the south of the Altai Republic",
        text_fr: "Au sud de la République de l'Altaï",
        isCorrect: true
      },
      {
        text: "В Якутии",
        text_en: "In Yakutia",
        text_fr: "En Yakoutie",
        isCorrect: false
      },
      {
        text: "В Республике Коми",
        text_en: "In the Komi Republic",
        text_fr: "Dans la République de Komi",
        isCorrect: false
      },
      {
        text: "На Камчатке",
        text_en: "In Kamchatka",
        text_fr: "Au Kamtchatka",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Плато Укок – плоскогорье на юге республики Алтай.'",
    explanation_en: "The text states: 'The Ukok Plateau is a plateau in the south of the Altai Republic.'",
    explanation_fr: "Le texte indique : 'Le plateau d'Ukok est un plateau au sud de la République de l'Altaï.'"
  },
  {
    question: "Почему местные жители считают плато Укок священным?",
    question_en: "Why do local residents consider the Ukok Plateau sacred?",
    question_fr: "Pourquoi les habitants locaux considèrent-ils le plateau d'Ukok comme sacré ?",
    options: [
      {
        text: "Потому что верят, что там обитают горные духи",
        text_en: "Because they believe that mountain spirits live there",
        text_fr: "Parce qu'ils croient que des esprits de montagne y habitent",
        isCorrect: true
      },
      {
        text: "Потому что там находятся древние храмы",
        text_en: "Because there are ancient temples there",
        text_fr: "Parce qu'il y a des temples anciens là-bas",
        isCorrect: false
      },
      {
        text: "Потому что там происходили важные исторические события",
        text_en: "Because important historical events took place there",
        text_fr: "Parce que des événements historiques importants s'y sont déroulés",
        isCorrect: false
      },
      {
        text: "Потому что там родились их предки",
        text_en: "Because their ancestors were born there",
        text_fr: "Parce que leurs ancêtres y sont nés",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Местные жители считают это место священным, так как верят, что на плато Укок обитают горные духи.'",
    explanation_en: "The text says: 'Local residents consider this place sacred because they believe that mountain spirits live on the Ukok Plateau.'",
    explanation_fr: "Le texte dit : 'Les habitants locaux considèrent cet endroit comme sacré car ils croient que des esprits de montagne habitent le plateau d'Ukok.'"
  },
  {
    question: "Что было обнаружено на плато в 90-е годы прошлого века?",
    question_en: "What was discovered on the plateau in the 90s of the last century?",
    question_fr: "Qu'a-t-on découvert sur le plateau dans les années 90 du siècle dernier ?",
    options: [
      {
        text: "Захоронения культур, существовавших в III–II тысячелетиях до н.э.",
        text_en: "Burials of cultures that existed in the 3rd-2nd millennia BC",
        text_fr: "Des sépultures de cultures ayant existé aux IIIe-IIe millénaires avant J.-C.",
        isCorrect: true
      },
      {
        text: "Древний город",
        text_en: "An ancient city",
        text_fr: "Une ville ancienne",
        isCorrect: false
      },
      {
        text: "Золотые рудники",
        text_en: "Gold mines",
        text_fr: "Des mines d'or",
        isCorrect: false
      },
      {
        text: "Наскальные рисунки",
        text_en: "Cave paintings",
        text_fr: "Des peintures rupestres",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'В 90-е годы прошлого века были обнаружены захоронения культур, существовавших в III–II тысячелетиях до н.э., в том числе всемирно известная мумия «Алтайской принцессы».'",
    explanation_en: "The text states: 'In the 90s of the last century, burials of cultures that existed in the 3rd-2nd millennia BC were discovered, including the world-famous mummy of the \"Altai Princess\".'",
    explanation_fr: "Le texte indique : 'Dans les années 90 du siècle dernier, des sépultures de cultures ayant existé aux IIIe-IIe millénaires avant J.-C. ont été découvertes, dont la momie mondialement connue de la \"Princesse de l'Altaï\".'"
  },
  {
    question: "Что такое Алтайский Стоунхендж?",
    question_en: "What is the Altai Stonehenge?",
    question_fr: "Qu'est-ce que le Stonehenge de l'Altaï ?",
    options: [
      {
        text: "5 огромных каменных валунов до 7 метров высотой",
        text_en: "5 huge stone boulders up to 7 meters high",
        text_fr: "5 énormes rochers de pierre jusqu'à 7 mètres de haut",
        isCorrect: true
      },
      {
        text: "Древний храм",
        text_en: "An ancient temple",
        text_fr: "Un temple ancien",
        isCorrect: false
      },
      {
        text: "Круг из 10 камней",
        text_en: "A circle of 10 stones",
        text_fr: "Un cercle de 10 pierres",
        isCorrect: false
      },
      {
        text: "Каменная арка",
        text_en: "A stone arch",
        text_fr: "Une arche de pierre",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Помимо захоронений, на территории плато находится Алтайский Стоунхендж – 5 огромных каменных валунов до 7 метров высотой.'",
    explanation_en: "The text says: 'In addition to burials, on the territory of the plateau is the Altai Stonehenge - 5 huge stone boulders up to 7 meters high.'",
    explanation_fr: "Le texte dit : 'En plus des sépultures, sur le territoire du plateau se trouve le Stonehenge de l'Altaï - 5 énormes rochers de pierre jusqu'à 7 mètres de haut.'"
  },
  {
    question: "Почему плато Укок остаётся малоизученным?",
    question_en: "Why does the Ukok Plateau remain poorly studied?",
    question_fr: "Pourquoi le plateau d'Ukok reste-t-il peu étudié ?",
    options: [
      {
        text: "Из-за своей труднодоступности",
        text_en: "Due to its inaccessibility",
        text_fr: "En raison de son inaccessibilité",
        isCorrect: true
      },
      {
        text: "Из-за запрета местных властей",
        text_en: "Due to a ban by local authorities",
        text_fr: "En raison d'une interdiction des autorités locales",
        isCorrect: false
      },
      {
        text: "Из-за отсутствия финансирования",
        text_en: "Due to lack of funding",
        text_fr: "En raison du manque de financement",
        isCorrect: false
      },
      {
        text: "Из-за религиозных причин",
        text_en: "Due to religious reasons",
        text_fr: "Pour des raisons religieuses",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Но из-за своей труднодоступности плато остаётся малоизученным, природа здесь сохранилась практически в девственном виде.'",
    explanation_en: "The text states: 'But due to its inaccessibility, the plateau remains poorly studied, nature here has been preserved almost in pristine form.'",
    explanation_fr: "Le texte indique : 'Mais en raison de son inaccessibilité, le plateau reste peu étudié, la nature y est restée presque intacte.'"
  },
  {
    question: "Сколько всего селений находится на всём плоскогорье?",
    question_en: "How many settlements are there in the entire plateau?",
    question_fr: "Combien de villages se trouvent sur tout le plateau ?",
    options: [
      {
        text: "Всего одно селение",
        text_en: "Only one settlement",
        text_fr: "Un seul village",
        isCorrect: true
      },
      {
        text: "Три селения",
        text_en: "Three settlements",
        text_fr: "Trois villages",
        isCorrect: false
      },
      {
        text: "Пять селений",
        text_en: "Five settlements",
        text_fr: "Cinq villages",
        isCorrect: false
      },
      {
        text: "Нет ни одного селения",
        text_en: "No settlements",
        text_fr: "Aucun village",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Из-за сурового климата этот район практически безлюдный, на всём плоскогорье всего одно селение.'",
    explanation_en: "The text says: 'Due to the harsh climate, this area is almost uninhabited, with only one settlement on the entire plateau.'",
    explanation_fr: "Le texte dit : 'En raison du climat rigoureux, cette région est presque inhabitée, il n'y a qu'un seul village sur tout le plateau.'"
  }
];

// Exercise 52 - Material 169: Красная площадь
const exercise52Questions = [
  {
    question: "Чем является Красная площадь для Москвы и России?",
    question_en: "What is Red Square for Moscow and Russia?",
    question_fr: "Qu'est-ce que la place Rouge pour Moscou et la Russie ?",
    options: [
      {
        text: "Одним из главных символов города и страны",
        text_en: "One of the main symbols of the city and country",
        text_fr: "L'un des principaux symboles de la ville et du pays",
        isCorrect: true
      },
      {
        text: "Самым большим парком",
        text_en: "The largest park",
        text_fr: "Le plus grand parc",
        isCorrect: false
      },
      {
        text: "Центром торговли",
        text_en: "The center of trade",
        text_fr: "Le centre du commerce",
        isCorrect: false
      },
      {
        text: "Местом проведения концертов",
        text_en: "A place for concerts",
        text_fr: "Un lieu de concerts",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Красная площадь в Москве является одним из главных символов города и страны в целом.'",
    explanation_en: "The text states: 'Red Square in Moscow is one of the main symbols of the city and the country as a whole.'",
    explanation_fr: "Le texte indique : 'La place Rouge à Moscou est l'un des principaux symboles de la ville et du pays dans son ensemble.'"
  },
  {
    question: "Что находится в Александровском парке?",
    question_en: "What is in Alexander Garden?",
    question_fr: "Qu'y a-t-il dans le jardin d'Alexandre ?",
    options: [
      {
        text: "Фонтаны, скульптуры, редкие виды деревьев и кустарников",
        text_en: "Fountains, sculptures, rare species of trees and shrubs",
        text_fr: "Des fontaines, des sculptures, des espèces rares d'arbres et d'arbustes",
        isCorrect: true
      },
      {
        text: "Музеи и галереи",
        text_en: "Museums and galleries",
        text_fr: "Des musées et des galeries",
        isCorrect: false
      },
      {
        text: "Кафе и рестораны",
        text_en: "Cafes and restaurants",
        text_fr: "Des cafés et des restaurants",
        isCorrect: false
      },
      {
        text: "Спортивные площадки",
        text_en: "Sports grounds",
        text_fr: "Des terrains de sport",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Фонтаны, скульптуры, редкие виды деревьев и кустарников делают это место очень привлекательным для прогулок.'",
    explanation_en: "The text says: 'Fountains, sculptures, rare species of trees and shrubs make this place very attractive for walks.'",
    explanation_fr: "Le texte dit : 'Des fontaines, des sculptures, des espèces rares d'arbres et d'arbustes rendent cet endroit très attrayant pour les promenades.'"
  },
  {
    question: "Во что превращается площадь перед ГУМ зимой?",
    question_en: "What does the square in front of GUM turn into in winter?",
    question_fr: "En quoi se transforme la place devant le GOUM en hiver ?",
    options: [
      {
        text: "В празднично украшенный каток",
        text_en: "Into a festively decorated ice rink",
        text_fr: "En une patinoire décorée de manière festive",
        isCorrect: true
      },
      {
        text: "В ярмарку",
        text_en: "Into a fair",
        text_fr: "En une foire",
        isCorrect: false
      },
      {
        text: "В концертную площадку",
        text_en: "Into a concert venue",
        text_fr: "En une scène de concert",
        isCorrect: false
      },
      {
        text: "В лыжную трассу",
        text_en: "Into a ski slope",
        text_fr: "En une piste de ski",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Зимой площадь перед магазином превращают в празднично украшенный каток.'",
    explanation_en: "The text states: 'In winter, the square in front of the store is turned into a festively decorated ice rink.'",
    explanation_fr: "Le texte indique : 'En hiver, la place devant le magasin est transformée en une patinoire décorée de manière festive.'"
  },
  {
    question: "Сколько куполов у Собора Василия Блаженного?",
    question_en: "How many domes does St. Basil's Cathedral have?",
    question_fr: "Combien de coupoles a la cathédrale Saint-Basile ?",
    options: [
      {
        text: "Девять разноцветных куполов",
        text_en: "Nine multicolored domes",
        text_fr: "Neuf coupoles multicolores",
        isCorrect: true
      },
      {
        text: "Семь разноцветных куполов",
        text_en: "Seven multicolored domes",
        text_fr: "Sept coupoles multicolores",
        isCorrect: false
      },
      {
        text: "Пять разноцветных куполов",
        text_en: "Five multicolored domes",
        text_fr: "Cinq coupoles multicolores",
        isCorrect: false
      },
      {
        text: "Одиннадцать разноцветных куполов",
        text_en: "Eleven multicolored domes",
        text_fr: "Onze coupoles multicolores",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Невероятно красивое здание с девятью разноцветными куполами больше похоже на пряничный дворец, чем на собор.'",
    explanation_en: "The text says: 'An incredibly beautiful building with nine multicolored domes looks more like a gingerbread palace than a cathedral.'",
    explanation_fr: "Le texte dit : 'Un bâtiment incroyablement beau avec neuf coupoles multicolores ressemble plus à un palais en pain d'épice qu'à une cathédrale.'"
  },
  {
    question: "Какие часы являются, вероятно, самыми известными часами России?",
    question_en: "Which clock is probably the most famous clock in Russia?",
    question_fr: "Quelle horloge est probablement la plus célèbre de Russie ?",
    options: [
      {
        text: "Часы на Спасской башне - куранты",
        text_en: "The clock on the Spasskaya Tower - the chimes",
        text_fr: "L'horloge de la tour Spasskaïa - le carillon",
        isCorrect: true
      },
      {
        text: "Часы в ГУМе",
        text_en: "The clock in GUM",
        text_fr: "L'horloge du GOUM",
        isCorrect: false
      },
      {
        text: "Часы в Кремле",
        text_en: "The clock in the Kremlin",
        text_fr: "L'horloge du Kremlin",
        isCorrect: false
      },
      {
        text: "Часы в метро",
        text_en: "The clock in the metro",
        text_fr: "L'horloge du métro",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Еще одним узнаваемым архитектурным сооружением является Спасская башня с часами – курантами. Эти часы, вероятно самые известные часы России, ведь именно по ним россияне встречают Новый Год.'",
    explanation_en: "The text states: 'Another recognizable architectural structure is the Spasskaya Tower with a clock - chimes. This clock is probably the most famous clock in Russia, because it is by them that Russians celebrate the New Year.'",
    explanation_fr: "Le texte indique : 'Une autre structure architecturale reconnaissable est la tour Spasskaïa avec son horloge - le carillon. Cette horloge est probablement la plus célèbre de Russie, car c'est elle qui marque le Nouvel An pour les Russes.'"
  },
  {
    question: "Почему россияне встречают Новый Год по курантам?",
    question_en: "Why do Russians celebrate the New Year by the chimes?",
    question_fr: "Pourquoi les Russes fêtent-ils le Nouvel An au son du carillon ?",
    options: [
      {
        text: "Потому что эти часы самые известные в России",
        text_en: "Because this clock is the most famous in Russia",
        text_fr: "Parce que cette horloge est la plus célèbre de Russie",
        isCorrect: true
      },
      {
        text: "Потому что эти часы самые точные",
        text_en: "Because this clock is the most accurate",
        text_fr: "Parce que cette horloge est la plus précise",
        isCorrect: false
      },
      {
        text: "Потому что это традиция",
        text_en: "Because it's a tradition",
        text_fr: "Parce que c'est une tradition",
        isCorrect: false
      },
      {
        text: "Потому что эти часы самые старые",
        text_en: "Because this clock is the oldest",
        text_fr: "Parce que cette horloge est la plus ancienne",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Эти часы, вероятно самые известные часы России, ведь именно по ним россияне встречают Новый Год.'",
    explanation_en: "The text says: 'This clock is probably the most famous clock in Russia, because it is by them that Russians celebrate the New Year.'",
    explanation_fr: "Le texte dit : 'Cette horloge est probablement la plus célèbre de Russie, car c'est elle qui marque le Nouvel An pour les Russes.'"
  }
];

// Exercise 58 - Material 311: Куршская коса
const exercise58Questions = [
  {
    question: "Между чем расположена Куршская коса?",
    question_en: "Between what is the Curonian Spit located?",
    question_fr: "Entre quoi se trouve la Flèche de Courlande ?",
    options: [
      {
        text: "Между солёным Балтийским морем и пресноводным Куршским заливом",
        text_en: "Between the salty Baltic Sea and the freshwater Curonian Lagoon",
        text_fr: "Entre la mer Baltique salée et le lagon de Courlande d'eau douce",
        isCorrect: true
      },
      {
        text: "Между двумя озёрами",
        text_en: "Between two lakes",
        text_fr: "Entre deux lacs",
        isCorrect: false
      },
      {
        text: "Между Чёрным и Каспийским морями",
        text_en: "Between the Black and Caspian Seas",
        text_fr: "Entre la mer Noire et la mer Caspienne",
        isCorrect: false
      },
      {
        text: "Между двумя реками",
        text_en: "Between two rivers",
        text_fr: "Entre deux rivières",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Куршская коса – это узкий и длинный песчаный полуостров саблевидной формы между солёным Балтийским морем и пресноводным Куршским заливом.'",
    explanation_en: "The text states: 'The Curonian Spit is a narrow and long sandy peninsula of saber-like shape between the salty Baltic Sea and the freshwater Curonian Lagoon.'",
    explanation_fr: "Le texte indique : 'La Flèche de Courlande est une péninsule étroite et longue de forme de sabre entre la mer Baltique salée et le lagon de Courlande d'eau douce.'"
  },
  {
    question: "Какова длина Куршской косы?",
    question_en: "What is the length of the Curonian Spit?",
    question_fr: "Quelle est la longueur de la Flèche de Courlande ?",
    options: [
      {
        text: "98 километров",
        text_en: "98 kilometers",
        text_fr: "98 kilomètres",
        isCorrect: true
      },
      {
        text: "80 километров",
        text_en: "80 kilometers",
        text_fr: "80 kilomètres",
        isCorrect: false
      },
      {
        text: "110 километров",
        text_en: "110 kilometers",
        text_fr: "110 kilomètres",
        isCorrect: false
      },
      {
        text: "75 километров",
        text_en: "75 kilometers",
        text_fr: "75 kilomètres",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Длина косы 98 километров.'",
    explanation_en: "The text says: 'The length of the spit is 98 kilometers.'",
    explanation_fr: "Le texte dit : 'La longueur de la flèche est de 98 kilomètres.'"
  },
  {
    question: "Какой высоты достигают дюны белого цвета на косе?",
    question_en: "What height do the white dunes on the spit reach?",
    question_fr: "Quelle hauteur atteignent les dunes blanches sur la flèche ?",
    options: [
      {
        text: "До 67 метров",
        text_en: "Up to 67 meters",
        text_fr: "Jusqu'à 67 mètres",
        isCorrect: true
      },
      {
        text: "До 50 метров",
        text_en: "Up to 50 meters",
        text_fr: "Jusqu'à 50 mètres",
        isCorrect: false
      },
      {
        text: "До 80 метров",
        text_en: "Up to 80 meters",
        text_fr: "Jusqu'à 80 mètres",
        isCorrect: false
      },
      {
        text: "До 40 метров",
        text_en: "Up to 40 meters",
        text_fr: "Jusqu'à 40 mètres",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Здесь можно увидеть высокие песчаные дюны белого цвета высотой до 67 метров.'",
    explanation_en: "The text states: 'Here you can see high white sand dunes up to 67 meters high.'",
    explanation_fr: "Le texte indique : 'Ici, on peut voir de hautes dunes de sable blanc atteignant jusqu'à 67 mètres.'"
  },
  {
    question: "Какая дюна является одной из самых высоких дюн в мире?",
    question_en: "Which dune is one of the highest dunes in the world?",
    question_fr: "Quelle dune est l'une des plus hautes dunes au monde ?",
    options: [
      {
        text: "Дюна Ветцекруго",
        text_en: "Dune Vetsekrugo",
        text_fr: "La dune Vetsekrugo",
        isCorrect: true
      },
      {
        text: "Дюна Байкал",
        text_en: "Dune Baikal",
        text_fr: "La dune Baïkal",
        isCorrect: false
      },
      {
        text: "Дюна Великан",
        text_en: "Dune Giant",
        text_fr: "La dune Géant",
        isCorrect: false
      },
      {
        text: "Дюна Куршская",
        text_en: "Dune Curonian",
        text_fr: "La dune de Courlande",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Дюна Ветцекруго – одна из самых высоких дюн в мире.'",
    explanation_en: "The text says: 'Dune Vetsekrugo is one of the highest dunes in the world.'",
    explanation_fr: "Le texte dit : 'La dune Vetsekrugo est l'une des plus hautes dunes au monde.'"
  },
  {
    question: "Почему Куршскую косу называют «Птичий мост»?",
    question_en: "Why is the Curonian Spit called 'Bird Bridge'?",
    question_fr: "Pourquoi la Flèche de Courlande est-elle appelée 'Pont des oiseaux' ?",
    options: [
      {
        text: "Потому что над косой каждый год пролетает до 20 миллионов птиц",
        text_en: "Because up to 20 million birds fly over the spit every year",
        text_fr: "Parce que jusqu'à 20 millions d'oiseaux survolent la flèche chaque année",
        isCorrect: true
      },
      {
        text: "Потому что на косе живёт много редких птиц",
        text_en: "Because many rare birds live on the spit",
        text_fr: "Parce que de nombreux oiseaux rares vivent sur la flèche",
        isCorrect: false
      },
      {
        text: "Потому что там есть заповедник для птиц",
        text_en: "Because there is a bird sanctuary there",
        text_fr: "Parce qu'il y a un sanctuaire d'oiseaux là-bas",
        isCorrect: false
      },
      {
        text: "Потому что люди кормят птиц",
        text_en: "Because people feed the birds",
        text_fr: "Parce que les gens nourrissent les oiseaux",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Её называют «Птичий мост», потому что каждый год над косой пролетает до 20 миллионов птиц, большая часть из которых делает здесь остановку, чтобы отдохнуть и поесть.'",
    explanation_en: "The text states: 'It is called the \"Bird Bridge\" because every year up to 20 million birds fly over the spit, most of which stop here to rest and eat.'",
    explanation_fr: "Le texte indique : 'On l'appelle le \"Pont des oiseaux\" car chaque année jusqu'à 20 millions d'oiseaux survolent la flèche, dont la plupart s'y arrêtent pour se reposer et manger.'"
  },
  {
    question: "Чем уникальна Куршская коса?",
    question_en: "What makes the Curonian Spit unique?",
    question_fr: "Qu'est-ce qui rend la Flèche de Courlande unique ?",
    options: [
      {
        text: "Тем, что на ней можно увидеть разные природные зоны",
        text_en: "The fact that you can see different natural zones on it",
        text_fr: "Le fait qu'on peut y voir différentes zones naturelles",
        isCorrect: true
      },
      {
        text: "Тем, что она самая длинная в мире",
        text_en: "The fact that it is the longest in the world",
        text_fr: "Le fait qu'elle est la plus longue au monde",
        isCorrect: false
      },
      {
        text: "Тем, что там живут редкие животные",
        text_en: "The fact that rare animals live there",
        text_fr: "Le fait que des animaux rares y vivent",
        isCorrect: false
      },
      {
        text: "Тем, что она самая старая",
        text_en: "The fact that it is the oldest",
        text_fr: "Le fait qu'elle est la plus ancienne",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Коса состоит из песка, на котором находится тонкий слой растительности, и уникальна тем, что на ней можно увидеть разные природные зоны – лес, пустыню, болота, озера и так далее.'",
    explanation_en: "The text says: 'The spit consists of sand with a thin layer of vegetation on it, and is unique in that you can see different natural zones on it - forest, desert, swamps, lakes, and so on.'",
    explanation_fr: "Le texte dit : 'La flèche se compose de sable avec une fine couche de végétation dessus, et est unique en ce qu'on peut y voir différentes zones naturelles - forêt, désert, marais, lacs, etc.'"
  }
];

// Exercise 61 - Material 312: Ростов
const exercise61Questions = [
  {
    question: "Сколько лет городу Ростов?",
    question_en: "How old is the city of Rostov?",
    question_fr: "Quel âge a la ville de Rostov ?",
    options: [
      {
        text: "Больше 1150 лет",
        text_en: "More than 1150 years",
        text_fr: "Plus de 1150 ans",
        isCorrect: true
      },
      {
        text: "Около 1000 лет",
        text_en: "About 1000 years",
        text_fr: "Environ 1000 ans",
        isCorrect: false
      },
      {
        text: "Около 900 лет",
        text_en: "About 900 years",
        text_fr: "Environ 900 ans",
        isCorrect: false
      },
      {
        text: "Около 800 лет",
        text_en: "About 800 years",
        text_fr: "Environ 800 ans",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Ростов – Один из древнейших городов России, которому уже больше 1150 лет.'",
    explanation_en: "The text states: 'Rostov is one of the oldest cities in Russia, which is already more than 1150 years old.'",
    explanation_fr: "Le texte indique : 'Rostov est l'une des plus anciennes villes de Russie, qui a déjà plus de 1150 ans.'"
  },
  {
    question: "Сколько памятников истории и культуры находится в Ростове?",
    question_en: "How many monuments of history and culture are in Rostov?",
    question_fr: "Combien de monuments d'histoire et de culture se trouvent à Rostov ?",
    options: [
      {
        text: "326 памятников",
        text_en: "326 monuments",
        text_fr: "326 monuments",
        isCorrect: true
      },
      {
        text: "200 памятников",
        text_en: "200 monuments",
        text_fr: "200 monuments",
        isCorrect: false
      },
      {
        text: "400 памятников",
        text_en: "400 monuments",
        text_fr: "400 monuments",
        isCorrect: false
      },
      {
        text: "150 памятников",
        text_en: "150 monuments",
        text_fr: "150 monuments",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'Не смотря на то, что город небольшой (около 30 тысяч жителей), на его территории находится 326 памятников истории и культуры.'",
    explanation_en: "The text says: 'Despite the fact that the city is small (about 30 thousand inhabitants), on its territory there are 326 monuments of history and culture.'",
    explanation_fr: "Le texte dit : 'Malgré le fait que la ville est petite (environ 30 mille habitants), sur son territoire se trouvent 326 monuments d'histoire et de culture.'"
  },
  {
    question: "Какому персонажу посвящён необычный музей в Ростове?",
    question_en: "To which character is the unusual museum in Rostov dedicated?",
    question_fr: "À quel personnage est consacré le musée inhabituel de Rostov ?",
    options: [
      {
        text: "Царевне-лягушке",
        text_en: "The Frog Princess",
        text_fr: "La princesse grenouille",
        isCorrect: true
      },
      {
        text: "Бабе Яге",
        text_en: "Baba Yaga",
        text_fr: "Baba Yaga",
        isCorrect: false
      },
      {
        text: "Змею Горынычу",
        text_en: "Zmey Gorynych",
        text_fr: "Zmey Gorynych",
        isCorrect: false
      },
      {
        text: "Ивану-царевичу",
        text_en: "Ivan Tsarevich",
        text_fr: "Ivan Tsarévitch",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'В Ростове находится необычный музей, посвященный сказочному персонажу – царевне-лягушке.'",
    explanation_en: "The text states: 'In Rostov there is an unusual museum dedicated to a fairy tale character - the Frog Princess.'",
    explanation_fr: "Le texte indique : 'À Rostov, il y a un musée inhabituel consacré à un personnage de conte de fées - la princesse grenouille.'"
  },
  {
    question: "Из какого материала в Ростове изготавливают посуду и сувениры?",
    question_en: "From what material are dishes and souvenirs made in Rostov?",
    question_fr: "De quel matériau sont fabriqués les plats et les souvenirs à Rostov ?",
    options: [
      {
        text: "Из особенной чёрной глины",
        text_en: "From special black clay",
        text_fr: "D'une argile noire spéciale",
        isCorrect: true
      },
      {
        text: "Из дерева",
        text_en: "From wood",
        text_fr: "Du bois",
        isCorrect: false
      },
      {
        text: "Из серебра",
        text_en: "From silver",
        text_fr: "De l'argent",
        isCorrect: false
      },
      {
        text: "Из красной глины",
        text_en: "From red clay",
        text_fr: "D'une argile rouge",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'В XVI Веке в Ростове начали изготавливать посуду и сувениры из особенной чёрной глины и продолжают это делать и в наше время.'",
    explanation_en: "The text says: 'In the 16th century, in Rostov they began to make dishes and souvenirs from special black clay and continue to do so in our time.'",
    explanation_fr: "Le texte dit : 'Au XVIe siècle, à Rostov, on a commencé à fabriquer des plats et des souvenirs à partir d'une argile noire spéciale et on continue à le faire de nos jours.'"
  },
  {
    question: "Что такое финифть?",
    question_en: "What is finift?",
    question_fr: "Qu'est-ce que la finift ?",
    options: [
      {
        text: "Художественные произведения из разноцветной эмали на металлической основе",
        text_en: "Artistic works of multicolored enamel on a metal base",
        text_fr: "Des œuvres artistiques en émail multicolore sur une base métallique",
        isCorrect: true
      },
      {
        text: "Деревянная резьба",
        text_en: "Wood carving",
        text_fr: "Sculpture sur bois",
        isCorrect: false
      },
      {
        text: "Керамическая посуда",
        text_en: "Ceramic dishes",
        text_fr: "De la vaisselle en céramique",
        isCorrect: false
      },
      {
        text: "Ювелирные украшения из золота",
        text_en: "Gold jewelry",
        text_fr: "Des bijoux en or",
        isCorrect: false
      }
    ],
    explanation: "В тексте написано: 'Также здесь изготавливают финифть – художественные произведения из разноцветной эмали на металлической основе.'",
    explanation_en: "The text states: 'Also here they make finift - artistic works of multicolored enamel on a metal base.'",
    explanation_fr: "Le texte indique : 'On y fabrique également la finift - des œuvres artistiques en émail multicolore sur une base métallique.'"
  },
  {
    question: "Какие известные фильмы были сняты в Ростове?",
    question_en: "What famous films were shot in Rostov?",
    question_fr: "Quels films célèbres ont été tournés à Rostov ?",
    options: [
      {
        text: "«Иван Васильевич меняет профессию» и «Невероятные приключения итальянцев в России»",
        text_en: "\"Ivan Vasilievich Changes Profession\" and \"The Incredible Adventures of Italians in Russia\"",
        text_fr: "« Ivan Vassilievitch change de profession » et « Les Incroyables Aventures des Italiens en Russie »",
        isCorrect: true
      },
      {
        text: "«Москва слезам не верит» и «Брат»",
        text_en: "\"Moscow Does Not Believe in Tears\" and \"Brother\"",
        text_fr: "« Moscou ne croit pas aux larmes » et « Frère »",
        isCorrect: false
      },
      {
        text: "«Война и мир» и «Анна Каренина»",
        text_en: "\"War and Peace\" and \"Anna Karenina\"",
        text_fr: "« Guerre et Paix » et « Anna Karénine »",
        isCorrect: false
      },
      {
        text: "«Операция Ы» и «Кавказская пленница»",
        text_en: "\"Operation Y\" and \"Kidnapping, Caucasian Style\"",
        text_fr: "« Opération Y » et « Prisonnier du Caucase »",
        isCorrect: false
      }
    ],
    explanation: "В тексте сказано: 'В нём было снято много фильмов и сериалов, например, известные комедии «Иван Васильевич меняет профессию» и «Невероятные приключения итальянцев в России».'",
    explanation_en: "The text says: 'Many films and series were shot in it, for example, the famous comedies \"Ivan Vasilievich Changes Profession\" and \"The Incredible Adventures of Italians in Russia\".'",
    explanation_fr: "Le texte dit : 'De nombreux films et séries y ont été tournés, par exemple, les célèbres comédies « Ivan Vassilievitch change de profession » et « Les Incroyables Aventures des Italiens en Russie ».'"
  }
];

// Exercise 64 - Material 479: Le Mont-Saint-Michel
const exercise64Questions = [
  {
    question: "Où se trouve le Mont-Saint-Michel ?",
    question_en: "Where is Mont-Saint-Michel located?",
    question_ru: "Где находится Мон-Сен-Мишель?",
    options: [
      {
        text: "En Normandie, au nord-ouest de la France",
        text_en: "In Normandy, in northwestern France",
        text_ru: "В Нормандии, на северо-западе Франции",
        isCorrect: true
      },
      {
        text: "En Bretagne, à l'ouest de la France",
        text_en: "In Brittany, in western France",
        text_ru: "В Бретани, на западе Франции",
        isCorrect: false
      },
      {
        text: "En Provence, au sud de la France",
        text_en: "In Provence, in southern France",
        text_ru: "В Провансе, на юге Франции",
        isCorrect: false
      },
      {
        text: "En Île-de-France, au centre de la France",
        text_en: "In Île-de-France, in central France",
        text_ru: "В Иль-де-Франс, в центре Франции",
        isCorrect: false
      }
    ],
    explanation: "Le texte indique : 'Le Mont-Saint-Michel est une commune française située en Normandie, au nord-ouest de la France.'",
    explanation_en: "The text states: 'Mont-Saint-Michel is a French commune located in Normandy, in northwestern France.'",
    explanation_ru: "В тексте сказано: 'Мон-Сен-Мишель – это французская коммуна, расположенная в Нормандии, на северо-западе Франции.'"
  },
  {
    question: "Combien d'habitants vivent dans cette commune ?",
    question_en: "How many inhabitants live in this commune?",
    question_ru: "Сколько жителей живет в этой коммуне?",
    options: [
      {
        text: "Seulement 36 habitants",
        text_en: "Only 36 inhabitants",
        text_ru: "Всего 36 жителей",
        isCorrect: true
      },
      {
        text: "Environ 100 habitants",
        text_en: "About 100 inhabitants",
        text_ru: "Около 100 жителей",
        isCorrect: false
      },
      {
        text: "Environ 200 habitants",
        text_en: "About 200 inhabitants",
        text_ru: "Около 200 жителей",
        isCorrect: false
      },
      {
        text: "Environ 50 habitants",
        text_en: "About 50 inhabitants",
        text_ru: "Около 50 жителей",
        isCorrect: false
      }
    ],
    explanation: "Le texte dit : 'Bien que seulement 36 habitants vivent dans cette commune, plus de deux millions de visiteurs s'y rendent chaque année.'",
    explanation_en: "The text says: 'Although only 36 inhabitants live in this commune, more than two million visitors go there every year.'",
    explanation_ru: "В тексте говорится: 'Хотя в этой коммуне проживает всего 36 жителей, более двух миллионов посетителей приезжают туда каждый год.'"
  },
  {
    question: "Quand l'abbaye a-t-elle été construite ?",
    question_en: "When was the abbey built?",
    question_ru: "Когда было построено аббатство?",
    options: [
      {
        text: "En 709",
        text_en: "In 709",
        text_ru: "В 709 году",
        isCorrect: true
      },
      {
        text: "En 609",
        text_en: "In 609",
        text_ru: "В 609 году",
        isCorrect: false
      },
      {
        text: "En 809",
        text_en: "In 809",
        text_ru: "В 809 году",
        isCorrect: false
      },
      {
        text: "En 1009",
        text_en: "In 1009",
        text_ru: "В 1009 году",
        isCorrect: false
      }
    ],
    explanation: "Le texte indique : 'Le Mont-Saint-Michel est en fait un îlot sur lequel une abbaye fut construite en 709.'",
    explanation_en: "The text states: 'Mont-Saint-Michel is actually an islet on which an abbey was built in 709.'",
    explanation_ru: "В тексте сказано: 'Мон-Сен-Мишель – это на самом деле островок, на котором аббатство было построено в 709 году.'"
  },
  {
    question: "Que se passait-il en période de grandes marées ?",
    question_en: "What happened during high tides?",
    question_ru: "Что происходило во время сильных приливов?",
    options: [
      {
        text: "Le Mont se retrouvait coupé du monde",
        text_en: "The Mont was cut off from the world",
        text_ru: "Мон оказывался отрезанным от мира",
        isCorrect: true
      },
      {
        text: "Le Mont était plus facile d'accès",
        text_en: "The Mont was easier to access",
        text_fr: "Le Mont était plus facile d'accès",
        text_ru: "До Мона было легче добраться",
        isCorrect: false
      },
      {
        text: "L'abbaye était fermée aux visiteurs",
        text_en: "The abbey was closed to visitors",
        text_ru: "Аббатство было закрыто для посетителей",
        isCorrect: false
      },
      {
        text: "Les habitants devaient évacuer",
        text_en: "The inhabitants had to evacuate",
        text_ru: "Жители должны были эвакуироваться",
        isCorrect: false
      }
    ],
    explanation: "Le texte dit : 'En effet, en période de grandes marées, le Mont se retrouvait coupé du monde. Il fallait alors attendre la fin de la marée ou utiliser un bateau pour pouvoir le rejoindre.'",
    explanation_en: "The text says: 'Indeed, during high tides, the Mont was cut off from the world. It was then necessary to wait for the end of the tide or use a boat to reach it.'",
    explanation_ru: "В тексте говорится: 'Действительно, во время сильных приливов Мон оказывался отрезанным от мира. Тогда приходилось ждать окончания прилива или использовать лодку, чтобы добраться до него.'"
  },
  {
    question: "Qu'est-ce qui a été récemment construit pour relier l'îlot à la terre ?",
    question_en: "What was recently built to connect the islet to the land?",
    question_ru: "Что было недавно построено, чтобы соединить островок с землей?",
    options: [
      {
        text: "Un pont",
        text_en: "A bridge",
        text_ru: "Мост",
        isCorrect: true
      },
      {
        text: "Un tunnel",
        text_en: "A tunnel",
        text_ru: "Тоннель",
        isCorrect: false
      },
      {
        text: "Une route sur l'eau",
        text_en: "A road on water",
        text_ru: "Дорога по воде",
        isCorrect: false
      },
      {
        text: "Un téléphérique",
        text_en: "A cable car",
        text_ru: "Канатная дорога",
        isCorrect: false
      }
    ],
    explanation: "Le texte indique : 'Récemment un pont a été construit, qui permet de relier l'îlot à la terre.'",
    explanation_en: "The text states: 'Recently a bridge was built, which allows connecting the islet to the land.'",
    explanation_ru: "В тексте сказано: 'Недавно был построен мост, который позволяет соединить островок с землей.'"
  },
  {
    question: "Comment Victor Hugo appelait-il le Mont-Saint-Michel ?",
    question_en: "What did Victor Hugo call Mont-Saint-Michel?",
    question_ru: "Как Виктор Гюго называл Мон-Сен-Мишель?",
    options: [
      {
        text: "La Merveille",
        text_en: "The Marvel",
        text_ru: "Чудо",
        isCorrect: true
      },
      {
        text: "La Beauté",
        text_en: "The Beauty",
        text_ru: "Красота",
        isCorrect: false
      },
      {
        text: "Le Trésor",
        text_en: "The Treasure",
        text_ru: "Сокровище",
        isCorrect: false
      },
      {
        text: "Le Joyau",
        text_en: "The Jewel",
        text_ru: "Драгоценность",
        isCorrect: false
      }
    ],
    explanation: "Le texte dit : 'Vous pourrez profiter de cet endroit que l'on surnomme la Merveille et dont Victor Hugo disait : \"Le Mont-Saint-Michel est pour la France ce que la Grande Pyramide est pour l'Égypte\".'",
    explanation_en: "The text says: 'You can enjoy this place that is nicknamed the Marvel and of which Victor Hugo said: \"Mont-Saint-Michel is to France what the Great Pyramid is to Egypt\".'",
    explanation_ru: "В тексте говорится: 'Вы сможете насладиться этим местом, которое прозвали Чудом и о котором Виктор Гюго сказал: \"Мон-Сен-Мишель для Франции то же, что Великая пирамида для Египта\".'"
  }
];

// Map exercises to their questions
const exerciseUpdates = [
  { id: 25, materialId: 114, name: 'Озеро Байкал', questions: exercise25Questions },
  { id: 28, materialId: 115, name: 'Долина Гейзеров', questions: exercise28Questions },
  { id: 31, materialId: 120, name: 'Столбы выветривания', questions: exercise31Questions },
  { id: 12, materialId: 121, name: 'Эльбрус', questions: exercise12Questions },
  { id: 37, materialId: 155, name: 'Ленские столбы', questions: exercise37Questions },
  { id: 49, materialId: 168, name: 'Плато Укок', questions: exercise49Questions },
  { id: 52, materialId: 169, name: 'Красная площадь', questions: exercise52Questions },
  { id: 58, materialId: 311, name: 'Куршская коса', questions: exercise58Questions },
  { id: 61, materialId: 312, name: 'Ростов', questions: exercise61Questions },
  { id: 64, materialId: 479, name: 'Le Mont-Saint-Michel', questions: exercise64Questions }
];

async function updateExercises() {
  console.log('Starting to update exercises...\n');

  for (const exercise of exerciseUpdates) {
    try {
      console.log(`Updating Exercise ${exercise.id} (${exercise.name})...`);

      // Fetch the current exercise
      const { data: currentExercise, error: fetchError } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exercise.id)
        .single();

      if (fetchError) {
        console.error(`Error fetching exercise ${exercise.id}:`, fetchError);
        continue;
      }

      // Update the questions in the data field
      const updatedData = {
        ...currentExercise.data,
        questions: exercise.questions
      };

      // Update the exercise
      const { error: updateError } = await supabase
        .from('exercises')
        .update({ data: updatedData })
        .eq('id', exercise.id);

      if (updateError) {
        console.error(`Error updating exercise ${exercise.id}:`, updateError);
      } else {
        console.log(`✓ Successfully updated Exercise ${exercise.id} (${exercise.name}) with ${exercise.questions.length} questions`);
      }
    } catch (error) {
      console.error(`Error processing exercise ${exercise.id}:`, error);
    }
  }

  console.log('\n=== Update Complete ===');
  console.log(`Total exercises updated: ${exerciseUpdates.length}`);
}

// Run the update
updateExercises()
  .then(() => {
    console.log('\nAll updates completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
