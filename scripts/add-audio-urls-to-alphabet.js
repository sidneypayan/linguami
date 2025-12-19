const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CDN_BASE_URL = 'https://linguami-cdn.etreailleurs.workers.dev';

// Alphabet français avec URLs audio
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

async function addAudioToAlphabet() {
  console.log('🔊 Adding audio URLs to alphabet block...');

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Lesson found:', lesson.title_fr);

  // Find alphabetGrid block in blocks_ru
  const blockIndex = lesson.blocks_ru.findIndex(b => b.type === 'alphabetGrid');

  if (blockIndex === -1) {
    console.error('❌ AlphabetGrid block not found');
    return;
  }

  console.log('📝 Found alphabetGrid block at index', blockIndex);

  // Add audio URL to each letter
  const updatedLetters = lesson.blocks_ru[blockIndex].letters.map(letterObj => {
    const audioUrl = `${CDN_BASE_URL}/audios/courses/fr/alphabet-letter-${letterObj.letter.toLowerCase()}.mp3`;
    return {
      ...letterObj,
      audioUrl
    };
  });

  console.log('\n📋 Preview (first 3 letters):');
  updatedLetters.slice(0, 3).forEach(l => {
    console.log(`  ${l.letter} - ${l.word} - ${l.audioUrl}`);
  });

  // Update block
  lesson.blocks_ru[blockIndex].letters = updatedLetters;

  // Save to DB
  const { error: updateError } = await supabase
    .from('lessons')
    .update({ blocks_ru: lesson.blocks_ru })
    .eq('id', 1);

  if (updateError) {
    console.error('❌ Update error:', updateError);
    return;
  }

  console.log('\n✅ Audio URLs added to all 26 letters!');
  console.log('🎉 Students can now click on letters to hear pronunciation!');
}

addAudioToAlphabet();
