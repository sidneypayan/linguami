#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createDragDropExercise(materialId, pairsFile) {
  console.log(`\n🎯 Creating Drag and Drop Exercise for Material ${materialId}\n`)

  // Get material from database
  const { data: material, error: materialError } = await supabase
    .from('materials')
    .select('*')
    .eq('id', materialId)
    .single()

  if (materialError || !material) {
    console.error(`❌ Material ${materialId} not found`)
    process.exit(1)
  }

  console.log(`📖 Material: ${material.title}`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Section: ${material.section}`)

  // Load pairs from file
  let pairs
  try {
    const fileContent = fs.readFileSync(pairsFile, 'utf8')
    pairs = JSON.parse(fileContent)
  } catch (error) {
    console.error(`❌ Error reading pairs file: ${error.message}`)
    process.exit(1)
  }

  // Validate pairs
  if (!pairs || pairs.length !== 6) {
    console.error('❌ You must provide exactly 6 vocabulary pairs')
    process.exit(1)
  }

  // Validate structure
  for (const pair of pairs) {
    if (!pair.word || !pair.translations) {
      console.error('❌ Each pair must have "word" and "translations" fields')
      console.error('   Example: { "word": "lavandin", "translations": { "en": "lavender", "fr": "lavande", "ru": "лаванда" } }')
      process.exit(1)
    }
    if (!pair.translations.en || !pair.translations.fr || !pair.translations.ru) {
      console.error('❌ Translations must include en, fr, and ru')
      process.exit(1)
    }
  }

  // Build proper structure for drag and drop
  const formattedPairs = pairs.map((pair, index) => ({
    id: index + 1,
    // Left: Material word repeated in all locales
    left: {
      en: pair.word,
      fr: pair.word,
      ru: pair.word
    },
    // Right: Translations in all locales
    right: {
      en: pair.translations.en,
      fr: pair.translations.fr,
      ru: pair.translations.ru
    }
  }))

  console.log('\n📝 Creating exercise in database...')

  // Determine exercise title based on language
  const titles = {
    fr: 'Association de vocabulaire',
    ru: 'Ассоциация слов',
    en: 'Vocabulary Association'
  }

  // Create exercise in database
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      material_id: materialId,
      type: 'drag_and_drop',
      title: titles[material.lang] || 'Vocabulary Association',
      lang: material.lang,
      level: 'intermediate',
      xp_reward: 10,
      data: {
        questions: [{
          pairs: formattedPairs
        }]
      }
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Database error:', error)
    throw error
  }

  console.log('\n✅ Drag and Drop exercise created successfully!')
  console.log(`   Exercise ID: ${data.id}`)
  console.log(`   Material ID: ${materialId}`)
  console.log(`   Type: drag_and_drop`)
  console.log(`   Title: ${titles[material.lang]}`)
  console.log(`   Language: ${material.lang}`)
  console.log(`   Number of pairs: ${formattedPairs.length}`)
  console.log('\n📋 Vocabulary pairs:')
  formattedPairs.forEach((pair, i) => {
    console.log(`   ${i + 1}. ${pair.left[material.lang]} → EN: ${pair.right.en}, FR: ${pair.right.fr}, RU: ${pair.right.ru}`)
  })
}

// Main execution
if (require.main === module) {
  const materialId = parseInt(process.argv[2])
  const pairsFile = process.argv[3]

  if (!materialId || !pairsFile) {
    console.log('❌ Usage: node scripts/create-dragdrop.js <material_id> <pairs_json_file>')
    console.log('\n📝 Example:')
    console.log('   node scripts/create-dragdrop.js 481 pairs-481.json')
    console.log('\n📄 Pairs JSON format:')
    console.log(`   [
     {
       "word": "lavandin",
       "translations": {
         "en": "lavender",
         "fr": "lavande",
         "ru": "лаванда"
       }
     },
     {
       "word": "truffe",
       "translations": {
         "en": "truffle",
         "fr": "truffe",
         "ru": "трюфель"
       }
     }
     ... (6 total pairs)
   ]`)
    console.log('\n💡 Rules:')
    console.log('   - "word" is the vocabulary word from the material (in material language)')
    console.log('   - "translations" contains the word translated in all 3 languages')
    console.log('   - Left column shows material word, right column shows translation based on user locale')
    process.exit(1)
  }

  createDragDropExercise(materialId, pairsFile).catch(error => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
}
