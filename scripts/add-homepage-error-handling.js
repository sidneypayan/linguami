const fs = require('fs');

const homepagePath = 'C:/Users/Sidney/Documents/linguami/components/homepage/index.js';
let content = fs.readFileSync(homepagePath, 'utf8');

// Add toast import
content = content.replace(
  /import { useUserContext } from '@\/context\/user'/,
  `import { useUserContext } from '@/context/user'\nimport { toast } from 'react-toastify'`
);

// Add error handling after onboarding check
const errorHandling = `
	// Check for access error params
	useEffect(() => {
		const error = searchParams.get('error')
		if (error === 'admin_only') {
			toast.error(translations.admin_only_error || 'Cette section est réservée aux administrateurs.')
			// Clean up URL
			window.history.replaceState({}, '', window.location.pathname)
		} else if (error === 'vip_only') {
			toast.error(translations.vip_only_error || 'Cette section est réservée aux membres VIP et administrateurs.')
			// Clean up URL
			window.history.replaceState({}, '', window.location.pathname)
		}
	}, [searchParams, translations])
`;

// Insert after the onboarding useEffect
content = content.replace(
  /(\/\/ Check for onboarding param after signup[\s\S]*?\}, \[searchParams, isUserLoggedIn\])/,
  `$1\n${errorHandling}`
);

fs.writeFileSync(homepagePath, content, 'utf8');
console.log('✅ Added error handling for admin_only and vip_only to homepage');
