const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function debugUserLanguage() {
  console.log('\n🔍 Debugging User Language Configuration...\n')

  // Get all users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()

  if (usersError) {
    console.error('❌ Error fetching users:', usersError)
    return
  }

  console.log(`Found ${users.length} users\n`)

  // Check each user's profile
  for (const user of users.slice(0, 5)) {
    const { data: profile } = await supabase
      .from('users_profile')
      .select('email, learning_language, spoken_language')
      .eq('id', user.id)
      .maybeSingle()

    if (profile) {
      console.log(`👤 ${profile.email}`)
      console.log(`   📚 Learning Language: ${profile.learning_language || '❌ NOT SET'}`)
      console.log(`   🗣️  Spoken Language: ${profile.spoken_language || '❌ NOT SET'}`)
      console.log('')
    }
  }

  // Check materials in "pop" section
  console.log('\n📊 Materials in "pop" section:\n')

  const { data: materials, error: materialsError } = await supabase
    .from('materials')
    .select('id, title, lang, level, section')
    .eq('section', 'pop')
    .order('lang')
    .limit(20)

  if (materialsError) {
    console.error('❌ Error fetching materials:', materialsError)
    return
  }

  const langCount = {}
  materials?.forEach(m => {
    langCount[m.lang] = (langCount[m.lang] || 0) + 1
  })

  console.log('Materials by language:')
  Object.entries(langCount).forEach(([lang, count]) => {
    console.log(`  ${lang}: ${count} materials`)
  })

  console.log('\nFirst 5 materials in "pop":')
  materials?.slice(0, 5).forEach(m => {
    console.log(`  [${m.lang}] ${m.title} (${m.level})`)
  })
}

debugUserLanguage()
  .then(() => {
    console.log('\n✅ Debug complete!\n')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
