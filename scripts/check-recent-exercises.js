require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRecentExercises() {
  // Get recent exercise progress for material 121
  const { data: progressData, error: progressError } = await supabase
    .from('user_exercise_progress')
    .select('*, exercises(title, material_id, xp_reward)')
    .order('last_attempt_at', { ascending: false })
    .limit(10)

  if (progressError) {
    console.error('Error:', progressError)
    return
  }

  console.log('Recent exercise attempts:\n')
  for (const p of progressData) {
    const { data: user } = await supabase
      .from('users_profile')
      .select('name')
      .eq('id', p.user_id)
      .single()

    console.log(`${user?.name || 'Unknown'}: Exercise "${p.exercises?.title}" (Material ${p.exercises?.material_id})`)
    console.log(`  Score: ${p.score}% | Attempts: ${p.attempts} | XP Reward: ${p.exercises?.xp_reward}`)
    console.log(`  Last attempt: ${p.last_attempt_at}`)
    console.log(`  Completed: ${p.completed}`)
    console.log('')
  }

  // Get recent XP transactions
  const { data: transactions, error: txError } = await supabase
    .from('xp_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (txError) {
    console.error('Error getting transactions:', txError)
  } else {
    console.log('\nRecent XP transactions:\n')
    for (const tx of transactions) {
      const { data: user } = await supabase
        .from('users_profile')
        .select('name')
        .eq('id', tx.user_id)
        .single()

      console.log(`${user?.name || 'Unknown'}: +${tx.xp_amount} XP, +${tx.gold_earned} Gold`)
      console.log(`  ${tx.description}`)
      console.log(`  ${tx.created_at}`)
      console.log('')
    }
  }

  // Get Sidney's current XP
  const { data: sidney } = await supabase
    .from('users_profile')
    .select('id, name')
    .eq('name', 'Sidney')
    .single()

  if (sidney) {
    const { data: xpProfile } = await supabase
      .from('user_xp_profile')
      .select('*')
      .eq('user_id', sidney.id)
      .single()

    console.log('\nSidney\'s current XP profile:')
    console.log(`  Total XP: ${xpProfile?.total_xp || 0}`)
    console.log(`  Total Gold: ${xpProfile?.total_gold || 0}`)
    console.log(`  Level: ${xpProfile?.current_level || 1}`)
  }
}

checkRecentExercises()
