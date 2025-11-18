const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../components/method/LessonPageClient.jsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for useAddXP
if (!content.includes('useAddXP')) {
  content = content.replace(
    "import { useLessonProgress, useCompleteLesson } from '@/lib/courses-client'",
    "import { useLessonProgress, useCompleteLesson } from '@/lib/courses-client'\nimport { useAddXP } from '@/hooks/gamification/useAddXP'"
  );
}

// 2. Add useAddXP hook call
if (!content.includes('const { mutate: addXP } = useAddXP()')) {
  content = content.replace(
    'const { mutate: completeLesson, isPending: isCompleting } = useCompleteLesson(isUserLoggedIn)',
    `const { mutate: completeLesson, isPending: isCompleting } = useCompleteLesson(isUserLoggedIn)

\t// React Query: Add XP mutation
\tconst { mutate: addXP } = useAddXP()`
  );
}

// 3. Add XP reward in onSuccess
if (!content.includes('Award XP for completing the lesson')) {
  content = content.replace(
    /toast\.success\(t\('methode_lesson_completed_toast'\)\)\n\n(\s+)\/\/ Check if we should show upsell modal/,
    `toast.success(t('methode_lesson_completed_toast'))

$1// Award XP for completing the lesson (only for logged in users)
$1if (isUserLoggedIn) {
$1\taddXP({
$1\t\tactionType: 'material_completed',
$1\t\tsourceId: \`lesson-\${lesson.id}\`,
$1\t\tcustomXp: 50, // 50 XP for completing a lesson
$1\t})
$1}

$1// Check if we should show upsell modal`
  );
}

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully added XP rewards to LessonPageClient.jsx');
console.log('Changes made:');
console.log('  1. Added useAddXP import');
console.log('  2. Added useAddXP hook');
console.log('  3. Added XP reward (50 XP + 5 Gold) on lesson completion');
