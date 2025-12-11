const fs = require('fs');

const lessonPagePath = 'C:/Users/Sidney/Documents/linguami/app/[locale]/method/[level]/[lessonSlug]/page.js';
let content = fs.readFileSync(lessonPagePath, 'utf8');

// Add admin check after authentication check
content = content.replace(
  /const { isAuthenticated, user } = await checkAdminAuth\(\)\s*if \(!isAuthenticated\) \{\s*redirect\(`\/\${locale}\/login`\)\s*\}/,
  `const { isAuthenticated, isAdmin, user } = await checkAdminAuth()

	if (!isAuthenticated) {
		redirect(\`/\${locale}/login\`)
	}

	if (!isAdmin) {
		redirect(\`/\${locale}?error=admin_only\`)
	}`
);

fs.writeFileSync(lessonPagePath, content, 'utf8');
console.log('✅ Added admin-only access control to method lesson page');
