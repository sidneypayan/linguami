/**
 * Script to automatically translate material titles
 * Fetches all materials and translates titles to fr/en/ru
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

// Use the complete translations dictionary
const commonTranslations = materialTranslations

async function translateMaterialTitles() {
  console.log('🔄 Fetching materials from database...\n')

  // Fetch all materials
  const { data: materials, error } = await supabase
    .from('materials')
    .select('id, title, lang, title_fr, title_en, title_ru')
    .order('id')

  if (error) {
    console.error('❌ Error fetching materials:', error)
    process.exit(1)
  }

  console.log(`📊 Found ${materials.length} materials\n`)

  let updated = 0
  let skipped = 0
  let notFound = []

  for (const material of materials) {
    const { id, title, lang, title_fr, title_en, title_ru } = material

    // Skip if all translations already exist
    if (title_fr && title_en && title_ru) {
      skipped++
      continue
    }

    // Check if we have a translation in our dictionary
    const translation = commonTranslations[title]

    if (translation) {
      const updates = {}
      if (!title_fr) updates.title_fr = translation.fr
      if (!title_en) updates.title_en = translation.en
      if (!title_ru) updates.title_ru = translation.ru

      // Update the database
      const { error: updateError } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', id)

      if (updateError) {
        console.error(`❌ Error updating material ${id}:`, updateError)
      } else {
        console.log(`✅ Updated material ${id}: ${title} (${lang})`)
        console.log(`   → FR: ${updates.title_fr || title_fr}`)
        console.log(`   → EN: ${updates.title_en || title_en}`)
        console.log(`   → RU: ${updates.title_ru || title_ru}\n`)
        updated++
      }
    } else {
      notFound.push({ id, title, lang })
      console.log(`⚠️  No translation found for: ${title} (ID: ${id}, Lang: ${lang})`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📈 Summary:')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⏭️  Skipped (already translated): ${skipped}`)
  console.log(`   ⚠️  Not found in dictionary: ${notFound.length}`)

  if (notFound.length > 0) {
    console.log('\n⚠️  Materials without translations:')
    notFound.forEach(m => {
      console.log(`   - ID ${m.id}: "${m.title}" (${m.lang})`)
    })
    console.log('\nℹ️  You can add these translations manually or update the commonTranslations dictionary.')
  }

  console.log('='.repeat(60) + '\n')
}

translateMaterialTitles().catch(console.error)
