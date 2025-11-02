import React, { useState, useEffect } from 'react'
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

import {
	HomeRounded,
	AutoStoriesRounded,
	PersonSearchRounded,
	LocalLibraryRounded,
	RssFeedRounded,
	DensityMediumRounded,
	AdminPanelSettings,
} from '@mui/icons-material'

import LanguageMenu from './LanguageMenu.jsx'
import InterfaceLanguageMenu from './InterfaceLanguageMenu.jsx'

const drawerWidth = '80%'

const Navbar = props => {
	const { t, lang } = useTranslation('common')
	const { user, userProfile, isUserLoggedIn, isUserAdmin } = useUserContext()
	const router = useRouter()
	const { lessons, lessons_loading } = useSelector(store => store.lessons)

	const allNavigationLinks = [
		{
			name: 'Linguami',
			icon: <HomeRounded style={{ fontSize: '1.5rem' }} />,
			href: '/',
		},
		{
			name: t('material'),
			icon: <AutoStoriesRounded style={{ fontSize: '1.5rem' }} />,
			href: '/materials',
		},
		{
			name: t('teacher'),
			icon: <PersonSearchRounded style={{ fontSize: '1.5rem' }} />,
			href: '/teacher',
		},
		{
			name: t('lessons'),
			icon: <LocalLibraryRounded style={{ fontSize: '1.5rem' }} />,
			href: '/lessons',
			// Cacher seulement si chargement terminé ET aucune leçon
			hideIf: !lessons_loading && lessons.length === 0,
		},
		{
			name: t('blog'),
			icon: <RssFeedRounded style={{ fontSize: '1.5rem' }} />,
			href: '/blog',
		},
	]

	// Filtrer les liens à ne pas afficher
	const navigationLinks = allNavigationLinks.filter(link => !link.hideIf)

	const { window } = props
	const [mobileOpen, setMobileOpen] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	const isActivePath = (href) => {
		if (href === '/') return router.pathname === '/'
		return router.pathname.startsWith(href)
	}

	const drawer = (
		<Box
			onClick={handleDrawerToggle}
			sx={{
				height: '100vh',
				background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: '200px',
					background: 'radial-gradient(circle at bottom left, rgba(0,0,0,0.3) 0%, transparent 70%)',
					pointerEvents: 'none',
				},
			}}>
			{/* Header du drawer */}
			<Box
				sx={{
					p: 3,
					pb: 2.5,
					display: 'flex',
					alignItems: 'center',
					gap: 2,
					borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
					position: 'relative',
					zIndex: 1,
				}}>
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: 3,
						background: 'rgba(255, 255, 255, 0.2)',
						backdropFilter: 'blur(10px)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
					}}>
					<HomeRounded sx={{ fontSize: '1.75rem', color: 'white' }} />
				</Box>
				<Box>
					<Box
						sx={{
							fontWeight: 800,
							fontSize: '1.5rem',
							color: 'white',
							letterSpacing: '-0.5px',
							lineHeight: 1.2,
						}}>
						Linguami
					</Box>
					<Box
						sx={{
							fontSize: '0.75rem',
							color: 'rgba(255, 255, 255, 0.8)',
							fontWeight: 500,
							mt: 0.25,
						}}>
						Apprentissage des langues
					</Box>
				</Box>
			</Box>

			{/* Navigation */}
			<List sx={{ color: '#fff', px: 2.5, py: 4, position: 'relative', zIndex: 1, flex: 1 }}>
				{navigationLinks.map((link, index) => {
					const isActive = isActivePath(link.href)
					return (
						<ListItem
							key={link.name}
							disablePadding
							sx={{
								mb: 1.5,
								animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
								'@keyframes slideIn': {
									'0%': {
										opacity: 0,
										transform: 'translateX(-20px)',
									},
									'100%': {
										opacity: 1,
										transform: 'translateX(0)',
									},
								},
							}}>
							<Link href={`${link.href}`} style={{ width: '100%' }}>
								<ListItemButton
									sx={{
										borderRadius: 3,
										py: 1.5,
										px: 2,
										backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
										backdropFilter: isActive ? 'blur(10px)' : 'none',
										boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.15)' : 'none',
										border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
										transition: 'all 0.3s ease',
										'&:hover': {
											backgroundColor: 'rgba(255, 255, 255, 0.15)',
											transform: 'translateX(8px)',
											boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
										},
									}}>
									<ListItemIcon
										sx={{
											color: '#fff',
											minWidth: 44,
											'& .MuiSvgIcon-root': {
												fontSize: '1.5rem',
												filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
											},
										}}>
										{link.icon}
									</ListItemIcon>
									<ListItemText
										primary={link.name}
										primaryTypographyProps={{
											fontWeight: isActive ? 700 : 600,
											fontSize: '1.0625rem',
											letterSpacing: '-0.2px',
										}}
									/>
									{isActive && (
										<Box
											sx={{
												width: 6,
												height: 6,
												borderRadius: '50%',
												backgroundColor: 'white',
												boxShadow: '0 0 10px rgba(255,255,255,0.8)',
											}}
										/>
									)}
								</ListItemButton>
							</Link>
						</ListItem>
					)
				})}

				{/* Admin button for mobile - only for admin users */}
				{isUserAdmin && (
					<ListItem
						disablePadding
						sx={{
							mb: 1.5,
							animation: `slideIn 0.3s ease-out ${navigationLinks.length * 0.05}s both`,
							'@keyframes slideIn': {
								'0%': {
									opacity: 0,
									transform: 'translateX(-20px)',
								},
								'100%': {
									opacity: 1,
									transform: 'translateX(0)',
								},
							},
						}}>
						<Link href="/admin" style={{ width: '100%' }}>
							<ListItemButton
								sx={{
									borderRadius: 3,
									py: 1.5,
									px: 2,
									backgroundColor: isActivePath('/admin') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
									backdropFilter: isActivePath('/admin') ? 'blur(10px)' : 'none',
									boxShadow: isActivePath('/admin') ? '0 4px 15px rgba(0, 0, 0, 0.15)' : 'none',
									border: isActivePath('/admin') ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 200, 100, 0.3)',
									background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 140, 0, 0.15) 100%)',
									transition: 'all 0.3s ease',
									'&:hover': {
										backgroundColor: 'rgba(255, 215, 0, 0.25)',
										transform: 'translateX(8px)',
										boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
									},
								}}>
								<ListItemIcon
									sx={{
										color: '#fff',
										minWidth: 44,
										'& .MuiSvgIcon-root': {
											fontSize: '1.5rem',
											filter: isActivePath('/admin') ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(255,215,0,0.3))',
										},
									}}>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText
									primary={t('admin')}
									primaryTypographyProps={{
										fontWeight: isActivePath('/admin') ? 700 : 600,
										fontSize: '1.0625rem',
										letterSpacing: '-0.2px',
									}}
								/>
								{isActivePath('/admin') && (
									<Box
										sx={{
											width: 6,
											height: 6,
											borderRadius: '50%',
											backgroundColor: 'white',
											boxShadow: '0 0 10px rgba(255,255,255,0.8)',
										}}
									/>
								)}
							</ListItemButton>
						</Link>
					</ListItem>
				)}
			</List>

			{/* Language selectors pour mobile */}
			<Box sx={{ px: 3, pb: 2, mt: 'auto', position: 'relative', zIndex: 1 }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
					<InterfaceLanguageMenu variant="full" onClose={handleDrawerToggle} />
					<LanguageMenu variant="full" onClose={handleDrawerToggle} />
				</Box>
			</Box>

			{/* Bouton Sign in pour mobile */}
			{isMounted && !isUserLoggedIn && (
				<Box sx={{ px: 3, pb: 4, position: 'relative', zIndex: 1 }}>
					<Link href={`/signin`}>
						<Button
							variant='contained'
							fullWidth
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								color: 'white',
								fontWeight: 700,
								textTransform: 'none',
								py: 1.75,
								borderRadius: 3,
								fontSize: '1.0625rem',
								boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
									transform: 'translateY(-3px)',
									boxShadow: '0 12px 32px rgba(139, 92, 246, 0.6), 0 0 20px rgba(6, 182, 212, 0.3)',
								},
								'&:active': {
									transform: 'translateY(-1px)',
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
					background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #1e1b4b 100%)',
					backdropFilter: 'blur(10px)',
					boxShadow: '0 4px 30px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
					borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
					position: 'relative',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
						pointerEvents: 'none',
					},
				}}>
				<Toolbar sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				py: 2,
				position: 'relative',
				zIndex: 1,
				minHeight: { xs: 70, sm: 80 },
				px: { xs: 1.5, sm: 2, md: 3 },
			}}>
					{/* Menu mobile */}
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='start'
						onClick={handleDrawerToggle}
						sx={{
							ml: { xs: 0.5, sm: 0 },
							mr: { xs: 1.5, sm: 1.5, lg: 2 },
							display: { xs: 'flex', lg: 'none' },
							width: { xs: 44, sm: 48, lg: 50 },
							height: { xs: 44, sm: 48, lg: 50 },
							borderRadius: 2,
							background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
							backdropFilter: 'blur(10px)',
							border: '1px solid rgba(139, 92, 246, 0.4)',
							boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: '-50%',
								left: '-50%',
								width: '200%',
								height: '200%',
								background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
								transform: 'translate(-100%, -100%)',
								transition: 'transform 0.5s ease',
							},
							'&:hover': {
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(6, 182, 212, 0.3) 100%)',
								transform: 'scale(1.1) rotate(5deg)',
								boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), 0 0 25px rgba(6, 182, 212, 0.3)',
								border: '1px solid rgba(139, 92, 246, 0.6)',
								'&::before': {
									transform: 'translate(0, 0)',
								},
							},
							'&:active': {
								transform: 'scale(0.95)',
							},
						}}>
						<DensityMediumRounded sx={{ fontSize: '1.6rem', filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))' }} />
					</IconButton>

					{/* Logo/Brand - caché sur mobile, visible sur tablette et desktop */}
					<Box
						sx={{
							display: { xs: 'none', sm: 'flex' },
							alignItems: 'center',
							mr: { xs: 0, lg: 3 },
							flexShrink: 0,
						}}>
						<Link href='/'>
							<Box
								sx={{
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									px: { xs: 1, sm: 1.5, md: 2 },
									py: 1,
									borderRadius: 2,
									transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
									position: 'relative',
									overflow: 'hidden',
									'&::before': {
										content: '""',
										position: 'absolute',
										top: 0,
										left: '-100%',
										width: '100%',
										height: '100%',
										background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
										transition: 'left 0.6s ease',
									},
									'&:hover': {
										transform: 'scale(1.05) translateY(-2px)',
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.25) 100%)',
										boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4), 0 0 25px rgba(6, 182, 212, 0.3)',
										'&::before': {
											left: '100%',
										},
									},
								}}>
								<Box
									sx={{
										fontWeight: 800,
										fontSize: { xs: '1.3rem', sm: '1.5rem' },
										color: 'white',
										letterSpacing: '-0.5px',
									}}>
									Linguami
								</Box>
							</Box>
						</Link>
					</Box>

					{/* Navigation Links */}
					<Box sx={{
						display: { xs: 'none', lg: 'flex' },
						gap: 1.5,
						flex: 1,
						justifyContent: 'flex-start',
						minWidth: 0,
					}}>
						{navigationLinks.slice(1).map((link, index) => {
							const isActive = isActivePath(link.href)
							return (
								<Link key={link.name} href={`${link.href}`}>
									<Button
										startIcon={link.icon}
										sx={{
											color: '#fff',
											fontWeight: 600,
											textTransform: 'none',
											fontSize: '0.95rem',
											px: 2.5,
											py: 1,
											borderRadius: 2,
											background: isActive
												? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)'
												: 'rgba(255, 255, 255, 0.05)',
											border: isActive
												? '1px solid rgba(139, 92, 246, 0.5)'
												: '1px solid rgba(255, 255, 255, 0.1)',
											boxShadow: isActive ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											position: 'relative',
											overflow: 'hidden',
											'&::before': {
												content: '""',
												position: 'absolute',
												top: 0,
												left: '-100%',
												width: '100%',
												height: '100%',
												background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
												transition: 'left 0.5s ease',
											},
											'& .MuiButton-startIcon': {
												marginRight: '8px',
											},
											'& .MuiSvgIcon-root': {
												fontSize: '1.3rem',
												transition: 'all 0.3s ease',
												filter: isActive ? 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))' : 'none',
											},
											'&:hover': {
												background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)',
												border: '1px solid rgba(139, 92, 246, 0.6)',
												transform: 'translateY(-3px)',
												boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
												'& .MuiSvgIcon-root': {
													transform: 'scale(1.2) rotate(-5deg)',
													filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.9))',
												},
												'&::before': {
													left: '100%',
												},
											},
											'&:active': {
												transform: 'translateY(-1px)',
											},
										}}>
										{link.name}
									</Button>
								</Link>
							)
						})}
					</Box>

					{/* Right side */}
					<Box sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 0.5, sm: 0.75, lg: 1.5 },
						flexShrink: 0,
					}}>
						{/* Admin button - only for admin users */}
						{isUserAdmin && (
							<Link href="/admin">
									<Button
									startIcon={<AdminPanelSettings />}
									sx={{
										color: '#fff',
										fontWeight: 700,
										textTransform: 'none',
										fontSize: '0.95rem',
										px: 2.5,
										py: 1,
										borderRadius: 2,
										background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(255, 140, 0, 0.25) 100%)',
										border: '1px solid rgba(255, 215, 0, 0.4)',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										display: { xs: 'none', lg: 'flex' },
										boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
										position: 'relative',
										overflow: 'hidden',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: '-100%',
											width: '100%',
											height: '100%',
											background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
											transition: 'left 0.5s ease',
										},
										'& .MuiButton-startIcon': {
											marginRight: '8px',
										},
										'& .MuiSvgIcon-root': {
											fontSize: '1.3rem',
											transition: 'all 0.3s ease',
											filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
										},
										'&:hover': {
											background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.4) 0%, rgba(255, 140, 0, 0.4) 100%)',
											transform: 'translateY(-3px) scale(1.05)',
											boxShadow: '0 4px 25px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.4)',
											border: '1px solid rgba(255, 215, 0, 0.6)',
											'& .MuiSvgIcon-root': {
												transform: 'scale(1.2) rotate(10deg)',
												filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 1))',
											},
											'&::before': {
												left: '100%',
											},
										},
										'&:active': {
											transform: 'translateY(-1px) scale(1.02)',
										},
									}}>
									{t('admin')}
									</Button>
							</Link>
						)}

						{/* Language buttons - only show when not in material/blog detail */}
						{isMounted && !router.query.material && !router.query.slug && (
							<>
								<InterfaceLanguageMenu />
								<LanguageMenu />
							</>
						)}

						{isMounted && (
							<>
								{isUserLoggedIn ? (
									<UserMenu />
								) : (
									<Box
										sx={{
											display: { xs: 'none', lg: 'flex' },
											gap: 1.5,
										}}>
										<Link href={`/signin`}>
											<Button
												variant='contained'
												sx={{
													background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35) 0%, rgba(6, 182, 212, 0.35) 100%)',
													backdropFilter: 'blur(10px)',
													color: 'white',
													fontWeight: 700,
													textTransform: 'none',
													px: 3.5,
													py: 1,
													borderRadius: 2,
													boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
													border: '1px solid rgba(139, 92, 246, 0.5)',
													transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
													position: 'relative',
													overflow: 'hidden',
													'&::before': {
														content: '""',
														position: 'absolute',
														top: 0,
														left: '-100%',
														width: '100%',
														height: '100%',
														background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
														transition: 'left 0.5s ease',
													},
													'&::after': {
														content: '""',
														position: 'absolute',
														top: 0,
														left: 0,
														right: 0,
														bottom: 0,
														borderRadius: 2,
														background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
														opacity: 0,
														transition: 'opacity 0.3s ease',
													},
													'&:hover': {
														background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.6) 0%, rgba(6, 182, 212, 0.6) 100%)',
														transform: 'translateY(-3px) scale(1.05)',
														boxShadow: '0 6px 30px rgba(139, 92, 246, 0.6), 0 0 30px rgba(6, 182, 212, 0.4)',
														border: '1px solid rgba(139, 92, 246, 0.8)',
														'&::before': {
															left: '100%',
														},
														'&::after': {
															opacity: 1,
														},
													},
													'&:active': {
														transform: 'translateY(-1px) scale(1.02)',
													},
												}}>
												{t('signin')}
											</Button>
										</Link>
									</Box>
								)}
							</>
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
						display: { xs: 'block', lg: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							borderRight: 'none',
							boxShadow: '4px 0 30px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
						},
						'& .MuiBackdrop-root': {
							backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
