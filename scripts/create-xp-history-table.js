const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function createTable() {
  console.log('📊 Creating user_xp_history table...\n')

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, 'create-user-xp-history-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Execute SQL via Supabase RPC (this won't work directly)
    // Note: Supabase JS client doesn't support raw SQL execution
    // You need to use the SQL Editor in the dashboard or use psql

    console.log('❌ Cannot execute raw SQL via Supabase JS client')
    console.log('✅ Please use one of these methods instead:')
    console.log('')
    console.log('Method 1: Supabase Dashboard')
    console.log('  1. Open https://supabase.com/dashboard')
    console.log('  2. Select your dev project')
    console.log('  3. Go to SQL Editor')
    console.log('  4. Copy-paste the SQL from: scripts/create-user-xp-history-table.sql')
    console.log('  5. Click Run')
    console.log('')
    console.log('Method 2: psql command line')
    console.log(`  psql "${process.env.DATABASE_URL}" < scripts/create-user-xp-history-table.sql`)
    console.log('')
    console.log('📄 SQL content to execute:')
    console.log('─'.repeat(80))
    console.log(sql)
    console.log('─'.repeat(80))

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createTable()
