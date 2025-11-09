require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkExercisesTable() {
  console.log('🔍 Vérification de la structure de la table exercises...\n')

  // Récupérer un exercice existant pour voir la structure
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Erreur:', error.message)
    return
  }

  if (exercises && exercises.length > 0) {
    console.log('📋 Structure d\'un exercice existant:')
    console.log(JSON.stringify(exercises[0], null, 2))
    console.log('\n📝 Colonnes disponibles:', Object.keys(exercises[0]))
  } else {
    console.log('⚠️  Aucun exercice trouvé dans la base de données')
  }
}

checkExercisesTable()
