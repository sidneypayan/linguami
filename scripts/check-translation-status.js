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

const { data: materials, error } = await supabase
  .from('materials')
  .select('id, title, lang, title_fr, title_en, title_ru')
  .order('id')

if (error) {
  console.error('Error:', error)
  process.exit(1)
}

const total = materials.length
const fullyTranslated = materials.filter(m => m.title_fr && m.title_en && m.title_ru).length
const partiallyTranslated = materials.filter(m =>
  (m.title_fr || m.title_en || m.title_ru) && !(m.title_fr && m.title_en && m.title_ru)
).length
const notTranslated = materials.filter(m => !m.title_fr && !m.title_en && !m.title_ru).length

console.log('\n📊 RÉSULTATS DE LA TRADUCTION\n')
console.log('='.repeat(60))
console.log(`✅ Totalement traduits:     ${fullyTranslated}/${total} (${Math.round(fullyTranslated/total*100)}%)`)
console.log(`⚠️  Partiellement traduits: ${partiallyTranslated}/${total}`)
console.log(`❌ Non traduits:            ${notTranslated}/${total}`)
console.log('='.repeat(60))

if (notTranslated > 0) {
  console.log('\n❌ Matériaux non traduits (premiers 30):')
  materials.filter(m => !m.title_fr && !m.title_en && !m.title_ru).slice(0, 30).forEach(m => {
    console.log(`   - ID ${m.id}: "${m.title}" (${m.lang})`)
  })
  if (notTranslated > 30) {
    console.log(`   ... et ${notTranslated - 30} autres`)
  }
}
