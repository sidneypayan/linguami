const fs = require('fs');

const trainingPagePath = 'C:/Users/Sidney/Documents/linguami/app/[locale]/training/page.js';
let content = fs.readFileSync(trainingPagePath, 'utf8');

// Add imports
content = content.replace(
  /import { getTranslations } from 'next-intl\/server'/,
  `import { getTranslations } from 'next-intl/server'\nimport { redirect } from 'next/navigation'\nimport { checkVipAuth } from '@/lib/admin'`
);

// Add access control to the component
content = content.replace(
  /export default async function TrainingPage\(\) \{\s*return <TrainingPageClient \/>\s*\}/,
  `export default async function TrainingPage({ params }) {
	const { locale } = await params

	// Check if user is authenticated and is admin or VIP
	const { isAuthenticated, hasAccess } = await checkVipAuth()

	if (!isAuthenticated) {
		// Not logged in - redirect to login
		redirect(\`/\${locale}/login\`)
	}

	if (!hasAccess) {
		// Logged in but not admin or VIP - redirect to home with error
		redirect(\`/\${locale}?error=vip_only\`)
	}

	return <TrainingPageClient />
}`
);

fs.writeFileSync(trainingPagePath, content, 'utf8');
console.log('✅ Added admin/VIP access control to training page');
