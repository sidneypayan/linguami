const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function checkMaterialsCount() {
  console.log('📊 Checking materials count for pagination test...\n')

  // Count by language
  const { data: frMaterials } = await supabase
    .from('materials')
    .select('id', { count: 'exact' })
    .eq('lang', 'fr')

  const { data: ruMaterials } = await supabase
    .from('materials')
    .select('id', { count: 'exact' })
    .eq('lang', 'ru')

  // Count by section
  const { data: allMaterials } = await supabase
    .from('materials')
    .select('section, lang, level')

  const sections = {}
  allMaterials?.forEach(m => {
    const key = `${m.section}_${m.lang}`
    sections[key] = (sections[key] || 0) + 1
  })

  console.log('📈 TOTAL MATERIALS:')
  console.log('─'.repeat(80))
  console.log(`   FR: ${frMaterials?.length || 0}`)
  console.log(`   RU: ${ruMaterials?.length || 0}`)
  console.log(`   Total: ${allMaterials?.length || 0}`)

  console.log('\n📂 BY SECTION & LANGUAGE:')
  console.log('─'.repeat(80))
  Object.entries(sections)
    .sort()
    .forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`)
    })

  console.log('\n💡 PAGINATION INFO:')
  console.log('─'.repeat(80))
  const itemsPerPage = 12 // Common pagination size
  const totalPages = Math.ceil((allMaterials?.length || 0) / itemsPerPage)
  console.log(`   Items per page: ${itemsPerPage}`)
  console.log(`   Total pages needed: ${totalPages}`)

  if (totalPages < 2) {
    console.log('\n⚠️  Not enough materials to test pagination (need 13+ materials)')
  } else {
    console.log('\n✅ Enough materials to test pagination')
  }
}

checkMaterialsCount()
