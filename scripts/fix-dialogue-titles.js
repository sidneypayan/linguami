/**
 * Uniformise les titres des dialogues : même titre pour les 3 niveaux
 * Utilise une traduction simple des titres russes originaux
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Mapping des titres simples en français (traduction directe du russe)
const simpleTitles = {
  69: "Où se trouve la banque ?",
  123: "A la banque",
  124: "A la caisse du cinéma",
  125: "Dans un magasin de chaussures",
  126: "Dans un magasin de vêtements",
  127: "Au marché",
  128: "Au supermarché",
  129: "Dans un magasin de fournitures",
  131: "Au restaurant",
  132: "Les saisons",
  133: "Au café",
  134: "Dans un magasin d'électronique",
  140: "Chez le fleuriste",
  141: "Le plat préféré",
  145: "Dans le bus",
  146: "A la pharmacie",
  147: "Dans une librairie",
  152: "La famille",
  153: "Chez le médecin"
}

async function updateTitles() {
  console.log('\n🔧 Uniformisation des titres des dialogues...\n')

  // 1. Mettre à jour le fichier JSON
  console.log('📝 Mise à jour du fichier JSON...')
  const dialogues = require('./all-57-dialogues-fr.json')

  dialogues.forEach(dialogue => {
    const simpleTitle = simpleTitles[dialogue.original_id]
    if (simpleTitle) {
      dialogue.title_fr = simpleTitle
    }
  })

  fs.writeFileSync(
    'D:/linguami/scripts/all-57-dialogues-fr.json',
    JSON.stringify(dialogues, null, 2)
  )
  console.log('✅ Fichier JSON mis à jour\n')

  // 2. Mettre à jour la DB de production
  console.log('🗄️  Mise à jour de la base de données...')

  let successCount = 0
  let errorCount = 0

  // Les dialogues ont été insérés avec les IDs 601 à 657
  for (let i = 0; i < dialogues.length; i++) {
    const dialogue = dialogues[i]
    const dbId = 601 + i
    const newTitle = simpleTitles[dialogue.original_id]

    if (!newTitle) {
      console.error(`❌ Pas de titre pour l'ID original ${dialogue.original_id}`)
      errorCount++
      continue
    }

    const { error } = await supabase
      .from('materials')
      .update({ title: newTitle })
      .eq('id', dbId)

    if (error) {
      console.error(`❌ Erreur pour l'ID ${dbId}: ${error.message}`)
      errorCount++
    } else {
      console.log(`[${i + 1}/57] ✅ ID ${dbId}: "${newTitle}"`)
      successCount++
    }

    await new Promise(resolve => setTimeout(resolve, 50))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RÉSULTATS')
  console.log('='.repeat(60))
  console.log(`✅ Succès: ${successCount}/57`)
  console.log(`❌ Erreurs: ${errorCount}/57`)
  console.log('\n✨ Terminé !')
}

updateTitles()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Erreur:', err)
    process.exit(1)
  })
