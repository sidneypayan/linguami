const fs = require('fs');

const homepagePath = 'C:/Users/Sidney/Documents/linguami/components/homepage/index.js';
let content = fs.readFileSync(homepagePath, 'utf8');

// Fix the missing closing parenthesis on line 365
content = content.replace(
  /\}, \[searchParams, isUserLoggedIn\]\s*\n\s*\/\/ Check for access error params/,
  '}), [searchParams, isUserLoggedIn])\n\n\t// Check for access error params'
);

fs.writeFileSync(homepagePath, content, 'utf8');
console.log('✅ Fixed syntax error - added missing closing parenthesis');
