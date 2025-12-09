/**
 * Sync Method content (courses, lessons, training) from PROD to DEV database
 *
 * Usage: node scripts/sync-method-from-prod.js
 *
 * This script syncs:
 * - courses
 * - course_lessons
 * - training_themes
 * - training_questions
 *
 * It does NOT sync:
 * - course_levels (static data in code)
 * - user_course_progress (user data)
 * - user_course_access (user data)
 * - training_progress (user data)
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// PROD database (source)
const prodUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const prodKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY

// DEV database (destination)
const devUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const devKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!prodUrl || !prodKey) {
  console.error('Missing PROD database credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_PROD_URL, NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY')
  process.exit(1)
}

if (!devUrl || !devKey) {
  console.error('Missing DEV database credentials in .env.local')
  process.exit(1)
}

const prodSupabase = createClient(prodUrl, prodKey)
const devSupabase = createClient(devUrl, devKey)

async function syncTable(tableName, options = {}) {
  const { orderBy = 'id', conflictColumns = ['id'] } = options

  console.log(`\n📥 Syncing ${tableName}...`)

  // Fetch from PROD
  const { data: prodData, error: prodError } = await prodSupabase
    .from(tableName)
    .select('*')
    .order(orderBy)

  if (prodError) {
    console.error(`  ❌ Error fetching from PROD:`, prodError.message)
    return { success: false, error: prodError.message }
  }

  if (!prodData || prodData.length === 0) {
    console.log(`  ⚠️  No data found in PROD`)
    return { success: true, count: 0 }
  }

  console.log(`  📊 Found ${prodData.length} records in PROD`)

  // Upsert to DEV
  const { data: devData, error: devError } = await devSupabase
    .from(tableName)
    .upsert(prodData, {
      onConflict: conflictColumns.join(','),
      ignoreDuplicates: false
    })
    .select()

  if (devError) {
    console.error(`  ❌ Error upserting to DEV:`, devError.message)
    return { success: false, error: devError.message }
  }

  console.log(`  ✅ Synced ${prodData.length} records to DEV`)
  return { success: true, count: prodData.length }
}

async function main() {
  console.log('🔄 Starting PROD → DEV sync...')
  console.log(`   PROD: ${prodUrl}`)
  console.log(`   DEV:  ${devUrl}`)

  const results = {}

  // Sync courses first (parent table)
  results.courses = await syncTable('courses', {
    orderBy: 'id',
    conflictColumns: ['id']
  })

  // Then sync course_lessons (depends on courses)
  results.course_lessons = await syncTable('course_lessons', {
    orderBy: 'id',
    conflictColumns: ['id']
  })

  // Sync training_themes
  results.training_themes = await syncTable('training_themes', {
    orderBy: 'id',
    conflictColumns: ['id']
  })

  // Sync training_questions (depends on training_themes)
  results.training_questions = await syncTable('training_questions', {
    orderBy: 'id',
    conflictColumns: ['id']
  })

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📋 SYNC SUMMARY')
  console.log('='.repeat(50))

  let hasErrors = false
  for (const [table, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`  ✅ ${table}: ${result.count} records`)
    } else {
      console.log(`  ❌ ${table}: ${result.error}`)
      hasErrors = true
    }
  }

  if (hasErrors) {
    console.log('\n⚠️  Sync completed with errors')
    process.exit(1)
  } else {
    console.log('\n✅ Sync completed successfully!')
  }
}

main().catch(console.error)
