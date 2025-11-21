import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.production') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log('\n🔍 Récupération des matériaux ayant le même titre dans les 3 langues...\n')

const { data: materials, error } = await supabase
  .from('materials')
  .select('id, title, lang, section, title_fr, title_en, title_ru')
  .order('section', { ascending: true })
  .order('id', { ascending: true })

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

// Find materials where all 3 titles are identical (need real translation)
const needsTranslation = materials.filter(m => {
  if (!m.title_fr || !m.title_en || !m.title_ru) return false
  // Check if all 3 are the same
  return m.title_fr === m.title_en && m.title_en === m.title_ru
})

console.log(`📊 Matériaux avec le même titre dans les 3 langues: ${needsTranslation.length}\n`)

// Group by section
const bySection = {}
needsTranslation.forEach(m => {
  if (!bySection[m.section]) bySection[m.section] = []
  bySection[m.section].push(m)
})

console.log('📋 Par section:\n')
Object.keys(bySection).sort().forEach(section => {
  console.log(`  ${section}: ${bySection[section].length} matériaux`)
})

console.log('\n\n=== MATÉRIAUX À TRADUIRE PAR SECTION ===\n')

Object.keys(bySection).sort().forEach(section => {
  console.log(`\n// ========== ${section.toUpperCase()} (${bySection[section].length} matériaux) ==========\n`)

  bySection[section].forEach(m => {
    console.log(`ID ${m.id}: "${m.title_ru}"`)
  })
})
