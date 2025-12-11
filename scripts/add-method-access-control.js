const fs = require('fs');

const methodPagePath = 'C:/Users/Sidney/Documents/linguami/app/[locale]/method/page.js';
let content = fs.readFileSync(methodPagePath, 'utf8');

// Replace imports
content = content.replace(
  /import { redirect } from 'next\/navigation'\nimport { createServerClient } from '@\/lib\/supabase-server'\nimport { cookies } from 'next\/headers'/,
  `import { redirect } from 'next/navigation'\nimport { checkAdminAuth } from '@/lib/admin'`
);

// Replace the authentication check
content = content.replace(
  /\/\/ Check if user is authenticated[\s\S]*?redirect\(`\/\${locale}\/login`\)\s*\}/,
  `// Check if user is authenticated and is admin
	const { isAuthenticated, isAdmin } = await checkAdminAuth()

	if (!isAuthenticated) {
		// Not logged in - redirect to login
		redirect(\`/\${locale}/login\`)
	}

	if (!isAdmin) {
		// Logged in but not admin - redirect to home with error
		redirect(\`/\${locale}?error=admin_only\`)
	}`
);

fs.writeFileSync(methodPagePath, content, 'utf8');
console.log('✅ Added admin-only access control to method page');
