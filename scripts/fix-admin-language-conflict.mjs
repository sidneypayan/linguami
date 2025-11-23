import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://capnpewksfdnllttnvzu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAdminConflict() {
  console.log('🔧 Correction du conflit pour admin@linguami.dev...\n')

  // Trouver l'admin
  const { data: admin, error: fetchError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('email', 'admin@linguami.dev')
    .single()

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération de l\'admin:', fetchError)
    return
  }

  console.log('📝 Profil actuel:')
  console.log(`   learning_language: ${admin.learning_language}`)
  console.log(`   spoken_language: ${admin.spoken_language}\n`)

  if (admin.learning_language !== admin.spoken_language) {
    console.log('✅ Pas de conflit, rien à faire!')
    return
  }

  // Règles de correction :
  // - spoken = 'fr' → learning = 'ru'
  // - spoken = 'ru' → learning = 'fr'
  // - spoken = 'en' → learning = 'fr'
  let newLearningLanguage
  if (admin.spoken_language === 'fr') {
    newLearningLanguage = 'ru'
  } else if (admin.spoken_language === 'ru') {
    newLearningLanguage = 'fr'
  } else {
    newLearningLanguage = 'fr'
  }

  console.log(`🔄 Correction: learning_language ${admin.learning_language} → ${newLearningLanguage}\n`)

  const { error: updateError } = await supabase
    .from('users_profile')
    .update({ learning_language: newLearningLanguage })
    .eq('id', admin.id)

  if (updateError) {
    console.error('❌ Erreur lors de la mise à jour:', updateError)
    return
  }

  console.log('✅ Conflit corrigé avec succès!')
  console.log(`   learning_language: ${newLearningLanguage}`)
  console.log(`   spoken_language: ${admin.spoken_language}`)
}

fixAdminConflict()
