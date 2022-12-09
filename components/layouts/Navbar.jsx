import { useState } from 'react'
import { useUserContext } from '../../context/user.js'
import UserMenu from './UserMenu'
import { GiBookmarklet } from 'react-icons/gi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import { HiHome } from 'react-icons/hi'
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
	ListItemText,
	Toolbar,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

const drawerWidth = '80%'

const Navbar = props => {
	const { t, lang } = useTranslation()
	const { user, userProfile, isUserLoggedIn } = useUserContext()

	const navigationLinks = [
		{ name: <HiHome style={{ fontSize: '1.5rem' }} />, href: '/' },
		{ name: t('common:material'), href: '/materials' },
		{ name: t('common:teacher'), href: '/teacher' },
		{ name: t('common:blog'), href: '/blog' },
	]

	const userNavigationLinks = [
		{
			name: t('common:mydictionary'),
			href: '/dictionary',
			icon: (
				<GiBookmarklet style={{ fontSize: '1.5rem', marginRight: '.25rem' }} />
			),
		},
		{
			name: t('common:mymaterials'),
			href: '/my-materials',
			icon: (
				<HiOutlineAcademicCap
					style={{ fontSize: '1.5rem', marginRight: '.25rem' }}
				/>
			),
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
						<ListItemButton
							href={`/${lang + link.href}`}
							sx={{ textAlign: 'center' }}>
							<ListItemText primary={link.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			{!isUserLoggedIn && (
				<Box sx={{ bgcolor: 'clrPrimary1', height: '100vh' }}>
					<Button variant='outlined' href='/login' sx={{ marginRight: '2rem' }}>
						{t('common:signin')}
					</Button>

					<Button
						variant='contained'
						href='/register'
						sx={{ bgcolor: 'purple' }}>
						{t('common:register')}
					</Button>
				</Box>
			)}

			{isUserLoggedIn && (
				<Divider color='#fff' width='50%' sx={{ margin: '1rem auto' }} />
			)}

			{isUserLoggedIn &&
				userNavigationLinks.map(link => (
					<Box
						key={link.name}
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginRight: '.5rem',
							color: '#fff',
						}}>
						{link.icon}
						<Button href={`/${lang + link.href}`} sx={{ color: '#fff' }}>
							{link.name}
						</Button>
					</Box>
				))}
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
					<Box
						sx={{
							display: {
								xs: 'none',
								sm: 'flex',
								alignItems: 'center',
							},
						}}>
						{isUserLoggedIn &&
							userNavigationLinks.map(link => (
								<Box
									key={link.name}
									sx={{
										display: 'flex',
										alignItems: 'center',
										marginRight: '.5rem',
									}}>
									{link.icon}
									<Button href={`/${lang + link.href}`} sx={{ color: '#fff' }}>
										{link.name}
									</Button>
								</Box>
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
