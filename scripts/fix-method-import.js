const fs = require('fs');

const methodPagePath = 'C:/Users/Sidney/Documents/linguami/app/[locale]/method/page.js';
let content = fs.readFileSync(methodPagePath, 'utf8');

// Add checkAdminAuth import and remove unnecessary imports
content = content.replace(
  /import { redirect } from 'next\/navigation'\nimport { createServerClient } from '@\/lib\/supabase-server'\nimport { cookies } from 'next\/headers'/,
  `import { redirect } from 'next/navigation'\nimport { checkAdminAuth } from '@/lib/admin'`
);

fs.writeFileSync(methodPagePath, content, 'utf8');
console.log('✅ Fixed method page imports');
