require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const lesson10Content = {
  // blocks_fr - For French speakers learning French
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'Saluer et se présenter'
    },
    {
      type: 'subtitle',
      text: 'Les bases de la communication en français'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: 'Bonjour / Bonsoir',
          translation: 'Salutations formelles'
        },
        {
          form: 'Salut / Coucou',
          translation: 'Salutations informelles'
        },
        {
          form: 'Je m\'appelle...',
          translation: 'Se présenter'
        },
        {
          form: 'Tu / Vous',
          translation: 'Tutoiement et vouvoiement'
        }
      ]
    },
    {
      type: 'title',
      text: 'Les salutations'
    },
    {
      type: 'paragraph',
      text: 'En français, on adapte la salutation selon le moment de la journée et le niveau de formalité.'
    },
    {
      type: 'conjugationTable',
      title: 'Salutations selon le moment',
      rows: [
        {
          pronoun: '🌅 Matin/Journée',
          form: 'Bonjour',
          translation: 'Hello / Good morning/afternoon',
          pronunciation: '[bɔ̃ʒuʁ]'
        },
        {
          pronoun: '🌙 Soir',
          form: 'Bonsoir',
          translation: 'Good evening',
          pronunciation: '[bɔ̃swaʁ]',
          mnemonic: 'Utilisé à partir de 17h-18h'
        },
        {
          pronoun: '😴 Nuit',
          form: 'Bonne nuit',
          translation: 'Good night (au coucher)',
          pronunciation: '[bɔn nɥi]'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Registres de langue',
      items: [
        {
          usage: 'Formel / Poli (vous)',
          examples: [
            'Bonjour, madame/monsieur',
            'Enchanté(e)',
            'Comment allez-vous ?',
            'Au revoir, bonne journée'
          ]
        },
        {
          usage: 'Informel / Familier (tu)',
          examples: [
            'Salut !',
            'Coucou !',
            'Ça va ?',
            'À plus ! / À bientôt !'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Se présenter'
    },
    {
      type: 'usageList',
      title: 'Donner des informations personnelles',
      items: [
        {
          usage: 'Nom',
          examples: [
            'Je m\'appelle Marie. (My name is Marie)',
            'Mon nom est Dupont. (My last name is Dupont)',
            'Comment tu t\'appelles ? (What\'s your name?)'
          ],
          commonMistake: {
            wrong: 'Mon nom est Marie (for first name)',
            correct: 'Je m\'appelle Marie'
          }
        },
        {
          usage: 'Âge',
          examples: [
            'J\'ai 25 ans. (I am 25 years old)',
            'Quel âge as-tu ? (How old are you?)'
          ]
        },
        {
          usage: 'Nationalité',
          examples: [
            'Je suis français(e). (I\'m French)',
            'Je suis du Canada. (I\'m from Canada)',
            'Je viens de Paris. (I come from Paris)'
          ]
        },
        {
          usage: 'Profession',
          examples: [
            'Je suis étudiant(e). (I\'m a student)',
            'Je travaille dans l\'informatique. (I work in IT)',
            'Qu\'est-ce que tu fais dans la vie ? (What do you do?)'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Tu vs Vous',
      rows: [
        {
          pronoun: 'TU',
          form: 'Tutoiement',
          translation: 'Informal "you"',
          mnemonic: 'Famille, amis, enfants, jeunes entre eux'
        },
        {
          pronoun: 'VOUS',
          form: 'Vouvoiement',
          translation: 'Formal "you" (singular or plural)',
          mnemonic: 'Inconnus, supérieurs, personnes âgées, contexte professionnel'
        }
      ]
    },
    {
      type: 'paragraph',
      text: '💡 Astuce : En cas de doute, utilisez "vous". Si la personne préfère "tu", elle vous le dira : "On peut se tutoyer ?"'
    },
    {
      type: 'title',
      text: 'Prendre congé'
    },
    {
      type: 'conjugationTable',
      title: 'Dire au revoir',
      rows: [
        {
          pronoun: '👔 Formel',
          form: 'Au revoir',
          translation: 'Goodbye',
          pronunciation: '[oʁvwaʁ]'
        },
        {
          pronoun: '😊 Standard',
          form: 'Bonne journée / Bonne soirée',
          translation: 'Have a good day/evening'
        },
        {
          pronoun: '👋 Informel',
          form: 'Salut ! / Ciao !',
          translation: 'Bye!'
        },
        {
          pronoun: '🤝 Entre amis',
          form: 'À bientôt / À plus tard / À tout à l\'heure',
          translation: 'See you soon/later'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Première rencontre (formel)',
      lines: [
        {
          speaker: 'Vous',
          text: 'Bonjour, je m\'appelle Thomas Martin.'
        },
        {
          speaker: 'Claire',
          text: 'Enchantée, moi c\'est Claire Dubois. Vous êtes français ?'
        },
        {
          speaker: 'Vous',
          text: 'Non, je suis belge. Je viens de Bruxelles. Et vous ?'
        },
        {
          speaker: 'Claire',
          text: 'Je suis française, de Lyon. Qu\'est-ce que vous faites dans la vie ?'
        },
        {
          speaker: 'Vous',
          text: 'Je suis ingénieur. Et vous ?'
        },
        {
          speaker: 'Claire',
          text: 'Je travaille dans le marketing.'
        }
      ],
      translation: 'You: Hello, my name is Thomas Martin. | Claire: Nice to meet you, I\'m Claire Dubois. Are you French? | You: No, I\'m Belgian. I\'m from Brussels. And you? | Claire: I\'m French, from Lyon. What do you do? | You: I\'m an engineer. And you? | Claire: I work in marketing.'
    },
    {
      type: 'miniDialogue',
      title: 'Rencontre entre étudiants (informel)',
      lines: [
        {
          speaker: 'Léa',
          text: 'Salut ! Tu t\'appelles comment ?'
        },
        {
          speaker: 'Vous',
          text: 'Salut ! Moi c\'est Alex. Et toi ?'
        },
        {
          speaker: 'Léa',
          text: 'Moi, c\'est Léa. Tu viens d\'où ?'
        },
        {
          speaker: 'Vous',
          text: 'Je suis de Montréal, au Canada. Et toi ?'
        },
        {
          speaker: 'Léa',
          text: 'Moi, je suis parisienne. Tu es étudiant ?'
        },
        {
          speaker: 'Vous',
          text: 'Oui, j\'étudie le français. Toi aussi ?'
        },
        {
          speaker: 'Léa',
          text: 'Non, moi je fais du droit.'
        }
      ],
      translation: 'Léa: Hi! What\'s your name? | You: Hi! I\'m Alex. And you? | Léa: I\'m Léa. Where are you from? | You: I\'m from Montreal, Canada. And you? | Léa: I\'m Parisian. Are you a student? | You: Yes, I\'m studying French. You too? | Léa: No, I\'m studying law.'
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'Bonjour le soir après 18h',
          correct: 'Bonsoir',
          explanation: 'Utilisez "bonsoir" en fin d\'après-midi/soirée'
        },
        {
          wrong: 'Je m\'appelle Dupont (nom de famille)',
          correct: 'Mon nom est Dupont / Je m\'appelle Marie Dupont',
          explanation: '"Je m\'appelle" s\'utilise surtout avec le prénom'
        },
        {
          wrong: 'Tutoyer un inconnu adulte',
          correct: 'Vouvoyer d\'abord',
          explanation: 'Attendez que l\'autre propose le tutoiement'
        }
      ]
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 4: Les pronoms sujets et ÊTRE',
          url: '/lessons?slug=les-pronoms-sujets-et-etre'
        },
        {
          title: 'Leçon 11: La négation simple',
          url: '/lessons?slug=la-negation-simple'
        }
      ]
    }
  ],

  // blocks_en - For English speakers learning French
  blocks_en: [
    {
      type: 'mainTitle',
      text: 'Greeting and Introducing Yourself'
    },
    {
      type: 'subtitle',
      text: 'The Basics of French Communication'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: 'Bonjour / Bonsoir',
          translation: 'Formal greetings'
        },
        {
          form: 'Salut / Coucou',
          translation: 'Informal greetings'
        },
        {
          form: 'Je m\'appelle...',
          translation: 'Introducing yourself'
        },
        {
          form: 'Tu / Vous',
          translation: 'Informal / Formal "you"'
        }
      ]
    },
    {
      type: 'title',
      text: 'Greetings'
    },
    {
      type: 'paragraph',
      text: 'In French, greetings vary depending on the time of day and the level of formality.'
    },
    {
      type: 'conjugationTable',
      title: 'Greetings by Time of Day',
      rows: [
        {
          pronoun: '🌅 Morning/Day',
          form: 'Bonjour',
          translation: 'Hello / Good morning/afternoon',
          pronunciation: '[bɔ̃ʒuʁ]'
        },
        {
          pronoun: '🌙 Evening',
          form: 'Bonsoir',
          translation: 'Good evening',
          pronunciation: '[bɔ̃swaʁ]',
          mnemonic: 'Used from 5-6 PM onwards'
        },
        {
          pronoun: '😴 Night',
          form: 'Bonne nuit',
          translation: 'Good night (when going to bed)',
          pronunciation: '[bɔn nɥi]'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Formal vs Informal',
      items: [
        {
          usage: 'Formal / Polite (vous)',
          examples: [
            'Bonjour, madame/monsieur',
            'Enchanté(e)',
            'Comment allez-vous ?',
            'Au revoir, bonne journée'
          ]
        },
        {
          usage: 'Informal / Casual (tu)',
          examples: [
            'Salut !',
            'Coucou !',
            'Ça va ?',
            'À plus ! / À bientôt !'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Introducing Yourself'
    },
    {
      type: 'usageList',
      title: 'Giving Personal Information',
      items: [
        {
          usage: 'Name',
          examples: [
            'Je m\'appelle Marie. (My name is Marie)',
            'Mon nom est Dupont. (My last name is Dupont)',
            'Comment tu t\'appelles ? (What\'s your name?)'
          ],
          commonMistake: {
            wrong: 'Mon nom est Marie (for first name)',
            correct: 'Je m\'appelle Marie'
          }
        },
        {
          usage: 'Age',
          examples: [
            'J\'ai 25 ans. (I am 25 years old)',
            'Quel âge as-tu ? (How old are you?)'
          ]
        },
        {
          usage: 'Nationality',
          examples: [
            'Je suis français(e). (I\'m French)',
            'Je suis du Canada. (I\'m from Canada)',
            'Je viens de Paris. (I come from Paris)'
          ]
        },
        {
          usage: 'Profession',
          examples: [
            'Je suis étudiant(e). (I\'m a student)',
            'Je travaille dans l\'informatique. (I work in IT)',
            'Qu\'est-ce que tu fais dans la vie ? (What do you do?)'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Tu vs Vous',
      rows: [
        {
          pronoun: 'TU',
          form: 'Informal',
          translation: 'Informal "you"',
          mnemonic: 'Family, friends, children, young people among themselves'
        },
        {
          pronoun: 'VOUS',
          form: 'Formal',
          translation: 'Formal "you" (singular or plural)',
          mnemonic: 'Strangers, superiors, elderly people, professional context'
        }
      ]
    },
    {
      type: 'paragraph',
      text: '💡 Tip: When in doubt, use "vous". If the person prefers "tu", they will tell you: "On peut se tutoyer ?" (Can we use "tu"?)'
    },
    {
      type: 'title',
      text: 'Saying Goodbye'
    },
    {
      type: 'conjugationTable',
      title: 'Farewells',
      rows: [
        {
          pronoun: '👔 Formal',
          form: 'Au revoir',
          translation: 'Goodbye',
          pronunciation: '[oʁvwaʁ]'
        },
        {
          pronoun: '😊 Standard',
          form: 'Bonne journée / Bonne soirée',
          translation: 'Have a good day/evening'
        },
        {
          pronoun: '👋 Informal',
          form: 'Salut ! / Ciao !',
          translation: 'Bye!'
        },
        {
          pronoun: '🤝 Among friends',
          form: 'À bientôt / À plus tard / À tout à l\'heure',
          translation: 'See you soon/later'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'First Meeting (formal)',
      lines: [
        {
          speaker: 'You',
          text: 'Bonjour, je m\'appelle Thomas Martin.'
        },
        {
          speaker: 'Claire',
          text: 'Enchantée, moi c\'est Claire Dubois. Vous êtes français ?'
        },
        {
          speaker: 'You',
          text: 'Non, je suis belge. Je viens de Bruxelles. Et vous ?'
        },
        {
          speaker: 'Claire',
          text: 'Je suis française, de Lyon. Qu\'est-ce que vous faites dans la vie ?'
        },
        {
          speaker: 'You',
          text: 'Je suis ingénieur. Et vous ?'
        },
        {
          speaker: 'Claire',
          text: 'Je travaille dans le marketing.'
        }
      ],
      translation: 'You: Hello, my name is Thomas Martin. | Claire: Nice to meet you, I\'m Claire Dubois. Are you French? | You: No, I\'m Belgian. I\'m from Brussels. And you? | Claire: I\'m French, from Lyon. What do you do? | You: I\'m an engineer. And you? | Claire: I work in marketing.'
    },
    {
      type: 'miniDialogue',
      title: 'Meeting Between Students (informal)',
      lines: [
        {
          speaker: 'Léa',
          text: 'Salut ! Tu t\'appelles comment ?'
        },
        {
          speaker: 'You',
          text: 'Salut ! Moi c\'est Alex. Et toi ?'
        },
        {
          speaker: 'Léa',
          text: 'Moi, c\'est Léa. Tu viens d\'où ?'
        },
        {
          speaker: 'You',
          text: 'Je suis de Montréal, au Canada. Et toi ?'
        },
        {
          speaker: 'Léa',
          text: 'Moi, je suis parisienne. Tu es étudiant ?'
        },
        {
          speaker: 'You',
          text: 'Oui, j\'étudie le français. Toi aussi ?'
        },
        {
          speaker: 'Léa',
          text: 'Non, moi je fais du droit.'
        }
      ],
      translation: 'Léa: Hi! What\'s your name? | You: Hi! I\'m Alex. And you? | Léa: I\'m Léa. Where are you from? | You: I\'m from Montreal, Canada. And you? | Léa: I\'m Parisian. Are you a student? | You: Yes, I\'m studying French. You too? | Léa: No, I\'m studying law.'
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'Bonjour in the evening after 6 PM',
          correct: 'Bonsoir',
          explanation: 'Use "bonsoir" in late afternoon/evening'
        },
        {
          wrong: 'Je m\'appelle Dupont (last name)',
          correct: 'Mon nom est Dupont / Je m\'appelle Marie Dupont',
          explanation: '"Je m\'appelle" is mainly used with first name'
        },
        {
          wrong: 'Using "tu" with an adult stranger',
          correct: 'Use "vous" first',
          explanation: 'Wait for the other person to suggest "tu"'
        }
      ]
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 4: Subject Pronouns and ÊTRE',
          url: '/lessons?slug=les-pronoms-sujets-et-etre'
        },
        {
          title: 'Lesson 11: Simple Negation',
          url: '/lessons?slug=la-negation-simple'
        }
      ]
    }
  ],

  // blocks_ru - For Russian speakers learning French
  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'Приветствия и знакомство'
    },
    {
      type: 'subtitle',
      text: 'Основы французского общения'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: 'Bonjour / Bonsoir',
          translation: 'Формальные приветствия'
        },
        {
          form: 'Salut / Coucou',
          translation: 'Неформальные приветствия'
        },
        {
          form: 'Je m\'appelle...',
          translation: 'Представиться'
        },
        {
          form: 'Tu / Vous',
          translation: 'Ты / Вы'
        }
      ]
    },
    {
      type: 'title',
      text: 'Приветствия'
    },
    {
      type: 'paragraph',
      text: 'Во французском языке приветствия меняются в зависимости от времени суток и уровня формальности.'
    },
    {
      type: 'conjugationTable',
      title: 'Приветствия по времени суток',
      rows: [
        {
          pronoun: '🌅 Утро/День',
          form: 'Bonjour',
          translation: 'Здравствуйте / Добрый день',
          pronunciation: '[bɔ̃ʒuʁ]'
        },
        {
          pronoun: '🌙 Вечер',
          form: 'Bonsoir',
          translation: 'Добрый вечер',
          pronunciation: '[bɔ̃swaʁ]',
          mnemonic: 'Используется с 17-18 часов'
        },
        {
          pronoun: '😴 Ночь',
          form: 'Bonne nuit',
          translation: 'Спокойной ночи (при отходе ко сну)',
          pronunciation: '[bɔn nɥi]'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Уровни формальности',
      items: [
        {
          usage: 'Формальный / Вежливый (vous)',
          examples: [
            'Bonjour, madame/monsieur',
            'Enchanté(e)',
            'Comment allez-vous ?',
            'Au revoir, bonne journée'
          ]
        },
        {
          usage: 'Неформальный / Дружеский (tu)',
          examples: [
            'Salut !',
            'Coucou !',
            'Ça va ?',
            'À plus ! / À bientôt !'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Представиться'
    },
    {
      type: 'usageList',
      title: 'Личная информация',
      items: [
        {
          usage: 'Имя',
          examples: [
            'Je m\'appelle Marie. (Меня зовут Мари)',
            'Mon nom est Dupont. (Моя фамилия Дюпон)',
            'Comment tu t\'appelles ? (Как тебя зовут?)'
          ],
          commonMistake: {
            wrong: 'Mon nom est Marie (для имени)',
            correct: 'Je m\'appelle Marie'
          }
        },
        {
          usage: 'Возраст',
          examples: [
            'J\'ai 25 ans. (Мне 25 лет)',
            'Quel âge as-tu ? (Сколько тебе лет?)'
          ]
        },
        {
          usage: 'Национальность',
          examples: [
            'Je suis français(e). (Я француз/француженка)',
            'Je suis du Canada. (Я из Канады)',
            'Je viens de Paris. (Я из Парижа)'
          ]
        },
        {
          usage: 'Профессия',
          examples: [
            'Je suis étudiant(e). (Я студент/студентка)',
            'Je travaille dans l\'informatique. (Я работаю в IT)',
            'Qu\'est-ce que tu fais dans la vie ? (Чем ты занимаешься?)'
          ]
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'Tu и Vous',
      rows: [
        {
          pronoun: 'TU',
          form: 'На "ты"',
          translation: 'Неформальное обращение',
          mnemonic: 'Семья, друзья, дети, молодёжь между собой'
        },
        {
          pronoun: 'VOUS',
          form: 'На "вы"',
          translation: 'Формальное обращение (к одному или многим)',
          mnemonic: 'Незнакомцы, начальство, пожилые люди, рабочий контекст'
        }
      ]
    },
    {
      type: 'paragraph',
      text: '💡 Совет: В случае сомнения используйте "vous". Если человек предпочитает "tu", он скажет: "On peut se tutoyer ?" (Можем перейти на "ты"?)'
    },
    {
      type: 'title',
      text: 'Прощание'
    },
    {
      type: 'conjugationTable',
      title: 'Попрощаться',
      rows: [
        {
          pronoun: '👔 Формально',
          form: 'Au revoir',
          translation: 'До свидания',
          pronunciation: '[oʁvwaʁ]'
        },
        {
          pronoun: '😊 Стандартно',
          form: 'Bonne journée / Bonne soirée',
          translation: 'Хорошего дня/вечера'
        },
        {
          pronoun: '👋 Неформально',
          form: 'Salut ! / Ciao !',
          translation: 'Пока!'
        },
        {
          pronoun: '🤝 Между друзьями',
          form: 'À bientôt / À plus tard / À tout à l\'heure',
          translation: 'До скорого/позже'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Первая встреча (формально)',
      lines: [
        {
          speaker: 'Вы',
          text: 'Bonjour, je m\'appelle Thomas Martin.'
        },
        {
          speaker: 'Клэр',
          text: 'Enchantée, moi c\'est Claire Dubois. Vous êtes français ?'
        },
        {
          speaker: 'Вы',
          text: 'Non, je suis belge. Je viens de Bruxelles. Et vous ?'
        },
        {
          speaker: 'Клэр',
          text: 'Je suis française, de Lyon. Qu\'est-ce que vous faites dans la vie ?'
        },
        {
          speaker: 'Вы',
          text: 'Je suis ingénieur. Et vous ?'
        },
        {
          speaker: 'Клэр',
          text: 'Je travaille dans le marketing.'
        }
      ],
      translation: 'Вы: Здравствуйте, меня зовут Тома Мартен. | Клэр: Приятно познакомиться, я Клэр Дюбуа. Вы француз? | Вы: Нет, я бельгиец. Я из Брюсселя. А вы? | Клэр: Я француженка, из Лиона. Чем вы занимаетесь? | Вы: Я инженер. А вы? | Клэр: Я работаю в маркетинге.'
    },
    {
      type: 'miniDialogue',
      title: 'Встреча студентов (неформально)',
      lines: [
        {
          speaker: 'Леа',
          text: 'Salut ! Tu t\'appelles comment ?'
        },
        {
          speaker: 'Вы',
          text: 'Salut ! Moi c\'est Alex. Et toi ?'
        },
        {
          speaker: 'Леа',
          text: 'Moi, c\'est Léa. Tu viens d\'où ?'
        },
        {
          speaker: 'Вы',
          text: 'Je suis de Montréal, au Canada. Et toi ?'
        },
        {
          speaker: 'Леа',
          text: 'Moi, je suis parisienne. Tu es étudiant ?'
        },
        {
          speaker: 'Вы',
          text: 'Oui, j\'étudie le français. Toi aussi ?'
        },
        {
          speaker: 'Леа',
          text: 'Non, moi je fais du droit.'
        }
      ],
      translation: 'Леа: Привет! Как тебя зовут? | Вы: Привет! Я Алекс. А тебя? | Леа: Я Леа. Ты откуда? | Вы: Я из Монреаля, Канада. А ты? | Леа: Я парижанка. Ты студент? | Вы: Да, я изучаю французский. Ты тоже? | Леа: Нет, я изучаю право.'
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'Bonjour вечером после 18:00',
          correct: 'Bonsoir',
          explanation: 'Используйте "bonsoir" в конце дня/вечером'
        },
        {
          wrong: 'Je m\'appelle Dupont (фамилия)',
          correct: 'Mon nom est Dupont / Je m\'appelle Marie Dupont',
          explanation: '"Je m\'appelle" используется в основном с именем'
        },
        {
          wrong: 'Обращение на "ты" к незнакомому взрослому',
          correct: 'Сначала на "вы"',
          explanation: 'Подождите, пока другой предложит перейти на "ты"'
        }
      ]
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 4: Личные местоимения и глагол ÊTRE',
          url: '/lessons?slug=les-pronoms-sujets-et-etre'
        },
        {
          title: 'Урок 11: Простое отрицание',
          url: '/lessons?slug=la-negation-simple'
        }
      ]
    }
  ]
};

async function updateLesson10() {
  console.log('🚀 Updating Lesson 10: Saluer et se présenter...\n');

  try {
    const { data, error } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson10Content.blocks_fr,
        blocks_en: lesson10Content.blocks_en,
        blocks_ru: lesson10Content.blocks_ru,
        keywords: ['salutations', 'greetings', 'приветствия', 'présentation', 'introduction', 'знакомство', 'tu vs vous'],
        estimated_read_time: 10
      })
      .eq('id', 10)
      .select();

    if (error) {
      console.error('❌ Error updating lesson:', error);
      throw error;
    }

    console.log('✅ Lesson 10 updated successfully!');
    console.log('Lesson details:', data[0]);

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

updateLesson10()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
