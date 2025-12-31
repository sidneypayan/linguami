const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../components/exercises');

// Files that need updating
const filesToUpdate = [
  'MultipleChoiceSequential.jsx',
  'FillInTheBlankSequential.jsx',
  'DragAndDropSequential.jsx',
  'AudioDictation.jsx'
];

console.log('Checking exercise files for ExerciseResults usage...\n');

filesToUpdate.forEach(filename => {
  const filepath = path.join(componentsDir, filename);

  if (!fs.existsSync(filepath)) {
    console.log(`❌ ${filename} - File not found`);
    return;
  }

  const content = fs.readFileSync(filepath, 'utf8');

  // Check if file imports ExerciseResults
  const importsER = content.includes("import ExerciseResults from");

  // Check if file has a completion section with Trophy
  const hasTrophy = content.includes('<Trophy');
  const hasCompletionSection = content.includes('exerciseCompleted') || content.includes('isCompleted');

  console.log(`📄 ${filename}`);
  console.log(`   Imports ExerciseResults: ${importsER ? '✅' : '❌'}`);
  console.log(`   Has Trophy icon: ${hasTrophy ? '✅' : '❌'}`);
  console.log(`   Has completion state: ${hasCompletionSection ? '✅' : '❌'}`);

  if (importsER && !content.includes('<ExerciseResults')) {
    console.log(`   ⚠️  Imports but doesn't USE ExerciseResults - needs manual update`);
  } else if (content.includes('<ExerciseResults')) {
    console.log(`   ✅ Already using ExerciseResults`);
  }

  console.log('');
});

console.log('\n✅ Analysis complete. Manual updates needed for files marked with ⚠️');
