require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTrainingData() {
  // Get all training themes
  const { data: themes, error: themesError } = await supabase
    .from('training_themes')
    .select('*')
    .order('lang', { ascending: true })
    .order('level', { ascending: true });

  if (themesError) {
    console.error('Error fetching themes:', themesError);
    return;
  }

  console.log('\n=== TRAINING THEMES ===');
  console.log('Total themes:', themes.length);

  // Group by lang
  const byLang = {};
  themes.forEach(theme => {
    if (!byLang[theme.lang]) byLang[theme.lang] = [];
    byLang[theme.lang].push(theme);
  });

  Object.keys(byLang).forEach(lang => {
    console.log(`\nLanguage: ${lang} (${byLang[lang].length} themes)`);
    byLang[lang].forEach(theme => {
      const label = theme.label_fr || theme.label_en || theme.key;
      console.log(`  - [${theme.level}] ${theme.key}: ${label}`);
    });
  });

  // Get sample questions
  console.log('\n=== SAMPLE QUESTIONS ===');
  const { data: questions, error: questionsError } = await supabase
    .from('training_questions')
    .select('id, theme_id, type, question_fr, question_en, question_ru, options')
    .limit(5);

  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
    return;
  }

  questions.forEach(q => {
    console.log(`\nQuestion ${q.id} (theme: ${q.theme_id}, type: ${q.type})`);
    if (q.question_fr) console.log(`  FR: ${q.question_fr.substring(0, 80)}`);
    if (q.question_en) console.log(`  EN: ${q.question_en.substring(0, 80)}`);
    if (q.question_ru) console.log(`  RU: ${q.question_ru.substring(0, 80)}`);
    if (q.options && q.options.length > 0) {
      console.log(`  Options: ${JSON.stringify(q.options.slice(0, 3))}`);
    }
  });

  // Count questions per theme
  console.log('\n=== QUESTIONS COUNT PER THEME ===');
  for (const theme of themes) {
    const { count } = await supabase
      .from('training_questions')
      .select('*', { count: 'exact', head: true })
      .eq('theme_id', theme.id);

    if (count > 0) {
      console.log(`Theme ${theme.key} (${theme.lang}/${theme.level}): ${count} questions`);
    }
  }
}

checkTrainingData().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
