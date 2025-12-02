const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const lesson = {
  course_id: 2,  // beginner-russian
  slug: 'privet-saluer-prendre-conge',
  title_fr: 'Привет ! - Saluer et prendre congé',
  title_ru: 'Привет! - Приветствия и прощания',
  title_en: 'Привет! - Greetings and farewells',
  order_index: 0,
  estimated_minutes: 30,
  is_published: true,
  objectives_fr: [
    'Dire bonjour et au revoir en russe',
    'Utiliser le registre formel et informel',
    'Se présenter avec "Меня зовут"',
    'Souhaiter une bonne journée/soirée'
  ],
  objectives_ru: [
    'Здороваться и прощаться по-русски',
    'Использовать формальный и неформальный регистры',
    'Представляться с помощью "Меня зовут"',
    'Желать хорошего дня/вечера'
  ],
  objectives_en: [
    'Say hello and goodbye in Russian',
    'Use formal and informal registers',
    'Introduce yourself with "Меня зовут"',
    'Wish someone a nice day/evening'
  ],
  blocks_fr: [
    // BLOC 1: Dialogue
    {
      type: 'dialogue',
      title: 'Première rencontre au café',
      lines: [
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Здравствуйте!',
          audioUrl: null,
          vocab: [
            { word: 'Здравствуйте', translation: 'Bonjour (formel)' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Здравствуйте! Как вы поживаете?',
          audioUrl: null,
          vocab: [
            { word: 'Как вы поживаете?', translation: 'Comment allez-vous ? (formel)' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Хорошо, спасибо. А вы?',
          audioUrl: null,
          vocab: [
            { word: 'Хорошо', translation: 'Bien' },
            { word: 'спасибо', translation: 'merci' },
            { word: 'А вы?', translation: 'Et vous ? (formel)' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Очень хорошо, спасибо! Меня зовут Иван.',
          audioUrl: null,
          vocab: [
            { word: 'Очень хорошо', translation: 'Très bien' },
            { word: 'Меня зовут', translation: "Je m'appelle (litt. : on m'appelle)" }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Очень приятно, Иван! Меня зовут Анна.',
          audioUrl: null,
          vocab: [
            { word: 'Очень приятно', translation: 'Enchanté(e) / Très agréable' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Очень приятно, Анна! Хорошего дня!',
          audioUrl: null,
          vocab: [
            { word: 'Хорошего дня', translation: 'Bonne journée' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Спасибо, вам тоже! До свидания!',
          audioUrl: null,
          vocab: [
            { word: 'вам тоже', translation: 'à vous aussi (formel)' },
            { word: 'До свидания', translation: 'Au revoir' }
          ]
        }
      ],
      vocabulary: [
        { word: 'Здравствуйте', translation: 'Bonjour (formel)', category: 'expressions' },
        { word: 'До свидания', translation: 'Au revoir', category: 'expressions' },
        { word: 'Спасибо', translation: 'Merci', category: 'expressions' }
      ]
    },
    // BLOC 2: Vocabulaire - Les salutations
    {
      type: 'vocabulary',
      title: 'Les salutations',
      icon: 'book',
      category: 'salutations',
      words: [
        {
          word: 'Здравствуйте',
          translation: 'Bonjour (formel, à toute heure)',
          pronunciation: '[zdrástvujtʲe]',
          example: 'Здравствуйте, как дела?',
          exampleTranslation: 'Bonjour, comment allez-vous ?'
        },
        {
          word: 'Привет',
          translation: 'Salut (informel, entre amis)',
          pronunciation: '[privʲét]',
          example: 'Привет! Как дела?',
          exampleTranslation: 'Salut ! Comment ça va ?'
        },
        {
          word: 'Доброе утро',
          translation: 'Bonjour / Bon matin (le matin)',
          pronunciation: '[dóbraje útra]',
          example: 'Доброе утро, мама!',
          exampleTranslation: 'Bonjour maman ! (le matin)'
        },
        {
          word: 'Добрый день',
          translation: "Bonjour (l'après-midi)",
          pronunciation: '[dóbryj dʲenʲ]',
          example: 'Добрый день, коллеги!',
          exampleTranslation: 'Bonjour, collègues !'
        },
        {
          word: 'Добрый вечер',
          translation: 'Bonsoir (le soir)',
          pronunciation: '[dóbryj vʲétʃer]',
          example: 'Добрый вечер!',
          exampleTranslation: 'Bonsoir !'
        }
      ]
    },
    // BLOC 3: Grammaire - Formel vs Informel
    {
      type: 'grammar',
      title: 'Formel vs Informel',
      icon: 'book',
      explanation: "En russe, comme en français, il existe deux registres : formel (вы - vous) et informel (ты - tu). Le choix dépend de la relation avec l'interlocuteur. On utilise \"вы\" avec les inconnus, les supérieurs et les personnes âgées. On utilise \"ты\" avec les amis, la famille et les enfants.",
      examples: [
        {
          sentence: 'Как вы поживаете?',
          translation: 'Comment allez-vous ? (formel)',
          note: 'Utilisez "вы" avec des inconnus, des supérieurs',
          audioUrl: null
        },
        {
          sentence: 'Как ты поживаешь?',
          translation: 'Comment vas-tu ? (informel)',
          note: 'Utilisez "ты" avec des amis, la famille',
          audioUrl: null
        },
        {
          sentence: 'Как дела?',
          translation: 'Comment ça va ? (neutre/informel)',
          note: 'Version courte, très courante',
          audioUrl: null
        }
      ],
      table: {
        title: 'Formel vs Informel',
        headers: ['Situation', 'Formel (вы)', 'Informel (ты)'],
        rows: [
          ['Saluer', 'Здравствуйте', 'Привет'],
          ['Demander des nouvelles', 'Как вы поживаете?', 'Как дела? / Как ты?'],
          ['Répondre', 'Хорошо, спасибо', 'Нормально / Отлично'],
          ['Prendre congé', 'До свидания', 'Пока / Давай']
        ],
        rowsAudio: []
      }
    },
    // BLOC 4: Exercice - Formel ou informel
    {
      type: 'exerciseInline',
      title: 'Formel ou informel ?',
      icon: 'edit',
      exerciseType: 'fillInBlank',
      xpReward: 10,
      questions: [
        {
          question: 'À votre professeur : ____. (Привет/Здравствуйте)',
          answer: 'Здравствуйте',
          acceptableAnswers: ['Здравствуйте', 'здравствуйте'],
          hint: 'Contexte formel (professeur)'
        },
        {
          question: 'À votre ami(e) : ____. (Привет/Здравствуйте)',
          answer: 'Привет',
          acceptableAnswers: ['Привет', 'привет'],
          hint: 'Contexte informel (ami)'
        },
        {
          question: 'Как вы ____? (поживаете/поживаешь) - à un inconnu',
          answer: 'поживаете',
          acceptableAnswers: ['поживаете'],
          hint: 'Vouvoiement pour un inconnu'
        }
      ]
    },
    // BLOC 5: Culture
    {
      type: 'culture',
      title: 'Les salutations en Russie',
      icon: 'globe',
      content: "En Russie, les hommes se serrent généralement la main lors d'une rencontre formelle. Entre amis proches et en famille, on peut s'embrasser (souvent trois fois sur les joues). Le contact visuel est important lors des salutations. \"Здравствуйте\" vient du mot \"здоровье\" (santé) - vous souhaitez littéralement la bonne santé à votre interlocuteur !",
      keyPoints: [
        'Les hommes se serrent la main en contexte formel',
        "Entre proches, on peut s'embrasser (3 fois)",
        'Le contact visuel est important',
        '"Здравствуйте" signifie littéralement "portez-vous bien"',
        'On enlève ses gants pour serrer la main'
      ],
      comparison: {
        fr: 'France : bise entre proches, poignée de main en contexte formel',
        other: 'Russie : poignée de main plus fréquente, étreinte entre proches'
      }
    },
    // BLOC 6: Vocabulaire - Prendre congé
    {
      type: 'vocabulary',
      title: 'Prendre congé',
      icon: 'book',
      category: 'farewells',
      words: [
        {
          word: 'До свидания',
          translation: 'Au revoir (formel)',
          pronunciation: '[da svidánʲija]',
          example: 'До свидания! До встречи!',
          exampleTranslation: 'Au revoir ! À bientôt !'
        },
        {
          word: 'Пока',
          translation: 'Salut / Au revoir (informel)',
          pronunciation: '[paká]',
          example: 'Пока! Увидимся!',
          exampleTranslation: 'Salut ! On se voit !'
        },
        {
          word: 'До встречи',
          translation: "À bientôt (litt. : jusqu'à la rencontre)",
          pronunciation: '[da fstrʲétʃi]',
          example: 'До встречи завтра!',
          exampleTranslation: 'À demain ! (litt. : À la rencontre demain)'
        },
        {
          word: 'До завтра',
          translation: 'À demain',
          pronunciation: '[da závtra]',
          example: 'До завтра на работе!',
          exampleTranslation: 'À demain au travail !'
        },
        {
          word: 'Хорошего дня',
          translation: 'Bonne journée',
          pronunciation: '[xaróʂeva dnʲa]',
          example: 'Хорошего дня!',
          exampleTranslation: 'Bonne journée !'
        },
        {
          word: 'Спокойной ночи',
          translation: 'Bonne nuit',
          pronunciation: '[spakójnaj nótʃi]',
          example: 'Спокойной ночи, сладких снов!',
          exampleTranslation: 'Bonne nuit, fais de beaux rêves !'
        }
      ]
    },
    // BLOC 7: Astuce de prononciation
    {
      type: 'tip',
      title: 'Astuce de prononciation',
      icon: 'lightbulb',
      color: 'info',
      content: "Le mot \"Здравствуйте\" est difficile à prononcer ! Le groupe \"вств\" se simplifie souvent à l'oral en \"ств\" [zdrástvujtʲe]. Commencez par dire \"здрасте\" (version très raccourcie, familière) puis ajoutez progressivement les sons. L'accent tonique est sur la première syllabe : ЗДРАВ-ствуй-те."
    },
    // BLOC 8: Grammaire - Se présenter
    {
      type: 'grammar',
      title: 'Se présenter : Меня зовут',
      icon: 'book',
      explanation: "Pour dire son nom en russe, on utilise \"Меня зовут\" + prénom. Littéralement, cela signifie \"On m'appelle\". C'est une construction impersonnelle très courante. Une alternative informelle est \"Я\" + prénom (Je suis + prénom).",
      examples: [
        {
          sentence: 'Меня зовут Анна.',
          translation: "Je m'appelle Anna.",
          note: 'Forme standard et polie',
          audioUrl: null
        },
        {
          sentence: 'Я Пётр.',
          translation: 'Je suis Piotr.',
          note: 'Plus direct, informel',
          audioUrl: null
        },
        {
          sentence: 'Как вас зовут?',
          translation: 'Comment vous appelez-vous ?',
          note: 'Question formelle',
          audioUrl: null
        }
      ],
      table: {
        title: 'La construction "Меня зовут"',
        headers: ['Russe', 'Français', 'Usage'],
        rows: [
          ['Меня зовут...', "Je m'appelle...", '1ère personne'],
          ['Тебя зовут...', "Tu t'appelles...", '2ème pers. informel'],
          ['Вас зовут...', 'Vous vous appelez...', '2ème pers. formel'],
          ['Его зовут...', "Il s'appelle...", '3ème pers. masc.'],
          ['Её зовут...', "Elle s'appelle...", '3ème pers. fém.'],
          ['Их зовут...', "Ils/Elles s'appellent...", '3ème pers. pluriel']
        ],
        rowsAudio: []
      }
    },
    // BLOC 9: Exercice - Présentations
    {
      type: 'exerciseInline',
      title: 'Complétez les présentations',
      icon: 'edit',
      exerciseType: 'fillInBlank',
      xpReward: 10,
      questions: [
        {
          question: '____ зовут Мария. (Меня/Тебя)',
          answer: 'Меня',
          acceptableAnswers: ['Меня', 'меня'],
          hint: 'Première personne du singulier'
        },
        {
          question: 'Как ____ зовут? (тебя/меня) - à un ami',
          answer: 'тебя',
          acceptableAnswers: ['тебя'],
          hint: 'Deuxième personne informelle'
        },
        {
          question: 'Как ____ зовут? (вас/тебя) - à un inconnu',
          answer: 'вас',
          acceptableAnswers: ['вас', 'Вас'],
          hint: 'Deuxième personne formelle'
        },
        {
          question: '____ зовут Иван. (Его/Её) - un homme',
          answer: 'Его',
          acceptableAnswers: ['Его', 'его'],
          hint: 'Troisième personne masculin'
        }
      ]
    },
    // BLOC 10: Conversation
    {
      type: 'conversation',
      title: 'À une soirée',
      context: "Vous êtes à une fête et vous rencontrez quelqu'un pour la première fois.",
      dialogue: [
        { speaker: 'Inconnu(e)', text: 'Добрый вечер!' },
        { speaker: 'Vous', text: '...' },
        { speaker: 'Inconnu(e)', text: 'Меня зовут Наташа. А вас?' },
        { speaker: 'Vous', text: '...' },
        { speaker: 'Inconnu(e)', text: 'Очень приятно! Вы знаете хозяина?' },
        { speaker: 'Vous', text: '...' }
      ],
      questions: [
        { question: 'Comment répondre à "Добрый вечер!" ?', answer: 'Добрый вечер!' },
        { question: 'Comment vous présenter après "А вас?" ?', answer: 'Меня зовут [votre prénom]. / Я [votre prénom].' },
        { question: 'Comment répondre à "Вы знаете хозяина?" ?', answer: 'Да, это мой друг. / Нет, не очень. / Да, это мой коллега.' }
      ]
    },
    // BLOC 11: Astuce - Erreurs courantes
    {
      type: 'tip',
      title: 'Erreurs courantes à éviter',
      icon: 'lightbulb',
      color: 'warning',
      content: "Attention ! \"До свидания\" s'utilise en partant (comme \"au revoir\"), pas en arrivant. Ne confondez pas \"Добрый день\" (bonjour, en arrivant) et \"Хорошего дня\" (bonne journée, en partant). \"Пока\" est très informel - évitez-le avec votre patron !"
    },
    // BLOC 12: Résumé
    {
      type: 'summary',
      title: 'Expressions à retenir',
      icon: 'check',
      keyPhrases: [
        { ru: 'Здравствуйте!', context: 'Bonjour (formel)' },
        { ru: 'Привет!', context: 'Salut (informel)' },
        { ru: 'Добрый день!', context: "Bonjour (l'après-midi)" },
        { ru: 'Добрый вечер!', context: 'Bonsoir' },
        { ru: 'Как вы поживаете?', context: 'Comment allez-vous ? (formel)' },
        { ru: 'Как дела?', context: 'Comment ça va ? (informel)' },
        { ru: 'Меня зовут...', context: "Je m'appelle..." },
        { ru: 'Очень приятно!', context: 'Enchanté(e) !' },
        { ru: 'До свидания!', context: 'Au revoir (formel)' },
        { ru: 'Пока!', context: 'Salut / Au revoir (informel)' },
        { ru: 'Хорошего дня!', context: 'Bonne journée !' }
      ]
    }
  ],
  blocks_en: [
    // BLOC 1: Dialogue
    {
      type: 'dialogue',
      title: 'First meeting at a café',
      lines: [
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Здравствуйте!',
          audioUrl: null,
          vocab: [
            { word: 'Здравствуйте', translation: 'Hello (formal)' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Здравствуйте! Как вы поживаете?',
          audioUrl: null,
          vocab: [
            { word: 'Как вы поживаете?', translation: 'How are you? (formal)' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Хорошо, спасибо. А вы?',
          audioUrl: null,
          vocab: [
            { word: 'Хорошо', translation: 'Good / Well' },
            { word: 'спасибо', translation: 'thank you' },
            { word: 'А вы?', translation: 'And you? (formal)' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Очень хорошо, спасибо! Меня зовут Иван.',
          audioUrl: null,
          vocab: [
            { word: 'Очень хорошо', translation: 'Very good' },
            { word: 'Меня зовут', translation: 'My name is (lit.: they call me)' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Очень приятно, Иван! Меня зовут Анна.',
          audioUrl: null,
          vocab: [
            { word: 'Очень приятно', translation: 'Nice to meet you (lit.: very pleasant)' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Очень приятно, Анна! Хорошего дня!',
          audioUrl: null,
          vocab: [
            { word: 'Хорошего дня', translation: 'Have a nice day' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Спасибо, вам тоже! До свидания!',
          audioUrl: null,
          vocab: [
            { word: 'вам тоже', translation: 'you too (formal)' },
            { word: 'До свидания', translation: 'Goodbye' }
          ]
        }
      ],
      vocabulary: [
        { word: 'Здравствуйте', translation: 'Hello (formal)', category: 'expressions' },
        { word: 'До свидания', translation: 'Goodbye', category: 'expressions' },
        { word: 'Спасибо', translation: 'Thank you', category: 'expressions' }
      ]
    },
    // BLOC 2: Vocabulary - Greetings
    {
      type: 'vocabulary',
      title: 'Greetings',
      icon: 'book',
      category: 'salutations',
      words: [
        {
          word: 'Здравствуйте',
          translation: 'Hello (formal, any time of day)',
          pronunciation: '[zdrástvujtʲe]',
          example: 'Здравствуйте, как дела?',
          exampleTranslation: 'Hello, how are you?'
        },
        {
          word: 'Привет',
          translation: 'Hi (informal, among friends)',
          pronunciation: '[privʲét]',
          example: 'Привет! Как дела?',
          exampleTranslation: 'Hi! How are you?'
        },
        {
          word: 'Доброе утро',
          translation: 'Good morning',
          pronunciation: '[dóbraje útra]',
          example: 'Доброе утро, мама!',
          exampleTranslation: 'Good morning, mom!'
        },
        {
          word: 'Добрый день',
          translation: 'Good afternoon',
          pronunciation: '[dóbryj dʲenʲ]',
          example: 'Добрый день, коллеги!',
          exampleTranslation: 'Good afternoon, colleagues!'
        },
        {
          word: 'Добрый вечер',
          translation: 'Good evening',
          pronunciation: '[dóbryj vʲétʃer]',
          example: 'Добрый вечер!',
          exampleTranslation: 'Good evening!'
        }
      ]
    },
    // BLOC 3: Grammar - Formal vs Informal
    {
      type: 'grammar',
      title: 'Formal vs Informal',
      icon: 'book',
      explanation: 'In Russian, like in French, there are two registers: formal (вы - you) and informal (ты - you). The choice depends on your relationship with the person. Use "вы" with strangers, superiors, and elderly people. Use "ты" with friends, family, and children.',
      examples: [
        {
          sentence: 'Как вы поживаете?',
          translation: 'How are you? (formal)',
          note: 'Use "вы" with strangers, superiors',
          audioUrl: null
        },
        {
          sentence: 'Как ты поживаешь?',
          translation: 'How are you? (informal)',
          note: 'Use "ты" with friends, family',
          audioUrl: null
        },
        {
          sentence: 'Как дела?',
          translation: 'How are things? (neutral/informal)',
          note: 'Short version, very common',
          audioUrl: null
        }
      ],
      table: {
        title: 'Formal vs Informal',
        headers: ['Situation', 'Formal (вы)', 'Informal (ты)'],
        rows: [
          ['Greeting', 'Здравствуйте', 'Привет'],
          ['Asking how someone is', 'Как вы поживаете?', 'Как дела? / Как ты?'],
          ['Responding', 'Хорошо, спасибо', 'Нормально / Отлично'],
          ['Saying goodbye', 'До свидания', 'Пока / Давай']
        ],
        rowsAudio: []
      }
    },
    // BLOC 4: Exercise - Formal or informal
    {
      type: 'exerciseInline',
      title: 'Formal or informal?',
      icon: 'edit',
      exerciseType: 'fillInBlank',
      xpReward: 10,
      questions: [
        {
          question: 'To your teacher: ____. (Привет/Здравствуйте)',
          answer: 'Здравствуйте',
          acceptableAnswers: ['Здравствуйте', 'здравствуйте'],
          hint: 'Formal context (teacher)'
        },
        {
          question: 'To your friend: ____. (Привет/Здравствуйте)',
          answer: 'Привет',
          acceptableAnswers: ['Привет', 'привет'],
          hint: 'Informal context (friend)'
        },
        {
          question: 'Как вы ____? (поживаете/поживаешь) - to a stranger',
          answer: 'поживаете',
          acceptableAnswers: ['поживаете'],
          hint: 'Formal "you" for a stranger'
        }
      ]
    },
    // BLOC 5: Culture
    {
      type: 'culture',
      title: 'Greetings in Russia',
      icon: 'globe',
      content: 'In Russia, men typically shake hands during formal meetings. Among close friends and family, people may embrace (often with three kisses on the cheeks). Eye contact is important during greetings. "Здравствуйте" comes from "здоровье" (health) - you are literally wishing good health to your interlocutor!',
      keyPoints: [
        'Men shake hands in formal contexts',
        'Among close ones, embracing (3 times) is common',
        'Eye contact is important',
        '"Здравствуйте" literally means "be healthy"',
        'You should remove gloves before shaking hands'
      ],
      comparison: {
        fr: 'France: cheek kisses among acquaintances, handshake in formal contexts',
        other: 'Russia: handshake more frequent, embrace among close ones'
      }
    },
    // BLOC 6: Vocabulary - Farewells
    {
      type: 'vocabulary',
      title: 'Farewells',
      icon: 'book',
      category: 'farewells',
      words: [
        {
          word: 'До свидания',
          translation: 'Goodbye (formal)',
          pronunciation: '[da svidánʲija]',
          example: 'До свидания! До встречи!',
          exampleTranslation: 'Goodbye! See you soon!'
        },
        {
          word: 'Пока',
          translation: 'Bye (informal)',
          pronunciation: '[paká]',
          example: 'Пока! Увидимся!',
          exampleTranslation: 'Bye! See you!'
        },
        {
          word: 'До встречи',
          translation: 'See you soon (lit.: until the meeting)',
          pronunciation: '[da fstrʲétʃi]',
          example: 'До встречи завтра!',
          exampleTranslation: 'See you tomorrow!'
        },
        {
          word: 'До завтра',
          translation: 'See you tomorrow',
          pronunciation: '[da závtra]',
          example: 'До завтра на работе!',
          exampleTranslation: 'See you tomorrow at work!'
        },
        {
          word: 'Хорошего дня',
          translation: 'Have a nice day',
          pronunciation: '[xaróʂeva dnʲa]',
          example: 'Хорошего дня!',
          exampleTranslation: 'Have a nice day!'
        },
        {
          word: 'Спокойной ночи',
          translation: 'Good night',
          pronunciation: '[spakójnaj nótʃi]',
          example: 'Спокойной ночи, сладких снов!',
          exampleTranslation: 'Good night, sweet dreams!'
        }
      ]
    },
    // BLOC 7: Tip - Pronunciation
    {
      type: 'tip',
      title: 'Pronunciation tip',
      icon: 'lightbulb',
      color: 'info',
      content: 'The word "Здравствуйте" is difficult to pronounce! The cluster "вств" is often simplified to "ств" [zdrástvujtʲe] in speech. Start by saying "здрасте" (very shortened, colloquial version) then gradually add the sounds. The stress is on the first syllable: ЗДРАВ-ствуй-те.'
    },
    // BLOC 8: Grammar - Introducing yourself
    {
      type: 'grammar',
      title: 'Introducing yourself: Меня зовут',
      icon: 'book',
      explanation: 'To say your name in Russian, use "Меня зовут" + first name. Literally, this means "They call me". It\'s a very common impersonal construction. An informal alternative is "Я" + name (I am + name).',
      examples: [
        {
          sentence: 'Меня зовут Анна.',
          translation: 'My name is Anna.',
          note: 'Standard and polite form',
          audioUrl: null
        },
        {
          sentence: 'Я Пётр.',
          translation: "I'm Pyotr.",
          note: 'More direct, informal',
          audioUrl: null
        },
        {
          sentence: 'Как вас зовут?',
          translation: 'What is your name? (formal)',
          note: 'Formal question',
          audioUrl: null
        }
      ],
      table: {
        title: 'The "Меня зовут" construction',
        headers: ['Russian', 'English', 'Usage'],
        rows: [
          ['Меня зовут...', 'My name is...', '1st person'],
          ['Тебя зовут...', 'Your name is...', '2nd person informal'],
          ['Вас зовут...', 'Your name is...', '2nd person formal'],
          ['Его зовут...', 'His name is...', '3rd person masc.'],
          ['Её зовут...', 'Her name is...', '3rd person fem.'],
          ['Их зовут...', 'Their names are...', '3rd person plural']
        ],
        rowsAudio: []
      }
    },
    // BLOC 9: Exercise - Introductions
    {
      type: 'exerciseInline',
      title: 'Complete the introductions',
      icon: 'edit',
      exerciseType: 'fillInBlank',
      xpReward: 10,
      questions: [
        {
          question: '____ зовут Мария. (Меня/Тебя)',
          answer: 'Меня',
          acceptableAnswers: ['Меня', 'меня'],
          hint: 'First person singular'
        },
        {
          question: 'Как ____ зовут? (тебя/меня) - to a friend',
          answer: 'тебя',
          acceptableAnswers: ['тебя'],
          hint: 'Second person informal'
        },
        {
          question: 'Как ____ зовут? (вас/тебя) - to a stranger',
          answer: 'вас',
          acceptableAnswers: ['вас', 'Вас'],
          hint: 'Second person formal'
        },
        {
          question: '____ зовут Иван. (Его/Её) - a man',
          answer: 'Его',
          acceptableAnswers: ['Его', 'его'],
          hint: 'Third person masculine'
        }
      ]
    },
    // BLOC 10: Conversation
    {
      type: 'conversation',
      title: 'At a party',
      context: 'You are at a party and meet someone for the first time.',
      dialogue: [
        { speaker: 'Stranger', text: 'Добрый вечер!' },
        { speaker: 'You', text: '...' },
        { speaker: 'Stranger', text: 'Меня зовут Наташа. А вас?' },
        { speaker: 'You', text: '...' },
        { speaker: 'Stranger', text: 'Очень приятно! Вы знаете хозяина?' },
        { speaker: 'You', text: '...' }
      ],
      questions: [
        { question: 'How to respond to "Добрый вечер!"?', answer: 'Добрый вечер!' },
        { question: 'How to introduce yourself after "А вас?"?', answer: 'Меня зовут [your name]. / Я [your name].' },
        { question: 'How to answer "Вы знаете хозяина?"?', answer: 'Да, это мой друг. / Нет, не очень. / Да, это мой коллега.' }
      ]
    },
    // BLOC 11: Tip - Common mistakes
    {
      type: 'tip',
      title: 'Common mistakes to avoid',
      icon: 'lightbulb',
      color: 'warning',
      content: 'Be careful! "До свидания" is used when leaving (like "goodbye"), not when arriving. Don\'t confuse "Добрый день" (hello, when arriving) and "Хорошего дня" (have a nice day, when leaving). "Пока" is very informal - avoid it with your boss!'
    },
    // BLOC 12: Summary
    {
      type: 'summary',
      title: 'Key phrases to remember',
      icon: 'check',
      keyPhrases: [
        { ru: 'Здравствуйте!', context: 'Hello (formal)' },
        { ru: 'Привет!', context: 'Hi (informal)' },
        { ru: 'Добрый день!', context: 'Good afternoon' },
        { ru: 'Добрый вечер!', context: 'Good evening' },
        { ru: 'Как вы поживаете?', context: 'How are you? (formal)' },
        { ru: 'Как дела?', context: 'How are things? (informal)' },
        { ru: 'Меня зовут...', context: 'My name is...' },
        { ru: 'Очень приятно!', context: 'Nice to meet you!' },
        { ru: 'До свидания!', context: 'Goodbye (formal)' },
        { ru: 'Пока!', context: 'Bye (informal)' },
        { ru: 'Хорошего дня!', context: 'Have a nice day!' }
      ]
    }
  ],
  blocks_ru: [
    // Pour les russophones (blocks_ru) - Copie de blocks_fr mais avec explications en russe
    // Normalement ce bloc ne sera pas utilisé car le cours est pour apprendre le RUSSE
    // Mais on le remplit pour la cohérence
    {
      type: 'dialogue',
      title: 'Первая встреча в кафе',
      lines: [
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Здравствуйте!',
          audioUrl: null,
          vocab: [
            { word: 'Здравствуйте', translation: 'Формальное приветствие' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Здравствуйте! Как вы поживаете?',
          audioUrl: null,
          vocab: [
            { word: 'Как вы поживаете?', translation: 'Формальный вопрос о самочувствии' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Хорошо, спасибо. А вы?',
          audioUrl: null,
          vocab: [
            { word: 'Хорошо', translation: 'Положительный ответ' },
            { word: 'спасибо', translation: 'Выражение благодарности' },
            { word: 'А вы?', translation: 'Вопрос в ответ (формальный)' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Очень хорошо, спасибо! Меня зовут Иван.',
          audioUrl: null,
          vocab: [
            { word: 'Очень хорошо', translation: 'Очень положительный ответ' },
            { word: 'Меня зовут', translation: 'Способ представиться' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Очень приятно, Иван! Меня зовут Анна.',
          audioUrl: null,
          vocab: [
            { word: 'Очень приятно', translation: 'Выражение при знакомстве' }
          ]
        },
        {
          speaker: 'Иван',
          speakerGender: 'male',
          text: 'Очень приятно, Анна! Хорошего дня!',
          audioUrl: null,
          vocab: [
            { word: 'Хорошего дня', translation: 'Пожелание при прощании' }
          ]
        },
        {
          speaker: 'Анна',
          speakerGender: 'female',
          text: 'Спасибо, вам тоже! До свидания!',
          audioUrl: null,
          vocab: [
            { word: 'вам тоже', translation: 'Ответное пожелание (формальное)' },
            { word: 'До свидания', translation: 'Формальное прощание' }
          ]
        }
      ],
      vocabulary: [
        { word: 'Здравствуйте', translation: 'Формальное приветствие', category: 'expressions' },
        { word: 'До свидания', translation: 'Формальное прощание', category: 'expressions' },
        { word: 'Спасибо', translation: 'Благодарность', category: 'expressions' }
      ]
    },
    {
      type: 'vocabulary',
      title: 'Приветствия',
      icon: 'book',
      category: 'salutations',
      words: [
        {
          word: 'Здравствуйте',
          translation: 'Формальное приветствие (в любое время дня)',
          pronunciation: '[здра́вствуйте]',
          example: 'Здравствуйте, как дела?',
          exampleTranslation: 'Формальное приветствие с вопросом'
        },
        {
          word: 'Привет',
          translation: 'Неформальное приветствие (среди друзей)',
          pronunciation: '[приве́т]',
          example: 'Привет! Как дела?',
          exampleTranslation: 'Дружеское приветствие'
        },
        {
          word: 'Доброе утро',
          translation: 'Приветствие утром',
          pronunciation: '[до́брое у́тро]',
          example: 'Доброе утро, мама!',
          exampleTranslation: 'Утреннее приветствие'
        },
        {
          word: 'Добрый день',
          translation: 'Приветствие днём',
          pronunciation: '[до́брый день]',
          example: 'Добрый день, коллеги!',
          exampleTranslation: 'Дневное приветствие'
        },
        {
          word: 'Добрый вечер',
          translation: 'Приветствие вечером',
          pronunciation: '[до́брый ве́чер]',
          example: 'Добрый вечер!',
          exampleTranslation: 'Вечернее приветствие'
        }
      ]
    },
    {
      type: 'grammar',
      title: 'Формальное и неформальное общение',
      icon: 'book',
      explanation: 'В русском языке, как и во многих других, есть два регистра: формальный (вы) и неформальный (ты). Выбор зависит от отношений с собеседником. "Вы" используется с незнакомыми людьми, начальством и пожилыми людьми. "Ты" используется с друзьями, семьёй и детьми.',
      examples: [
        { sentence: 'Как вы поживаете?', translation: 'Формальный вопрос о самочувствии', note: 'Используйте "вы" с незнакомыми, начальством', audioUrl: null },
        { sentence: 'Как ты поживаешь?', translation: 'Неформальный вопрос о самочувствии', note: 'Используйте "ты" с друзьями, семьёй', audioUrl: null },
        { sentence: 'Как дела?', translation: 'Нейтральный/неформальный вопрос', note: 'Короткая версия, очень распространена', audioUrl: null }
      ],
      table: {
        title: 'Формальное vs Неформальное',
        headers: ['Ситуация', 'Формально (вы)', 'Неформально (ты)'],
        rows: [
          ['Приветствие', 'Здравствуйте', 'Привет'],
          ['Вопрос о делах', 'Как вы поживаете?', 'Как дела? / Как ты?'],
          ['Ответ', 'Хорошо, спасибо', 'Нормально / Отлично'],
          ['Прощание', 'До свидания', 'Пока / Давай']
        ],
        rowsAudio: []
      }
    },
    {
      type: 'exerciseInline',
      title: 'Формально или неформально?',
      icon: 'edit',
      exerciseType: 'fillInBlank',
      xpReward: 10,
      questions: [
        { question: 'Преподавателю: ____. (Привет/Здравствуйте)', answer: 'Здравствуйте', acceptableAnswers: ['Здравствуйте', 'здравствуйте'], hint: 'Формальный контекст' },
        { question: 'Другу: ____. (Привет/Здравствуйте)', answer: 'Привет', acceptableAnswers: ['Привет', 'привет'], hint: 'Неформальный контекст' },
        { question: 'Как вы ____? (поживаете/поживаешь) - незнакомцу', answer: 'поживаете', acceptableAnswers: ['поживаете'], hint: 'Формальное "вы"' }
      ]
    },
    {
      type: 'culture',
      title: 'Приветствия в России',
      icon: 'globe',
      content: 'В России мужчины обычно пожимают руки при формальной встрече. Среди близких друзей и в семье люди могут обниматься (часто три раза). Зрительный контакт важен при приветствии. "Здравствуйте" происходит от слова "здоровье" - вы буквально желаете здоровья собеседнику!',
      keyPoints: ['Мужчины пожимают руки формально', 'Среди близких обнимаются (3 раза)', 'Зрительный контакт важен', '"Здравствуйте" означает "будьте здоровы"', 'Перед рукопожатием снимают перчатки'],
      comparison: { fr: 'Франция: поцелуи в щёку, рукопожатие формально', other: 'Россия: рукопожатие чаще, объятия среди близких' }
    },
    {
      type: 'vocabulary',
      title: 'Прощание',
      icon: 'book',
      category: 'farewells',
      words: [
        { word: 'До свидания', translation: 'Формальное прощание', pronunciation: '[до свида́ния]', example: 'До свидания! До встречи!', exampleTranslation: 'Прощание' },
        { word: 'Пока', translation: 'Неформальное прощание', pronunciation: '[пока́]', example: 'Пока! Увидимся!', exampleTranslation: 'Дружеское прощание' },
        { word: 'До встречи', translation: 'До скорой встречи', pronunciation: '[до встре́чи]', example: 'До встречи завтра!', exampleTranslation: 'Прощание с указанием времени' },
        { word: 'До завтра', translation: 'Увидимся завтра', pronunciation: '[до за́втра]', example: 'До завтра на работе!', exampleTranslation: 'Прощание до следующего дня' },
        { word: 'Хорошего дня', translation: 'Пожелание хорошего дня', pronunciation: '[хоро́шего дня]', example: 'Хорошего дня!', exampleTranslation: 'Пожелание' },
        { word: 'Спокойной ночи', translation: 'Пожелание перед сном', pronunciation: '[споко́йной но́чи]', example: 'Спокойной ночи, сладких снов!', exampleTranslation: 'Вечернее пожелание' }
      ]
    },
    { type: 'tip', title: 'Совет по произношению', icon: 'lightbulb', color: 'info', content: 'Слово "Здравствуйте" сложно произносить! Группа "вств" часто упрощается в речи до "ств". Начните с "здрасте" (очень сокращённая версия), затем добавляйте звуки. Ударение: ЗДРАВ-ствуй-те.' },
    {
      type: 'grammar',
      title: 'Представление: Меня зовут',
      icon: 'book',
      explanation: 'Чтобы назвать своё имя, используйте "Меня зовут" + имя. Буквально это означает "Меня называют". Неформальная альтернатива - "Я" + имя.',
      examples: [
        { sentence: 'Меня зовут Анна.', translation: 'Стандартная форма', note: 'Стандартная и вежливая форма', audioUrl: null },
        { sentence: 'Я Пётр.', translation: 'Прямая форма', note: 'Более прямая, неформальная', audioUrl: null },
        { sentence: 'Как вас зовут?', translation: 'Формальный вопрос', note: 'Формальный вопрос', audioUrl: null }
      ],
      table: {
        title: 'Конструкция "Меня зовут"',
        headers: ['Русский', 'Перевод', 'Употребление'],
        rows: [
          ['Меня зовут...', 'Меня называют...', '1-е лицо'],
          ['Тебя зовут...', 'Тебя называют...', '2-е лицо неформ.'],
          ['Вас зовут...', 'Вас называют...', '2-е лицо форм.'],
          ['Его зовут...', 'Его называют...', '3-е лицо муж.'],
          ['Её зовут...', 'Её называют...', '3-е лицо жен.'],
          ['Их зовут...', 'Их называют...', '3-е лицо мн.ч.']
        ],
        rowsAudio: []
      }
    },
    {
      type: 'exerciseInline',
      title: 'Дополните представления',
      icon: 'edit',
      exerciseType: 'fillInBlank',
      xpReward: 10,
      questions: [
        { question: '____ зовут Мария. (Меня/Тебя)', answer: 'Меня', acceptableAnswers: ['Меня', 'меня'], hint: '1-е лицо' },
        { question: 'Как ____ зовут? (тебя/меня) - другу', answer: 'тебя', acceptableAnswers: ['тебя'], hint: '2-е лицо неформ.' },
        { question: 'Как ____ зовут? (вас/тебя) - незнакомцу', answer: 'вас', acceptableAnswers: ['вас', 'Вас'], hint: '2-е лицо форм.' },
        { question: '____ зовут Иван. (Его/Её) - мужчина', answer: 'Его', acceptableAnswers: ['Его', 'его'], hint: '3-е лицо муж.' }
      ]
    },
    {
      type: 'conversation',
      title: 'На вечеринке',
      context: 'Вы на вечеринке и встречаете кого-то в первый раз.',
      dialogue: [
        { speaker: 'Незнакомец', text: 'Добрый вечер!' },
        { speaker: 'Вы', text: '...' },
        { speaker: 'Незнакомец', text: 'Меня зовут Наташа. А вас?' },
        { speaker: 'Вы', text: '...' },
        { speaker: 'Незнакомец', text: 'Очень приятно! Вы знаете хозяина?' },
        { speaker: 'Вы', text: '...' }
      ],
      questions: [
        { question: 'Как ответить на "Добрый вечер!"?', answer: 'Добрый вечер!' },
        { question: 'Как представиться после "А вас?"?', answer: 'Меня зовут [ваше имя]. / Я [ваше имя].' },
        { question: 'Как ответить на "Вы знаете хозяина?"?', answer: 'Да, это мой друг. / Нет, не очень.' }
      ]
    },
    { type: 'tip', title: 'Частые ошибки', icon: 'lightbulb', color: 'warning', content: 'Внимание! "До свидания" используется при уходе, а не при приходе. Не путайте "Добрый день" (приветствие) и "Хорошего дня" (пожелание при уходе). "Пока" очень неформальное - избегайте с начальником!' },
    {
      type: 'summary',
      title: 'Выражения для запоминания',
      icon: 'check',
      keyPhrases: [
        { ru: 'Здравствуйте!', context: 'Формальное приветствие' },
        { ru: 'Привет!', context: 'Неформальное приветствие' },
        { ru: 'Добрый день!', context: 'Приветствие днём' },
        { ru: 'Добрый вечер!', context: 'Приветствие вечером' },
        { ru: 'Как вы поживаете?', context: 'Формальный вопрос о делах' },
        { ru: 'Как дела?', context: 'Неформальный вопрос о делах' },
        { ru: 'Меня зовут...', context: 'Представление' },
        { ru: 'Очень приятно!', context: 'При знакомстве' },
        { ru: 'До свидания!', context: 'Формальное прощание' },
        { ru: 'Пока!', context: 'Неформальное прощание' },
        { ru: 'Хорошего дня!', context: 'Пожелание хорошего дня' }
      ]
    }
  ]
};

async function main() {
  const { data, error } = await supabase
    .from('course_lessons')
    .insert(lesson)
    .select()
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Lesson created successfully!');
    console.log('ID:', data.id);
    console.log('Slug:', data.slug);
  }
}

main().catch(console.error);
