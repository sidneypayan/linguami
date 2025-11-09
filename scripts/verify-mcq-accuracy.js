const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Keywords that suggest specific facts that need verification
const suspiciousKeywords = [
  'высота', 'height', 'altitude', 'hauteur',
  'метров', 'meters', 'mètres',
  'километров', 'kilometers', 'kilomètres',
  'лет', 'years', 'ans',
  'тысяч', 'thousand', 'milliers',
  'миллионов', 'million',
  'процент', 'percent', 'pour cent',
  'сколько', 'how many', 'combien',
  'когда', 'when', 'quand',
  'в каком году', 'in what year', 'en quelle année'
]

function containsSuspiciousKeywords(text) {
  return suspiciousKeywords.some(keyword =>
    text.toLowerCase().includes(keyword.toLowerCase())
  )
}

function extractNumbers(text) {
  // Extract numbers from text
  const numbers = text.match(/\d+[\.,]?\d*/g) || []
  return numbers
}

async function verifyMCQAccuracy() {
  try {
    const { data: materials, error } = await supabase
      .from('materials')
      .select('id, title, body, lang')
      .eq('section', 'beautiful-places')
      .order('id')

    if (error) throw error

    console.log('🔍 VERIFYING MCQ ACCURACY FOR BEAUTIFUL-PLACES\n')
    console.log('Checking if questions with numbers/dates are based on text content...\n')

    const issuesFound = []

    for (const material of materials) {
      const { data: exercise } = await supabase
        .from('exercises')
        .select('*')
        .eq('material_id', material.id)
        .eq('type', 'mcq')
        .single()

      if (!exercise || !exercise.data?.questions) continue

      const bodyNumbers = extractNumbers(material.body || '')

      for (const q of exercise.data.questions) {
        if (containsSuspiciousKeywords(q.question)) {
          // Check if the correct answer contains numbers
          const correctOption = q.options.find(o => o.key === q.correctAnswer)
          const answerNumbers = extractNumbers(correctOption?.text || '')

          // Check if those numbers exist in the body
          const numbersNotInBody = answerNumbers.filter(num =>
            !bodyNumbers.some(bodyNum =>
              bodyNum.replace(',', '.') === num.replace(',', '.')
            )
          )

          if (numbersNotInBody.length > 0) {
            issuesFound.push({
              materialId: material.id,
              materialTitle: material.title,
              question: q.question,
              answer: correctOption?.text,
              missingNumbers: numbersNotInBody
            })

            console.log(`⚠️  POTENTIAL ISSUE FOUND:`)
            console.log(`   Material ${material.id}: ${material.title}`)
            console.log(`   Question: ${q.question}`)
            console.log(`   Correct answer: ${correctOption?.text}`)
            console.log(`   Numbers in answer: ${answerNumbers.join(', ')}`)
            console.log(`   Numbers in body: ${bodyNumbers.join(', ')}`)
            console.log(`   ❌ Missing numbers: ${numbersNotInBody.join(', ')}`)
            console.log()
          }
        }
      }
    }

    console.log('\n' + '='.repeat(60))
    if (issuesFound.length === 0) {
      console.log('✅ No obvious issues found!')
      console.log('All questions with numbers seem to have those numbers in the text.')
    } else {
      console.log(`⚠️  Found ${issuesFound.length} potential issues`)
      console.log('These questions may be using external knowledge instead of text content')
    }
    console.log('='.repeat(60))

  } catch (error) {
    console.error('Error:', error.message)
  }
}

verifyMCQAccuracy()
