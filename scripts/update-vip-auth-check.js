const fs = require('fs');

const filePath = 'C:/Users/Sidney/Documents/linguami/lib/admin.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace checkPremiumAuth to check for VIP role instead of is_premium
const oldFunction = /\/\*\*\s*\* Check if user is admin OR premium \(VIP\)[\s\S]*?\n\}/;

const newFunction = `/**
 * Check if user is admin OR VIP
 * Returns user profile with admin and VIP status
 */
export async function checkVipAuth() {
	const cookieStore = await cookies()
	const supabase = createServerClient(cookieStore)

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error || !user) {
		return { isAuthenticated: false, isAdmin: false, isVip: false, user: null }
	}

	// Get user profile to check admin and VIP role
	const { data: profile } = await supabase
		.from('users_profile')
		.select('role')
		.eq('id', user.id)
		.single()

	const isAdmin = profile?.role === 'admin'
	const isVip = profile?.role === 'vip'

	return {
		isAuthenticated: true,
		isAdmin,
		isVip,
		hasAccess: isAdmin || isVip,
		user,
		supabase,
	}
}`;

content = content.replace(oldFunction, newFunction);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated auth check to use VIP role instead of is_premium');
