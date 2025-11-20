const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://capnpewksfdnllttnvzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcG5wZXdrc2ZkbmxsdHRudnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU1MzUwMiwiZXhwIjoyMDc5MTI5NTAyfQ.iU3xNj5CO_RBtGCCNpXl5LeobwRf1VGxV17sOqKPtDY',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function checkMaterials() {
  // Check users' learning language
  const { data: users } = await supabase.from('users_profile').select('email, learning_language')
  console.log('👤 Users et leurs langues d\'apprentissage:')
  users?.forEach(u => console.log('  ', u.email, '→ apprend:', u.learning_language))

  // Check materials by language
  const { data: materials } = await supabase.from('materials').select('id, title, lang, section')
  console.log('\n📚 Materials dans la base (total:', materials?.length || 0, '):')

  const byLang = {}
  materials?.forEach(m => {
    if (!byLang[m.lang]) {
      byLang[m.lang] = []
    }
    byLang[m.lang].push(m)
  })

  Object.keys(byLang).forEach(lang => {
    console.log('\n  Langue:', lang, '(' + byLang[lang].length + ' materials)')
    byLang[lang].slice(0, 3).forEach(m => {
      console.log('    -', m.title.substring(0, 50), '(section:', m.section + ')')
    })
  })
}

checkMaterials()
