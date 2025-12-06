require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkQuestion() {
  const { data } = await supabase
    .from('training_questions')
    .select('question_ru, question_en, question_fr, options')
    .eq('theme_id', 101)
    .limit(2);

  console.log('\n=== SAMPLE QUESTIONS FROM GREETINGS THEME ===\n');
  data.forEach((q, i) => {
    console.log(`Question ${i + 1}:`);
    console.log('  RU:', q.question_ru);
    console.log('  EN:', q.question_en);
    console.log('  FR:', q.question_fr);
    console.log('  Options:', q.options);
    console.log('');
  });
}

checkQuestion().then(() => process.exit(0));
