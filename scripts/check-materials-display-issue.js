const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function diagnose() {
  console.log('🔍 Diagnosing materials display issue...\n')

  // 1. Check admin user's learning language
  console.log('1️⃣ Checking admin user profile...')
  const { data: adminProfile } = await supabase
    .from('users_profile')
    .select('email, learning_language, spoken_language')
    .eq('email', 'admin@linguami.dev')
    .single()

  console.log('   Admin profile:', adminProfile)

  // 2. Check all materials in database
  console.log('\n2️⃣ All materials in database:')
  const { data: allMaterials } = await supabase
    .from('materials')
    .select('id, title, section, lang, level')
    .order('id')

  console.log(`   Total: ${allMaterials?.length || 0} materials`)
  allMaterials?.forEach(m => {
    console.log(`   - [${m.id}] ${m.title.substring(0, 40)} (section: ${m.section}, lang: ${m.lang}, level: ${m.level})`)
  })

  // 3. Simulate the getMaterialsByLanguageAction query
  const learningLang = adminProfile?.learning_language || 'fr'
  console.log(`\n3️⃣ Simulating getMaterialsByLanguageAction('${learningLang}'):`)

  const audioTextSections = [
    'dialogues',
    'culture',
    'legends',
    'slices-of-life',
    'beautiful-places',
    'podcasts',
    'short-stories',
  ]

  const videoSectionsFr = [
    'movie-trailers',
    'movie-clips',
    'cartoons',
    'various-materials',
    'rock',
    'pop',
    'folk',
    'variety',
    'kids',
  ]

  const videoSectionsRu = [...videoSectionsFr, 'eralash', 'galileo']

  const videoSections = learningLang === 'ru' ? videoSectionsRu : videoSectionsFr
  const validSections = [...audioTextSections, ...videoSections]

  console.log('   Valid sections:', validSections)

  const { data: filteredMaterials } = await supabase
    .from('materials')
    .select('*')
    .eq('lang', learningLang)
    .in('section', validSections)
    .order('created_at', { ascending: false })

  console.log(`\n   Result: ${filteredMaterials?.length || 0} materials`)
  filteredMaterials?.forEach(m => {
    console.log(`   ✅ [${m.id}] ${m.title.substring(0, 50)}`)
    console.log(`      section: ${m.section}, lang: ${m.lang}, level: ${m.level}`)
  })

  // 4. Check if materials have all required fields
  if (filteredMaterials && filteredMaterials.length > 0) {
    console.log('\n4️⃣ Checking material fields:')
    const sample = filteredMaterials[0]
    console.log('   Sample material fields:', Object.keys(sample))
    console.log('   Has newCategory?', 'newCategory' in sample ? '✅ YES' : '❌ NO')
  }
}

diagnose()
