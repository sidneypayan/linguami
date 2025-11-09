/**
 * Script pour créer 3 exercices par matériau de la section beautiful-places (russe)
 * - Exercice 1: Compréhension écrite (MCQ)
 * - Exercice 2: Compréhension orale (FITB)
 * - Exercice 3: Exercice de vocabulaire (Drag and Drop)
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Données des exercices pour chaque matériau
const exercisesData = {
  112: { // Республика Алтай
    reading: {
      fr: {
        title: "Compréhension écrite",
        questions: [
          {
            question: "Quel type de territoire est la République de l'Altaï ?",
            options: ["Un territoire plat", "Un territoire montagneux", "Un territoire côtier"],
            correctAnswer: 1
          },
          {
            question: "Comment est l'été dans l'Altaï ?",
            options: ["Court et chaud", "Long et frais", "Doux et pluvieux"],
            correctAnswer: 0
          },
          {
            question: "Qu'est-ce qui rend l'Altaï célèbre ?",
            options: ["Ses villes", "Sa nature et ses montagnes", "Ses plages"],
            correctAnswer: 1
          }
        ]
      },
      en: {
        title: "Reading comprehension",
        questions: [
          {
            question: "What type of territory is the Altai Republic?",
            options: ["A flat territory", "A mountainous territory", "A coastal territory"],
            correctAnswer: 1
          },
          {
            question: "How is summer in the Altai?",
            options: ["Short and hot", "Long and cool", "Mild and rainy"],
            correctAnswer: 0
          },
          {
            question: "What makes the Altai famous?",
            options: ["Its cities", "Its nature and mountains", "Its beaches"],
            correctAnswer: 1
          }
        ]
      },
      ru: {
        title: "Понимание текста",
        questions: [
          {
            question: "Какой тип территории представляет собой Республика Алтай?",
            options: ["Плоская территория", "Гористая территория", "Прибрежная территория"],
            correctAnswer: 1
          },
          {
            question: "Какое лето на Алтае?",
            options: ["Короткое и жаркое", "Длинное и прохладное", "Мягкое и дождливое"],
            correctAnswer: 0
          },
          {
            question: "Чем знаменит Алтай?",
            options: ["Своими городами", "Своей природой и горами", "Своими пляжами"],
            correctAnswer: 1
          }
        ]
      }
    },
    listening: {
      fr: {
        title: "Compréhension orale",
        sentences: [
          "Это ___ территория.",
          "Лето здесь очень короткое и ___.",
          "Природа этого края ___."
        ],
        answers: ["гористая", "жаркое", "завораживает"]
      },
      en: {
        title: "Listening comprehension",
        sentences: [
          "This is a ___ territory.",
          "Summer here is very short and ___.",
          "The nature of this region is ___."
        ],
        answers: ["mountainous", "hot", "fascinating"]
      },
      ru: {
        title: "Понимание на слух",
        sentences: [
          "Это ___ территория.",
          "Лето здесь очень короткое и ___.",
          "Природа этого края ___."
        ],
        answers: ["гористая", "жаркое", "завораживает"]
      }
    },
    vocabulary: {
      fr: {
        title: "Exercice de vocabulaire",
        pairs: [
          { ru: "республика", translation: "république" },
          { ru: "хребет", translation: "chaîne de montagnes" },
          { ru: "долина", translation: "vallée" },
          { ru: "лето", translation: "été" },
          { ru: "природа", translation: "nature" },
          { ru: "пещера", translation: "grotte" }
        ]
      },
      en: {
        title: "Vocabulary exercise",
        pairs: [
          { ru: "республика", translation: "republic" },
          { ru: "хребет", translation: "mountain range" },
          { ru: "долина", translation: "valley" },
          { ru: "лето", translation: "summer" },
          { ru: "природа", translation: "nature" },
          { ru: "пещера", translation: "cave" }
        ]
      },
      ru: {
        title: "Упражнение на лексику",
        pairs: [
          { ru: "республика", translation: "republic (en)" },
          { ru: "хребет", translation: "mountain range (en)" },
          { ru: "долина", translation: "valley (en)" },
          { ru: "лето", translation: "summer (en)" },
          { ru: "природа", translation: "nature (en)" },
          { ru: "пещера", translation: "cave (en)" }
        ]
      }
    }
  },
  114: { // Озеро Байкал
    reading: {
      fr: {
        title: "Compréhension écrite",
        questions: [
          {
            question: "Où se trouve le lac Baïkal ?",
            options: ["Dans le nord de la Russie", "En Sibérie orientale", "Dans l'Oural"],
            correctAnswer: 1
          },
          {
            question: "Quelle est la particularité du Baïkal ?",
            options: ["C'est le lac le plus profond avec de l'eau douce", "C'est le lac le plus grand", "C'est le lac le plus salé"],
            correctAnswer: 0
          },
          {
            question: "Comment les habitants locaux appellent-ils le Baïkal ?",
            options: ["L'océan", "La mer", "Le fleuve"],
            correctAnswer: 1
          }
        ]
      },
      en: {
        title: "Reading comprehension",
        questions: [
          {
            question: "Where is Lake Baikal located?",
            options: ["In northern Russia", "In Eastern Siberia", "In the Urals"],
            correctAnswer: 1
          },
          {
            question: "What is special about Baikal?",
            options: ["It's the deepest freshwater lake", "It's the largest lake", "It's the saltiest lake"],
            correctAnswer: 0
          },
          {
            question: "What do local residents call Baikal?",
            options: ["The ocean", "The sea", "The river"],
            correctAnswer: 1
          }
        ]
      },
      ru: {
        title: "Понимание текста",
        questions: [
          {
            question: "Где находится озеро Байкал?",
            options: ["На севере России", "В Восточной Сибири", "На Урале"],
            correctAnswer: 1
          },
          {
            question: "В чем особенность Байкала?",
            options: ["Это самое глубокое озеро с пресной водой", "Это самое большое озеро", "Это самое соленое озеро"],
            correctAnswer: 0
          },
          {
            question: "Как местные жители называют Байкал?",
            options: ["Океаном", "Морем", "Рекой"],
            correctAnswer: 1
          }
        ]
      }
    },
    listening: {
      fr: {
        title: "Compréhension orale",
        sentences: [
          "Байкал – самое ___ озеро на планете.",
          "Местные жители традиционно называют Байкал ___.",
          "Волны на озере достигают 4-5 ___ в высоту."
        ],
        answers: ["глубокое", "морем", "метров"]
      },
      en: {
        title: "Listening comprehension",
        sentences: [
          "Baikal is the ___ lake on the planet.",
          "Local residents traditionally call Baikal a ___.",
          "Waves on the lake reach 4-5 ___ in height."
        ],
        answers: ["deepest", "sea", "meters"]
      },
      ru: {
        title: "Понимание на слух",
        sentences: [
          "Байкал – самое ___ озеро на планете.",
          "Местные жители традиционно называют Байкал ___.",
          "Волны на озере достигают 4-5 ___ в высоту."
        ],
        answers: ["глубокое", "морем", "метров"]
      }
    },
    vocabulary: {
      fr: {
        title: "Exercice de vocabulaire",
        pairs: [
          { ru: "озеро", translation: "lac" },
          { ru: "глубокий", translation: "profond" },
          { ru: "пресная вода", translation: "eau douce" },
          { ru: "флора", translation: "flore" },
          { ru: "фауна", translation: "faune" },
          { ru: "шторм", translation: "tempête" }
        ]
      },
      en: {
        title: "Vocabulary exercise",
        pairs: [
          { ru: "озеро", translation: "lake" },
          { ru: "глубокий", translation: "deep" },
          { ru: "пресная вода", translation: "fresh water" },
          { ru: "флора", translation: "flora" },
          { ru: "фауна", translation: "fauna" },
          { ru: "шторм", translation: "storm" }
        ]
      },
      ru: {
        title: "Упражнение на лексику",
        pairs: [
          { ru: "озеро", translation: "lake (en)" },
          { ru: "глубокий", translation: "deep (en)" },
          { ru: "пресная вода", translation: "fresh water (en)" },
          { ru: "флора", translation: "flora (en)" },
          { ru: "фауна", translation: "fauna (en)" },
          { ru: "шторм", translation: "storm (en)" }
        ]
      }
    }
  },
  115: { // Долина Гейзеров
    reading: {
      fr: {
        title: "Compréhension écrite",
        questions: [
          {
            question: "Où se trouve la Vallée des Geysers ?",
            options: ["Au Kamtchatka", "En Sibérie", "Dans l'Altaï"],
            correctAnswer: 0
          },
          {
            question: "Quand la Vallée des Geysers a-t-elle été découverte ?",
            options: ["En 1931", "En 1941", "En 1951"],
            correctAnswer: 1
          },
          {
            question: "Comment s'appelle le geyser le plus grand et le plus puissant ?",
            options: ["Le Grand", "Le Géant", "Le Puissant"],
            correctAnswer: 1
          }
        ]
      },
      en: {
        title: "Reading comprehension",
        questions: [
          {
            question: "Where is the Valley of Geysers located?",
            options: ["In Kamchatka", "In Siberia", "In the Altai"],
            correctAnswer: 0
          },
          {
            question: "When was the Valley of Geysers discovered?",
            options: ["In 1931", "In 1941", "In 1951"],
            correctAnswer: 1
          },
          {
            question: "What is the name of the largest and most powerful geyser?",
            options: ["The Great", "The Giant", "The Powerful"],
            correctAnswer: 1
          }
        ]
      },
      ru: {
        title: "Понимание текста",
        questions: [
          {
            question: "Где находится Долина Гейзеров?",
            options: ["На Камчатке", "В Сибири", "На Алтае"],
            correctAnswer: 0
          },
          {
            question: "Когда была открыта Долина Гейзеров?",
            options: ["В 1931 году", "В 1941 году", "В 1951 году"],
            correctAnswer: 1
          },
          {
            question: "Как называется самый большой и сильный гейзер?",
            options: ["Большой", "Великан", "Мощный"],
            correctAnswer: 1
          }
        ]
      }
    },
    listening: {
      fr: {
        title: "Compréhension orale",
        sentences: [
          "Долина Гейзеров была открыта в ___ году.",
          "Это единственное гейзерное поле в ___.",
          "Фонтан самого большого гейзера достигает в высоту ___ метров."
        ],
        answers: ["1941", "Евразии", "30"]
      },
      en: {
        title: "Listening comprehension",
        sentences: [
          "The Valley of Geysers was discovered in ___.",
          "This is the only geyser field in ___.",
          "The fountain of the largest geyser reaches a height of ___ meters."
        ],
        answers: ["1941", "Eurasia", "30"]
      },
      ru: {
        title: "Понимание на слух",
        sentences: [
          "Долина Гейзеров была открыта в ___ году.",
          "Это единственное гейзерное поле в ___.",
          "Фонтан самого большого гейзера достигает в высоту ___ метров."
        ],
        answers: ["1941", "Евразии", "30"]
      }
    },
    vocabulary: {
      fr: {
        title: "Exercice de vocabulaire",
        pairs: [
          { ru: "долина", translation: "vallée" },
          { ru: "гейзер", translation: "geyser" },
          { ru: "источник", translation: "source" },
          { ru: "водопад", translation: "cascade" },
          { ru: "кипящий", translation: "bouillant" },
          { ru: "фонтан", translation: "fontaine" }
        ]
      },
      en: {
        title: "Vocabulary exercise",
        pairs: [
          { ru: "долина", translation: "valley" },
          { ru: "гейзер", translation: "geyser" },
          { ru: "источник", translation: "spring" },
          { ru: "водопад", translation: "waterfall" },
          { ru: "кипящий", translation: "boiling" },
          { ru: "фонтан", translation: "fountain" }
        ]
      },
      ru: {
        title: "Упражнение на лексику",
        pairs: [
          { ru: "долина", translation: "valley (en)" },
          { ru: "гейзер", translation: "geyser (en)" },
          { ru: "источник", translation: "spring (en)" },
          { ru: "водопад", translation: "waterfall (en)" },
          { ru: "кипящий", translation: "boiling (en)" },
          { ru: "фонтан", translation: "fountain (en)" }
        ]
      }
    }
  }
}

async function main() {
  console.log('🚀 Début de la création des exercices pour beautiful-places...\n')

  // Récupérer les matériaux de la section beautiful-places (russe)
  const { data: materials, error: materialsError } = await supabase
    .from('materials')
    .select('id, title, section, lang')
    .eq('section', 'beautiful-places')
    .eq('lang', 'ru')
    .order('id')

  if (materialsError) {
    console.error('❌ Erreur lors de la récupération des matériaux:', materialsError)
    return
  }

  console.log(`📚 ${materials.length} matériaux trouvés`)
  console.log(`📝 ${Object.keys(exercisesData).length} matériaux avec exercices définis\n`)

  // Pour chaque matériau avec des exercices définis
  for (const material of materials) {
    const exercises = exercisesData[material.id]

    if (!exercises) {
      console.log(`⚠️  Pas d'exercices définis pour: ${material.title} (ID: ${material.id})`)
      continue
    }

    console.log(`\n📖 Création des exercices pour: ${material.title} (ID: ${material.id})`)

    // Exercice 1: Compréhension écrite (MCQ)
    console.log('  📝 Exercice 1: Compréhension écrite (MCQ)...')
    const { error: err1 } = await supabase
      .from('exercises')
      .insert({
        material_id: material.id,
        exercise_type: 'mcq',
        title_fr: exercises.reading.fr.title,
        title_en: exercises.reading.en.title,
        title_ru: exercises.reading.ru.title,
        body: {
          fr: { questions: exercises.reading.fr.questions },
          en: { questions: exercises.reading.en.questions },
          ru: { questions: exercises.reading.ru.questions }
        },
        order_index: 1
      })

    if (err1) {
      console.error('    ❌ Erreur:', err1.message)
    } else {
      console.log('    ✅ Créé')
    }

    // Exercice 2: Compréhension orale (FITB)
    console.log('  🎧 Exercice 2: Compréhension orale (FITB)...')
    const { error: err2 } = await supabase
      .from('exercises')
      .insert({
        material_id: material.id,
        exercise_type: 'fitb',
        title_fr: exercises.listening.fr.title,
        title_en: exercises.listening.en.title,
        title_ru: exercises.listening.ru.title,
        body: {
          fr: {
            sentences: exercises.listening.fr.sentences,
            answers: exercises.listening.fr.answers
          },
          en: {
            sentences: exercises.listening.en.sentences,
            answers: exercises.listening.en.answers
          },
          ru: {
            sentences: exercises.listening.ru.sentences,
            answers: exercises.listening.ru.answers
          }
        },
        order_index: 2
      })

    if (err2) {
      console.error('    ❌ Erreur:', err2.message)
    } else {
      console.log('    ✅ Créé')
    }

    // Exercice 3: Vocabulaire (Drag and Drop)
    console.log('  📚 Exercice 3: Vocabulaire (Drag & Drop)...')
    const { error: err3 } = await supabase
      .from('exercises')
      .insert({
        material_id: material.id,
        exercise_type: 'drag_drop',
        title_fr: exercises.vocabulary.fr.title,
        title_en: exercises.vocabulary.en.title,
        title_ru: exercises.vocabulary.ru.title,
        body: {
          fr: { pairs: exercises.vocabulary.fr.pairs },
          en: { pairs: exercises.vocabulary.en.pairs },
          ru: { pairs: exercises.vocabulary.ru.pairs }
        },
        order_index: 3
      })

    if (err3) {
      console.error('    ❌ Erreur:', err3.message)
    } else {
      console.log('    ✅ Créé')
    }
  }

  console.log('\n\n✅ Terminé ! Exercices créés pour 3 matériaux.')
  console.log('ℹ️  Note: Les exercices pour les autres matériaux peuvent être ajoutés en suivant le même modèle.')
}

main()
