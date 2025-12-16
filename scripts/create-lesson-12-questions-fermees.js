require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const lesson12Content = {
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'Poser des questions fermées'
    },
    {
      type: 'subtitle',
      text: 'Les trois façons de poser une question oui/non'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: 'Intonation montante',
          translation: 'Tu viens ? (familier)'
        },
        {
          form: 'Est-ce que',
          translation: 'Est-ce que tu viens ? (standard)'
        },
        {
          form: 'Inversion',
          translation: 'Viens-tu ? (formel)'
        },
        {
          form: 'Oui / Non / Si',
          translation: 'Si pour répondre à une négation'
        }
      ]
    },
    {
      type: 'title',
      text: 'Les trois structures interrogatives'
    },
    {
      type: 'paragraph',
      text: 'En français, il existe trois façons de poser une question fermée (oui/non), classées par niveau de formalité.'
    },
    {
      type: 'conjugationTable',
      title: '3 façons de poser la même question',
      rows: [
        {
          pronoun: '😊 Familier',
          form: 'Tu parles français ?',
          translation: 'Intonation montante',
          mnemonic: 'La plus simple, juste l\'intonation'
        },
        {
          pronoun: '👔 Standard',
          form: 'Est-ce que tu parles français ?',
          translation: 'Avec "est-ce que"',
          mnemonic: 'La plus courante à l\'oral'
        },
        {
          pronoun: '🎩 Formel',
          form: 'Parles-tu français ?',
          translation: 'Inversion sujet-verbe',
          mnemonic: 'Style soutenu, écrit'
        }
      ]
    },
    {
      type: 'title',
      text: '1. Intonation montante (familier)'
    },
    {
      type: 'paragraph',
      text: 'La façon la plus simple : on garde l\'ordre normal et on monte la voix à la fin. ↗️'
    },
    {
      type: 'usageList',
      title: 'Exemples d\'intonation',
      items: [
        {
          usage: 'Avec TU',
          examples: [
            'Tu viens ce soir ? ↗️',
            'Tu as faim ? ↗️',
            'Tu aimes le chocolat ? ↗️'
          ]
        },
        {
          usage: 'Avec VOUS',
          examples: [
            'Vous habitez à Paris ? ↗️',
            'Vous parlez anglais ? ↗️',
            'Vous avez des enfants ? ↗️'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: '2. Est-ce que... (standard)'
    },
    {
      type: 'paragraph',
      text: 'On ajoute "Est-ce que" au début de la phrase. C\'est la forme la plus utilisée à l\'oral.'
    },
    {
      type: 'usageList',
      title: 'Construction avec est-ce que',
      items: [
        {
          usage: 'Structure',
          examples: [
            'Est-ce que + sujet + verbe + ?',
            'Est-ce que tu viens ?',
            'Est-ce qu\'il est français ? (élision devant voyelle)'
          ]
        },
        {
          usage: 'Exemples courants',
          examples: [
            'Est-ce que tu es étudiant ?',
            'Est-ce que vous avez le temps ?',
            'Est-ce qu\'elle habite ici ?',
            'Est-ce qu\'on peut fumer ?'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: '3. Inversion sujet-verbe (formel)'
    },
    {
      type: 'paragraph',
      text: 'On inverse le verbe et le pronom sujet, reliés par un trait d\'union. Style plus formel.'
    },
    {
      type: 'conjugationTable',
      title: 'Formation avec inversion',
      verb: 'parler',
      rows: [
        {
          pronoun: 'Tu',
          form: 'Parles-tu ?',
          translation: 'Do you speak?'
        },
        {
          pronoun: 'Il/Elle',
          form: 'Parle-t-il ? / Parle-t-elle ?',
          translation: 'Does he/she speak?',
          mnemonic: '-t- euphonique pour éviter 2 voyelles'
        },
        {
          pronoun: 'Nous',
          form: 'Parlons-nous ?',
          translation: 'Do we speak?'
        },
        {
          pronoun: 'Vous',
          form: 'Parlez-vous ?',
          translation: 'Do you speak?'
        },
        {
          pronoun: 'Ils/Elles',
          form: 'Parlent-ils ? / Parlent-elles ?',
          translation: 'Do they speak?'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Cas particuliers de l\'inversion',
      items: [
        {
          usage: 'Ajout du -t- euphonique',
          examples: [
            'A-t-il faim ? (pas "A-il faim?")',
            'Va-t-elle à Paris ? (pas "Va-elle?")',
            'Mange-t-on ici ? (pas "Mange-on?")'
          ],
          commonMistake: {
            wrong: 'Parle-il ?',
            correct: 'Parle-t-il ?'
          }
        },
        {
          usage: 'Avec nom propre',
          examples: [
            'Marie vient-elle ? (pas "Vient Marie?")',
            'Pierre a-t-il téléphoné ?',
            'Les étudiants sont-ils prêts ?'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Répondre aux questions'
    },
    {
      type: 'conjugationTable',
      title: 'Oui / Non / Si',
      rows: [
        {
          pronoun: 'Question affirmative',
          form: 'Tu viens ? → Oui / Non',
          translation: 'Yes / No'
        },
        {
          pronoun: 'Question négative',
          form: 'Tu ne viens pas ? → Si / Non',
          translation: 'Yes (Si) / No',
          mnemonic: 'SI pour contredire une négation'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Exemples de réponses',
      items: [
        {
          usage: 'Réponse positive à question affirmative',
          examples: [
            '— Tu parles français ? — Oui.',
            '— Est-ce que vous êtes étudiant ? — Oui, je suis étudiant.'
          ]
        },
        {
          usage: 'Réponse négative',
          examples: [
            '— Tu viens ce soir ? — Non, désolé.',
            '— Vous avez une voiture ? — Non, je n\'ai pas de voiture.'
          ]
        },
        {
          usage: 'SI pour contredire une négation',
          examples: [
            '— Tu ne parles pas anglais ? — Si, je parle anglais ! (Yes, I do!)',
            '— Vous n\'êtes pas français ? — Si, je suis français.'
          ],
          commonMistake: {
            wrong: '— Tu ne viens pas ? — Oui. (confus!)',
            correct: '— Tu ne viens pas ? — Si, je viens !'
          }
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'Parle-il français ?',
          correct: 'Parle-t-il français ?',
          explanation: 'Ajout du -t- entre deux voyelles'
        },
        {
          wrong: 'Est-ce que parles-tu ?',
          correct: 'Est-ce que tu parles ? OU Parles-tu ?',
          explanation: 'Ne pas mélanger les deux structures'
        },
        {
          wrong: '— Tu ne viens pas ? — Oui.',
          correct: '— Tu ne viens pas ? — Si !',
          explanation: 'SI pour contredire une négation'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Invitation',
      lines: [
        {
          speaker: 'Paul',
          text: 'Salut Marie ! Tu es libre ce soir ?'
        },
        {
          speaker: 'Marie',
          text: 'Oui, pourquoi ?'
        },
        {
          speaker: 'Paul',
          text: 'Est-ce que tu veux venir au cinéma avec moi ?'
        },
        {
          speaker: 'Marie',
          text: 'Oui, bonne idée ! On va voir quel film ?'
        },
        {
          speaker: 'Paul',
          text: 'Tu aimes les films d\'action ?'
        },
        {
          speaker: 'Marie',
          text: 'Non, pas trop. Tu n\'aimes pas les comédies ?'
        },
        {
          speaker: 'Paul',
          text: 'Si, j\'adore ! Alors, on va voir une comédie ?'
        },
        {
          speaker: 'Marie',
          text: 'Parfait !'
        }
      ],
      translation: 'Paul: Hi Marie! Are you free tonight? | Marie: Yes, why? | Paul: Do you want to come to the cinema with me? | Marie: Yes, good idea! What film are we going to see? | Paul: Do you like action films? | Marie: No, not really. Don\'t you like comedies? | Paul: Yes, I love them! So, shall we see a comedy? | Marie: Perfect!'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 11: La négation',
          url: '/lessons?slug=la-negation-simple'
        },
        {
          title: 'Leçon 10: Saluer et se présenter',
          url: '/lessons?slug=saluer-et-se-presenter'
        }
      ]
    }
  ],

  blocks_en: [
    {
      type: 'mainTitle',
      text: 'Asking Yes/No Questions'
    },
    {
      type: 'subtitle',
      text: 'Three Ways to Ask Yes/No Questions'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: 'Rising intonation',
          translation: 'Tu viens ? (casual)'
        },
        {
          form: 'Est-ce que',
          translation: 'Est-ce que tu viens ? (standard)'
        },
        {
          form: 'Inversion',
          translation: 'Viens-tu ? (formal)'
        },
        {
          form: 'Oui / Non / Si',
          translation: 'Si to answer negative questions'
        }
      ]
    },
    {
      type: 'title',
      text: 'Three Question Structures'
    },
    {
      type: 'paragraph',
      text: 'In French, there are three ways to ask a yes/no question, ranked by formality level.'
    },
    {
      type: 'conjugationTable',
      title: '3 Ways to Ask the Same Question',
      rows: [
        {
          pronoun: '😊 Casual',
          form: 'Tu parles français ?',
          translation: 'Rising intonation',
          mnemonic: 'Simplest, just intonation'
        },
        {
          pronoun: '👔 Standard',
          form: 'Est-ce que tu parles français ?',
          translation: 'With "est-ce que"',
          mnemonic: 'Most common in speech'
        },
        {
          pronoun: '🎩 Formal',
          form: 'Parles-tu français ?',
          translation: 'Subject-verb inversion',
          mnemonic: 'Formal style, written'
        }
      ]
    },
    {
      type: 'title',
      text: '1. Rising Intonation (casual)'
    },
    {
      type: 'paragraph',
      text: 'The simplest way: keep normal word order and raise your voice at the end. ↗️'
    },
    {
      type: 'usageList',
      title: 'Intonation Examples',
      items: [
        {
          usage: 'With TU',
          examples: [
            'Tu viens ce soir ? ↗️',
            'Tu as faim ? ↗️',
            'Tu aimes le chocolat ? ↗️'
          ]
        },
        {
          usage: 'With VOUS',
          examples: [
            'Vous habitez à Paris ? ↗️',
            'Vous parlez anglais ? ↗️',
            'Vous avez des enfants ? ↗️'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: '2. Est-ce que... (standard)'
    },
    {
      type: 'paragraph',
      text: 'Add "Est-ce que" at the beginning of the sentence. Most commonly used in speech.'
    },
    {
      type: 'usageList',
      title: 'Construction with est-ce que',
      items: [
        {
          usage: 'Structure',
          examples: [
            'Est-ce que + subject + verb + ?',
            'Est-ce que tu viens ?',
            'Est-ce qu\'il est français ? (elision before vowel)'
          ]
        },
        {
          usage: 'Common examples',
          examples: [
            'Est-ce que tu es étudiant ?',
            'Est-ce que vous avez le temps ?',
            'Est-ce qu\'elle habite ici ?',
            'Est-ce qu\'on peut fumer ?'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: '3. Subject-Verb Inversion (formal)'
    },
    {
      type: 'paragraph',
      text: 'Invert the verb and subject pronoun, linked by a hyphen. More formal style.'
    },
    {
      type: 'conjugationTable',
      title: 'Formation with Inversion',
      verb: 'parler',
      rows: [
        {
          pronoun: 'Tu',
          form: 'Parles-tu ?',
          translation: 'Do you speak?'
        },
        {
          pronoun: 'Il/Elle',
          form: 'Parle-t-il ? / Parle-t-elle ?',
          translation: 'Does he/she speak?',
          mnemonic: 'Add -t- to avoid two vowels'
        },
        {
          pronoun: 'Nous',
          form: 'Parlons-nous ?',
          translation: 'Do we speak?'
        },
        {
          pronoun: 'Vous',
          form: 'Parlez-vous ?',
          translation: 'Do you speak?'
        },
        {
          pronoun: 'Ils/Elles',
          form: 'Parlent-ils ? / Parlent-elles ?',
          translation: 'Do they speak?'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Special Cases of Inversion',
      items: [
        {
          usage: 'Adding euphonic -t-',
          examples: [
            'A-t-il faim ? (not "A-il faim?")',
            'Va-t-elle à Paris ? (not "Va-elle?")',
            'Mange-t-on ici ? (not "Mange-on?")'
          ],
          commonMistake: {
            wrong: 'Parle-il ?',
            correct: 'Parle-t-il ?'
          }
        },
        {
          usage: 'With proper nouns',
          examples: [
            'Marie vient-elle ? (not "Vient Marie?")',
            'Pierre a-t-il téléphoné ?',
            'Les étudiants sont-ils prêts ?'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Answering Questions'
    },
    {
      type: 'conjugationTable',
      title: 'Oui / Non / Si',
      rows: [
        {
          pronoun: 'Affirmative question',
          form: 'Tu viens ? → Oui / Non',
          translation: 'Yes / No'
        },
        {
          pronoun: 'Negative question',
          form: 'Tu ne viens pas ? → Si / Non',
          translation: 'Yes (Si) / No',
          mnemonic: 'SI to contradict a negative'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Answer Examples',
      items: [
        {
          usage: 'Positive answer to affirmative question',
          examples: [
            '— Tu parles français ? — Oui.',
            '— Est-ce que vous êtes étudiant ? — Oui, je suis étudiant.'
          ]
        },
        {
          usage: 'Negative answer',
          examples: [
            '— Tu viens ce soir ? — Non, désolé.',
            '— Vous avez une voiture ? — Non, je n\'ai pas de voiture.'
          ]
        },
        {
          usage: 'SI to contradict a negative',
          examples: [
            '— Tu ne parles pas anglais ? — Si, je parle anglais ! (Yes, I do!)',
            '— Vous n\'êtes pas français ? — Si, je suis français.'
          ],
          commonMistake: {
            wrong: '— Tu ne viens pas ? — Oui. (confusing!)',
            correct: '— Tu ne viens pas ? — Si, je viens !'
          }
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'Parle-il français ?',
          correct: 'Parle-t-il français ?',
          explanation: 'Add -t- between two vowels'
        },
        {
          wrong: 'Est-ce que parles-tu ?',
          correct: 'Est-ce que tu parles ? OR Parles-tu ?',
          explanation: 'Don\'t mix the two structures'
        },
        {
          wrong: '— Tu ne viens pas ? — Oui.',
          correct: '— Tu ne viens pas ? — Si !',
          explanation: 'SI to contradict a negative'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Invitation',
      lines: [
        {
          speaker: 'Paul',
          text: 'Salut Marie ! Tu es libre ce soir ?'
        },
        {
          speaker: 'Marie',
          text: 'Oui, pourquoi ?'
        },
        {
          speaker: 'Paul',
          text: 'Est-ce que tu veux venir au cinéma avec moi ?'
        },
        {
          speaker: 'Marie',
          text: 'Oui, bonne idée ! On va voir quel film ?'
        },
        {
          speaker: 'Paul',
          text: 'Tu aimes les films d\'action ?'
        },
        {
          speaker: 'Marie',
          text: 'Non, pas trop. Tu n\'aimes pas les comédies ?'
        },
        {
          speaker: 'Paul',
          text: 'Si, j\'adore ! Alors, on va voir une comédie ?'
        },
        {
          speaker: 'Marie',
          text: 'Parfait !'
        }
      ],
      translation: 'Paul: Hi Marie! Are you free tonight? | Marie: Yes, why? | Paul: Do you want to come to the cinema with me? | Marie: Yes, good idea! What film are we going to see? | Paul: Do you like action films? | Marie: No, not really. Don\'t you like comedies? | Paul: Yes, I love them! So, shall we see a comedy? | Marie: Perfect!'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 11: Negation',
          url: '/lessons?slug=la-negation-simple'
        },
        {
          title: 'Lesson 10: Greetings',
          url: '/lessons?slug=saluer-et-se-presenter'
        }
      ]
    }
  ],

  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'Задавать закрытые вопросы'
    },
    {
      type: 'subtitle',
      text: 'Три способа задать вопрос да/нет'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: 'Восходящая интонация',
          translation: 'Tu viens ? (разговорный)'
        },
        {
          form: 'Est-ce que',
          translation: 'Est-ce que tu viens ? (стандартный)'
        },
        {
          form: 'Инверсия',
          translation: 'Viens-tu ? (формальный)'
        },
        {
          form: 'Oui / Non / Si',
          translation: 'Si для ответа на отрицание'
        }
      ]
    },
    {
      type: 'title',
      text: 'Три вопросительные структуры'
    },
    {
      type: 'paragraph',
      text: 'Во французском языке существует три способа задать закрытый вопрос (да/нет), различающихся по уровню формальности.'
    },
    {
      type: 'conjugationTable',
      title: '3 способа задать один и тот же вопрос',
      rows: [
        {
          pronoun: '😊 Разговорный',
          form: 'Tu parles français ?',
          translation: 'Восходящая интонация',
          mnemonic: 'Самый простой, только интонация'
        },
        {
          pronoun: '👔 Стандартный',
          form: 'Est-ce que tu parles français ?',
          translation: 'С "est-ce que"',
          mnemonic: 'Самый частый в речи'
        },
        {
          pronoun: '🎩 Формальный',
          form: 'Parles-tu français ?',
          translation: 'Инверсия подлежащее-глагол',
          mnemonic: 'Официальный стиль, письменная речь'
        }
      ]
    },
    {
      type: 'title',
      text: '1. Восходящая интонация (разговорный)'
    },
    {
      type: 'paragraph',
      text: 'Самый простой способ: сохраняем обычный порядок слов и повышаем голос в конце. ↗️'
    },
    {
      type: 'usageList',
      title: 'Примеры с интонацией',
      items: [
        {
          usage: 'С TU',
          examples: [
            'Tu viens ce soir ? ↗️',
            'Tu as faim ? ↗️',
            'Tu aimes le chocolat ? ↗️'
          ]
        },
        {
          usage: 'С VOUS',
          examples: [
            'Vous habitez à Paris ? ↗️',
            'Vous parlez anglais ? ↗️',
            'Vous avez des enfants ? ↗️'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: '2. Est-ce que... (стандартный)'
    },
    {
      type: 'paragraph',
      text: 'Добавляем "Est-ce que" в начало предложения. Самая используемая форма в речи.'
    },
    {
      type: 'usageList',
      title: 'Конструкция с est-ce que',
      items: [
        {
          usage: 'Структура',
          examples: [
            'Est-ce que + подлежащее + глагол + ?',
            'Est-ce que tu viens ?',
            'Est-ce qu\'il est français ? (элизия перед гласной)'
          ]
        },
        {
          usage: 'Частые примеры',
          examples: [
            'Est-ce que tu es étudiant ?',
            'Est-ce que vous avez le temps ?',
            'Est-ce qu\'elle habite ici ?',
            'Est-ce qu\'on peut fumer ?'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: '3. Инверсия подлежащее-глагол (формальный)'
    },
    {
      type: 'paragraph',
      text: 'Меняем местами глагол и местоимение-подлежащее, связывая дефисом. Более формальный стиль.'
    },
    {
      type: 'conjugationTable',
      title: 'Образование с инверсией',
      verb: 'parler',
      rows: [
        {
          pronoun: 'Tu',
          form: 'Parles-tu ?',
          translation: 'Ты говоришь?'
        },
        {
          pronoun: 'Il/Elle',
          form: 'Parle-t-il ? / Parle-t-elle ?',
          translation: 'Он/Она говорит?',
          mnemonic: 'Добавляем -t- чтобы избежать двух гласных'
        },
        {
          pronoun: 'Nous',
          form: 'Parlons-nous ?',
          translation: 'Мы говорим?'
        },
        {
          pronoun: 'Vous',
          form: 'Parlez-vous ?',
          translation: 'Вы говорите?'
        },
        {
          pronoun: 'Ils/Elles',
          form: 'Parlent-ils ? / Parlent-elles ?',
          translation: 'Они говорят?'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Особые случаи инверсии',
      items: [
        {
          usage: 'Добавление эвфонического -t-',
          examples: [
            'A-t-il faim ? (не "A-il faim?")',
            'Va-t-elle à Paris ? (не "Va-elle?")',
            'Mange-t-on ici ? (не "Mange-on?")'
          ],
          commonMistake: {
            wrong: 'Parle-il ?',
            correct: 'Parle-t-il ?'
          }
        },
        {
          usage: 'С именами собственными',
          examples: [
            'Marie vient-elle ? (не "Vient Marie?")',
            'Pierre a-t-il téléphoné ?',
            'Les étudiants sont-ils prêts ?'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Отвечать на вопросы'
    },
    {
      type: 'conjugationTable',
      title: 'Oui / Non / Si',
      rows: [
        {
          pronoun: 'Утвердительный вопрос',
          form: 'Tu viens ? → Oui / Non',
          translation: 'Да / Нет'
        },
        {
          pronoun: 'Отрицательный вопрос',
          form: 'Tu ne viens pas ? → Si / Non',
          translation: 'Да (Si) / Нет',
          mnemonic: 'SI чтобы опровергнуть отрицание'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Примеры ответов',
      items: [
        {
          usage: 'Положительный ответ на утвердительный вопрос',
          examples: [
            '— Tu parles français ? — Oui.',
            '— Est-ce que vous êtes étudiant ? — Oui, je suis étudiant.'
          ]
        },
        {
          usage: 'Отрицательный ответ',
          examples: [
            '— Tu viens ce soir ? — Non, désolé.',
            '— Vous avez une voiture ? — Non, je n\'ai pas de voiture.'
          ]
        },
        {
          usage: 'SI чтобы опровергнуть отрицание',
          examples: [
            '— Tu ne parles pas anglais ? — Si, je parle anglais ! (Нет, говорю!)',
            '— Vous n\'êtes pas français ? — Si, je suis français.'
          ],
          commonMistake: {
            wrong: '— Tu ne viens pas ? — Oui. (непонятно!)',
            correct: '— Tu ne viens pas ? — Si, je viens !'
          }
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'Parle-il français ?',
          correct: 'Parle-t-il français ?',
          explanation: 'Добавляем -t- между двумя гласными'
        },
        {
          wrong: 'Est-ce que parles-tu ?',
          correct: 'Est-ce que tu parles ? ИЛИ Parles-tu ?',
          explanation: 'Не смешивать две структуры'
        },
        {
          wrong: '— Tu ne viens pas ? — Oui.',
          correct: '— Tu ne viens pas ? — Si !',
          explanation: 'SI чтобы опровергнуть отрицание'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Приглашение',
      lines: [
        {
          speaker: 'Поль',
          text: 'Salut Marie ! Tu es libre ce soir ?'
        },
        {
          speaker: 'Мари',
          text: 'Oui, pourquoi ?'
        },
        {
          speaker: 'Поль',
          text: 'Est-ce que tu veux venir au cinéma avec moi ?'
        },
        {
          speaker: 'Мари',
          text: 'Oui, bonne idée ! On va voir quel film ?'
        },
        {
          speaker: 'Поль',
          text: 'Tu aimes les films d\'action ?'
        },
        {
          speaker: 'Мари',
          text: 'Non, pas trop. Tu n\'aimes pas les comédies ?'
        },
        {
          speaker: 'Поль',
          text: 'Si, j\'adore ! Alors, on va voir une comédie ?'
        },
        {
          speaker: 'Мари',
          text: 'Parfait !'
        }
      ],
      translation: 'Поль: Привет Мари! Ты свободна сегодня вечером? | Мари: Да, почему? | Поль: Хочешь пойти со мной в кино? | Мари: Да, отличная идея! Какой фильм посмотрим? | Поль: Ты любишь боевики? | Мари: Нет, не очень. Ты не любишь комедии? | Поль: Нет, обожаю! Тогда пойдём на комедию? | Мари: Отлично!'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 11: Отрицание',
          url: '/lessons?slug=la-negation-simple'
        },
        {
          title: 'Урок 10: Приветствия',
          url: '/lessons?slug=saluer-et-se-presenter'
        }
      ]
    }
  ]
};

async function updateLesson12() {
  console.log('🚀 Updating Lesson 12: Poser des questions fermées...\n');

  try {
    const { data, error } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson12Content.blocks_fr,
        blocks_en: lesson12Content.blocks_en,
        blocks_ru: lesson12Content.blocks_ru,
        keywords: ['questions', 'вопросы', 'est-ce que', 'inversion', 'инверсия', 'oui non si', 'да нет'],
        estimated_read_time: 14
      })
      .eq('id', 12)
      .select();

    if (error) {
      console.error('❌ Error updating lesson:', error);
      throw error;
    }

    console.log('✅ Lesson 12 updated successfully!');

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

updateLesson12()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
