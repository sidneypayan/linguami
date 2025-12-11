const fs = require('fs');

const levelPagePath = 'C:/Users/Sidney/Documents/linguami/app/[locale]/method/[level]/page.js';
let content = fs.readFileSync(levelPagePath, 'utf8');

// Add admin check after authentication check
content = content.replace(
  /const { isAuthenticated, user, supabase } = await checkAdminAuth\(\)\s*if \(!isAuthenticated\) \{\s*redirect\(`\/\${locale}\/login`\)\s*\}/,
  `const { isAuthenticated, isAdmin, user, supabase } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(\`/\${locale}/login\`)
	}

	if (!isAdmin) {
		redirect(\`/\${locale}?error=admin_only\`)
	}`
);

fs.writeFileSync(levelPagePath, content, 'utf8');
console.log('✅ Added admin-only access control to method level page');
