const fs = require('fs');

const homepagePath = 'C:/Users/Sidney/Documents/linguami/components/homepage/index.js';
let content = fs.readFileSync(homepagePath, 'utf8');

// Fix the useEffect syntax - remove the extra closing paren and fix the structure
content = content.replace(
  /\t\}\)\), \[searchParams, isUserLoggedIn\]\)/,
  '\t}, [searchParams, isUserLoggedIn])'
);

// Remove the extra closing paren after the error handling useEffect
content = content.replace(
  /\t\}, \[searchParams, translations\]\)\n\)/,
  '\t}, [searchParams, translations])'
);

fs.writeFileSync(homepagePath, content, 'utf8');
console.log('✅ Fixed all syntax errors in homepage');
