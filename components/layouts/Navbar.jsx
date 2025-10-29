import React, { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useUserContext } from '../../context/user.js'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
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
import {
	Article,
	HistoryEdu,
	Home,
	School,
	MenuBook,
} from '@mui/icons-material'

import LanguageMenu from './LanguageMenu.jsx'

const drawerWidth = '80%'

const Navbar = props => {
	const { t, lang } = useTranslation('common')
	const { user, userProfile, isUserLoggedIn } = useUserContext()
	const router = useRouter()
	const { lessons, lessons_loading } = useSelector(store => store.lessons)

	const allNavigationLinks = [
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
			name: t('lessons'),
			icon: <MenuBook style={{ fontSize: '1.5rem' }} />,
			href: '/lessons',
			// Cacher seulement si chargement terminé ET aucune leçon
			hideIf: !lessons_loading && lessons.length === 0,
		},
		{
			name: t('blog'),
			icon: <HistoryEdu style={{ fontSize: '1.5rem' }} />,
			href: '/blog',
		},
	]

	// Filtrer les liens à ne pas afficher
	const navigationLinks = allNavigationLinks.filter(link => !link.hideIf)

	const { window } = props
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{
				height: '100vh',
				background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				flexDirection: 'column',
			}}>
			{/* Header du drawer */}
			<Box
				sx={{
					p: 3,
					display: 'flex',
					alignItems: 'center',
					gap: 1.5,
					borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
				}}>
				<Home sx={{ fontSize: '2rem', color: 'white' }} />
				<Box
					sx={{
						fontWeight: 800,
						fontSize: '1.5rem',
						color: 'white',
						letterSpacing: '-0.5px',
					}}>
					Linguami
				</Box>
			</Box>

			{/* Navigation */}
			<List sx={{ color: '#fff', px: 2, py: 3 }}>
				{navigationLinks.map(link => (
					<ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
						<Link href={`${link.href}`} style={{ width: '100%' }}>
							<ListItemButton
								sx={{
									borderRadius: 2,
									transition: 'all 0.2s ease',
									'&:hover': {
										backgroundColor: 'rgba(255, 255, 255, 0.15)',
										transform: 'translateX(8px)',
									},
								}}>
								<ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
									{link.icon}
								</ListItemIcon>
								<ListItemText
									primary={link.name}
									primaryTypographyProps={{
										fontWeight: 600,
										fontSize: '1rem',
									}}
								/>
							</ListItemButton>
						</Link>
					</ListItem>
				))}
			</List>

			{/* Bouton Sign in pour mobile */}
			{!isUserLoggedIn && (
				<Box sx={{ px: 3, pb: 3, mt: 'auto' }}>
					<Link href={`/signin`}>
						<Button
							variant='contained'
							fullWidth
							sx={{
								background: 'rgba(255, 255, 255, 0.2)',
								backdropFilter: 'blur(10px)',
								color: 'white',
								fontWeight: 600,
								textTransform: 'none',
								py: 1.5,
								borderRadius: 2,
								border: '2px solid rgba(255, 255, 255, 0.3)',
								fontSize: '1rem',
								transition: 'all 0.2s ease',
								'&:hover': {
									background: 'rgba(255, 255, 255, 0.3)',
									transform: 'translateY(-2px)',
									boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
								},
							}}>
							{t('signin')}
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
				elevation={0}
				sx={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					backdropFilter: 'blur(10px)',
					boxShadow: '0 4px 30px rgba(102, 126, 234, 0.3)',
				}}>
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
					{/* Menu mobile */}
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{
							mr: 2,
							display: { sm: 'none' },
							'&:hover': {
								backgroundColor: 'rgba(255, 255, 255, 0.15)',
							},
						}}>
						<MenuIcon />
					</IconButton>

					{/* Logo/Brand - visible sur desktop */}
					<Box
						sx={{
							display: { xs: 'none', sm: 'flex' },
							alignItems: 'center',
							mr: 3,
						}}>
						<Link href='/'>
							<Box
								sx={{
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									gap: 1,
									transition: 'transform 0.2s ease',
									'&:hover': {
										transform: 'scale(1.05)',
									},
								}}>
								<Home sx={{ fontSize: '1.8rem', color: 'white' }} />
								<Box
									sx={{
										fontWeight: 800,
										fontSize: '1.3rem',
										color: 'white',
										letterSpacing: '-0.5px',
									}}>
									Linguami
								</Box>
							</Box>
						</Link>
					</Box>

					{/* Navigation Links */}
					<Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, flex: 1 }}>
						{navigationLinks.slice(1).map(link => (
							<Link key={link.name} href={`${link.href}`}>
								<Button
									sx={{
										color: '#fff',
										fontWeight: 600,
										textTransform: 'none',
										fontSize: '0.95rem',
										px: 2,
										borderRadius: 2,
										transition: 'all 0.2s ease',
										'&:hover': {
											backgroundColor: 'rgba(255, 255, 255, 0.15)',
											transform: 'translateY(-2px)',
										},
									}}>
									{link.name}
								</Button>
							</Link>
						))}
					</Box>

					{/* Right side */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						{!router.query.material && !router.query.slug && <LanguageMenu />}

						{isUserLoggedIn ? (
							<UserMenu />
						) : (
							<Box
								sx={{
									display: { xs: 'none', sm: 'flex' },
									gap: 1.5,
								}}>
								<Link href={`/signin`}>
									<Button
										variant='contained'
										sx={{
											background: 'rgba(255, 255, 255, 0.2)',
											backdropFilter: 'blur(10px)',
											color: 'white',
											fontWeight: 600,
											textTransform: 'none',
											px: 3,
											borderRadius: 2,
											boxShadow: 'none',
											border: '1px solid rgba(255, 255, 255, 0.3)',
											transition: 'all 0.2s ease',
											'&:hover': {
												background: 'rgba(255, 255, 255, 0.3)',
												transform: 'translateY(-2px)',
												boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
											},
										}}>
										{t('signin')}
									</Button>
								</Link>
							</Box>
						)}
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
							borderRight: 'none',
							boxShadow: '4px 0 30px rgba(102, 126, 234, 0.3)',
						},
						'& .MuiBackdrop-root': {
							backgroundColor: 'rgba(0, 0, 0, 0.6)',
							backdropFilter: 'blur(4px)',
						},
					}}>
					{drawer}
				</Drawer>
			</Box>
		</Box>
	)
}

// Mémoïser la navbar (composant statique)
export default React.memo(Navbar)
