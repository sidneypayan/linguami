const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function cleanDatabase() {
  console.log('🧹 Cleaning dev database...\n')

  try {
    // Delete in correct order (respecting foreign keys)

    console.log('1️⃣ Deleting user_xp_history...')
    const { error: e1 } = await supabase.from('user_xp_history').delete().neq('id', 0)
    if (e1) console.log('⚠️ ', e1.message)
    else console.log('✅ Deleted')

    console.log('2️⃣ Deleting user_materials...')
    const { error: e2 } = await supabase.from('user_materials').delete().neq('user_id', '00000000-0000-0000-0000-000000000000')
    if (e2) console.log('⚠️ ', e2.message)
    else console.log('✅ Deleted')

    console.log('3️⃣ Deleting user_xp_profile...')
    const { error: e3 } = await supabase.from('user_xp_profile').delete().neq('user_id', '00000000-0000-0000-0000-000000000000')
    if (e3) console.log('⚠️ ', e3.message)
    else console.log('✅ Deleted')

    console.log('4️⃣ Deleting exercises...')
    const { error: e4 } = await supabase.from('exercises').delete().neq('id', 0)
    if (e4) console.log('⚠️ ', e4.message)
    else console.log('✅ Deleted')

    console.log('5️⃣ Deleting course_lessons...')
    const { error: e5 } = await supabase.from('course_lessons').delete().neq('id', 0)
    if (e5) console.log('⚠️ ', e5.message)
    else console.log('✅ Deleted')

    console.log('6️⃣ Deleting courses...')
    const { error: e6 } = await supabase.from('courses').delete().neq('id', 0)
    if (e6) console.log('⚠️ ', e6.message)
    else console.log('✅ Deleted')

    console.log('7️⃣ Deleting course_levels...')
    const { error: e7 } = await supabase.from('course_levels').delete().neq('id', 0)
    if (e7) console.log('⚠️ ', e7.message)
    else console.log('✅ Deleted')

    console.log('8️⃣ Deleting materials...')
    const { error: e8 } = await supabase.from('materials').delete().neq('id', 0)
    if (e8) console.log('⚠️ ', e8.message)
    else console.log('✅ Deleted')

    console.log('9️⃣ Deleting xp_rewards_config...')
    const { error: e9 } = await supabase.from('xp_rewards_config').delete().neq('id', 0)
    if (e9) console.log('⚠️ ', e9.message)
    else console.log('✅ Deleted')

    console.log('🔟 Deleting users_profile...')
    const { error: e10 } = await supabase.from('users_profile').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (e10) console.log('⚠️ ', e10.message)
    else console.log('✅ Deleted')

    console.log('1️⃣1️⃣ Deleting auth users...')
    const { data: users } = await supabase.auth.admin.listUsers()
    let deletedCount = 0
    for (const user of users.users) {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (!error) deletedCount++
    }
    console.log(`✅ Deleted ${deletedCount} auth users`)

    console.log('\n✨ Database cleaned successfully!')
    console.log('💡 Now run: node scripts/seed-dev-database-complete.js')

  } catch (error) {
    console.error('\n❌ Error during cleaning:', error.message)
    console.error(error)
  }
}

cleanDatabase()
