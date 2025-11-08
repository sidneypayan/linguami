require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllXP() {
  // Get all users with XP or exercise progress
  const { data: xpProfiles, error } = await supabase
    .from('user_xp_profile')
    .select('*, users_profile(name)')
    .or('total_xp.gt.0,total_gold.gt.0')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Users with XP or Gold:\n')
  xpProfiles.forEach(profile => {
    console.log(`${profile.users_profile?.name || 'Unknown'}:`)
    console.log(`  XP: ${profile.total_xp} | Gold: ${profile.total_gold} | Level: ${profile.current_level}`)
  })

  // Get all users with exercise progress
  const { data: progressData, error: progressError } = await supabase
    .from('user_exercise_progress')
    .select('user_id, exercise_id, score, attempts, last_attempt_at')
    .order('last_attempt_at', { ascending: false })
    .limit(20)

  if (progressError) {
    console.error('Error getting progress:', progressError)
  } else {
    console.log('\n\nRecent exercise attempts:\n')
    for (const p of progressData) {
      // Get user and exercise details separately
      const { data: user } = await supabase
        .from('users_profile')
        .select('name')
        .eq('id', p.user_id)
        .single()

      const { data: exercise } = await supabase
        .from('exercises')
        .select('title')
        .eq('id', p.exercise_id)
        .single()

      console.log(`${user?.name || 'Unknown'}: Exercise "${exercise?.title}" - ${p.score}% (${p.attempts} attempts) at ${p.last_attempt_at}`)
    }
  }

  // Get recent XP transactions
  const { data: transactions, error: txError } = await supabase
    .from('xp_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (txError) {
    console.error('Error getting transactions:', txError)
  } else {
    console.log('\n\nRecent XP transactions:\n')
    for (const tx of transactions) {
      const { data: user } = await supabase
        .from('users_profile')
        .select('name')
        .eq('id', tx.user_id)
        .single()

      console.log(`${user?.name || 'Unknown'}: +${tx.xp_amount} XP, +${tx.gold_earned} Gold - ${tx.description} at ${tx.created_at}`)
    }
  }
}

checkAllXP()
