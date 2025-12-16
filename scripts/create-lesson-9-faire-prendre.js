require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const lesson9Content = {
  // blocks_fr - For French speakers learning French
  blocks_fr: [
    {
      type: 'mainTitle',
      text: 'FAIRE et PRENDRE au présent'
    },
    {
      type: 'subtitle',
      text: 'Deux verbes irréguliers essentiels'
    },
    {
      type: 'quickSummary',
      title: 'Points clés',
      keyForms: [
        {
          form: 'je fais',
          translation: 'Verbe irrégulier du 3e groupe'
        },
        {
          form: 'je prends',
          translation: 'Verbe irrégulier en -ENDRE'
        },
        {
          form: 'faire du sport',
          translation: 'Expressions courantes avec FAIRE'
        },
        {
          form: 'prendre le bus',
          translation: 'Expressions courantes avec PRENDRE'
        }
      ]
    },
    {
      type: 'title',
      text: 'Le verbe FAIRE'
    },
    {
      type: 'paragraph',
      text: 'FAIRE est un verbe irrégulier très fréquent. Il signifie "to do" ou "to make" et s\'utilise dans de nombreuses expressions.'
    },
    {
      type: 'conjugationTable',
      verb: 'faire',
      title: 'Conjugaison de FAIRE au présent',
      rows: [
        {
          pronoun: 'je',
          form: 'fais',
          pronunciation: '[fɛ]',
          translation: 'I do/make'
        },
        {
          pronoun: 'tu',
          form: 'fais',
          pronunciation: '[fɛ]',
          translation: 'you do/make'
        },
        {
          pronoun: 'il/elle/on',
          form: 'fait',
          pronunciation: '[fɛ]',
          translation: 'he/she/one does/makes'
        },
        {
          pronoun: 'nous',
          form: 'faisons',
          pronunciation: '[fəzɔ̃]',
          translation: 'we do/make',
          mnemonic: 'Attention: nous FAISONs'
        },
        {
          pronoun: 'vous',
          form: 'faites',
          pronunciation: '[fɛt]',
          translation: 'you do/make',
          mnemonic: 'Attention: vous FAITEs (pas "faisez"!)'
        },
        {
          pronoun: 'ils/elles',
          form: 'font',
          pronunciation: '[fɔ̃]',
          translation: 'they do/make'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Expressions avec FAIRE',
      items: [
        {
          usage: 'faire + du/de la/des + activité',
          examples: [
            'Je fais du sport (I do sports)',
            'Elle fait de la natation (She swims)',
            'Nous faisons des courses (We do shopping)'
          ]
        },
        {
          usage: 'faire + article + nom (tâche)',
          examples: [
            'Je fais la cuisine (I cook)',
            'Tu fais le ménage (You clean)',
            'Il fait ses devoirs (He does his homework)'
          ]
        },
        {
          usage: 'Expressions idiomatiques',
          examples: [
            'faire attention (to pay attention)',
            'faire la fête (to party)',
            'faire beau (to be nice weather)'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Le verbe PRENDRE'
    },
    {
      type: 'paragraph',
      text: 'PRENDRE signifie "to take". C\'est le modèle pour tous les verbes en -ENDRE (apprendre, comprendre, surprendre).'
    },
    {
      type: 'conjugationTable',
      verb: 'prendre',
      title: 'Conjugaison de PRENDRE au présent',
      rows: [
        {
          pronoun: 'je',
          form: 'prends',
          pronunciation: '[pʁɑ̃]',
          translation: 'I take'
        },
        {
          pronoun: 'tu',
          form: 'prends',
          pronunciation: '[pʁɑ̃]',
          translation: 'you take'
        },
        {
          pronoun: 'il/elle/on',
          form: 'prend',
          pronunciation: '[pʁɑ̃]',
          translation: 'he/she/one takes',
          mnemonic: 'Pas de -s à la 3e personne'
        },
        {
          pronoun: 'nous',
          form: 'prenons',
          pronunciation: '[pʁənɔ̃]',
          translation: 'we take'
        },
        {
          pronoun: 'vous',
          form: 'prenez',
          pronunciation: '[pʁəne]',
          translation: 'you take'
        },
        {
          pronoun: 'ils/elles',
          form: 'prennent',
          pronunciation: '[pʁɛn]',
          translation: 'they take',
          mnemonic: 'Double N + prononciation différente'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Expressions avec PRENDRE',
      items: [
        {
          usage: 'prendre + transport',
          examples: [
            'Je prends le bus (I take the bus)',
            'Elle prend le métro (She takes the metro)',
            'Nous prenons l\'avion (We take the plane)'
          ]
        },
        {
          usage: 'prendre + nourriture/boisson',
          examples: [
            'Je prends un café (I have a coffee)',
            'Tu prends le petit-déjeuner ? (Do you have breakfast?)',
            'Il prend une pizza (He has a pizza)'
          ]
        },
        {
          usage: 'Expressions idiomatiques',
          examples: [
            'prendre une douche (to take a shower)',
            'prendre rendez-vous (to make an appointment)',
            'prendre son temps (to take one\'s time)'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Erreurs fréquentes',
      rows: [
        {
          wrong: 'vous faisez',
          correct: 'vous faites',
          explanation: 'Forme irrégulière de FAIRE'
        },
        {
          wrong: 'ils prenent',
          correct: 'ils prennent',
          explanation: 'Double N à la 3e personne du pluriel'
        },
        {
          wrong: 'Je fais tennis',
          correct: 'Je fais du tennis',
          explanation: 'Toujours "faire DU/DE LA" + sport'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'Au café',
      lines: [
        {
          speaker: 'Marie',
          text: 'Qu\'est-ce que tu prends ?'
        },
        {
          speaker: 'Thomas',
          text: 'Je prends un café, et toi ?'
        },
        {
          speaker: 'Marie',
          text: 'Moi, je prends un thé. Tu fais du sport aujourd\'hui ?'
        },
        {
          speaker: 'Thomas',
          text: 'Oui, je fais de la natation à 18h.'
        }
      ],
      translation: 'Marie: What are you having? | Thomas: I\'m having a coffee, and you? | Marie: I\'m having tea. Are you doing sports today? | Thomas: Yes, I\'m swimming at 6pm.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Leçon 8: ALLER et VENIR',
          url: '/lessons?slug=aller-et-venir'
        },
        {
          title: 'Leçon 10: Saluer et se présenter',
          url: '/lessons?slug=saluer-et-se-presenter'
        }
      ]
    }
  ],

  // blocks_en - For English speakers learning French
  blocks_en: [
    {
      type: 'mainTitle',
      text: 'FAIRE and PRENDRE in the Present Tense'
    },
    {
      type: 'subtitle',
      text: 'Two Essential Irregular Verbs'
    },
    {
      type: 'quickSummary',
      title: 'Key Points',
      keyForms: [
        {
          form: 'je fais',
          translation: '3rd group irregular verb'
        },
        {
          form: 'je prends',
          translation: 'Irregular -ENDRE verb'
        },
        {
          form: 'faire du sport',
          translation: 'Common expressions with FAIRE'
        },
        {
          form: 'prendre le bus',
          translation: 'Common expressions with PRENDRE'
        }
      ]
    },
    {
      type: 'title',
      text: 'The verb FAIRE'
    },
    {
      type: 'paragraph',
      text: 'FAIRE is a very frequent irregular verb. It means "to do" or "to make" and is used in many expressions.'
    },
    {
      type: 'conjugationTable',
      verb: 'faire',
      title: 'Present tense conjugation of FAIRE',
      rows: [
        {
          pronoun: 'je',
          form: 'fais',
          pronunciation: '[fɛ]',
          translation: 'I do/make'
        },
        {
          pronoun: 'tu',
          form: 'fais',
          pronunciation: '[fɛ]',
          translation: 'you do/make'
        },
        {
          pronoun: 'il/elle/on',
          form: 'fait',
          pronunciation: '[fɛ]',
          translation: 'he/she/one does/makes'
        },
        {
          pronoun: 'nous',
          form: 'faisons',
          pronunciation: '[fəzɔ̃]',
          translation: 'we do/make',
          mnemonic: 'Note: nous FAISONs'
        },
        {
          pronoun: 'vous',
          form: 'faites',
          pronunciation: '[fɛt]',
          translation: 'you do/make',
          mnemonic: 'Note: vous FAITEs (not "faisez"!)'
        },
        {
          pronoun: 'ils/elles',
          form: 'font',
          pronunciation: '[fɔ̃]',
          translation: 'they do/make'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Expressions with FAIRE',
      items: [
        {
          usage: 'faire + du/de la/des + activity',
          examples: [
            'Je fais du sport (I do sports)',
            'Elle fait de la natation (She swims)',
            'Nous faisons des courses (We do shopping)'
          ]
        },
        {
          usage: 'faire + article + noun (task)',
          examples: [
            'Je fais la cuisine (I cook)',
            'Tu fais le ménage (You clean)',
            'Il fait ses devoirs (He does his homework)'
          ]
        },
        {
          usage: 'Idiomatic expressions',
          examples: [
            'faire attention (to pay attention)',
            'faire la fête (to party)',
            'faire beau (to be nice weather)'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'The verb PRENDRE'
    },
    {
      type: 'paragraph',
      text: 'PRENDRE means "to take". It is the model for all -ENDRE verbs (apprendre, comprendre, surprendre).'
    },
    {
      type: 'conjugationTable',
      verb: 'prendre',
      title: 'Present tense conjugation of PRENDRE',
      rows: [
        {
          pronoun: 'je',
          form: 'prends',
          pronunciation: '[pʁɑ̃]',
          translation: 'I take'
        },
        {
          pronoun: 'tu',
          form: 'prends',
          pronunciation: '[pʁɑ̃]',
          translation: 'you take'
        },
        {
          pronoun: 'il/elle/on',
          form: 'prend',
          pronunciation: '[pʁɑ̃]',
          translation: 'he/she/one takes',
          mnemonic: 'No -s in 3rd person'
        },
        {
          pronoun: 'nous',
          form: 'prenons',
          pronunciation: '[pʁənɔ̃]',
          translation: 'we take'
        },
        {
          pronoun: 'vous',
          form: 'prenez',
          pronunciation: '[pʁəne]',
          translation: 'you take'
        },
        {
          pronoun: 'ils/elles',
          form: 'prennent',
          pronunciation: '[pʁɛn]',
          translation: 'they take',
          mnemonic: 'Double N + different pronunciation'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Expressions with PRENDRE',
      items: [
        {
          usage: 'prendre + transport',
          examples: [
            'Je prends le bus (I take the bus)',
            'Elle prend le métro (She takes the metro)',
            'Nous prenons l\'avion (We take the plane)'
          ]
        },
        {
          usage: 'prendre + food/drink',
          examples: [
            'Je prends un café (I have a coffee)',
            'Tu prends le petit-déjeuner ? (Do you have breakfast?)',
            'Il prend une pizza (He has a pizza)'
          ]
        },
        {
          usage: 'Idiomatic expressions',
          examples: [
            'prendre une douche (to take a shower)',
            'prendre rendez-vous (to make an appointment)',
            'prendre son temps (to take one\'s time)'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Common Mistakes',
      rows: [
        {
          wrong: 'vous faisez',
          correct: 'vous faites',
          explanation: 'Irregular form of FAIRE'
        },
        {
          wrong: 'ils prenent',
          correct: 'ils prennent',
          explanation: 'Double N in 3rd person plural'
        },
        {
          wrong: 'Je fais tennis',
          correct: 'Je fais du tennis',
          explanation: 'Always "faire DU/DE LA" + sport'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'At the café',
      lines: [
        {
          speaker: 'Marie',
          text: 'Qu\'est-ce que tu prends ?'
        },
        {
          speaker: 'Thomas',
          text: 'Je prends un café, et toi ?'
        },
        {
          speaker: 'Marie',
          text: 'Moi, je prends un thé. Tu fais du sport aujourd\'hui ?'
        },
        {
          speaker: 'Thomas',
          text: 'Oui, je fais de la natation à 18h.'
        }
      ],
      translation: 'Marie: What are you having? | Thomas: I\'m having a coffee, and you? | Marie: I\'m having tea. Are you doing sports today? | Thomas: Yes, I\'m swimming at 6pm.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Lesson 8: ALLER and VENIR',
          url: '/lessons?slug=aller-et-venir'
        },
        {
          title: 'Lesson 10: Greeting and Introducing',
          url: '/lessons?slug=saluer-et-se-presenter'
        }
      ]
    }
  ],

  // blocks_ru - For Russian speakers learning French
  blocks_ru: [
    {
      type: 'mainTitle',
      text: 'FAIRE и PRENDRE в настоящем времени'
    },
    {
      type: 'subtitle',
      text: 'Два важнейших неправильных глагола'
    },
    {
      type: 'quickSummary',
      title: 'Ключевые моменты',
      keyForms: [
        {
          form: 'je fais',
          translation: 'Неправильный глагол 3-й группы'
        },
        {
          form: 'je prends',
          translation: 'Неправильный глагол на -ENDRE'
        },
        {
          form: 'faire du sport',
          translation: 'Устойчивые выражения с FAIRE'
        },
        {
          form: 'prendre le bus',
          translation: 'Устойчивые выражения с PRENDRE'
        }
      ]
    },
    {
      type: 'title',
      text: 'Глагол FAIRE'
    },
    {
      type: 'paragraph',
      text: 'FAIRE - очень частотный неправильный глагол. Он означает "делать" и используется во многих выражениях.'
    },
    {
      type: 'conjugationTable',
      verb: 'faire',
      title: 'Спряжение FAIRE в настоящем времени',
      rows: [
        {
          pronoun: 'je',
          form: 'fais',
          pronunciation: '[fɛ]',
          translation: 'я делаю'
        },
        {
          pronoun: 'tu',
          form: 'fais',
          pronunciation: '[fɛ]',
          translation: 'ты делаешь'
        },
        {
          pronoun: 'il/elle/on',
          form: 'fait',
          pronunciation: '[fɛ]',
          translation: 'он/она делает'
        },
        {
          pronoun: 'nous',
          form: 'faisons',
          pronunciation: '[fəzɔ̃]',
          translation: 'мы делаем',
          mnemonic: 'Внимание: nous FAISONs'
        },
        {
          pronoun: 'vous',
          form: 'faites',
          pronunciation: '[fɛt]',
          translation: 'вы делаете',
          mnemonic: 'Внимание: vous FAITEs (не "faisez"!)'
        },
        {
          pronoun: 'ils/elles',
          form: 'font',
          pronunciation: '[fɔ̃]',
          translation: 'они делают'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Выражения с FAIRE',
      items: [
        {
          usage: 'faire + du/de la/des + занятие',
          examples: [
            'Je fais du sport (Я занимаюсь спортом)',
            'Elle fait de la natation (Она плавает)',
            'Nous faisons des courses (Мы делаем покупки)'
          ]
        },
        {
          usage: 'faire + артикль + существительное (работа по дому)',
          examples: [
            'Je fais la cuisine (Я готовлю)',
            'Tu fais le ménage (Ты убираешься)',
            'Il fait ses devoirs (Он делает домашнюю работу)'
          ]
        },
        {
          usage: 'Идиоматические выражения',
          examples: [
            'faire attention (быть внимательным)',
            'faire la fête (веселиться, праздновать)',
            'faire beau (о хорошей погоде)'
          ]
        }
      ]
    },
    {
      type: 'title',
      text: 'Глагол PRENDRE'
    },
    {
      type: 'paragraph',
      text: 'PRENDRE означает "брать". Это модель для всех глаголов на -ENDRE (apprendre, comprendre, surprendre).'
    },
    {
      type: 'conjugationTable',
      verb: 'prendre',
      title: 'Спряжение PRENDRE в настоящем времени',
      rows: [
        {
          pronoun: 'je',
          form: 'prends',
          pronunciation: '[pʁɑ̃]',
          translation: 'я беру'
        },
        {
          pronoun: 'tu',
          form: 'prends',
          pronunciation: '[pʁɑ̃]',
          translation: 'ты берёшь'
        },
        {
          pronoun: 'il/elle/on',
          form: 'prend',
          pronunciation: '[pʁɑ̃]',
          translation: 'он/она берёт',
          mnemonic: 'Нет -s в 3-м лице'
        },
        {
          pronoun: 'nous',
          form: 'prenons',
          pronunciation: '[pʁənɔ̃]',
          translation: 'мы берём'
        },
        {
          pronoun: 'vous',
          form: 'prenez',
          pronunciation: '[pʁəne]',
          translation: 'вы берёте'
        },
        {
          pronoun: 'ils/elles',
          form: 'prennent',
          pronunciation: '[pʁɛn]',
          translation: 'они берут',
          mnemonic: 'Двойное N + другое произношение'
        }
      ]
    },
    {
      type: 'usageList',
      title: 'Выражения с PRENDRE',
      items: [
        {
          usage: 'prendre + транспорт',
          examples: [
            'Je prends le bus (Я еду на автобусе)',
            'Elle prend le métro (Она едет на метро)',
            'Nous prenons l\'avion (Мы летим на самолёте)'
          ]
        },
        {
          usage: 'prendre + еда/напиток',
          examples: [
            'Je prends un café (Я пью кофе)',
            'Tu prends le petit-déjeuner ? (Ты завтракаешь?)',
            'Il prend une pizza (Он берёт пиццу)'
          ]
        },
        {
          usage: 'Идиоматические выражения',
          examples: [
            'prendre une douche (принимать душ)',
            'prendre rendez-vous (записаться на приём)',
            'prendre son temps (не спешить)'
          ]
        }
      ]
    },
    {
      type: 'mistakesTable',
      title: 'Типичные ошибки',
      rows: [
        {
          wrong: 'vous faisez',
          correct: 'vous faites',
          explanation: 'Неправильная форма FAIRE'
        },
        {
          wrong: 'ils prenent',
          correct: 'ils prennent',
          explanation: 'Двойное N в 3-м лице множественного числа'
        },
        {
          wrong: 'Je fais tennis',
          correct: 'Je fais du tennis',
          explanation: 'Всегда "faire DU/DE LA" + спорт'
        }
      ]
    },
    {
      type: 'miniDialogue',
      title: 'В кафе',
      lines: [
        {
          speaker: 'Marie',
          text: 'Qu\'est-ce que tu prends ?'
        },
        {
          speaker: 'Thomas',
          text: 'Je prends un café, et toi ?'
        },
        {
          speaker: 'Marie',
          text: 'Moi, je prends un thé. Tu fais du sport aujourd\'hui ?'
        },
        {
          speaker: 'Thomas',
          text: 'Oui, je fais de la natation à 18h.'
        }
      ],
      translation: 'Мари: Что ты будешь? | Тома: Я возьму кофе, а ты? | Мари: Я возьму чай. Ты сегодня занимаешься спортом? | Тома: Да, я плаваю в 18:00.'
    },
    {
      type: 'relatedTopics',
      links: [
        {
          title: 'Урок 8: ALLER и VENIR',
          url: '/lessons?slug=aller-et-venir'
        },
        {
          title: 'Урок 10: Приветствия и знакомство',
          url: '/lessons?slug=saluer-et-se-presenter'
        }
      ]
    }
  ]
};

async function updateLesson9() {
  console.log('🚀 Updating Lesson 9: FAIRE et PRENDRE...\n');

  try {
    const { data, error } = await supabase
      .from('lessons')
      .update({
        blocks_fr: lesson9Content.blocks_fr,
        blocks_en: lesson9Content.blocks_en,
        blocks_ru: lesson9Content.blocks_ru,
        keywords: ['faire', 'prendre', 'verbes irréguliers', 'expressions', 'irregular verbs', 'неправильные глаголы'],
        estimated_read_time: 12
      })
      .eq('id', 9)
      .select();

    if (error) {
      console.error('❌ Error updating lesson:', error);
      throw error;
    }

    console.log('✅ Lesson 9 updated successfully!');
    console.log('Lesson details:', data[0]);

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

updateLesson9()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('💥 Fatal error:', err);
    process.exit(1);
  });
