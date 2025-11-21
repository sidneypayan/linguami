/**
 * Organise les dialogues français pour qu'ils apparaissent groupés par titre
 * Utilise le champ chapter_number pour définir l'ordre d'affichage
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function organizeDialogues() {
  console.log('\n🔄 Organisation des dialogues français par thème...\n')

  // 1. Récupérer tous les dialogues français
  const { data: dialogues, error } = await supabase
    .from('materials')
    .select('id, title, level')
    .eq('lang', 'fr')
    .eq('section', 'dialogues')
    .order('title')

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  console.log(`📊 ${dialogues.length} dialogues français trouvés\n`)

  // 2. Grouper par titre
  const groups = {}
  dialogues.forEach(d => {
    if (!groups[d.title]) {
      groups[d.title] = []
    }
    groups[d.title].push(d)
  })

  console.log(`📁 ${Object.keys(groups).length} thèmes distincts\n`)
  console.log('🔢 Attribution des chapter_number...\n')

  // 3. Assigner un chapter_number à chaque groupe
  const titles = Object.keys(groups).sort()
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i]
    const chapterNumber = i + 1
    const dialogueGroup = groups[title]

    console.log(`[${i + 1}/${titles.length}] "${title}" → chapter_number: ${chapterNumber}`)

    // Mettre à jour tous les dialogues de ce groupe
    for (const dialogue of dialogueGroup) {
      const { error: updateError } = await supabase
        .from('materials')
        .update({ chapter_number: chapterNumber })
        .eq('id', dialogue.id)

      if (updateError) {
        console.error(`   ❌ Erreur pour ID ${dialogue.id}: ${updateError.message}`)
        errorCount++
      } else {
        console.log(`   ✅ ID ${dialogue.id} (${dialogue.level})`)
        successCount++
      }

      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RÉSULTATS')
  console.log('='.repeat(60))
  console.log(`✅ Succès: ${successCount}`)
  console.log(`❌ Erreurs: ${errorCount}`)
  console.log('\n💡 Les dialogues seront maintenant affichés groupés par thème')
  console.log('   en triant par chapter_number puis par level')
  console.log('\n✨ Terminé !')
}

organizeDialogues()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Erreur:', err)
    process.exit(1)
  })
