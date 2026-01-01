const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addCedilleSyllableAudio() {
  // 1. Get current lesson
  const { data: lesson, error: fetchError } = await supabase
    .from('lessons')
    .select('blocks_fr, blocks_en, blocks_ru')
    .eq('slug', 'alphabet-sons-et-accents')
    .single();

  if (fetchError) {
    console.error('Error fetching lesson:', fetchError);
    return;
  }

  console.log('Found lesson, updating blocks...\n');

  // Base URL for audio files
  const baseUrl = 'https://linguami-cdn.etreailleurs.workers.dev/audios/fr/lessons/beginner/lesson-1';

  // Audio URLs for syllables
  const syllableAudioUrls = {
    'ca': `${baseUrl}/syllable-ca.mp3`,
    'co': `${baseUrl}/syllable-co.mp3`,
    'cu': `${baseUrl}/syllable-cu.mp3`,
    'ça': `${baseUrl}/syllable-ca-cedille.mp3`,
    'ço': `${baseUrl}/syllable-co-cedille.mp3`,
    'çu': `${baseUrl}/syllable-cu-cedille.mp3`,
  };

  // Function to update blocks in a language
  const updateBlocks = (blocks) => {
    return blocks.map((block, index) => {
      // Find the importantNote block about cédille (block 13 in the list, index 12)
      if (
        block.type === 'importantNote' &&
        (block.note?.includes('седил') || block.note?.includes('çi') || block.note?.includes('ca, co, cu'))
      ) {
        console.log(`Updating block ${index + 1} (${block.type})`);
        console.log('Current audioUrls:', Object.keys(block.audioUrls || {}));

        // Merge existing audioUrls with new syllable URLs
        const updatedAudioUrls = {
          ...(block.audioUrls || {}),
          ...syllableAudioUrls
        };

        console.log('New audioUrls:', Object.keys(updatedAudioUrls));

        return {
          ...block,
          audioUrls: updatedAudioUrls
        };
      }
      return block;
    });
  };

  // Update all language blocks
  const updatedBlocksFr = updateBlocks(lesson.blocks_fr);
  const updatedBlocksEn = updateBlocks(lesson.blocks_en);
  const updatedBlocksRu = updateBlocks(lesson.blocks_ru);

  // 2. Update lesson in database
  const { error: updateError } = await supabase
    .from('lessons')
    .update({
      blocks_fr: updatedBlocksFr,
      blocks_en: updatedBlocksEn,
      blocks_ru: updatedBlocksRu
    })
    .eq('slug', 'alphabet-sons-et-accents');

  if (updateError) {
    console.error('Error updating lesson:', updateError);
    return;
  }

  console.log('\n✅ Successfully added audio URLs for syllables!');
  console.log('\nAdded audio for:');
  Object.keys(syllableAudioUrls).forEach(syllable => {
    console.log(`  - ${syllable}: ${syllableAudioUrls[syllable]}`);
  });
}

addCedilleSyllableAudio();
