const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateEnchanteWithNote() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Lesson found:', data.slug)

  const step1Index = 0
  const updates = {}

  // Update blocks_fr
  const blocks_fr = [...(data.blocks_fr || [])]
  if (blocks_fr[step1Index] && blocks_fr[step1Index].vocabulary) {
    const enchante = blocks_fr[step1Index].vocabulary.find(v => v.word === "Enchanté(e)")
    if (enchante) {
      enchante.note = "Enchanté (homme) / Enchantée (femme)"
      updates.blocks_fr = blocks_fr
      console.log('✅ Added note to blocks_fr')
    }
  }

  // Update blocks_ru
  const blocks_ru = [...(data.blocks_ru || [])]
  if (blocks_ru[step1Index] && blocks_ru[step1Index].vocabulary) {
    const enchante = blocks_ru[step1Index].vocabulary.find(v => v.word === "Enchanté(e)")
    if (enchante) {
      enchante.note = "Enchanté (мужчина) / Enchantée (женщина)"
      updates.blocks_ru = blocks_ru
      console.log('✅ Added note to blocks_ru')
    }
  }

  // Update blocks_en
  const blocks_en = [...(data.blocks_en || [])]
  if (blocks_en[step1Index] && blocks_en[step1Index].vocabulary) {
    const enchante = blocks_en[step1Index].vocabulary.find(v => v.word === "Enchanté(e)")
    if (enchante) {
      enchante.note = "Enchanté (man) / Enchantée (woman)"
      updates.blocks_en = blocks_en
      console.log('✅ Added note to blocks_en')
    }
  }

  // Save to database
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('course_lessons')
      .update(updates)
      .eq('slug', 'bonjour-saluer-prendre-conge')

    if (updateError) {
      console.error('Error updating:', updateError)
      return
    }

    console.log('\n✅ Successfully added gender explanation to "Enchanté(e)" in all blocks!')
  } else {
    console.log('\n⚠️  No "Enchanté(e)" found in vocabulary')
  }
}

updateEnchanteWithNote()
