require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function findUncompletedExercises() {
  // Get Sidney's ID
  const { data: sidney } = await supabase
    .from('users_profile')
    .select('id, name')
    .eq('name', 'Sidney')
    .single()

  if (!sidney) {
    console.log('Sidney not found')
    return
  }

  console.log(`Finding exercises for: ${sidney.name}\n`)

  // Get all exercises
  const { data: allExercises } = await supabase
    .from('exercises')
    .select('*, materials(title, lang)')
    .order('material_id', { ascending: true })

  // Get Sidney's progress
  const { data: progress } = await supabase
    .from('user_exercise_progress')
    .select('*')
    .eq('user_id', sidney.id)

  const progressMap = {}
  if (progress) {
    progress.forEach(p => {
      progressMap[p.exercise_id] = p
    })
  }

  // Categorize exercises
  const notStarted = []
  const inProgress = []
  const completed = []

  allExercises.forEach(ex => {
    const userProgress = progressMap[ex.id]

    if (!userProgress) {
      notStarted.push(ex)
    } else if (userProgress.score < 100) {
      inProgress.push({ ...ex, userProgress })
    } else {
      completed.push({ ...ex, userProgress })
    }
  })

  console.log('═══════════════════════════════════════════════════')
  console.log('🆕 EXERCICES NON COMMENCÉS (Tu gagneras de l\'XP !)')
  console.log('═══════════════════════════════════════════════════\n')

  if (notStarted.length === 0) {
    console.log('Aucun exercice non commencé\n')
  } else {
    notStarted.forEach(ex => {
      console.log(`📝 ${ex.title}`)
      console.log(`   Material: ${ex.materials?.title || 'Unknown'} (ID: ${ex.material_id})`)
      console.log(`   Type: ${ex.type}`)
      console.log(`   XP Reward: ${ex.xp_reward} XP`)
      console.log(`   Level: ${ex.level}`)
      console.log('')
    })
  }

  console.log('═══════════════════════════════════════════════════')
  console.log('📊 EXERCICES EN COURS (< 100%, tu peux gagner de l\'XP !)')
  console.log('═══════════════════════════════════════════════════\n')

  if (inProgress.length === 0) {
    console.log('Aucun exercice en cours\n')
  } else {
    inProgress.forEach(ex => {
      console.log(`📊 ${ex.title}`)
      console.log(`   Material: ${ex.materials?.title || 'Unknown'} (ID: ${ex.material_id})`)
      console.log(`   Type: ${ex.type}`)
      console.log(`   Current Score: ${ex.userProgress.score}%`)
      console.log(`   Attempts: ${ex.userProgress.attempts}`)
      console.log(`   XP Reward si 100%: ${ex.xp_reward} XP`)
      console.log(`   Level: ${ex.level}`)
      console.log('')
    })
  }

  console.log('═══════════════════════════════════════════════════')
  console.log('✅ EXERCICES COMPLÉTÉS (100%, XP déjà obtenu)')
  console.log('═══════════════════════════════════════════════════\n')

  if (completed.length === 0) {
    console.log('Aucun exercice complété\n')
  } else {
    completed.forEach(ex => {
      console.log(`✅ ${ex.title}`)
      console.log(`   Material: ${ex.materials?.title || 'Unknown'} (ID: ${ex.material_id})`)
      console.log(`   Score: ${ex.userProgress.score}%`)
      console.log(`   Attempts: ${ex.userProgress.attempts}`)
      console.log(`   XP déjà obtenu: ${ex.xp_reward} XP`)
      console.log('')
    })
  }

  console.log('═══════════════════════════════════════════════════')
  console.log('📈 RÉSUMÉ')
  console.log('═══════════════════════════════════════════════════\n')
  console.log(`Total exercices: ${allExercises.length}`)
  console.log(`🆕 Non commencés: ${notStarted.length} (${notStarted.reduce((sum, ex) => sum + ex.xp_reward, 0)} XP disponibles)`)
  console.log(`📊 En cours: ${inProgress.length} (${inProgress.reduce((sum, ex) => sum + ex.xp_reward, 0)} XP disponibles)`)
  console.log(`✅ Complétés: ${completed.length} (${completed.reduce((sum, ex) => sum + ex.xp_reward, 0)} XP déjà obtenus)`)
  console.log('')
}

findUncompletedExercises()
