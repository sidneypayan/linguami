require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const lesson11Content = {
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'La négation simple'
    },
    {
      type: 'subtitle',
      text: 'Comment dire "non" en français'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: 'ne ... pas',
          translation: 'Négation de base'
        },
        {
          form: 'ne ... jamais',
          translation: 'Jamais, never'
        },
        {
          form: 'ne ... plus',
          translation: 'Plus, no longer'
        },
        {
          form: 'n\' + voyelle',
          translation: 'Élision devant voyelle'
        }
      ]
    },
    {
      type: 'title',
      text: 'La structure NE ... PAS'
    },
    {
      type: 'paragraph',
      text: 'En français, la négation standard utilise deux mots qui encadrent le verbe : NE (ou N\') avant le verbe et PAS après le verbe.'
    },
    {
      type: 'conjugationTable',
      title: 'Formation de base',
      verb: 'parler',
      rows: [
        {
          pronoun: 'Affirmatif',
          form: 'Je parle français',
          translation: 'I speak French'
        },
        {
          pronoun: 'Négatif',
          form: 'Je ne parle pas français',
          translation: 'I don\'t speak French',
          mnemonic: 'NE + verbe + PAS'
        },
        {
          pronoun: 'Avec voyelle',
          form: 'Je n\'aime pas',
          translation: 'I don\'t like',
          mnemonic: 'NE devient N\' devant voyelle'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Exemples avec différents verbes',
      items: [
        {
          usage: 'ÊTRE et AVOIR',
          examples: [
            'Je ne suis pas français. (I\'m not French)',
            'Elle n\'est pas ici. (She\'s not here)',
            'Nous n\'avons pas de voiture. (We don\'t have a car)',
            'Tu n\'as pas faim ? (Aren\'t you hungry?)'
          ]
        },
        {
          usage: 'Verbes en -ER',
          examples: [
            'Je ne parle pas anglais. (I don\'t speak English)',
            'Il ne travaille pas aujourd\'hui. (He\'s not working today)',
            'Vous ne mangez pas de viande ? (Don\'t you eat meat?)'
          ]
        },
        {
          usage: 'Verbes irréguliers',
          examples: [
            'Je ne fais pas de sport. (I don\'t do sports)',
            'Tu ne prends pas le métro ? (Don\'t you take the metro?)',
            'Nous n\'allons pas au cinéma. (We\'re not going to the cinema)'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Autres formes de négation'
    },
    {
      type: 'conjugationTable',
      title: 'NE ... JAMAIS (never)',
      rows: [
        {
          pronoun: 'Je',
          form: 'ne bois jamais',
          translation: 'I never drink',
          pronunciation: 'de café'
        },
        {
          pronoun: 'Tu',
          form: 'ne viens jamais',
          translation: 'You never come',
          pronunciation: 'ici'
        },
        {
          pronoun: 'Il/Elle',
          form: 'ne mange jamais',
          translation: 'He/She never eats',
          pronunciation: 'de viande'
        },
        {
          pronoun: 'Nous',
          form: 'n\'allons jamais',
          translation: 'We never go',
          pronunciation: 'à la plage'
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'NE ... PLUS (no longer / no more)',
      rows: [
        {
          pronoun: 'Je',
          form: 'ne fume plus',
          translation: 'I don\'t smoke anymore',
          mnemonic: 'Action qui était vraie avant'
        },
        {
          pronoun: 'Il',
          form: 'ne travaille plus',
          translation: 'He doesn\'t work anymore',
          pronunciation: 'ici'
        },
        {
          pronoun: 'Nous',
          form: 'n\'avons plus',
          translation: 'We don\'t have anymore',
          pronunciation: 'd\'argent'
        },
        {
          pronoun: 'Ils',
          form: 'n\'habitent plus',
          translation: 'They no longer live',
          pronunciation: 'à Paris'
        }
      ]
    },
    {
      type: 'paragraph',
      text: '💡 Astuce : NE ... PLUS indique un changement d\'état. Avant c\'était vrai, maintenant c\'est faux.'
    },
    {
      type: 'title',
      text: 'Négation avec article'
    },
    {
      type: 'usageList',
      title: 'Changement d\'article après négation',
      items: [
        {
          usage: 'UN/UNE/DES → DE/D\'',
          examples: [
            'J\'ai un chien. → Je n\'ai pas de chien.',
            'Elle a une voiture. → Elle n\'a pas de voiture.',
            'Nous avons des enfants. → Nous n\'avons pas d\'enfants.'
          ],
          commonMistake: {
            wrong: 'Je n\'ai pas un chien',
            correct: 'Je n\'ai pas de chien'
          }
        },
        {
          usage: 'LE/LA/LES reste identique',
          examples: [
            'J\'aime le café. → Je n\'aime pas le café.',
            'Elle regarde la télé. → Elle ne regarde pas la télé.',
            'Nous prenons les clés. → Nous ne prenons pas les clés.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'Je pas parle français',
          correct: 'Je ne parle pas français',
          explanation: 'Il faut toujours NE + verbe + PAS'
        },
        {
          wrong: 'Je ne aime pas',
          correct: 'Je n\'aime pas',
          explanation: 'Élision de NE devant voyelle'
        },
        {
          wrong: 'Je n\'ai pas un chat',
          correct: 'Je n\'ai pas de chat',
          explanation: 'UN/UNE/DES devient DE après négation'
        },
        {
          wrong: 'Je jamais bois',
          correct: 'Je ne bois jamais',
          explanation: 'Il faut NE + verbe + JAMAIS'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Préférences alimentaires',
      lines: [
        {
          speaker: 'Marc',
          text: 'Tu manges de la viande ?'
        },
        {
          speaker: 'Sophie',
          text: 'Non, je ne mange pas de viande. Je suis végétarienne.'
        },
        {
          speaker: 'Marc',
          text: 'Tu ne manges jamais de viande ?'
        },
        {
          speaker: 'Sophie',
          text: 'Non, jamais. Mais avant, je mangeais de la viande. Maintenant, je ne mange plus de viande.'
        },
        {
          speaker: 'Marc',
          text: 'Et tu aimes le fromage ?'
        },
        {
          speaker: 'Sophie',
          text: 'Oui, j\'adore ! Je n\'aime pas la viande, mais j\'aime le fromage.'
        }
      ],
      translation: 'Marc: Do you eat meat? | Sophie: No, I don\'t eat meat. I\'m vegetarian. | Marc: You never eat meat? | Sophie: No, never. But before, I ate meat. Now, I don\'t eat meat anymore. | Marc: And do you like cheese? | Sophie: Yes, I love it! I don\'t like meat, but I like cheese.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 4: Le verbe ÊTRE',
          url: '/lessons?slug=les-pronoms-sujets-et-etre'
        },
        {
          title: 'Leçon 12: Poser des questions',
          url: '/lessons?slug=poser-des-questions-fermees'
        }
      ]
    }
  ],

  blocks_en: [
    {
      type: 'mainTitle',
      text: 'Simple Negation'
    },
    {
      type: 'subtitle',
      text: 'How to Say "No" in French'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: 'ne ... pas',
          translation: 'Basic negation'
        },
        {
          form: 'ne ... jamais',
          translation: 'Never'
        },
        {
          form: 'ne ... plus',
          translation: 'No longer / no more'
        },
        {
          form: 'n\' + vowel',
          translation: 'Elision before vowel'
        }
      ]
    },
    {
      type: 'title',
      text: 'The NE ... PAS Structure'
    },
    {
      type: 'paragraph',
      text: 'In French, standard negation uses two words that frame the verb: NE (or N\') before the verb and PAS after the verb.'
    },
    {
      type: 'conjugationTable',
      title: 'Basic Formation',
      verb: 'parler',
      rows: [
        {
          pronoun: 'Affirmative',
          form: 'Je parle français',
          translation: 'I speak French'
        },
        {
          pronoun: 'Negative',
          form: 'Je ne parle pas français',
          translation: 'I don\'t speak French',
          mnemonic: 'NE + verb + PAS'
        },
        {
          pronoun: 'With vowel',
          form: 'Je n\'aime pas',
          translation: 'I don\'t like',
          mnemonic: 'NE becomes N\' before vowel'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Examples with Different Verbs',
      items: [
        {
          usage: 'ÊTRE and AVOIR',
          examples: [
            'Je ne suis pas français. (I\'m not French)',
            'Elle n\'est pas ici. (She\'s not here)',
            'Nous n\'avons pas de voiture. (We don\'t have a car)',
            'Tu n\'as pas faim ? (Aren\'t you hungry?)'
          ]
        },
        {
          usage: '-ER Verbs',
          examples: [
            'Je ne parle pas anglais. (I don\'t speak English)',
            'Il ne travaille pas aujourd\'hui. (He\'s not working today)',
            'Vous ne mangez pas de viande ? (Don\'t you eat meat?)'
          ]
        },
        {
          usage: 'Irregular Verbs',
          examples: [
            'Je ne fais pas de sport. (I don\'t do sports)',
            'Tu ne prends pas le métro ? (Don\'t you take the metro?)',
            'Nous n\'allons pas au cinéma. (We\'re not going to the cinema)'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Other Forms of Negation'
    },
    {
      type: 'conjugationTable',
      title: 'NE ... JAMAIS (never)',
      rows: [
        {
          pronoun: 'Je',
          form: 'ne bois jamais',
          translation: 'I never drink',
          pronunciation: 'de café'
        },
        {
          pronoun: 'Tu',
          form: 'ne viens jamais',
          translation: 'You never come',
          pronunciation: 'ici'
        },
        {
          pronoun: 'Il/Elle',
          form: 'ne mange jamais',
          translation: 'He/She never eats',
          pronunciation: 'de viande'
        },
        {
          pronoun: 'Nous',
          form: 'n\'allons jamais',
          translation: 'We never go',
          pronunciation: 'à la plage'
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'NE ... PLUS (no longer / no more)',
      rows: [
        {
          pronoun: 'Je',
          form: 'ne fume plus',
          translation: 'I don\'t smoke anymore',
          mnemonic: 'Action that was true before'
        },
        {
          pronoun: 'Il',
          form: 'ne travaille plus',
          translation: 'He doesn\'t work anymore',
          pronunciation: 'ici'
        },
        {
          pronoun: 'Nous',
          form: 'n\'avons plus',
          translation: 'We don\'t have anymore',
          pronunciation: 'd\'argent'
        },
        {
          pronoun: 'Ils',
          form: 'n\'habitent plus',
          translation: 'They no longer live',
          pronunciation: 'à Paris'
        }
      ]
    },
    {
      type: 'paragraph',
      text: '💡 Tip: NE ... PLUS indicates a change of state. Before it was true, now it\'s false.'
    },
    {
      type: 'title',
      text: 'Negation with Articles'
    },
    {
      type: 'usageList',
      title: 'Article Changes After Negation',
      items: [
        {
          usage: 'UN/UNE/DES → DE/D\'',
          examples: [
            'J\'ai un chien. → Je n\'ai pas de chien.',
            'Elle a une voiture. → Elle n\'a pas de voiture.',
            'Nous avons des enfants. → Nous n\'avons pas d\'enfants.'
          ],
          commonMistake: {
            wrong: 'Je n\'ai pas un chien',
            correct: 'Je n\'ai pas de chien'
          }
        },
        {
          usage: 'LE/LA/LES stays the same',
          examples: [
            'J\'aime le café. → Je n\'aime pas le café.',
            'Elle regarde la télé. → Elle ne regarde pas la télé.',
            'Nous prenons les clés. → Nous ne prenons pas les clés.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'Je pas parle français',
          correct: 'Je ne parle pas français',
          explanation: 'Always need NE + verb + PAS'
        },
        {
          wrong: 'Je ne aime pas',
          correct: 'Je n\'aime pas',
          explanation: 'NE elides to N\' before vowel'
        },
        {
          wrong: 'Je n\'ai pas un chat',
          correct: 'Je n\'ai pas de chat',
          explanation: 'UN/UNE/DES becomes DE after negation'
        },
        {
          wrong: 'Je jamais bois',
          correct: 'Je ne bois jamais',
          explanation: 'Need NE + verb + JAMAIS'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Food Preferences',
      lines: [
        {
          speaker: 'Marc',
          text: 'Tu manges de la viande ?'
        },
        {
          speaker: 'Sophie',
          text: 'Non, je ne mange pas de viande. Je suis végétarienne.'
        },
        {
          speaker: 'Marc',
          text: 'Tu ne manges jamais de viande ?'
        },
        {
          speaker: 'Sophie',
          text: 'Non, jamais. Mais avant, je mangeais de la viande. Maintenant, je ne mange plus de viande.'
        },
        {
          speaker: 'Marc',
          text: 'Et tu aimes le fromage ?'
        },
        {
          speaker: 'Sophie',
          text: 'Oui, j\'adore ! Je n\'aime pas la viande, mais j\'aime le fromage.'
        }
      ],
      translation: 'Marc: Do you eat meat? | Sophie: No, I don\'t eat meat. I\'m vegetarian. | Marc: You never eat meat? | Sophie: No, never. But before, I ate meat. Now, I don\'t eat meat anymore. | Marc: And do you like cheese? | Sophie: Yes, I love it! I don\'t like meat, but I like cheese.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 4: The Verb ÊTRE',
          url: '/lessons?slug=les-pronoms-sujets-et-etre'
        },
        {
          title: 'Lesson 12: Asking Questions',
          url: '/lessons?slug=poser-des-questions-fermees'
        }
      ]
    }
  ],

  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'Простое отрицание'
    },
    {
      type: 'subtitle',
      text: 'Как сказать "нет" по-французски'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: 'ne ... pas',
          translation: 'Базовое отрицание'
        },
        {
          form: 'ne ... jamais',
          translation: 'Никогда'
        },
        {
          form: 'ne ... plus',
          translation: 'Больше не'
        },
        {
          form: 'n\' + гласная',
          translation: 'Элизия перед гласной'
        }
      ]
    },
    {
      type: 'title',
      text: 'Структура NE ... PAS'
    },
    {
      type: 'paragraph',
      text: 'Во французском языке стандартное отрицание использует два слова, которые обрамляют глагол: NE (или N\') перед глаголом и PAS после глагола.'
    },
    {
      type: 'conjugationTable',
      title: 'Базовое образование',
      verb: 'parler',
      rows: [
        {
          pronoun: 'Утверждение',
          form: 'Je parle français',
          translation: 'Я говорю по-французски'
        },
        {
          pronoun: 'Отрицание',
          form: 'Je ne parle pas français',
          translation: 'Я не говорю по-французски',
          mnemonic: 'NE + глагол + PAS'
        },
        {
          pronoun: 'С гласной',
          form: 'Je n\'aime pas',
          translation: 'Я не люблю',
          mnemonic: 'NE становится N\' перед гласной'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Примеры с разными глаголами',
      items: [
        {
          usage: 'ÊTRE и AVOIR',
          examples: [
            'Je ne suis pas français. (Я не француз)',
            'Elle n\'est pas ici. (Её здесь нет)',
            'Nous n\'avons pas de voiture. (У нас нет машины)',
            'Tu n\'as pas faim ? (Ты не голоден?)'
          ]
        },
        {
          usage: 'Глаголы на -ER',
          examples: [
            'Je ne parle pas anglais. (Я не говорю по-английски)',
            'Il ne travaille pas aujourd\'hui. (Он сегодня не работает)',
            'Vous ne mangez pas de viande ? (Вы не едите мясо?)'
          ]
        },
        {
          usage: 'Неправильные глаголы',
          examples: [
            'Je ne fais pas de sport. (Я не занимаюсь спортом)',
            'Tu ne prends pas le métro ? (Ты не едешь на метро?)',
            'Nous n\'allons pas au cinéma. (Мы не идём в кино)'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Другие формы отрицания'
    },
    {
      type: 'conjugationTable',
      title: 'NE ... JAMAIS (никогда)',
      rows: [
        {
          pronoun: 'Je',
          form: 'ne bois jamais',
          translation: 'Я никогда не пью',
          pronunciation: 'de café'
        },
        {
          pronoun: 'Tu',
          form: 'ne viens jamais',
          translation: 'Ты никогда не приходишь',
          pronunciation: 'ici'
        },
        {
          pronoun: 'Il/Elle',
          form: 'ne mange jamais',
          translation: 'Он/Она никогда не ест',
          pronunciation: 'de viande'
        },
        {
          pronoun: 'Nous',
          form: 'n\'allons jamais',
          translation: 'Мы никогда не ходим',
          pronunciation: 'à la plage'
        }
      ]
    },
    {
      type: 'conjugationTable',
      title: 'NE ... PLUS (больше не)',
      rows: [
        {
          pronoun: 'Je',
          form: 'ne fume plus',
          translation: 'Я больше не курю',
          mnemonic: 'Действие, которое было правдой раньше'
        },
        {
          pronoun: 'Il',
          form: 'ne travaille plus',
          translation: 'Он больше не работает',
          pronunciation: 'ici'
        },
        {
          pronoun: 'Nous',
          form: 'n\'avons plus',
          translation: 'У нас больше нет',
          pronunciation: 'd\'argent'
        },
        {
          pronoun: 'Ils',
          form: 'n\'habitent plus',
          translation: 'Они больше не живут',
          pronunciation: 'à Paris'
        }
      ]
    },
    {
      type: 'paragraph',
      text: '💡 Совет: NE ... PLUS указывает на изменение состояния. Раньше это было правдой, теперь - нет.'
    },
    {
      type: 'title',
      text: 'Отрицание с артиклем'
    },
    {
      type: 'usageList',
      title: 'Изменение артикля после отрицания',
      items: [
        {
          usage: 'UN/UNE/DES → DE/D\'',
          examples: [
            'J\'ai un chien. → Je n\'ai pas de chien.',
            'Elle a une voiture. → Elle n\'a pas de voiture.',
            'Nous avons des enfants. → Nous n\'avons pas d\'enfants.'
          ],
          commonMistake: {
            wrong: 'Je n\'ai pas un chien',
            correct: 'Je n\'ai pas de chien'
          }
        },
        {
          usage: 'LE/LA/LES остаётся без изменений',
          examples: [
            'J\'aime le café. → Je n\'aime pas le café.',
            'Elle regarde la télé. → Elle ne regarde pas la télé.',
            'Nous prenons les clés. → Nous ne prenons pas les clés.'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'Je pas parle français',
          correct: 'Je ne parle pas français',
          explanation: 'Всегда нужно NE + глагол + PAS'
        },
        {
          wrong: 'Je ne aime pas',
          correct: 'Je n\'aime pas',
          explanation: 'Элизия NE перед гласной'
        },
        {
          wrong: 'Je n\'ai pas un chat',
          correct: 'Je n\'ai pas de chat',
          explanation: 'UN/UNE/DES становится DE после отрицания'
        },
        {
          wrong: 'Je jamais bois',
          correct: 'Je ne bois jamais',
          explanation: 'Нужно NE + глагол + JAMAIS'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Пищевые предпочтения',
      lines: [
        {
          speaker: 'Марк',
          text: 'Tu manges de la viande ?'
        },
        {
          speaker: 'Софи',
          text: 'Non, je ne mange pas de viande. Je suis végétarienne.'
        },
        {
          speaker: 'Марк',
          text: 'Tu ne manges jamais de viande ?'
        },
        {
          speaker: 'Софи',
          text: 'Non, jamais. Mais avant, je mangeais de la viande. Maintenant, je ne mange plus de viande.'
        },
        {
          speaker: 'Марк',
          text: 'Et tu aimes le fromage ?'
        },
        {
          speaker: 'Софи',
          text: 'Oui, j\'adore ! Je n\'aime pas la viande, mais j\'aime le fromage.'
        }
      ],
      translation: 'Марк: Ты ешь мясо? | Софи: Нет, я не ем мясо. Я вегетарианка. | Марк: Ты никогда не ешь мясо? | Софи: Нет, никогда. Но раньше я ела мясо. Сейчас я больше не ем мясо. | Марк: А ты любишь сыр? | Софи: Да, обожаю! Я не люблю мясо, но люблю сыр.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 4: Глагол ÊTRE',
          url: '/lessons?slug=les-pronoms-sujets-et-etre'
        },
        {
          title: 'Урок 12: Задавать вопросы',
          url: '/lessons?slug=poser-des-questions-fermees'
        }
      ]
    }
  ]
};

async function updateLesson11() {
  console.log('🚀 Updating Lesson 11: La négation simple...\n');

  try {
    const { data, error } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson11Content.blocks_fr,
        blocks_en: lesson11Content.blocks_en,
        blocks_ru: lesson11Content.blocks_ru,
        keywords: ['négation', 'negation', 'отрицание', 'ne pas', 'jamais', 'plus', 'never', 'никогда'],
        estimated_read_time: 12
      })
      .eq('id', 11)
      .select();

    if (error) {
      console.error('❌ Error updating lesson:', error);
      throw error;
    }

    console.log('✅ Lesson 11 updated successfully!');
    console.log('Lesson details:', data[0]);

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

updateLesson11()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
