const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkLesson1() {
  try {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('📋 All columns in lesson 1:\n')
    Object.keys(lesson)
      .filter(k => !k.startsWith('blocks_'))
      .forEach(key => {
        console.log(`${key}: ${lesson[key]}`)
      })
  } catch (error) {
    console.error('Error:', error)
  }
}

checkLesson1()
