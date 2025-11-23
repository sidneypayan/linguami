'use client'

import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useTranslations, useLocale } from 'next-intl'
import { Paper, BottomNavigation, BottomNavigationAction, Badge, useTheme } from '@mui/material'
import {
	HomeRounded,
	AutoStoriesRounded,
	BookmarksRounded,
	LocalLibraryRounded,
} from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import { getUserWordsAction } from '@/app/actions/words'
import { useState, useEffect } from 'react'
import { getGuestWordsByLanguage } from '@/utils/guestDictionary'

const BottomNav = () => {
	const router = useNextRouter() // For navigation
	const pathname = usePathname()
	const params = useParams()
	const locale = useLocale()
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { isUserLoggedIn, userLearningLanguage, isBootstrapping, user } = useUserContext()
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

	// Vérifier si des cours sont disponibles pour la langue choisie
	const hasLessons = userLearningLanguage === 'fr'

	// Déterminer la valeur active basée sur le pathname
	// Paths include locale: /fr, /ru/materials, /en/dictionary, etc.
	const getActiveValue = () => {
		// Remove locale prefix from pathname (e.g., /fr/materials -> /materials)
		const pathWithoutLocale = pathname.replace(/^\/(fr|ru|en)/, '') || '/'

		if (pathWithoutLocale === '/') return 'home'
		if (pathWithoutLocale.startsWith('/materials')) return 'materials'
		if (pathWithoutLocale.startsWith('/dictionary')) return 'dictionary'
		if (pathWithoutLocale.startsWith('/lessons') || pathWithoutLocale.startsWith('/teacher')) return 'lessons'
		return 'home'
	}

	const handleNavigation = (event, newValue) => {
		switch (newValue) {
			case 'home':
				router.push('/')
				break
			case 'materials':
				router.push('/materials')
				break
			case 'dictionary':
				// Allow both guests and logged-in users to access dictionary
				router.push('/dictionary')
				break
			case 'lessons':
				router.push('/lessons')
				break
			default:
				break
		}
	}

	return (
		<Paper
			sx={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				display: { xs: 'block', md: 'none' },
				zIndex: 1100,
				borderRadius: 0,
				boxShadow: isDark
					? '0 -4px 24px rgba(139, 92, 246, 0.25)'
					: '0 -4px 24px rgba(102, 126, 234, 0.15)',
				borderTop: isDark
					? '1px solid rgba(139, 92, 246, 0.3)'
					: '1px solid rgba(102, 126, 234, 0.15)',
				backdropFilter: 'blur(10px)',
				background: isDark
					? 'rgba(15, 23, 42, 0.95)'
					: 'rgba(255, 255, 255, 0.95)',
			}}
			elevation={0}>
			<BottomNavigation
				value={getActiveValue()}
				onChange={handleNavigation}
				showLabels
				sx={{
					height: '72px',
					background: 'transparent',
					'& .MuiBottomNavigationAction-root': {
						minWidth: 'auto',
						padding: '8px 12px 10px',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						borderRadius: 2,
						mx: 0.5,
						'&.Mui-selected': {
							background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
							'& .MuiBottomNavigationAction-label': {
								fontSize: '0.75rem',
								fontWeight: 800,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								letterSpacing: '0.3px',
							},
							'& .MuiSvgIcon-root': {
								transform: 'scale(1.15) translateY(-2px)',
								filter: 'drop-shadow(0 3px 6px rgba(102, 126, 234, 0.35))',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
							},
						},
						'&:not(.Mui-selected)': {
							color: isDark ? '#cbd5e1' : '#9ca3af',
							'& .MuiBottomNavigationAction-label': {
								fontSize: '0.6875rem',
								fontWeight: 600,
								color: isDark ? '#cbd5e1' : '#9ca3af',
							},
							'&:active': {
								background: isDark
									? 'rgba(139, 92, 246, 0.08)'
									: 'rgba(102, 126, 234, 0.05)',
							},
						},
					},
					'& .MuiBottomNavigationAction-label': {
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
						marginTop: '4px',
					},
					'& .MuiSvgIcon-root': {
						fontSize: '1.625rem',
						transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					},
				}}>
				<BottomNavigationAction
					label={locale === 'fr' ? 'Accueil' : locale === 'en' ? 'Home' : 'Главная'}
					value='home'
					icon={<HomeRounded />}
				/>
				<BottomNavigationAction
					label={t('material')}
					value='materials'
					icon={<AutoStoriesRounded />}
				/>
				<BottomNavigationAction
					label={locale === 'fr' ? 'Dico' : locale === 'en' ? 'Words' : 'Слова'}
					value='dictionary'
					icon={
						!isBootstrapping && wordsCount > 0 ? (
							<Badge
								badgeContent={wordsCount}
								max={99}
								sx={{
									'& .MuiBadge-badge': {
										background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
										color: 'white',
										fontWeight: 800,
										fontSize: '0.625rem',
										height: '20px',
										minWidth: '20px',
										padding: '0 5px',
										borderRadius: '10px',
										boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
										border: isDark
											? '2px solid rgba(15, 23, 42, 0.95)'
											: '2px solid white',
									},
								}}>
								<BookmarksRounded />
							</Badge>
						) : (
							<BookmarksRounded />
						)
					}
				/>
				{hasLessons && (
					<BottomNavigationAction
						label={t('lessons')}
						value='lessons'
						icon={<LocalLibraryRounded />}
					/>
				)}
			</BottomNavigation>
		</Paper>
	)
}

export default BottomNav
