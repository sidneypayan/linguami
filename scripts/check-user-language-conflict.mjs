import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://capnpewksfdnllttnvzu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUserConflicts() {
  console.log('🔍 Vérification des conflits learning_language === spoken_language...\n')

  const { data: users, error } = await supabase
    .from('users_profile')
    .select('id, name, email, learning_language, spoken_language')
    .or('learning_language.eq.spoken_language')

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  if (!users || users.length === 0) {
    console.log('✅ Aucun conflit détecté en base de données')
    return
  }

  console.log(`⚠️ ${users.length} utilisateur(s) avec conflit détecté(s):\n`)
  users.forEach(user => {
    console.log(`- ${user.email || user.name || user.id}`)
    console.log(`  learning_language: ${user.learning_language}`)
    console.log(`  spoken_language: ${user.spoken_language}\n`)
  })
}

checkUserConflicts()
