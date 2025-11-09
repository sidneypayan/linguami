const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log('Creating exercises for material 112...')
  
  // Material 112 - MCQ
  await supabase.from('exercises').insert({
    material_id: 112,
    type: 'mcq',
    title: 'Понимание текста',
    lang: 'ru',
    level: 'intermediate',
    data: {
      questions: [
        {
          id: 1,
          question: { fr: "Quel type de territoire est la République de l'Altaï ?", en: "What type of territory is the Altai Republic?", ru: "Какой тип территории представляет собой Республика Алтай?" },
          options: [
            { key: "A", text: { fr: "Un territoire plat", en: "A flat territory", ru: "Плоская территория" } },
            { key: "B", text: { fr: "Un territoire montagneux", en: "A mountainous territory", ru: "Гористая территория" } },
            { key: "C", text: { fr: "Un territoire côtier", en: "A coastal territory", ru: "Прибрежная территория" } }
          ],
          correctAnswer: "B",
          explanation: { fr: "La République de l'Altaï est une région montagneuse.", en: "The Altai Republic is a mountainous region.", ru: "Республика Алтай - это горная территория." }
        }
      ]
    },
    xp_reward: 15
  })
  
  console.log('Done!')
}

main()
