/**
 * Insère les 57 dialogues français dans la DB de production
 * (19 dialogues × 3 niveaux: beginner, intermediate, advanced)
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Lire les 57 dialogues
const dialogues = require('./all-57-dialogues-fr.json')

// Fonction pour générer un slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .trim()
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
}

async function getImageUrlFromOriginal(originalId) {
  const { data, error } = await supabase
    .from('materials')
    .select('image_url')
    .eq('id', originalId)
    .single()

  if (error) {
    console.warn(`⚠️  Impossible de récupérer l'image_url pour l'ID ${originalId}:`, error.message)
    return null
  }

  return data?.image_url || null
}

async function insertDialogues() {
  console.log('\n🚀 Début de l\'insertion des 57 dialogues français...\n')

  let successCount = 0
  let errorCount = 0
  const errors = []

  for (let i = 0; i < dialogues.length; i++) {
    const dialogue = dialogues[i]

    // Récupérer l'image_url du dialogue original
    const imageUrl = await getImageUrlFromOriginal(dialogue.original_id)

    // Générer un slug unique
    const baseSlug = generateSlug(dialogue.title_fr)
    const slug = `${baseSlug}-${dialogue.level}`

    // Préparer les données pour l'insertion
    const materialData = {
      title_fr: dialogue.title_fr,
      title_en: null,
      title_ru: null,
      content_fr: dialogue.content_fr,
      content_en: null,
      content_ru: null,
      section: dialogue.section,
      level: dialogue.level,
      lang: dialogue.lang,
      video_url: dialogue.video_url || null,
      image_url: imageUrl,
      author: dialogue.author || null,
      slug: slug,
      is_free: true
    }

    console.log(`[${i + 1}/57] Insertion: "${dialogue.title_fr}" (${dialogue.level})`)

    // Insérer dans la base de données
    const { data, error } = await supabase
      .from('materials')
      .insert(materialData)
      .select()

    if (error) {
      errorCount++
      const errorMsg = `Erreur pour "${dialogue.title_fr}" (${dialogue.level}): ${error.message}`
      console.error(`   ❌ ${errorMsg}`)
      errors.push(errorMsg)
    } else {
      successCount++
      console.log(`   ✅ Inséré avec l'ID: ${data[0].id}`)
    }

    // Petite pause pour éviter de surcharger la DB
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
