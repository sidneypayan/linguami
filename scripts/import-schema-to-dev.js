const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Dev Supabase credentials
const supabaseUrl = 'https://capnpewksfdnllttnvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function importSchema() {
  console.log('📥 Reading schema file...')
  const schemaPath = path.join(__dirname, '..', 'prod_schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')

  // Split schema into individual statements
  // Note: This is a simplified approach - for production, use proper SQL parsing
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`📝 Found ${statements.length} SQL statements`)
  console.log('⚠️  Note: This script can execute DDL via RPC or we need direct DB access')
  console.log('💡 Alternative: Use Supabase Dashboard > SQL Editor to paste and run the schema')

  // Test connection
  console.log('\n🔍 Testing connection to dev database...')
  const { data, error } = await supabase.from('users_profile').select('count').limit(1)

  if (error) {
    console.log('❌ Connection test result:', error.message)
    console.log('\n📋 Since direct SQL execution is limited, please:')
    console.log('1. Go to https://supabase.com/dashboard/project/capnpewksfdnllttnvzu/sql/new')
    console.log('2. Open D:/linguami/prod_schema.sql')
    console.log('3. Copy and paste the entire content')
    console.log('4. Click "Run" to execute')
  } else {
    console.log('✅ Connection successful!')
    console.log('Note: Table already exists or connection is working')
  }
}

importSchema()
