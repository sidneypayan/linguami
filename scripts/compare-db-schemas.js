const { createClient } = require('@supabase/supabase-js')

// Production DB
const prodSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_PROD || 'YOUR_PROD_URL',
  process.env.SUPABASE_SERVICE_ROLE_KEY_PROD || 'YOUR_PROD_SERVICE_KEY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Dev DB
const devSupabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function getTables(supabase, dbName) {
  // Query to get all tables in public schema
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
  })

  if (error) {
    // Fallback: try direct query (may not work with anon key)
    console.log(`⚠️  RPC failed for ${dbName}, trying alternative method...`)

    // Try listing known tables by attempting to query them
    const knownTables = [
      'users_profile', 'user_xp_profile', 'user_xp_history', 'user_materials',
      'user_words', 'user_cards', 'user_goals', 'user_streak_tracking',
      'materials', 'exercises', 'books',
      'course_levels', 'courses', 'course_lessons', 'course_user_progress',
      'xp_rewards_config', 'blog_posts'
    ]

    const existingTables = []
    for (const table of knownTables) {
      const { error: checkError } = await supabase.from(table).select('*').limit(0)
      if (!checkError || !checkError.message.includes('not found')) {
        existingTables.push(table)
      }
    }

    return existingTables.sort()
  }

  return data?.map(row => row.table_name).sort() || []
}

async function compareSchemas() {
  console.log('🔍 Comparing database schemas...\n')

  try {
    console.log('📊 Fetching tables from PRODUCTION...')
    const prodTables = await getTables(prodSupabase, 'PROD')
    console.log(`   Found ${prodTables.length} tables\n`)

    console.log('📊 Fetching tables from DEV...')
    const devTables = await getTables(devSupabase, 'DEV')
    console.log(`   Found ${devTables.length} tables\n`)

    // Find missing tables in dev
    const missingInDev = prodTables.filter(table => !devTables.includes(table))

    // Find extra tables in dev
    const extraInDev = devTables.filter(table => !prodTables.includes(table))

    // Common tables
    const commonTables = prodTables.filter(table => devTables.includes(table))

    console.log('=' .repeat(80))
    console.log('📋 COMPARISON RESULTS')
    console.log('='.repeat(80))

    if (missingInDev.length > 0) {
      console.log('\n❌ Tables MISSING in DEV (exist in PROD):')
      missingInDev.forEach(table => {
        console.log(`   - ${table}`)
      })
    } else {
      console.log('\n✅ No missing tables in DEV')
    }

    if (extraInDev.length > 0) {
      console.log('\n⚠️  Tables EXTRA in DEV (not in PROD):')
      extraInDev.forEach(table => {
        console.log(`   - ${table}`)
      })
    }

    console.log(`\n✅ Common tables: ${commonTables.length}`)
    console.log('\n' + '='.repeat(80))

    if (missingInDev.length > 0) {
      console.log('\n💡 ACTION REQUIRED:')
      console.log('   Create migrations for missing tables in supabase/migrations/')
      console.log('   Or export them from prod schema')
    } else {
      console.log('\n✅ Dev database schema is complete!')
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.log('\n💡 Make sure you have set NEXT_PUBLIC_SUPABASE_URL_PROD and SUPABASE_SERVICE_ROLE_KEY_PROD in .env.local')
  }
}

compareSchemas()
