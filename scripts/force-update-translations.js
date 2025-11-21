/**
 * Script to force update material translations
 * Updates materials even if they already have translations
 * Specifically targets materials where all 3 titles are identical
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { materialTranslations } from './material-translations-complete.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get environment from command line argument (default: local)
const args = process.argv.slice(2)
const envArg = args.find(arg => arg.startsWith('--env='))
const environment = envArg ? envArg.split('=')[1] : 'local'

// Load environment variables
const envFile = environment === 'production' ? '.env.production' : '.env.local'
dotenv.config({ path: join(__dirname, '..', envFile) })

console.log(`🔧 Using environment: ${environment} (${envFile})\n`)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function forceUpdateTranslations() {
  console.log('🔄 Fetching materials with identical translations...\n')

  // Fetch all materials
  const { data: materials, error } = await supabase
    .from('materials')
    .select('id, title, lang, title_fr, title_en, title_ru')
    .order('id')

  if (error) {
    console.error('❌ Error fetching materials:', error)
    process.exit(1)
  }

  // Filter materials where all 3 titles are identical (need real translation)
  const needsUpdate = materials.filter(m => {
    if (!m.title_fr || !m.title_en || !m.title_ru) return false
    // Check if all 3 are the same
    return m.title_fr === m.title_en && m.title_en === m.title_ru
  })

  console.log(`📊 Found ${materials.length} total materials`)
  console.log(`🎯 Found ${needsUpdate.length} materials with identical titles in all 3 languages\n`)

  let updated = 0
  let skipped = 0
  let notFound = []

  for (const material of needsUpdate) {
    const { id, title, lang, title_fr, title_en, title_ru } = material

    // Try to find translation using different source titles
    const sourceTitle = title_ru || title_fr || title_en || title
    const translation = materialTranslations[sourceTitle]

    if (translation) {
      const updates = {
        title_fr: translation.fr,
        title_en: translation.en,
        title_ru: translation.ru
      }

      // Check if we actually need to update (translation is different)
      if (updates.title_fr === title_fr && updates.title_en === title_en && updates.title_ru === title_ru) {
        console.log(`⏭️  Skipping material ${id}: Already has correct translations`)
        skipped++
        continue
      }

      // Update the database
      const { error: updateError } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', id)

      if (updateError) {
        console.error(`❌ Error updating material ${id}:`, updateError)
      } else {
        console.log(`✅ Updated material ${id}: "${sourceTitle}"`)
        console.log(`   → FR: ${updates.title_fr}`)
        console.log(`   → EN: ${updates.title_en}`)
        console.log(`   → RU: ${updates.title_ru}\n`)
        updated++
      }
    } else {
      notFound.push({ id, title: sourceTitle, lang })
      console.log(`⚠️  No translation found for: "${sourceTitle}" (ID: ${id}, Lang: ${lang})`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📈 Summary:')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⏭️  Skipped (already correct): ${skipped}`)
  console.log(`   ⚠️  Not found in dictionary: ${notFound.length}`)

  if (notFound.length > 0) {
    console.log('\n⚠️  Materials without translations:')
    notFound.forEach(m => {
      console.log(`   - ID ${m.id}: "${m.title}" (${m.lang})`)
    })
    console.log('\nℹ️  You can add these translations manually or update the materialTranslations dictionary.')
  }

  console.log('='.repeat(60) + '\n')
}

forceUpdateTranslations().catch(console.error)
