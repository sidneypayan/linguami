const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.production' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addRussianTranslations() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('slug', 'bonjour-saluer-prendre-conge')
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Lesson found:', data.slug)

  const step10Index = 9

  // Update blocks_ru with Russian translations (add 4th column)
  const blocks_ru = [...(data.blocks_ru || [])]
  if (blocks_ru[step10Index]) {
    // Update headers to include translation column
    blocks_ru[step10Index].table.headers = [
      "Местоимение",
      "Спряжение",
      "Пример",
      "Перевод"
    ]

    // Update rows with Russian translations
    blocks_ru[step10Index].table.rows = [
      ["Je", "m'appel**le**", "Je m'appelle Thomas", "Меня зовут Томас"],
      ["Tu", "t'appel**les**", "Comment tu t'appelles ?", "Как тебя зовут?"],
      ["Il/Elle", "s'appel**le**", "Elle s'appelle Sophie", "Её зовут Софи"],
      ["Nous", "nous appel**ons**", "Nous nous appelons les Dupont", "Нас зовут Дюпон (фамилия)"],
      ["Vous", "vous appel**ez**", "Comment vous appelez-vous ?", "Как вас зовут?"],
      ["Ils/Elles", "s'appel**lent**", "Ils s'appellent Pierre et Marie", "Их зовут Пьер и Мари"]
    ]

    console.log('✅ Updated blocks_ru with Russian translations')
  }

  // Update blocks_en with English translations (add 4th column)
  const blocks_en = [...(data.blocks_en || [])]
  if (blocks_en[step10Index]) {
    blocks_en[step10Index].table.headers = [
      "Pronoun",
      "Conjugation",
      "Example",
      "Translation"
    ]

    blocks_en[step10Index].table.rows = [
      ["Je", "m'appel**le**", "Je m'appelle Thomas", "My name is Thomas"],
      ["Tu", "t'appel**les**", "Comment tu t'appelles ?", "What's your name? (informal)"],
      ["Il/Elle", "s'appel**le**", "Elle s'appelle Sophie", "Her name is Sophie"],
      ["Nous", "nous appel**ons**", "Nous nous appelons les Dupont", "Our name is Dupont (family name)"],
      ["Vous", "vous appel**ez**", "Comment vous appelez-vous ?", "What's your name? (formal)"],
      ["Ils/Elles", "s'appel**lent**", "Ils s'appellent Pierre et Marie", "Their names are Pierre and Marie"]
    ]

    console.log('✅ Updated blocks_en with English translations')
  }

  // Save to database
  const { error: updateError } = await supabase
    .from('course_lessons')
    .update({
      blocks_ru,
      blocks_en
    })
    .eq('slug', 'bonjour-saluer-prendre-conge')

  if (updateError) {
    console.error('Error updating:', updateError)
    return
  }

  console.log('\n✅ Successfully added Russian and English translations to the conjugation table!')
}

addRussianTranslations()
