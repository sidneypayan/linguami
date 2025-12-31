const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function removeHints() {
  // Get exercise 3
  const { data: exercise, error: fetchError } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', 83)
    .single();

  if (fetchError) {
    console.error('Error fetching exercise:', fetchError);
    return;
  }

  console.log('Current exercise data:');
  console.log(JSON.stringify(exercise.data, null, 2));

  // Remove hints from sentences
  const updatedData = {
    ...exercise.data,
    sentences: exercise.data.sentences.map(sentence => {
      const { hint, ...rest } = sentence;
      return rest;
    })
  };

  console.log('\nUpdated exercise data (hints removed):');
  console.log(JSON.stringify(updatedData, null, 2));

  // Update the exercise
  const { error: updateError } = await supabase
    .from('exercises')
    .update({ data: updatedData })
    .eq('id', 83);

  if (updateError) {
    console.error('Error updating exercise:', updateError);
    return;
  }

  console.log('\n✅ Exercise 3 hints removed successfully!');
}

removeHints();
