require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteFrenchQuestions() {
  console.log('🗑️  Deleting all French questions and themes...\n');

  // Delete all questions for French themes
  const { data: frThemes } = await supabase
    .from('training_themes')
    .select('id')
    .eq('lang', 'fr');

  if (frThemes && frThemes.length > 0) {
    const themeIds = frThemes.map(t => t.id);

    const { error: deleteQError } = await supabase
      .from('training_questions')
      .delete()
      .in('theme_id', themeIds);

    if (deleteQError) {
      console.error('Error deleting questions:', deleteQError);
    } else {
      console.log('✅ Deleted all French questions');
    }

    // Delete all French themes
    const { error: deleteTError } = await supabase
      .from('training_themes')
      .delete()
      .eq('lang', 'fr');

    if (deleteTError) {
      console.error('Error deleting themes:', deleteTError);
    } else {
      console.log('✅ Deleted all French themes');
    }
  }

  console.log('\n✨ Done!');
}

deleteFrenchQuestions()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
