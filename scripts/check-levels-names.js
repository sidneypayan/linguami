require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLevels() {
  console.log('=== NIVEAUX DANS LA DB LOCALE ===\n');

  const { data: levels, error } = await supabase
    .from('course_levels')
    .select('*')
    .order('id');

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  if (levels && levels.length > 0) {
    levels.forEach(level => {
      console.log(`\nNiveau ${level.id}:`);
      console.log('  Slug:', level.slug);
      console.log('  Nom FR:', level.name_fr);
      console.log('  Nom EN:', level.name_en);
      console.log('  Nom RU:', level.name_ru);
      console.log('  Description FR:', level.description_fr?.substring(0, 50) + '...');
      console.log('  Description RU:', level.description_ru?.substring(0, 50) + '...');
      console.log('  Description EN:', level.description_en?.substring(0, 50) + '...');
    });
  } else {
    console.log('Aucun niveau trouvé');
  }
}

checkLevels()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
