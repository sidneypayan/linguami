const fs = require('fs');

const methodPagePath = 'C:/Users/Sidney/Documents/linguami/app/[locale]/method/page.js';
let content = fs.readFileSync(methodPagePath, 'utf8');

// Simply add the checkAdminAuth import after redirect import
content = content.replace(
  /import { redirect } from 'next\/navigation'/,
  `import { redirect } from 'next/navigation'\nimport { checkAdminAuth } from '@/lib/admin'`
);

fs.writeFileSync(methodPagePath, content, 'utf8');
console.log('✅ Added checkAdminAuth import to method page');
