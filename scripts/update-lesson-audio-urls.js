const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Base URL for audio files
const BASE_AUDIO_URL = 'https://linguami-cdn.etreailleurs.workers.dev/audios/ru/lessons/beginner/lesson-1/';

// Mapping of audio file names to Russian words
const AUDIO_MAPPING = {
  'mat.mp3': ['мат'],
  'miat.mp3': ['мят'],
  'zaamok.mp3': ['за́мок'],  // château (accent on first syllable)
  'zamook.mp3': ['замо́к'],  // serrure (accent on second syllable)
  'khalasho.mp3': ['хорошо́', 'хорошо'],
  'moloko.mp3': ['молоко́', 'молоко'],
  'vada.mp3': ['вода'],
  'vino.mp3': ['вино'],
  'vladimir.mp3': ['Владимир'],
  'ruiba.mp3': ['рыба'],
  'rossia.mp3': ['Россия'],
  'rabota.mp3': ['работа'],
  'net.mp3': ['нет'],
  'neba.mp3': ['небо'],
  'nos.mp3': ['нос'],
  'sabaka.mp3': ['собака'],
  'stol.mp3': ['стол'],
  'moskva.mp3': ['Москва'],
  'xleb.mp3': ['хлеб'],
  'tchevov.mp3': ['Чехов'],
  'jit.mp3': ['жить'],
  'tsar.mp3': ['царь'],
  'tchac.mp3': ['час'],
  'chkola.mp3': ['школа'],
  'borsh.mp3': ['борщ']
};

async function updateLessonAudioUrls() {
  console.log('🎵 Updating audio URLs in lesson...\n');

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

  // Process each block and update audioUrls
  updatedBlocksFr.forEach((block, blockIndex) => {
    // Skip blocks that don't have audioUrls
    if (!block.audioUrls) return;

    console.log(`\n📌 Block ${blockIndex}: "${block.title || block.type}"`);

    const updatedAudioUrls = {};

    // Go through each word in the current audioUrls
    Object.keys(block.audioUrls).forEach(word => {
      let foundMapping = false;

      // Find the correct audio file for this word
      for (const [audioFile, russianWords] of Object.entries(AUDIO_MAPPING)) {
        if (russianWords.includes(word)) {
          updatedAudioUrls[word] = `${BASE_AUDIO_URL}${audioFile}`;
          console.log(`  ✅ ${word} → ${audioFile}`);
          foundMapping = true;
          break;
        }
      }

      // If no mapping found, keep the old URL but warn
      if (!foundMapping) {
        console.log(`  ⚠️  ${word} → No mapping found, keeping old URL`);
        updatedAudioUrls[word] = block.audioUrls[word];
      }
    });

    // Update the block's audioUrls
    block.audioUrls = updatedAudioUrls;
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
    b => b.audioUrls && Object.keys(b.audioUrls).length > 0
  );

  console.log(`  - ${blocksWithAudio.length} blocks with audio URLs`);

  let totalAudioUrls = 0;
  blocksWithAudio.forEach(block => {
    const audioCount = Object.keys(block.audioUrls).length;
    totalAudioUrls += audioCount;
    console.log(`  - "${block.title || block.type}": ${audioCount} audio URLs`);
  });

  console.log(`  - Total: ${totalAudioUrls} audio URLs`);
}

updateLessonAudioUrls();
