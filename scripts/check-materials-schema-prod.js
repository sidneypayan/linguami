/**
 * Vérifie la structure de la table materials en production
 */

require('dotenv').config({ path: '.env.production' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkSchema() {
  console.log('🔍 Récupération de la structure de la table materials...\n')

  // Récupérer un exemple de material pour voir toutes les colonnes
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Erreur:', error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log('⚠️  Aucune donnée dans la table materials')
    return
  }

  console.log('✅ Colonnes disponibles dans la table materials:')
  console.log('='.repeat(60))
  const columns = Object.keys(data[0])
  columns.forEach((col, idx) => {
    console.log(`${idx + 1}. ${col}`)
  })
  console.log('='.repeat(60))
  console.log(`\nTotal: ${columns.length} colonnes\n`)
}

checkSchema()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Erreur:', err)
    process.exit(1)
  })
