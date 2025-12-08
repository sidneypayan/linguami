const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateAllBlocks() {
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

  const step10Index = 9
  const updatedRows = [
    ["Je", "m'appel**le**", "Je m'appelle Thomas"],
    ["Tu", "t'appel**les**", "Comment tu t'appelles ?"],
    ["Il/Elle", "s'appel**le**", "Elle s'appelle Sophie"],
    ["Nous", "nous appel**ons**", "Nous nous appelons les Dupont"],
    ["Vous", "vous appel**ez**", "Comment vous appelez-vous ?"],
    ["Ils/Elles", "s'appel**lent**", "Ils s'appellent Pierre et Marie"]
  ]

  // Update blocks_fr
  const blocks_fr = [...(data.blocks_fr || [])]
  if (blocks_fr[step10Index]) {
    blocks_fr[step10Index].table.rows = updatedRows
    console.log('✅ Updated blocks_fr')
  }

  // Update blocks_ru
  const blocks_ru = [...(data.blocks_ru || [])]
  if (blocks_ru[step10Index]) {
    blocks_ru[step10Index].table.rows = updatedRows
    console.log('✅ Updated blocks_ru')
  }

  // Update blocks_en
  const blocks_en = [...(data.blocks_en || [])]
  if (blocks_en[step10Index]) {
    blocks_en[step10Index].table.rows = updatedRows
    console.log('✅ Updated blocks_en')
  }

  // Save to database
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({
      blocks_fr,
      blocks_ru,
      blocks_en
    })
    .eq('slug', 'bonjour-saluer-prendre-conge')

  if (updateError) {
    console.error('Error updating:', updateError)
    return
  }

  console.log('\n✅ Successfully updated ALL blocks (fr, ru, en) with bold endings!')
}

updateAllBlocks()
