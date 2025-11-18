const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixUserLanguages() {
  console.log('\n🔧 Fixing user language configuration...\n')

  // User email to fix
  const userEmail = 'spayan.fr@gmail.com'

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('users_profile')
    .select('id, email, learning_language, spoken_language')
    .eq('email', userEmail)
    .single()

  if (profileError) {
    console.error('❌ Error fetching profile:', profileError)
    return
  }

  console.log('📋 Current configuration:')
  console.log(`   Email: ${profile.email}`)
  console.log(`   Learning: ${profile.learning_language}`)
  console.log(`   Spoken: ${profile.spoken_language}`)

  // Fix: swap the languages
  const { data: updated, error: updateError } = await supabase
    .from('users_profile')
    .update({
      learning_language: 'ru',  // Should be learning Russian
      spoken_language: 'fr'     // Native French speaker
    })
    .eq('id', profile.id)
    .select()

  if (updateError) {
    console.error('❌ Error updating profile:', updateError)
    return
  }

  console.log('\n✅ Fixed configuration:')
  console.log(`   Email: ${userEmail}`)
  console.log(`   Learning: ru`)
  console.log(`   Spoken: fr`)
  console.log('\n🎉 Done! Refresh the page to see the changes.')
}

fixUserLanguages()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
