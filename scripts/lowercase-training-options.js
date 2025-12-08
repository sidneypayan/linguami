const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * Converts first letter to lowercase
 */
function lowercaseFirst(str) {
  if (!str || typeof str !== 'string') return str
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * Process options - can be array of strings or object with language keys
 */
function processOptions(options) {
  if (!options) return options

  // If it's an array of strings
  if (Array.isArray(options)) {
    return options.map(opt => lowercaseFirst(opt))
  }

  // If it's an object with language keys {fr: [...], en: [...], ru: [...]}
  if (typeof options === 'object') {
    const processed = {}
    for (const [lang, opts] of Object.entries(options)) {
      if (Array.isArray(opts)) {
        processed[lang] = opts.map(opt => lowercaseFirst(opt))
      } else {
        processed[lang] = opts
      }
    }
    return processed
  }

  return options
}

async function lowercaseAllOptions() {
  console.log('🔄 Fetching all training questions...\n')

  const { data: questions, error } = await supabase
    .from('training_questions')
    .select('*')
    .order('id')

  if (error) {
    console.error('❌ Error fetching questions:', error)
    return
  }

  console.log(`Found ${questions.length} questions\n`)

  let updatedCount = 0
  let unchangedCount = 0

  for (const question of questions) {
    let hasChanges = false
    const updates = {}

    // Process main options field
    if (question.options) {
      const processed = processOptions(question.options)
      if (JSON.stringify(processed) !== JSON.stringify(question.options)) {
        updates.options = processed
        hasChanges = true
      }
    }

    // Process language-specific options
    ['options_fr', 'options_en', 'options_ru'].forEach(field => {
      if (question[field]) {
        const processed = processOptions(question[field])
        if (JSON.stringify(processed) !== JSON.stringify(question[field])) {
          updates[field] = processed
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      const { error: updateError } = await supabase
        .from('training_questions')
        .update(updates)
        .eq('id', question.id)

      if (updateError) {
        console.error(`❌ Error updating question ${question.id}:`, updateError)
      } else {
        updatedCount++
        console.log(`✅ Updated question ${question.id}`)
      }
    } else {
      unchangedCount++
    }
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`✅ Updated: ${updatedCount} questions`)
  console.log(`⏭️  Unchanged: ${unchangedCount} questions`)
  console.log(`📊 Total: ${questions.length} questions`)
}

lowercaseAllOptions()
