const fs = require('fs');

const filePath = 'C:/Users/Sidney/Documents/linguami/lib/admin.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find the checkAdminAuth function and update it to include is_premium
content = content.replace(
  /\.select\('role'\)/,
  ".select('role, is_premium')"
);

content = content.replace(
  /return \{\s*isAuthenticated: true,\s*isAdmin: profile\?\.role === 'admin',\s*user,\s*supabase,\s*\}/,
  `return {
		isAuthenticated: true,
		isAdmin: profile?.role === 'admin',
		isPremium: !!profile?.is_premium,
		user,
		supabase,
	}`
);

// Add new checkPremiumAuth function at the end
const newFunction = `
/**
 * Check if user is admin OR premium (VIP)
 * Returns user profile with admin and premium status
 */
export async function checkPremiumAuth() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error || !user) {
		return { isAuthenticated: false, isAdmin: false, isPremium: false, user: null }
	}

	// Get user profile to check admin and premium status
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role, is_premium')
		.eq('id', user.id)
		.single()

	const isAdmin = profile?.role === 'admin'
	const isPremium = !!profile?.is_premium

	return {
		isAuthenticated: true,
		isAdmin,
		isPremium,
		hasAccess: isAdmin || isPremium,
		user,
		supabase,
	}
}
`;

content = content + newFunction;

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Added checkPremiumAuth function and updated checkAdminAuth');
