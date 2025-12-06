require('dotenv').config({ path: '.env.production' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findPhrases() {
  // Search in dictionary
  const { data: dictEntries } = await supabase
    .from('dictionary')
    .select('*')
    .or('french_word.ilike.%Comment allez%,french_word.ilike.%Comment vas%,french_word.ilike.%Ca va%,french_word.ilike.%Ça va%')
    .limit(10);

  console.log('=== DICTIONARY ENTRIES ===');
  if (dictEntries && dictEntries.length > 0) {
    dictEntries.forEach(entry => {
      console.log(`\nID ${entry.id}:`);
      console.log(`  FR: ${entry.french_word}`);
      console.log(`  RU: ${entry.russian_translation}`);
      console.log(`  EN: ${entry.english_translation}`);
    });
  } else {
    console.log('No dictionary entries found');
  }

  // Search in exercises
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .or('sentence.ilike.%Comment allez%,sentence.ilike.%Comment vas%,sentence.ilike.%Ca va%')
    .limit(10);

  console.log('\n\n=== EXERCISES ===');
  if (exercises && exercises.length > 0) {
    exercises.forEach(ex => {
      console.log(`\nExercise ${ex.id}:`);
      console.log(`  Type: ${ex.exercise_type}`);
      console.log(`  Sentence: ${ex.sentence}`);
      console.log(`  Translation RU: ${ex.russian_translation}`);
    });
  } else {
    console.log('No exercises found');
  }

  // Search in phrase tables if they exist
  const { data: phrases } = await supabase
    .from('phrases')
    .select('*')
    .or('french.ilike.%Comment allez%,french.ilike.%Comment vas%,french.ilike.%Ca va%,french.ilike.%Ça va%')
    .limit(10);

  console.log('\n\n=== PHRASES ===');
  if (phrases && phrases.length > 0) {
    phrases.forEach(phrase => {
      console.log(`\nPhrase ${phrase.id}:`);
      console.log(`  FR: ${phrase.french}`);
      console.log(`  RU: ${phrase.russian}`);
      console.log(`  EN: ${phrase.english}`);
    });
  } else {
    console.log('No phrases found (table might not exist)');
  }
}

findPhrases()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
