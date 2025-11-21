/**
 * Insère les 8 dialogues français manquants dans la DB de production
 * (4 thèmes × 2 niveaux: intermediate et advanced)
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Lire les 8 dialogues manquants
const dialogues = require('./missing-8-dialogues-fr.json')

async function insertDialogues() {
  console.log('\n🚀 Insertion des 8 dialogues français manquants...\n')

  let successCount = 0
  let errorCount = 0
  const errors = []

  for (let i = 0; i < dialogues.length; i++) {
    const dialogue = dialogues[i]

    // Préparer les données pour l'insertion
    const materialData = {
      title: dialogue.title,
      content: dialogue.content,
      section: dialogue.section,
      level: dialogue.level,
      lang: dialogue.lang,
      video_url: null,
      image_filename: null,
      audio_filename: null,
      content_accented: null,
      chapter_number: null,
      book_id: null
    }

    console.log(`[${i + 1}/8] Insertion: "${dialogue.title}" (${dialogue.level})`)

    // Insérer dans la base de données
    const { data, error } = await supabase
      .from('materials')
      .insert(materialData)
      .select()

    if (error) {
      errorCount++
      const errorMsg = `Erreur pour "${dialogue.title}" (${dialogue.level}): ${error.message}`
      console.error(`   ❌ ${errorMsg}`)
      errors.push(errorMsg)
    } else {
      successCount++
      console.log(`   ✅ Inséré avec l'ID: ${data[0].id}`)
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RÉSULTATS DE L\'INSERTION')
  console.log('='.repeat(60))
  console.log(`✅ Succès: ${successCount}/${dialogues.length}`)
  console.log(`❌ Erreurs: ${errorCount}/${dialogues.length}`)

  if (errors.length > 0) {
    console.log('\n⚠️  DÉTAILS DES ERREURS:')
    errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err}`)
    })
  }

  console.log('\n✨ Insertion terminée !')
}

// Exécuter le script
insertDialogues()
  .then(() => {
    console.log('\n👍 Script terminé avec succès')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Erreur fatale:', error)
    process.exit(1)
  })
