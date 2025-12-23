const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function updateLessonsAvailability() {
  try {
    // 1. Vérifier la structure de la table
    console.log('📋 Fetching all French lessons...\n')

    const { data: lessons, error: fetchError } = await supabase
      .from('lessons')
      .select('*')
      .eq('language', 'fr')
      .order('id')

    if (fetchError) {
      console.error('❌ Error fetching lessons:', fetchError)
      return
    }

    console.log(`Found ${lessons.length} French lessons\n`)

    // Afficher les colonnes disponibles
    if (lessons.length > 0) {
      console.log('Available columns:', Object.keys(lessons[0]).join(', '))
      console.log('\n')
    }

    // 2. Mettre à jour la leçon 1 (accessible à tous)
    console.log('✅ Making lesson 1 available to all users...')
    const { error: updateLesson1Error } = await supabase
      .from('lessons')
      .update({
        is_premium: false,
        is_published: true
      })
      .eq('id', 1)
      .eq('language', 'fr')

    if (updateLesson1Error) {
      console.error('❌ Error updating lesson 1:', updateLesson1Error)
    } else {
      console.log('   ✓ Lesson 1 is now available to all users\n')
    }

    // 3. Marquer les autres leçons comme "à venir" (premium ou non publiées)
    console.log('🔒 Marking other lessons as coming soon...')
    const { error: updateOthersError } = await supabase
      .from('lessons')
      .update({
        is_premium: true,
        is_published: false
      })
      .neq('id', 1)
      .eq('language', 'fr')

    if (updateOthersError) {
      console.error('❌ Error updating other lessons:', updateOthersError)
    } else {
      console.log('   ✓ Other lessons marked as coming soon\n')
    }

    // 4. Afficher le résultat final
    console.log('📊 Final status of French lessons:\n')
    const { data: finalLessons } = await supabase
      .from('lessons')
      .select('id, title, slug, is_premium, is_published')
      .eq('language', 'fr')
      .order('id')

    finalLessons?.forEach(lesson => {
      const status = lesson.is_published && !lesson.is_premium
        ? '✅ Available'
        : '🔒 Coming soon'
      console.log(`   ${status} - Lesson ${lesson.id}: ${lesson.title} (${lesson.slug})`)
    })

    console.log('\n✅ Done!')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

updateLessonsAvailability()
