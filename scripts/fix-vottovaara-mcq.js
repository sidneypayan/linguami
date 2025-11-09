const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixVottovaara() {
  try {
    const newQuestions = [
      {
        id: 1,
        question: 'Где находится скальный массив Воттоваара?',
        question_en: 'Where is the Vottovaara rock massif located?',
        question_fr: 'Où se trouve le massif rocheux de Vottovaara?',
        options: [
          { key: 'A', text: 'В республике Карелия', text_en: 'In the Republic of Karelia', text_fr: 'En République de Carélie' },
          { key: 'B', text: 'В Сибири', text_en: 'In Siberia', text_fr: 'En Sibérie' },
          { key: 'C', text: 'На Урале', text_en: 'In the Urals', text_fr: 'Dans l\'Oural' },
          { key: 'D', text: 'На Кавказе', text_en: 'In the Caucasus', text_fr: 'Dans le Caucase' }
        ],
        correctAnswer: 'A',
        explanation: 'Согласно тексту, Воттоваара – скальный массив на территории республики Карелия.',
        explanation_en: 'According to the text, Vottovaara is a rock massif in the Republic of Karelia.',
        explanation_fr: 'Selon le texte, Vottovaara est un massif rocheux en République de Carélie.'
      },
      {
        id: 2,
        question: 'Что такое сейды?',
        question_en: 'What are seids?',
        question_fr: 'Que sont les seids?',
        options: [
          { key: 'A', text: 'Культовые валуны с следами воздействия человека', text_en: 'Cultic boulders with traces of human impact', text_fr: 'Rochers cultuels portant des traces d\'intervention humaine' },
          { key: 'B', text: 'Деревянные статуи', text_en: 'Wooden statues', text_fr: 'Statues en bois' },
          { key: 'C', text: 'Древние постройки', text_en: 'Ancient buildings', text_fr: 'Constructions anciennes' },
          { key: 'D', text: 'Священные источники', text_en: 'Sacred springs', text_fr: 'Sources sacrées' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте сказано, что сейды – это культовые валуны, которые носят следы воздействия человека.',
        explanation_en: 'The text states that seids are cultic boulders that bear traces of human impact.',
        explanation_fr: 'Le texte indique que les seids sont des rochers cultuels qui portent des traces d\'intervention humaine.'
      },
      {
        id: 3,
        question: 'Какие деревья растут на Воттоваара?',
        question_en: 'What kind of trees grow on Vottovaara?',
        question_fr: 'Quels types d\'arbres poussent sur Vottovaara?',
        options: [
          { key: 'A', text: 'Низкорослые уродливые деревья', text_en: 'Stunted ugly trees', text_fr: 'Arbres rabougris et difformes' },
          { key: 'B', text: 'Высокие стройные сосны', text_en: 'Tall slender pines', text_fr: 'Grands pins élancés' },
          { key: 'C', text: 'Тропические пальмы', text_en: 'Tropical palms', text_fr: 'Palmiers tropicaux' },
          { key: 'D', text: 'Фруктовые деревья', text_en: 'Fruit trees', text_fr: 'Arbres fruitiers' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст упоминает "низкорослые уродливые деревья", которые чередуются с мрачными болотами и скалами.',
        explanation_en: 'The text mentions "stunted ugly trees" that alternate with gloomy swamps and rocks.',
        explanation_fr: 'Le texte mentionne des "arbres rabougris et difformes" qui alternent avec des marais sombres et des rochers.'
      },
      {
        id: 4,
        question: 'Кто, по легендам, обитает на горе Воттоваара?',
        question_en: 'According to legends, who inhabits Mount Vottovaara?',
        question_fr: 'Selon les légendes, qui habite le mont Vottovaara?',
        options: [
          { key: 'A', text: 'Шаманы', text_en: 'Shamans', text_fr: 'Chamans' },
          { key: 'B', text: 'Медведи', text_en: 'Bears', text_fr: 'Ours' },
          { key: 'C', text: 'Эльфы', text_en: 'Elves', text_fr: 'Elfes' },
          { key: 'D', text: 'Драконы', text_en: 'Dragons', text_fr: 'Dragons' }
        ],
        correctAnswer: 'A',
        explanation: 'В тексте упоминаются "леденящие душу истории о шаманах, обитающих на этой горе".',
        explanation_en: 'The text mentions "chilling stories about shamans living on this mountain".',
        explanation_fr: 'Le texte mentionne des "histoires glaçantes sur les chamans habitant cette montagne".'
      },
      {
        id: 5,
        question: 'Что известно о создании сейдов на Воттоваара?',
        question_en: 'What is known about the creation of seids on Vottovaara?',
        question_fr: 'Que sait-on de la création des seids sur Vottovaara?',
        options: [
          { key: 'A', text: 'До сих пор не доказано, когда и кем они были созданы', text_en: 'It has not yet been proven when and by whom they were created', text_fr: 'On ne sait toujours pas quand ni par qui ils ont été créés' },
          { key: 'B', text: 'Они были созданы в XVI веке', text_en: 'They were created in the 16th century', text_fr: 'Ils ont été créés au XVIe siècle' },
          { key: 'C', text: 'Их создали викинги', text_en: 'They were created by Vikings', text_fr: 'Ils ont été créés par les Vikings' },
          { key: 'D', text: 'Это естественные образования', text_en: 'They are natural formations', text_fr: 'Ce sont des formations naturelles' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст четко указывает: "до сих пор не доказано, когда и кем были созданы эти сейды".',
        explanation_en: 'The text clearly states: "it has not yet been proven when and by whom these seids were created".',
        explanation_fr: 'Le texte indique clairement : "on ne sait toujours pas quand ni par qui ces seids ont été créés".'
      },
      {
        id: 6,
        question: 'Как люди описывают красоту Воттоваары?',
        question_en: 'How do people describe the beauty of Vottovaara?',
        question_fr: 'Comment les gens décrivent-ils la beauté de Vottovaara?',
        options: [
          { key: 'A', text: 'Кто-то называет её неземной, кто-то гармоничной, кто-то загадочной', text_en: 'Some call it otherworldly, some harmonious, some mysterious', text_fr: 'Certains la qualifient d\'extraterrestre, d\'autres d\'harmonieuse, d\'autres encore de mystérieuse' },
          { key: 'B', text: 'Все единодушно считают её страшной', text_en: 'Everyone unanimously considers it scary', text_fr: 'Tout le monde la considère unanimement comme effrayante' },
          { key: 'C', text: 'Она не производит впечатления', text_en: 'It makes no impression', text_fr: 'Elle ne fait pas d\'impression' },
          { key: 'D', text: 'Она похожа на другие горы', text_en: 'It is similar to other mountains', text_fr: 'Elle ressemble aux autres montagnes' }
        ],
        correctAnswer: 'A',
        explanation: 'Текст говорит: "Кто-то называет красоту Воттоваары неземной, кто-то гармоничной, кто-то загадочной."',
        explanation_en: 'The text says: "Some call the beauty of Vottovaara otherworldly, some harmonious, some mysterious."',
        explanation_fr: 'Le texte dit : "Certains qualifient la beauté de Vottovaara d\'extraterrestre, d\'autres d\'harmonieuse, d\'autres encore de mystérieuse."'
      }
    ]

    const { error } = await supabase
      .from('exercises')
      .update({
        data: { questions: newQuestions }
      })
      .eq('id', 43) // Exercise ID for Vottovaara MCQ

    if (error) throw error

    console.log('✅ Fixed Vottovaara MCQ exercise!')
    console.log('Removed question about mountain height (not in text)')
    console.log('All 6 questions now based on text content only:')
    console.log('1. Location in Karelia')
    console.log('2. What are seids')
    console.log('3. Types of trees')
    console.log('4. Shamans in legends')
    console.log('5. Unknown origin of seids')
    console.log('6. Descriptions of beauty')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

fixVottovaara()
