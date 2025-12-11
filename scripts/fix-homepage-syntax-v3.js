const fs = require('fs');

const homepagePath = 'C:/Users/Sidney/Documents/linguami/components/homepage/index.js';
let content = fs.readFileSync(homepagePath, 'utf8');

// Fix line 365 - remove extra closing paren before comma
content = content.replace(
  /\t\}\)\, \[searchParams, isUserLoggedIn\]\)/,
  '\t}, [searchParams, isUserLoggedIn])'
);

fs.writeFileSync(homepagePath, content, 'utf8');
console.log('✅ Fixed useEffect syntax error');
