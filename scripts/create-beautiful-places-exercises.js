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

// Fonction pour créer l'exercice MCQ (Compréhension écrite)
function createReadingComprehensionExercise(material) {
  const exercises = {
    331: { // Байкал
      fr: {
        title: "Compréhension écrite",
        questions: [
          {
            question: "Où se trouve le lac Baïkal ?",
            options: ["En Sibérie", "En Ukraine", "Au Kazakhstan"],
            correctAnswer: 0
          },
          {
            question: "Quelle est la particularité du Baïkal concernant l'eau douce ?",
            options: ["Il contient 10% de l'eau douce mondiale", "Il contient 20% de l'eau douce mondiale", "Il contient 50% de l'eau douce mondiale"],
            correctAnswer: 1
          },
          {
            question: "Quel âge a le lac Baïkal ?",
            options: ["5 millions d'années", "15 millions d'années", "25 millions d'années"],
            correctAnswer: 2
          }
        ]
      },
      en: {
        title: "Reading comprehension",
        questions: [
          {
            question: "Where is Lake Baikal located?",
            options: ["In Siberia", "In Ukraine", "In Kazakhstan"],
            correctAnswer: 0
          },
          {
            question: "What is unique about Baikal regarding freshwater?",
            options: ["It contains 10% of the world's freshwater", "It contains 20% of the world's freshwater", "It contains 50% of the world's freshwater"],
            correctAnswer: 1
          },
          {
            question: "How old is Lake Baikal?",
            options: ["5 million years", "15 million years", "25 million years"],
            correctAnswer: 2
          }
        ]
      },
      ru: {
        title: "Понимание текста",
        questions: [
          {
            question: "Где находится озеро Байкал?",
            options: ["В Сибири", "В Украине", "В Казахстане"],
            correctAnswer: 0
          },
          {
            question: "Какая особенность Байкала касательно пресной воды?",
            options: ["Содержит 10% мировых запасов пресной воды", "Содержит 20% мировых запасов пресной воды", "Содержит 50% мировых запасов пресной воды"],
            correctAnswer: 1
          },
          {
            question: "Сколько лет озеру Байкал?",
            options: ["5 миллионов лет", "15 миллионов лет", "25 миллионов лет"],
            correctAnswer: 2
          }
        ]
      }
    },
    332: { // Камчатка
      fr: {
        title: "Compréhension écrite",
        questions: [
          {
            question: "Combien de volcans compte la péninsule du Kamchatka ?",
            options: ["Plus de 100", "Plus de 200", "Plus de 300"],
            correctAnswer: 2
          },
          {
            question: "Combien de volcans du Kamchatka sont actifs ?",
            options: ["19", "29", "39"],
            correctAnswer: 1
          },
          {
            question: "Qu'est-ce qui est typique du Kamchatka ?",
            options: ["Les geysers", "Les déserts", "Les forêts tropicales"],
            correctAnswer: 0
          }
        ]
      },
      en: {
        title: "Reading comprehension",
        questions: [
          {
            question: "How many volcanoes does the Kamchatka Peninsula have?",
            options: ["More than 100", "More than 200", "More than 300"],
            correctAnswer: 2
          },
          {
            question: "How many volcanoes in Kamchatka are active?",
            options: ["19", "29", "39"],
            correctAnswer: 1
          },
          {
            question: "What is typical of Kamchatka?",
            options: ["Geysers", "Deserts", "Tropical forests"],
            correctAnswer: 0
          }
        ]
      },
      ru: {
        title: "Понимание текста",
        questions: [
          {
            question: "Сколько вулканов на полуострове Камчатка?",
            options: ["Более 100", "Более 200", "Более 300"],
            correctAnswer: 2
          },
          {
            question: "Сколько вулканов Камчатки активны?",
            options: ["19", "29", "39"],
            correctAnswer: 1
          },
          {
            question: "Что типично для Камчатки?",
            options: ["Гейзеры", "Пустыни", "Тропические леса"],
            correctAnswer: 0
          }
        ]
      }
    },
    333: { // Эльбрус
      fr: {
        title: "Compréhension écrite",
        questions: [
          {
            question: "Où se trouve le mont Elbrouz ?",
            options: ["Dans le Caucase", "En Sibérie", "En Oural"],
            correctAnswer: 0
          },
          {
            question: "Quelle est l'altitude de l'Elbrouz ?",
            options: ["4642 mètres", "5642 mètres", "6642 mètres"],
            correctAnswer: 1
          },
          {
            question: "Quel est le statut de l'Elbrouz ?",
            options: ["Plus haute montagne de Russie", "Plus haute montagne d'Europe", "Les deux"],
            correctAnswer: 2
          }
        ]
      },
      en: {
        title: "Reading comprehension",
        questions: [
          {
            question: "Where is Mount Elbrus located?",
            options: ["In the Caucasus", "In Siberia", "In the Urals"],
            correctAnswer: 0
          },
          {
            question: "What is the altitude of Elbrus?",
            options: ["4642 meters", "5642 meters", "6642 meters"],
            correctAnswer: 1
          },
          {
            question: "What is the status of Elbrus?",
            options: ["Highest mountain in Russia", "Highest mountain in Europe", "Both"],
            correctAnswer: 2
          }
        ]
      },
      ru: {
        title: "Понимание текста",
        questions: [
          {
            question: "Где находится гора Эльбрус?",
            options: ["На Кавказе", "В Сибири", "На Урале"],
            correctAnswer: 0
          },
          {
            question: "Какая высота Эльбруса?",
            options: ["4642 метра", "5642 метра", "6642 метра"],
            correctAnswer: 1
          },
          {
            question: "Каков статус Эльбруса?",
            options: ["Самая высокая гора России", "Самая высокая гора Европы", "Оба варианта"],
            correctAnswer: 2
          }
        ]
      }
    }
  }

  return exercises[material.id] || null
}

// Fonction pour créer l'exercice FITB (Compréhension orale)
function createListeningComprehensionExercise(material) {
  const exercises = {
    331: { // Байкал
      fr: {
        title: "Compréhension orale",
        sentences: [
          "Байкал - самое ___ озеро в мире.",
          "Байкал содержит около 20% мировых ___ пресной воды.",
          "Возраст озера составляет около ___ миллионов лет."
        ],
        answers: ["глубокое", "запасов", "25"]
      },
      en: {
        title: "Listening comprehension",
        sentences: [
          "Baikal is the ___ lake in the world.",
          "Baikal contains about 20% of the world's ___ water reserves.",
          "The lake is about ___ million years old."
        ],
        answers: ["deepest", "fresh", "25"]
      },
      ru: {
        title: "Понимание на слух",
        sentences: [
          "Байкал - самое ___ озеро в мире.",
          "Байкал содержит около 20% мировых ___ пресной воды.",
          "Возраст озера составляет около ___ миллионов лет."
        ],
        answers: ["глубокое", "запасов", "25"]
      }
    },
    332: { // Камчатка
      fr: {
        title: "Compréhension orale",
        sentences: [
          "Полуостров Камчатка насчитывает более ___ вулканов.",
          "Из них ___ являются активными.",
          "Камчатка известна своими ___."
        ],
        answers: ["300", "29", "гейзерами"]
      },
      en: {
        title: "Listening comprehension",
        sentences: [
          "The Kamchatka Peninsula has more than ___ volcanoes.",
          "Of these, ___ are active.",
          "Kamchatka is known for its ___."
        ],
        answers: ["300", "29", "geysers"]
      },
      ru: {
        title: "Понимание на слух",
        sentences: [
          "Полуостров Камчатка насчитывает более ___ вулканов.",
          "Из них ___ являются активными.",
          "Камчатка известна своими ___."
        ],
        answers: ["300", "29", "гейзерами"]
      }
    },
    333: { // Эльбрус
      fr: {
        title: "Compréhension orale",
        sentences: [
          "Эльбрус расположен в горах ___.",
          "Его высота составляет ___ метров.",
          "Эльбрус - самая высокая гора ___."
        ],
        answers: ["Кавказа", "5642", "Европы"]
      },
      en: {
        title: "Listening comprehension",
        sentences: [
          "Elbrus is located in the ___ mountains.",
          "Its height is ___ meters.",
          "Elbrus is the highest mountain in ___."
        ],
        answers: ["Caucasus", "5642", "Europe"]
      },
      ru: {
        title: "Понимание на слух",
        sentences: [
          "Эльбрус расположен в горах ___.",
          "Его высота составляет ___ метров.",
          "Эльбрус - самая высокая гора ___."
        ],
        answers: ["Кавказа", "5642", "Европы"]
      }
    }
  }

  return exercises[material.id] || null
}

// Fonction pour créer l'exercice Drag and Drop (Vocabulaire)
function createVocabularyExercise(material) {
  const exercises = {
    331: { // Байкал
      fr: {
        title: "Exercice de vocabulaire",
        pairs: [
          { ru: "озеро", translation: "lac" },
          { ru: "глубокий", translation: "profond" },
          { ru: "пресная вода", translation: "eau douce" },
          { ru: "запасы", translation: "réserves" },
          { ru: "возраст", translation: "âge" },
          { ru: "Сибирь", translation: "Sibérie" }
        ]
      },
      en: {
        title: "Vocabulary exercise",
        pairs: [
          { ru: "озеро", translation: "lake" },
          { ru: "глубокий", translation: "deep" },
          { ru: "пресная вода", translation: "fresh water" },
          { ru: "запасы", translation: "reserves" },
          { ru: "возраст", translation: "age" },
          { ru: "Сибирь", translation: "Siberia" }
        ]
      },
      ru: {
        title: "Упражнение на лексику",
        pairs: [
          { ru: "озеро", translation: "lake (en)" },
          { ru: "глубокий", translation: "deep (en)" },
          { ru: "пресная вода", translation: "fresh water (en)" },
          { ru: "запасы", translation: "reserves (en)" },
          { ru: "возраст", translation: "age (en)" },
          { ru: "Сибирь", translation: "Siberia (en)" }
        ]
      }
    },
    332: { // Камчатка
      fr: {
        title: "Exercice de vocabulaire",
        pairs: [
          { ru: "полуостров", translation: "péninsule" },
          { ru: "вулкан", translation: "volcan" },
          { ru: "активный", translation: "actif" },
          { ru: "гейзер", translation: "geyser" },
          { ru: "природа", translation: "nature" },
          { ru: "уникальный", translation: "unique" }
        ]
      },
      en: {
        title: "Vocabulary exercise",
        pairs: [
          { ru: "полуостров", translation: "peninsula" },
          { ru: "вулкан", translation: "volcano" },
          { ru: "активный", translation: "active" },
          { ru: "гейзер", translation: "geyser" },
          { ru: "природа", translation: "nature" },
          { ru: "уникальный", translation: "unique" }
        ]
      },
      ru: {
        title: "Упражнение на лексику",
        pairs: [
          { ru: "полуостров", translation: "peninsula (en)" },
          { ru: "вулкан", translation: "volcano (en)" },
          { ru: "активный", translation: "active (en)" },
          { ru: "гейзер", translation: "geyser (en)" },
          { ru: "природа", translation: "nature (en)" },
          { ru: "уникальный", translation: "unique (en)" }
        ]
      }
    },
    333: { // Эльбрус
      fr: {
        title: "Exercice de vocabulaire",
        pairs: [
          { ru: "гора", translation: "montagne" },
          { ru: "высота", translation: "altitude" },
          { ru: "Кавказ", translation: "Caucase" },
          { ru: "вершина", translation: "sommet" },
          { ru: "снег", translation: "neige" },
          { ru: "альпинизм", translation: "alpinisme" }
        ]
      },
      en: {
        title: "Vocabulary exercise",
        pairs: [
          { ru: "гора", translation: "mountain" },
          { ru: "высота", translation: "altitude" },
          { ru: "Кавказ", translation: "Caucasus" },
          { ru: "вершина", translation: "summit" },
          { ru: "снег", translation: "snow" },
          { ru: "альпинизм", translation: "mountaineering" }
        ]
      },
      ru: {
        title: "Упражнение на лексику",
        pairs: [
          { ru: "гора", translation: "mountain (en)" },
          { ru: "высота", translation: "altitude (en)" },
          { ru: "Кавказ", translation: "Caucasus (en)" },
          { ru: "вершина", translation: "summit (en)" },
          { ru: "снег", translation: "snow (en)" },
          { ru: "альпинизм", translation: "mountaineering (en)" }
        ]
      }
    }
  }

  return exercises[material.id] || null
}

async function main() {
  console.log('🚀 Début de la création des exercices pour beautiful-places...\n')

  // 1. Récupérer les matériaux de la section beautiful-places (russe)
  const { data: materials, error: materialsError } = await supabase
    .from('materials')
    .select('id, title, body, section, lang')
    .eq('section', 'beautiful-places')
    .eq('lang', 'ru')
    .order('id')

  if (materialsError) {
    console.error('❌ Erreur lors de la récupération des matériaux:', materialsError)
    return
  }

  console.log(`📚 ${materials.length} matériaux trouvés\n`)

  // 2. Pour chaque matériau, créer les 3 exercices
  for (const material of materials) {
    console.log(`\n📖 Traitement du matériau: ${material.title} (ID: ${material.id})`)

    const readingEx = createReadingComprehensionExercise(material)
    const listeningEx = createListeningComprehensionExercise(material)
    const vocabularyEx = createVocabularyExercise(material)

    if (!readingEx || !listeningEx || !vocabularyEx) {
      console.log(`⚠️  Exercices non définis pour le matériau ${material.id}, passage au suivant...`)
      continue
    }

    // Exercice 1: Compréhension écrite (MCQ)
    console.log('  📝 Création exercice 1: Compréhension écrite (MCQ)...')
    const { data: ex1, error: err1 } = await supabase
      .from('exercises')
      .insert({
        material_id: material.id,
        exercise_type: 'mcq',
        title_fr: readingEx.fr.title,
        title_en: readingEx.en.title,
        title_ru: readingEx.ru.title,
        content: {
          fr: { questions: readingEx.fr.questions },
          en: { questions: readingEx.en.questions },
          ru: { questions: readingEx.ru.questions }
        },
        order_index: 1
      })
      .select()

    if (err1) {
      console.error('    ❌ Erreur:', err1.message)
    } else {
      console.log('    ✅ Exercice MCQ créé')
    }

    // Exercice 2: Compréhension orale (FITB)
    console.log('  🎧 Création exercice 2: Compréhension orale (FITB)...')
    const { data: ex2, error: err2 } = await supabase
      .from('exercises')
      .insert({
        material_id: material.id,
        exercise_type: 'fitb',
        title_fr: listeningEx.fr.title,
        title_en: listeningEx.en.title,
        title_ru: listeningEx.ru.title,
        content: {
          fr: {
            sentences: listeningEx.fr.sentences,
            answers: listeningEx.fr.answers
          },
          en: {
            sentences: listeningEx.en.sentences,
            answers: listeningEx.en.answers
          },
          ru: {
            sentences: listeningEx.ru.sentences,
            answers: listeningEx.ru.answers
          }
        },
        order_index: 2
      })
      .select()

    if (err2) {
      console.error('    ❌ Erreur:', err2.message)
    } else {
      console.log('    ✅ Exercice FITB créé')
    }

    // Exercice 3: Exercice de vocabulaire (Drag and Drop)
    console.log('  📚 Création exercice 3: Vocabulaire (Drag & Drop)...')
    const { data: ex3, error: err3 } = await supabase
      .from('exercises')
      .insert({
        material_id: material.id,
        exercise_type: 'drag_drop',
        title_fr: vocabularyEx.fr.title,
        title_en: vocabularyEx.en.title,
        title_ru: vocabularyEx.ru.title,
        content: {
          fr: { pairs: vocabularyEx.fr.pairs },
          en: { pairs: vocabularyEx.en.pairs },
          ru: { pairs: vocabularyEx.ru.pairs }
        },
        order_index: 3
      })
      .select()

    if (err3) {
      console.error('    ❌ Erreur:', err3.message)
    } else {
      console.log('    ✅ Exercice Drag & Drop créé')
    }
  }

  console.log('\n\n✅ Terminé ! Tous les exercices ont été créés.')
}

main()
