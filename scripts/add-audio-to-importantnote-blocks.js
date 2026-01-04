const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Base URL for audio files
const BASE_AUDIO_URL = 'https://linguami-cdn.etreailleurs.workers.dev/audios/ru/lessons/beginner/lesson-1/';

// Function to normalize text for URL (remove accents, spaces, special chars)
function normalizeForUrl(text) {
  return text
    .toLowerCase()
    .replace(/́/g, '') // Remove accent marks
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^\u0400-\u04FF]/g, ''); // Keep only Cyrillic characters
}

async function addAudioToImportantNoteBlocks() {
  console.log('🎵 Adding audio buttons to importantNote blocks...\n');

  // Fetch the lesson
  const { data: lesson, error: fetchError } = await supabase
    .from('lessons')
    .select('*')
    .eq('slug', 'cyrillic-alphabet-sounds')
    .single();

  if (fetchError) {
    console.error('❌ Error fetching lesson:', fetchError);
    return;
  }

  console.log('✅ Lesson found:', lesson.title_fr);
  console.log('📝 Processing blocks_fr...\n');

  // Clone blocks_fr to modify
  const updatedBlocksFr = JSON.parse(JSON.stringify(lesson.blocks_fr));

  // Process each block
  updatedBlocksFr.forEach((block, index) => {
    if (block.type === 'importantNote' && block.examples) {
      console.log(`\n📌 Block: "${block.title}"`);

      // Initialize audioUrls if not present
      if (!block.audioUrls) {
        block.audioUrls = {};
      }

      // Process each example
      block.examples.forEach((example, exIndex) => {
        console.log(`  Example ${exIndex + 1}: ${example}`);

        // Extract Russian words from the example
        // Pattern: Russian word with optional accent marks
        const russianWordRegex = /([а-яёА-ЯЁ́]+)/g;
        const matches = example.match(russianWordRegex);

        if (matches) {
          matches.forEach(word => {
            // Skip very short words or single letters
            if (word.length < 2) return;

            // Normalize word for URL
            const normalizedWord = normalizeForUrl(word);
            const audioUrl = `${BASE_AUDIO_URL}${normalizedWord}.mp3`;

            // Add to audioUrls
            block.audioUrls[word] = audioUrl;
            console.log(`    ✅ Added audio for: ${word} → ${audioUrl}`);
          });
        }
      });
    }

    // Special handling for the "Exemple concret" block (мат vs мят)
    if (block.type === 'importantNote' && block.title === 'Exemple concret') {
      console.log(`\n📌 Block: "${block.title}" (special handling for мат/мят)`);

      if (!block.audioUrls) {
        block.audioUrls = {};
      }

      // Add audio for мат and мят from the content
      block.audioUrls['мат'] = `${BASE_AUDIO_URL}мат.mp3`;
      block.audioUrls['мят'] = `${BASE_AUDIO_URL}мят.mp3`;

      console.log(`  ✅ Added audio for: мат → ${block.audioUrls['мат']}`);
      console.log(`  ✅ Added audio for: мят → ${block.audioUrls['мят']}`);
    }
  });

  // Update the lesson in the database
  console.log('\n💾 Updating lesson in database...');

  const { error: updateError } = await supabase
    .from('lessons')
    .update({ blocks_fr: updatedBlocksFr })
    .eq('id', lesson.id);

  if (updateError) {
    console.error('❌ Error updating lesson:', updateError);
    return;
  }

  console.log('✅ Lesson updated successfully!');

  // Show summary
  console.log('\n📊 Summary:');
  const blocksWithAudio = updatedBlocksFr.filter(
    b => b.type === 'importantNote' && b.audioUrls && Object.keys(b.audioUrls).length > 0
  );
  console.log(`  - ${blocksWithAudio.length} importantNote blocks now have audio`);

  blocksWithAudio.forEach(block => {
    const audioCount = Object.keys(block.audioUrls).length;
    console.log(`  - "${block.title}": ${audioCount} audio URLs`);
  });
}

addAudioToImportantNoteBlocks();
