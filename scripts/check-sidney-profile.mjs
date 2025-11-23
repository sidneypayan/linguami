import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://capnpewksfdnllttnvzu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSidneyProfile() {
  console.log('🔍 Vérification du profil Sidney...\n')

  const { data: users, error } = await supabase
    .from('users_profile')
    .select('id, name, email, learning_language, spoken_language, role')
    .or('name.ilike.%sidney%,email.ilike.%sidney%')

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  if (!users || users.length === 0) {
    console.log('❌ Utilisateur Sidney non trouvé')
    return
  }

  console.log(`✅ Profil trouvé:\n`)
  users.forEach(user => {
    console.log(`Nom: ${user.name || 'N/A'}`)
    console.log(`Email: ${user.email || 'N/A'}`)
    console.log(`Role: ${user.role}`)
    console.log(`learning_language: ${user.learning_language}`)
    console.log(`spoken_language: ${user.spoken_language}`)
    console.log(`ID: ${user.id}\n`)

    if (user.learning_language === user.spoken_language) {
      console.log('⚠️ CONFLIT DÉTECTÉ!')
    } else {
      console.log('✅ Pas de conflit en DB')
    }
  })
}

checkSidneyProfile()
