require('dotenv').config({ path: process.argv[2] || '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateLevels() {
  const envName = process.argv[2] === '.env.production' ? 'PRODUCTION' : 'LOCAL';
  console.log(`\n=== MISE À JOUR DES NOMS DE NIVEAUX (${envName}) ===\n`);

  // Vérifier les noms actuels
  const { data: currentLevels } = await supabase
    .from('course_levels')
    .select('*')
    .order('id');

  console.log('Noms actuels:');
  currentLevels?.forEach(level => {
    console.log(`\n${level.slug}:`);
    console.log(`  FR: ${level.name_fr}`);
    console.log(`  EN: ${level.name_en}`);
    console.log(`  RU: ${level.name_ru}`);
  });

  // Nouveaux noms sans "Niveau", "Level", "Уровень"
  const updates = [
    {
      slug: 'beginner',
      name_fr: 'Débutant',
      name_en: 'Beginner',
      name_ru: 'Начальный',
    },
    {
      slug: 'intermediate',
      name_fr: 'Intermédiaire',
      name_en: 'Intermediate',
      name_ru: 'Средний',
    },
    {
      slug: 'advanced',
      name_fr: 'Avancé',
      name_en: 'Advanced',
      name_ru: 'Продвинутый',
    },
  ];

  console.log('\n\nApplication des mises à jour...\n');

  for (const update of updates) {
    const { error } = await supabase
      .from('course_levels')
      .update({
        name_fr: update.name_fr,
        name_en: update.name_en,
        name_ru: update.name_ru,
      })
      .eq('slug', update.slug);

    if (error) {
      console.error(`❌ Erreur pour ${update.slug}:`, error);
    } else {
      console.log(`✅ ${update.slug}: ${update.name_fr} / ${update.name_en} / ${update.name_ru}`);
    }
  }

  // Vérifier les nouveaux noms
  const { data: updatedLevels } = await supabase
    .from('course_levels')
    .select('*')
    .order('id');

  console.log('\n\nNouveaux noms:');
  updatedLevels?.forEach(level => {
    console.log(`\n${level.slug}:`);
    console.log(`  FR: ${level.name_fr}`);
    console.log(`  EN: ${level.name_en}`);
    console.log(`  RU: ${level.name_ru}`);
  });

  console.log('\n✅ Mise à jour terminée!\n');
}

updateLevels()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
