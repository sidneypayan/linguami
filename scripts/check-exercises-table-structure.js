#!/usr/bin/env node
/**
 * Script to check the structure of exercises table in production DB
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTableStructure() {
  console.log('\n🔍 Checking exercises table structure in PRODUCTION DB...\n')
  console.log(`📍 Database: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`)

  // Get a sample exercise to see its columns
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Error querying exercises table:', error)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No exercises found in the table')
    process.exit(0)
  }

  console.log('✅ Sample exercise found:')
  console.log('📋 Columns in the table:')
  Object.keys(data[0]).forEach(column => {
    console.log(`   - ${column}`)
  })

  console.log('\n🔍 Checking for polymorphic columns...')
  if (data[0].hasOwnProperty('parent_type')) {
    console.log('✅ parent_type column EXISTS')
  } else {
    console.log('❌ parent_type column MISSING')
  }

  if (data[0].hasOwnProperty('parent_id')) {
    console.log('✅ parent_id column EXISTS')
  } else {
    console.log('❌ parent_id column MISSING')
  }

  console.log('\n📊 Sample exercise data:')
  console.log(JSON.stringify(data[0], null, 2))
}

checkTableStructure()
