/**
 * Sync Method content (courses, lessons, training) from DEV to PROD database
 *
 * Usage: node scripts/sync-method-to-prod.js [--dry-run] [--table=courses|lessons|themes|questions]
 *
 * Options:
 *   --dry-run     Show what would be synced without actually syncing
 *   --table=X     Only sync a specific table (courses, lessons, themes, questions)
 *
 * Examples:
 *   node scripts/sync-method-to-prod.js                    # Sync everything
 *   node scripts/sync-method-to-prod.js --dry-run          # Preview changes
 *   node scripts/sync-method-to-prod.js --table=lessons    # Only sync lessons
 *
 * This script syncs:
 * - courses
 * - course_lessons
 * - training_themes
 * - training_questions
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

// DEV database (source)
const devUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const devKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// PROD database (destination)
const prodUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const prodKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY

// Parse arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const tableArg = args.find(a => a.startsWith('--table='))
const specificTable = tableArg ? tableArg.split('=')[1] : null

if (!devUrl || !devKey) {
  console.error('❌ Missing DEV database credentials in .env.local')
  process.exit(1)
}

if (!prodUrl || !prodKey) {
  console.error('❌ Missing PROD database credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_PROD_URL, SUPABASE_PROD_SERVICE_ROLE_KEY')
  process.exit(1)
}

const devSupabase = createClient(devUrl, devKey)
const prodSupabase = createClient(prodUrl, prodKey)

const tableMap = {
  courses: 'courses',
  lessons: 'course_lessons',
  themes: 'training_themes',
  questions: 'training_questions'
}

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

async function syncTable(tableName, options = {}) {
  const { orderBy = 'id', conflictColumns = ['id'] } = options

  console.log(`\n📤 ${isDryRun ? '[DRY-RUN] ' : ''}Syncing ${tableName}...`)

  // Fetch from DEV
  const { data: devData, error: devError } = await devSupabase
    .from(tableName)
    .select('*')
    .order(orderBy)

  if (devError) {
    console.error(`  ❌ Error fetching from DEV:`, devError.message)
    return { success: false, error: devError.message }
  }

  if (!devData || devData.length === 0) {
    console.log(`  ⚠️  No data found in DEV`)
    return { success: true, count: 0 }
  }

  console.log(`  📊 Found ${devData.length} records in DEV`)

  if (isDryRun) {
    console.log(`  🔍 Would sync ${devData.length} records to PROD`)
    return { success: true, count: devData.length, dryRun: true }
  }

  // Upsert to PROD
  const { data: prodData, error: prodError } = await prodSupabase
    .from(tableName)
    .upsert(devData, {
      onConflict: conflictColumns.join(','),
      ignoreDuplicates: false
    })
    .select()

  if (prodError) {
    console.error(`  ❌ Error upserting to PROD:`, prodError.message)
    return { success: false, error: prodError.message }
  }

  console.log(`  ✅ Synced ${devData.length} records to PROD`)
  return { success: true, count: devData.length }
}

async function main() {
  console.log('=' .repeat(60))
  console.log('🚀 DEV → PROD SYNC')
  console.log('='.repeat(60))
  console.log(`   DEV:  ${devUrl}`)
  console.log(`   PROD: ${prodUrl}`)

  if (isDryRun) {
    console.log('\n   📋 DRY-RUN MODE - No changes will be made')
  }

  if (specificTable) {
    console.log(`\n   🎯 Only syncing: ${specificTable}`)
  }

  // Confirmation for production sync
  if (!isDryRun) {
    console.log('\n⚠️  WARNING: This will overwrite data in PRODUCTION!')
    const confirmed = await askConfirmation('Are you sure you want to continue? (y/N): ')

    if (!confirmed) {
      console.log('❌ Sync cancelled')
      process.exit(0)
    }
  }

  const results = {}
  const tablesToSync = specificTable
    ? { [specificTable]: tableMap[specificTable] }
    : tableMap

  // Sync in order (parents before children)
  if (tablesToSync.courses) {
    results.courses = await syncTable('courses', {
      orderBy: 'id',
      conflictColumns: ['id']
    })
  }

  if (tablesToSync.lessons) {
    results.course_lessons = await syncTable('course_lessons', {
      orderBy: 'id',
      conflictColumns: ['id']
    })
  }

  if (tablesToSync.themes) {
    results.training_themes = await syncTable('training_themes', {
      orderBy: 'id',
      conflictColumns: ['id']
    })
  }

  if (tablesToSync.questions) {
    results.training_questions = await syncTable('training_questions', {
      orderBy: 'id',
      conflictColumns: ['id']
    })
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log(`📋 SYNC SUMMARY ${isDryRun ? '(DRY-RUN)' : ''}`)
  console.log('='.repeat(60))

  let hasErrors = false
  for (const [table, result] of Object.entries(results)) {
    if (result.success) {
      const status = result.dryRun ? '🔍' : '✅'
      console.log(`  ${status} ${table}: ${result.count} records`)
    } else {
      console.log(`  ❌ ${table}: ${result.error}`)
      hasErrors = true
    }
  }

  if (hasErrors) {
    console.log('\n⚠️  Sync completed with errors')
    process.exit(1)
  } else if (isDryRun) {
    console.log('\n📋 Dry-run complete. Run without --dry-run to apply changes.')
  } else {
    console.log('\n✅ Sync to PROD completed successfully!')
  }
}

main().catch(console.error)
