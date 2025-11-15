const fs = require('fs');
const path = require('path');

/**
 * Removes console.log debug statements while keeping console.error and console.warn
 */

const files = [
  'app/[locale]/auth/callback/page.js',
  'components/shared/TurnstileWidget.jsx',
  'app/[locale]/login/page.js'
];

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const originalLines = content.split('\n').length;

  // Remove single line console.log statements
  content = content.replace(/^\s*console\.log\([^)]*\)\s*$/gm, '');

  // Remove empty lines that were left behind (but only consecutive ones)
  content = content.replace(/\n{3,}/g, '\n\n');

  const newLines = content.split('\n').length;
  const removed = originalLines - newLines;

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ ${filePath}: Removed ${removed} lines of console.log`);
});

console.log('\n✨ Debug logs cleaned up!');
