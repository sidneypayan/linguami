'use client'

import { useRouter as useNextRouter, usePathname, useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useTranslations, useLocale } from 'next-intl'
import { Paper, BottomNavigation, BottomNavigationAction, Badge, useTheme } from '@mui/material'
import {
	HomeRounded,
	AutoStoriesRounded,
	BookmarksRounded,
	LocalLibraryRounded,
} from '@mui/icons-material'
import { useUserContext } from '@/context/user'

const BottomNav = () => {
	const router = useNextRouter() // For navigation
	const pathname = usePathname()
	const params = useParams()
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { isUserLoggedIn, userLearningLanguage, isBootstrapping } = useUserContext()
	const { user_words } = useSelector(store => store.words)

	// Vérifier si des cours sont disponibles pour la langue choisie
	const hasLessons = userLearningLanguage === 'fr'

	// Déterminer la valeur active basée sur le pathname
	const getActiveValue = () => {
		const path = pathname
		if (path === '/') return 'home'
		if (path.startsWith('/materials')) return 'materials'
		if (path.startsWith('/dictionary')) return 'dictionary'
		if (path.startsWith('/lessons') || path.startsWith('/teacher')) return 'lessons'
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
				if (isUserLoggedIn) {
					router.push('/dictionary')
				} else {
					router.push('/login')
				}
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
					label={router.locale === 'fr' ? 'Accueil' : 'Главная'}
					value='home'
					icon={<HomeRounded />}
				/>
				<BottomNavigationAction
					label={t('material')}
					value='materials'
					icon={<AutoStoriesRounded />}
				/>
				<BottomNavigationAction
					label={router.locale === 'fr' ? 'Dico' : 'Слова'}
					value='dictionary'
					icon={
						!isBootstrapping && isUserLoggedIn && user_words.length > 0 ? (
							<Badge
								badgeContent={user_words.length}
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
