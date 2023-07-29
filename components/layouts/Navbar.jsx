import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { useUserContext } from '../../context/user.js'
import { useRouter } from 'next/router'
import UserMenu from './UserMenu'
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
import Link from 'next/link'

import MenuIcon from '@mui/icons-material/Menu'
import { Article, HistoryEdu, Home, School } from '@mui/icons-material'
import LanguageMenu from './LanguageMenu.jsx'

const drawerWidth = '80%'

const Navbar = props => {
	const { t, lang } = useTranslation('common')
	const { user, userProfile, isUserLoggedIn } = useUserContext()
	const router = useRouter()

	const navigationLinks = [
		{
			name: 'Linguami',
			icon: <Home style={{ fontSize: '1.5rem' }} />,
			href: '/',
		},
		{
			name: t('material'),
			icon: <Article style={{ fontSize: '1.5rem' }} />,
			href: '/materials',
		},
		{
			name: t('teacher'),
			icon: <School style={{ fontSize: '1.5rem' }} />,
			href: '/teacher',
		},
		{
			name: t('blog'),
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
						<Link href={`${link.href}`}>
							<ListItemButton>
								<ListItemIcon sx={{ color: '#fff' }}>{link.icon}</ListItemIcon>
								<ListItemText primary={link.name} />
							</ListItemButton>
						</Link>
					</ListItem>
				))}
			</List>

			{!isUserLoggedIn && (
				<Box sx={{ bgcolor: 'clrPrimary1', height: '100vh' }}>
					<Link href={`/login`}>
						<Button variant='outlined' sx={{ marginRight: '2rem' }}>
							{t('signin')}
						</Button>
					</Link>
					<Link href={`/register`}>
						<Button variant='contained' sx={{ bgcolor: 'purple' }}>
							{t('register')}
						</Button>
					</Link>
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
							<Link key={link.name} href={`${link.href}`}>
								<Button sx={{ color: '#fff' }}>{link.name}</Button>
							</Link>
						))}
					</Box>

					{!router.query.material && !router.query.slug && <LanguageMenu />}

					{isUserLoggedIn ? (
						<UserMenu />
					) : (
						<Box
							sx={{
								display: { xs: 'none', sm: 'flex' },
								gap: '1rem',
							}}>
							<Link href={`/login`}>
								<Button sx={{ color: '#fff' }} variant='outlined'>
									{t('signin')}
								</Button>
							</Link>
							<Link href={`/register`}>
								<Button variant='contained' sx={{ bgcolor: 'purple' }}>
									{t('register')}
								</Button>
							</Link>
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
