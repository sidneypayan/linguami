const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })  // ← Connexion à la DB LOCALE

console.log('Connecting to:', process.env.NEXT_PUBLIC_SUPABASE_URL)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateStep10() {
  // 1. Get the lesson
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (error) {
    console.error('Error fetching lesson:', error)
    return
  }

  console.log('Lesson found:', data.slug)

  // 2. Find step 10 (index 9)
  const blocks = [...data.blocks_fr]
  const step10Index = 9

  if (!blocks[step10Index]) {
    console.error('Step 10 not found')
    return
  }

  console.log('\n=== Original Step 10 ===')
  console.log(JSON.stringify(blocks[step10Index].table.rows, null, 2))

  // 3. Update the conjugation column with bold endings
  blocks[step10Index].table.rows = [
    ["Je", "m'appel**le**", "Je m'appelle Thomas"],
    ["Tu", "t'appel**les**", "Comment tu t'appelles ?"],
    ["Il/Elle", "s'appel**le**", "Elle s'appelle Sophie"],
    ["Nous", "nous appel**ons**", "Nous nous appelons les Dupont"],
    ["Vous", "vous appel**ez**", "Comment vous appelez-vous ?"],
    ["Ils/Elles", "s'appel**lent**", "Ils s'appellent Pierre et Marie"]
  ]

  console.log('\n=== Updated Step 10 ===')
  console.log(JSON.stringify(blocks[step10Index].table.rows, null, 2))

  // 4. Update the lesson in the database
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({ blocks_fr: blocks })
    .eq('slug', 'bonjour-saluer-prendre-conge')

  if (updateError) {
    console.error('Error updating lesson:', updateError)
    return
  }

  console.log('\n✅ Step 10 updated successfully in LOCAL database!')
  console.log('The verb endings are now in bold in the conjugation table.')
}

updateStep10()
