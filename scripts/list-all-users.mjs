import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://capnpewksfdnllttnvzu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function listAllUsers() {
  console.log('👥 Liste de tous les utilisateurs:\n')

  const { data: users, error } = await supabase
    .from('users_profile')
    .select('id, name, email, learning_language, spoken_language, role')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  if (!users || users.length === 0) {
    console.log('❌ Aucun utilisateur trouvé')
    return
  }

  console.log(`📊 ${users.length} utilisateur(s) récent(s):\n`)
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || user.email || 'Anonyme'}`)
    console.log(`   Email: ${user.email || 'N/A'}`)
    console.log(`   Role: ${user.role || 'user'}`)
    console.log(`   learning_language: ${user.learning_language}`)
    console.log(`   spoken_language: ${user.spoken_language}`)

    if (user.learning_language === user.spoken_language) {
      console.log(`   ⚠️ CONFLIT!`)
    }
    console.log()
  })
}

listAllUsers()
