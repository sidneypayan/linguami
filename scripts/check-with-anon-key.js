const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Use EXACTLY the same credentials as Next.js server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY

console.log('Using URL:', supabaseUrl)
console.log('Using ANON_KEY (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkLesson() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select(`
      id,
      slug,
      blocks_fr,
      courses!inner (
        slug,
        lang
      )
    `)
    .eq('courses.slug', 'beginner-french')
    .eq('courses.lang', 'ru')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('\nLesson found:', data.slug)
  console.log('Course:', data.courses.slug, '(lang:', data.courses.lang + ')')

  if (data.blocks_fr) {
    const step10 = data.blocks_fr.find((block, index) => index === 9)
    if (step10) {
      console.log('\n=== Step 10 - Conjugation column ===')
      step10.table.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row[1]}`)
      })
    }
  }
}

checkLesson()
