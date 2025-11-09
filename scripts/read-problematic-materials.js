const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const problematicMaterials = [114, 115, 120, 121, 155, 168, 169, 311, 312, 479]

async function readMaterials() {
  try {
    for (const id of problematicMaterials) {
      const { data: material, error } = await supabase
        .from('materials')
        .select('id, title, body, lang')
        .eq('id', id)
        .single()

      if (error) throw error

      console.log('\n' + '='.repeat(80))
      console.log(`Material ${material.id}: ${material.title} (${material.lang})`)
      console.log('='.repeat(80))
      console.log(material.body)
      console.log('\n')
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

readMaterials()
