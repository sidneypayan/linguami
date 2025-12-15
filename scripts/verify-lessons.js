/**
 * Quick verification script for Russian lessons 6-9
 * Run: node scripts/verify-lessons.js
 */

const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║     VERIFICATION SCRIPT - Russian Lessons 6-9                  ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');

// Load the script
const scriptPath = path.join(__dirname, 'create-russian-lessons-6-20.js');
const content = fs.readFileSync(scriptPath, 'utf8');

// Verify syntax
console.log('🔍 Checking syntax...');
try {
  require(scriptPath);
  console.log('✅ JavaScript syntax is valid');
} catch (err) {
  console.log('❌ Syntax error:', err.message);
  process.exit(1);
}

// Load the module
const { allLessons } = require(scriptPath);

console.log('');
console.log('📚 Lessons verification:');
console.log('========================');
console.log('');

allLessons.forEach((lesson, index) => {
  console.log(`✅ Lesson ${lesson.order}: ${lesson.title_en}`);
  console.log(`   French title: ${lesson.title_fr}`);
  console.log(`   Russian title: ${lesson.title_ru}`);
  console.log(`   English blocks: ${lesson.blocks_en.length}`);
  console.log(`   French blocks: ${lesson.blocks_fr.length}`);

  // Verify block types
  const blockTypes = new Set(lesson.blocks_en.map(b => b.type));
  console.log(`   Block types: ${Array.from(blockTypes).join(', ')}`);

  // Check for required block types
  const requiredTypes = ['mainTitle', 'subtitle', 'quickSummary', 'conjugationTable', 'miniDialogue', 'relatedTopics'];
  const hasAllRequired = requiredTypes.every(type => blockTypes.has(type));

  if (hasAllRequired) {
    console.log(`   Structure: ✅ Complete`);
  } else {
    console.log(`   Structure: ⚠️  Missing some block types`);
  }

  console.log('');
});

console.log('═══════════════════════════════════════════════════════════════');
console.log(`📊 Summary: ${allLessons.length} lessons ready to insert`);
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log('🚀 To insert into database, run:');
console.log('   node scripts/create-russian-lessons-6-20.js');
console.log('');
