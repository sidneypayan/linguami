require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStructure() {
  // Get one theme to see structure
  const { data: theme } = await supabase
    .from('training_themes')
    .select('*')
    .eq('key', 'greetings')
    .single();

  console.log('=== THEME STRUCTURE ===');
  console.log(JSON.stringify(theme, null, 2));

  // Get one question to see structure
  const { data: question } = await supabase
    .from('training_questions')
    .select('*')
    .limit(1)
    .single();

  console.log('\n=== QUESTION STRUCTURE ===');
  console.log(JSON.stringify(question, null, 2));
}

checkStructure().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
