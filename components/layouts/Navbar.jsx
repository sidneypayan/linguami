import { useState } from 'react'
import { useUserContext } from '../../context/user.js'
import UserMenu from './UserMenu'
import { GiBookmarklet } from 'react-icons/gi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import useTranslation from 'next-translate/useTranslation'
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	Drawer,
	IconButton,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Menu,
	MenuItem,
	Stack,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

const drawerWidth = '80%'
const navigationLinks = [
	{ name: 'matériels', href: '/material' },
	{ name: 'blog', href: '/blog' },
]

const Navbar = props => {
	const { t, lang } = useTranslation()
	const { user, userProfile, isUserLoggedIn } = useUserContext()

	const { window } = props
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{ textAlign: 'center', bgcolor: '#4a148c' }}>
			<List sx={{ color: '#fff' }}>
				{navigationLinks.map(link => (
					<ListItem key={link.name} disablePadding>
						<ListItemButton href={link.href} sx={{ textAlign: 'center' }}>
							<ListItemText primary={link.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Box sx={{ bgcolor: '#4a148c', height: '100vh' }}>
				<Button variant='outlined' href='/login' sx={{ marginRight: '2rem' }}>
					{t('common:signin')}
				</Button>

				<Button variant='contained' href='/register' sx={{ bgcolor: 'purple' }}>
					{t('common:register')}
				</Button>
			</Box>
		</Box>
	)

	const container =
		window !== undefined ? () => window().document.body : undefined

	return (
		<Box sx={{ display: 'flex' }}>
			<AppBar
				component='nav'
				sx={{
					bgcolor: 'secondaryPurple',
				}}>
				<Toolbar>
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
							<Button href={link.href} key={link.name} sx={{ color: '#fff' }}>
								{link.name}
							</Button>
						))}
					</Box>

					<Box
						sx={{
							display: { xs: 'none', sm: 'flex' },
							marginLeft: 'auto',
							gap: '1rem',
						}}>
						<Button sx={{ color: '#fff' }} variant='outlined' href='/login'>
							{t('common:signin')}
						</Button>

						<Button
							variant='contained'
							href='/register'
							sx={{ bgcolor: 'purple' }}>
							{t('common:register')}
						</Button>
					</Box>
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
