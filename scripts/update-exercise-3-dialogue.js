const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateExercise3() {
  try {
    console.log('📋 Updating exercise 3 (ID 83)...\n')

    // New questions based on the mini dialogue
    const newData = {
      sentences: [
        {
          question: "Comment ___ va ?",
          answer: "ça",
          acceptableAnswers: ["ça"],
          hint: "From the dialogue"
        },
        {
          question: "___ bien, merci ! Et toi ?",
          answer: "Très",
          acceptableAnswers: ["Très", "très"],
          hint: "Very"
        }
      ]
    }

    const { error } = await supabase
      .from('exercises')
      .update({
        data: newData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 83)

    if (error) {
      console.error('❌ Error updating exercise:', error)
      return
    }

    console.log('✅ Successfully updated exercise 3!')
    console.log('\nNew questions:')
    newData.sentences.forEach((q, i) => {
      console.log(`\n${i + 1}. ${q.question}`)
      console.log(`   Answer: ${q.answer}`)
      console.log(`   Acceptable: ${q.acceptableAnswers.join(', ')}`)
    })
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateExercise3()
