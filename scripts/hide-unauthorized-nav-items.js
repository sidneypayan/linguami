const fs = require('fs');

// 1. Fix Navbar - hide "Méthode" for non-admins in ALL environments
const navbarPath = 'C:/Users/Sidney/Documents/linguami/components/layouts/Navbar.jsx';
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Change hideIf condition to hide for non-admins in all environments
navbarContent = navbarContent.replace(
  /hideIf: process\.env\.NODE_ENV === 'production' && !isUserAdmin,/,
  'hideIf: !isUserAdmin,'
);

fs.writeFileSync(navbarPath, navbarContent, 'utf8');
console.log('✅ Updated Navbar - Méthode hidden for non-admins');

// 2. Fix UserMenu - filter training for admin/VIP only
const userMenuPath = 'C:/Users/Sidney/Documents/linguami/components/layouts/UserMenu.jsx';
let userMenuContent = fs.readFileSync(userMenuPath, 'utf8');

// Update the destructuring to include isUserAdmin
userMenuContent = userMenuContent.replace(
  /const { user, userProfile, logout } = useUserContext\(\)/,
  'const { user, userProfile, logout, isUserAdmin } = useUserContext()'
);

// Replace the menuItems array to filter training based on role
userMenuContent = userMenuContent.replace(
  /const menuItems = \[\s*{ href: '\/dictionary'[\s\S]*?{ href: '\/settings', icon: Settings, label: t\('settings'\) },\s*\]/,
  `const allMenuItems = [
		{ href: '/dictionary', icon: SpellCheck, label: t('mydictionary') },
		{ href: '/my-materials', icon: Bookmark, label: t('mymaterials') },
		{ href: '/statistics', icon: BarChart3, label: t('statistics') },
		{ href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
		{ href: '/training', icon: Dumbbell, label: t('training'), requiresVipOrAdmin: true },
		{ href: '/settings', icon: Settings, label: t('settings') },
	]

	// Filter menu items based on user role
	const menuItems = allMenuItems.filter(item => {
		if (item.requiresVipOrAdmin) {
			const isVip = userProfile?.role === 'vip'
			return isUserAdmin || isVip
		}
		return true
	})`
);

fs.writeFileSync(userMenuPath, userMenuContent, 'utf8');
console.log('✅ Updated UserMenu - Training filtered for admin/VIP only');

console.log('✅ All navigation items updated successfully');
