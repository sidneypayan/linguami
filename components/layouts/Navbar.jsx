import { useState } from 'react'
import { useUserContext } from '../../context/user.js'
import UserMenu from './UserMenu'
import useTranslation from 'next-translate/useTranslation'
import {
	AppBar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import { Article, HistoryEdu, Home, School } from '@mui/icons-material'

const drawerWidth = '80%'

const Navbar = props => {
	const { t, lang } = useTranslation()
	const { user, userProfile, isUserLoggedIn } = useUserContext()

	const navigationLinks = [
		{
			name: 'Linguami',
			icon: <Home style={{ fontSize: '1.5rem' }} />,
			href: '/',
		},
		{
			name: t('common:material'),
			icon: <Article style={{ fontSize: '1.5rem' }} />,
			href: '/materials',
		},
		{
			name: t('common:teacher'),
			icon: <School style={{ fontSize: '1.5rem' }} />,
			href: '/teacher',
		},
		{
			name: t('common:blog'),
			icon: <HistoryEdu style={{ fontSize: '1.5rem' }} />,
			href: '/blog',
		},
	]

	const { window } = props
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: 'center', bgcolor: 'clrPrimary1', height: '100vh' }}>
			<List sx={{ color: '#fff' }}>
				{navigationLinks.map(link => (
					<ListItem key={link.name} disablePadding>
						<ListItemButton href={`/${lang + link.href}`}>
							<ListItemIcon sx={{ color: '#fff' }}>{link.icon}</ListItemIcon>
							<ListItemText primary={link.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			{!isUserLoggedIn && (
				<Box sx={{ bgcolor: 'clrPrimary1', height: '100vh' }}>
					<Button
						variant='outlined'
						href={`/${lang}/login`}
						sx={{ marginRight: '2rem' }}>
						{t('common:signin')}
					</Button>

					<Button
						variant='contained'
						href={`/${lang}/register`}
						sx={{ bgcolor: 'purple' }}>
						{t('common:register')}
					</Button>
				</Box>
			)}
		</Box>
	)

	const container =
		window !== undefined ? () => window().document.body : undefined

	return (
		<Box
			sx={{
				display: 'flex',
			}}>
			<AppBar
				component='nav'
				sx={{
					bgcolor: 'clrPrimary1',
				}}>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}>
						<MenuIcon />
					</IconButton>

					<Box sx={{ display: { xs: 'none', sm: 'block' } }}>
						{navigationLinks.map(link => (
							<Button
								href={`/${lang + link.href}`}
								key={link.name}
								sx={{ color: '#fff' }}>
								{link.name}
							</Button>
						))}
					</Box>

					{isUserLoggedIn ? (
						<UserMenu />
					) : (
						<Box
							sx={{
								display: { xs: 'none', sm: 'flex' },
								gap: '1rem',
							}}>
							<Button
								sx={{ color: '#fff' }}
								variant='outlined'
								href={`/${lang}/login`}>
								{t('common:signin')}
							</Button>

							<Button
								variant='contained'
								href={`/${lang}/register`}
								sx={{ bgcolor: 'purple' }}>
								{t('common:register')}
							</Button>
						</Box>
					)}
				</Toolbar>
			</AppBar>

			<Box component='nav'>
				<Drawer
					container={container}
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	)
}

export default Navbar
