const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function fixAdminLevel() {
  console.log('🔧 Fixing admin user level to match seeded materials...\n')

  // Check current level
  const { data: before } = await supabase
    .from('users_profile')
    .select('email, language_level')
    .eq('email', 'admin@linguami.dev')
    .single()

  console.log('Before:', before)

  // Update to beginner (to match our seeded materials)
  const { error } = await supabase
    .from('users_profile')
    .update({ language_level: 'beginner' })
    .eq('email', 'admin@linguami.dev')

  if (error) {
    console.error('❌ Error:', error)
  } else {
    const { data: after } = await supabase
      .from('users_profile')
      .select('email, language_level')
      .eq('email', 'admin@linguami.dev')
      .single()

    console.log('\n✅ Updated successfully!')
    console.log('After:', after)
    console.log('\nℹ️  The default level filter will now show materials at beginner level.')
  }
}

fixAdminLevel()
