/**
 * Vérifie les dialogues français existants (avant les 57 nouveaux)
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkExistingDialogues() {
  console.log('\n🔍 Analyse des dialogues français existants...\n')

  // Récupérer tous les dialogues français avant les 57 nouveaux (ID < 601)
  const { data, error } = await supabase
    .from('materials')
    .select('id, title, level, content')
    .eq('lang', 'fr')
    .eq('section', 'dialogues')
    .lt('id', 601)
    .order('title', { ascending: true })

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  console.log('📊 DIALOGUES FRANÇAIS EXISTANTS')
  console.log('='.repeat(70))

  // Grouper par titre
  const byTitle = {}
  data.forEach(d => {
    if (!byTitle[d.title]) {
      byTitle[d.title] = []
    }
    byTitle[d.title].push(d)
  })

  // Afficher les résultats
  Object.keys(byTitle).sort().forEach(title => {
    const dialogues = byTitle[title]
    const levels = dialogues.map(d => d.level).join(', ')
    const ids = dialogues.map(d => d.id).join(', ')

    console.log(`\n📝 "${title}"`)
    console.log(`   IDs: ${ids}`)
    console.log(`   Niveaux existants: ${levels}`)
    console.log(`   Nombre de versions: ${dialogues.length}/3`)

    if (dialogues.length < 3) {
      const missingLevels = ['beginner', 'intermediate', 'advanced']
        .filter(level => !dialogues.some(d => d.level === level))
      console.log(`   ⚠️  Manquant: ${missingLevels.join(', ')}`)
    } else {
      console.log(`   ✅ Complet (3 niveaux)`)
    }
  })

  console.log('\n' + '='.repeat(70))
  console.log(`\n📈 STATISTIQUES`)
  console.log(`   Total de dialogues: ${data.length}`)
  console.log(`   Thèmes uniques: ${Object.keys(byTitle).length}`)

  const complete = Object.values(byTitle).filter(d => d.length === 3).length
  const incomplete = Object.keys(byTitle).length - complete
  console.log(`   Thèmes complets (3 niveaux): ${complete}`)
  console.log(`   Thèmes incomplets: ${incomplete}`)

  console.log('\n')
}

checkExistingDialogues()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Erreur:', err)
    process.exit(1)
  })
