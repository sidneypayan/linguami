'use client'

import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { getUserWordsAction } from '@/app/actions/words'
import { useState, useEffect } from 'react'
import { getGuestWordsByLanguage } from '@/utils/guestDictionary'
import { cn } from '@/lib/utils'
import { Home, BookOpen, Bookmark, Library } from 'lucide-react'

const BottomNav = () => {
	const router = useNextRouter()
	const pathname = usePathname()
	const params = useParams()
	const locale = useLocale()
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const { isUserLoggedIn, userLearningLanguage, isBootstrapping, user, isUserAdmin } = useUserContext()
	const userId = user?.id

	// React Query: Fetch user words (only for logged-in users)
	const { data: user_words = [] } = useQuery({
		queryKey: ['userWords', userId, userLearningLanguage],
		queryFn: async () => {
			const result = await getUserWordsAction({ userId, userLearningLanguage })
			return result.success ? result.data : []
		},
		enabled: !!userId && !!userLearningLanguage && isUserLoggedIn && !isBootstrapping,
		staleTime: 5 * 60 * 1000,
	})

	// Guest words count (from localStorage)
	const [guestWordsCount, setGuestWordsCount] = useState(0)
	useEffect(() => {
		if (!isUserLoggedIn && userLearningLanguage) {
			const guestWords = getGuestWordsByLanguage(userLearningLanguage)
			setGuestWordsCount(guestWords.length)
		}
	}, [isUserLoggedIn, userLearningLanguage])

	// Total words count (user or guest)
	const wordsCount = isUserLoggedIn ? user_words.length : guestWordsCount

	// Check if lessons are available (admin only for now)
	const hasLessons = userLearningLanguage === 'fr' && isUserAdmin

	// Determine active value based on pathname
	const getActiveValue = () => {
		const pathWithoutLocale = pathname.replace(/^\/(fr|ru|en)/, '') || '/'
		if (pathWithoutLocale === '/') return 'home'
		if (pathWithoutLocale.startsWith('/materials')) return 'materials'
		if (pathWithoutLocale.startsWith('/dictionary')) return 'dictionary'
		if (pathWithoutLocale.startsWith('/lessons') || pathWithoutLocale.startsWith('/teacher')) return 'lessons'
		return 'home'
	}

	const activeValue = getActiveValue()

	const handleNavigation = (value) => {
		switch (value) {
			case 'home':
				router.push(`/${locale}`)
				break
			case 'materials':
				router.push(`/${locale}/materials`)
				break
			case 'dictionary':
				router.push(`/${locale}/dictionary`)
				break
			case 'lessons':
				router.push(`/${locale}/lessons`)
				break
			default:
				break
		}
	}

	const navItems = [
		{
			value: 'home',
			label: locale === 'fr' ? 'Accueil' : locale === 'en' ? 'Home' : 'Главная',
			icon: Home,
		},
		{
			value: 'materials',
			label: t('material'),
			icon: BookOpen,
		},
		{
			value: 'dictionary',
			label: locale === 'fr' ? 'Dico' : locale === 'en' ? 'Words' : 'Слова',
			icon: Bookmark,
			badge: !isBootstrapping && wordsCount > 0 ? wordsCount : null,
		},
		...(hasLessons ? [{
			value: 'lessons',
			label: t('lessons'),
			icon: Library,
		}] : []),
	]

	return (
		<div className={cn(
			'fixed bottom-0 left-0 right-0 z-50',
			'md:hidden',
			'backdrop-blur-xl',
			isDark
				? 'bg-slate-900/95 border-t border-violet-500/30 shadow-[0_-4px_24px_rgba(139,92,246,0.25)]'
				: 'bg-white/95 border-t border-violet-500/15 shadow-[0_-4px_24px_rgba(102,126,234,0.15)]'
		)}>
			<nav className="h-[72px] flex items-center justify-around px-2">
				{navItems.map((item) => {
					const isActive = activeValue === item.value
					const Icon = item.icon
					return (
						<button
							key={item.value}
							onClick={() => handleNavigation(item.value)}
							className={cn(
								'flex flex-col items-center justify-center gap-1',
								'min-w-0 flex-1 py-2 px-3 mx-0.5 rounded-xl',
								'transition-all duration-300',
								isActive && (isDark
									? 'bg-gradient-to-br from-violet-500/15 to-purple-500/10'
									: 'bg-gradient-to-br from-violet-500/10 to-purple-500/5'
								)
							)}
						>
							{/* Icon with optional badge */}
							<div className="relative">
								<Icon className={cn(
									'w-[1.625rem] h-[1.625rem] transition-all duration-300',
									isActive
										? 'text-violet-500 scale-115 -translate-y-0.5 drop-shadow-[0_3px_6px_rgba(102,126,234,0.35)]'
										: isDark ? 'text-slate-400' : 'text-slate-500'
								)} />
								{/* Badge */}
								{item.badge && (
									<span className={cn(
										'absolute -top-1.5 -right-2.5',
										'min-w-[20px] h-5 px-1.5',
										'flex items-center justify-center',
										'text-[0.625rem] font-extrabold text-white',
										'bg-gradient-to-br from-emerald-500 to-emerald-600',
										'rounded-full',
										'shadow-[0_2px_8px_rgba(16,185,129,0.4)]',
										isDark ? 'border-2 border-slate-900' : 'border-2 border-white'
									)}>
										{item.badge > 99 ? '99+' : item.badge}
									</span>
								)}
							</div>
							{/* Label */}
							<span className={cn(
								'text-[0.6875rem] font-semibold transition-all duration-300 mt-1',
								isActive
									? 'text-transparent bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text font-extrabold tracking-wide'
									: isDark ? 'text-slate-400' : 'text-slate-500'
							)}>
								{item.label}
							</span>
						</button>
					)
				})}
			</nav>
		</div>
	)
}

export default BottomNav
