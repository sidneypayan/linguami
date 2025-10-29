import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'
import { Paper, BottomNavigation, BottomNavigationAction, Badge } from '@mui/material'
import {
	Home,
	Article,
	MenuBook as Dictionary,
	School,
	Person,
} from '@mui/icons-material'
import { useUserContext } from '../../context/user'

const BottomNav = () => {
	const router = useRouter()
	const { t } = useTranslation('common')
	const { isUserLoggedIn } = useUserContext()
	const { user_words } = useSelector(store => store.words)

	// Déterminer la valeur active basée sur le pathname
	const getActiveValue = () => {
		const path = router.pathname
		if (path === '/') return 'home'
		if (path.startsWith('/materials')) return 'materials'
		if (path.startsWith('/dictionary')) return 'dictionary'
		if (path.startsWith('/lessons') || path.startsWith('/teacher')) return 'lessons'
		if (path.startsWith('/signin') || path.startsWith('/my-materials')) return 'profile'
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
					router.push('/signin')
				}
				break
			case 'lessons':
				router.push('/lessons')
				break
			case 'profile':
				if (isUserLoggedIn) {
					router.push('/my-materials')
				} else {
					router.push('/signin')
				}
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
				display: { xs: 'block', sm: 'none' },
				zIndex: 1100,
				borderRadius: 0,
				boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
				borderTop: '1px solid rgba(102, 126, 234, 0.1)',
			}}
			elevation={3}>
			<BottomNavigation
				value={getActiveValue()}
				onChange={handleNavigation}
				showLabels
				sx={{
					height: '70px',
					background: 'white',
					'& .MuiBottomNavigationAction-root': {
						minWidth: 'auto',
						padding: '6px 12px 8px',
						transition: 'all 0.3s ease',
						'&.Mui-selected': {
							color: '#667eea',
							'& .MuiBottomNavigationAction-label': {
								fontSize: '0.75rem',
								fontWeight: 700,
								transform: 'translateY(2px)',
							},
							'& .MuiSvgIcon-root': {
								transform: 'scale(1.2)',
								filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
							},
						},
						'&:not(.Mui-selected)': {
							color: '#718096',
							'& .MuiBottomNavigationAction-label': {
								fontSize: '0.7rem',
								fontWeight: 500,
							},
						},
						'&:active': {
							transform: 'scale(0.95)',
						},
					},
					'& .MuiBottomNavigationAction-label': {
						transition: 'all 0.3s ease',
					},
					'& .MuiSvgIcon-root': {
						fontSize: '1.5rem',
						transition: 'all 0.3s ease',
					},
				}}>
				<BottomNavigationAction
					label='Accueil'
					value='home'
					icon={<Home />}
				/>
				<BottomNavigationAction
					label='Matériels'
					value='materials'
					icon={<Article />}
				/>
				<BottomNavigationAction
					label='Dico'
					value='dictionary'
					icon={
						isUserLoggedIn && user_words.length > 0 ? (
							<Badge
								badgeContent={user_words.length}
								max={99}
								sx={{
									'& .MuiBadge-badge': {
										background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
										color: 'white',
										fontWeight: 700,
										fontSize: '0.65rem',
										height: '18px',
										minWidth: '18px',
										padding: '0 4px',
									},
								}}>
								<Dictionary />
							</Badge>
						) : (
							<Dictionary />
						)
					}
				/>
				<BottomNavigationAction
					label='Cours'
					value='lessons'
					icon={<School />}
				/>
				<BottomNavigationAction
					label='Profil'
					value='profile'
					icon={<Person />}
				/>
			</BottomNavigation>
		</Paper>
	)
}

export default BottomNav
