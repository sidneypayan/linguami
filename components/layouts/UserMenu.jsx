import { useTranslations, useLocale } from 'next-intl'
import { useUserContext } from '@/context/user.js'
import { useState, useMemo } from 'react'
import { styled, alpha, useTheme } from '@mui/material/styles'
import { getAvatarUrl } from '@/utils/avatars.js'
import {
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Avatar,
	Typography,
	Chip,
} from '@mui/material'
import {
	BookmarksRounded,
	LogoutRounded,
	SpellcheckRounded,
	PersonRounded,
	BarChartRounded,
	EmojiEventsRounded,
	SettingsRounded,
	VerifiedRounded,
} from '@mui/icons-material'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { cleanUserMaterialStatus } from '@/features/materials/materialsSlice.js'

const StyledMenu = styled(props => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 16,
		marginTop: theme.spacing(1),
		minWidth: 280,
		color: theme.palette.text.primary,
		background:
			theme.palette.mode === 'light'
				? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
				: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
		backdropFilter: 'blur(10px)',
		border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.4)'}`,
		boxShadow:
			theme.palette.mode === 'light'
				? '0 8px 32px rgba(139, 92, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)'
				: '0 8px 32px rgba(139, 92, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.5)',
		'& .MuiMenu-list': {
			padding: '0',
		},
		'& .MuiMenuItem-root': {
			borderRadius: '8px',
			padding: '10px 16px',
			margin: '4px 8px',
			fontSize: '0.95rem',
			fontWeight: 500,
			transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
			'& .MuiListItemIcon-root': {
				minWidth: 36,
			},
			'& .MuiSvgIcon-root': {
				fontSize: 20,
				color: theme.palette.mode === 'light' ? '#8b5cf6' : '#a78bfa',
				transition: 'transform 0.3s ease',
			},
			'&:hover': {
				background:
					theme.palette.mode === 'light'
						? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)'
						: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
				transform: 'translateX(4px)',
				borderLeft: `2px solid ${theme.palette.mode === 'light' ? '#8b5cf6' : '#a78bfa'}`,
				'& .MuiSvgIcon-root': {
					transform: 'scale(1.1)',
					color: theme.palette.mode === 'light' ? '#06b6d4' : '#67e8f9',
				},
			},
			'&:active': {
				backgroundColor: 'rgba(139, 92, 246, 0.15)',
			},
		},
		'& .MuiDivider-root': {
			margin: '8px 0',
			borderColor: theme.palette.mode === 'light' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.4)',
		},
		'&:before': {
			content: '""',
			display: 'block',
			position: 'absolute',
			top: 0,
			right: 14,
			width: 10,
			height: 10,
			background:
				theme.palette.mode === 'light'
					? 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)'
					: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
			border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.4)'}`,
			transform: 'translateY(-50%) rotate(45deg)',
			zIndex: 0,
		},
	},
}))

const UserMenu = () => {
	const t = useTranslations('common')
	const locale = useLocale()
	const { user, userProfile, logout } = useUserContext()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)
	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const avatarUrl = useMemo(
		() => getAvatarUrl(userProfile?.avatar_id),
		[userProfile?.avatar_id]
	)

	const username = userProfile?.name || user?.email?.split('@')[0] || 'User'

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					textAlign: 'center',
					ml: { xs: 0.5, sm: 1, lg: 2 },
					flexShrink: 0,
				}}>
				<IconButton
					onClick={handleClick}
					size='small'
					sx={{
						p: 0,
						background: open
							? 'rgba(255, 255, 255, 0.25)'
							: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
						backdropFilter: 'blur(10px)',
						border: { xs: '1.5px solid rgba(255, 255, 255, 0.3)', sm: '2px solid rgba(255, 255, 255, 0.3)' },
						borderColor: open ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)',
						transition: 'all 0.3s ease',
						'&:hover': {
							background: 'rgba(255, 255, 255, 0.25)',
							borderColor: 'rgba(255, 255, 255, 0.5)',
							transform: 'scale(1.05)',
						},
					}}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={open ? 'true' : undefined}>
					<Avatar
						src={avatarUrl}
						alt={username}
						sx={{
							width: { xs: 44, sm: 48, lg: 52 },
							height: { xs: 44, sm: 48, lg: 52 },
							border: '2px solid transparent',
						}}>
						<PersonRounded sx={{ fontSize: { xs: 24, sm: 28 } }} />
					</Avatar>
				</IconButton>
			</Box>
			<StyledMenu
				id='account-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}>
				{/* Carte de personnage */}
				<Box
					sx={{
						p: 2.5,
						background: 'linear-gradient(145deg, #4c1d95 0%, #2e1065 100%)',
						position: 'relative',
						overflow: 'hidden',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: -2,
							left: -2,
							right: -2,
							bottom: -2,
							background: 'linear-gradient(145deg, #8b5cf6 0%, #06b6d4 50%, #8b5cf6 100%)',
							zIndex: -1,
						},
						'&::after': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
							pointerEvents: 'none',
						},
					}}
					onClick={e => e.stopPropagation()}>
					<Box sx={{ position: 'relative', zIndex: 1 }}>
						{/* Nom du personnage */}
						<Box
							sx={{
								textAlign: 'center',
								mb: 1.5,
								pb: 1.5,
								borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
							}}>
							<Typography
								variant='h6'
								sx={{
									fontWeight: 700,
									background: 'linear-gradient(145deg, #a78bfa 0%, #06b6d4 50%, #a78bfa 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									fontSize: '1.1rem',
									letterSpacing: '0.03em',
									mb: 0.5,
								}}>
								{username}
							</Typography>
							{userProfile?.is_premium && (
								<Chip
									label='Premium'
									size='small'
									sx={{
										bgcolor: 'rgba(255, 215, 0, 0.2)',
										color: '#FFD700',
										fontWeight: 600,
										fontSize: '0.7rem',
										height: 20,
										border: '1px solid rgba(255, 215, 0, 0.3)',
									}}
								/>
							)}
						</Box>

						{/* Avatar */}
						<Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
							<Box
								sx={{
									position: 'relative',
									width: 80,
									height: 80,
									borderRadius: '50%',
									background: 'linear-gradient(145deg, #8b5cf6 0%, #06b6d4 100%)',
									p: 0.4,
									boxShadow: '0 4px 16px rgba(139, 92, 246, 0.5)',
								}}>
								<Avatar
									src={avatarUrl}
									alt={username}
									sx={{
										width: '100%',
										height: '100%',
										border: `3px solid ${isDark ? '#1e293b' : '#0f172a'}`,
										boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
									}}>
									<PersonRounded sx={{ fontSize: 35 }} />
								</Avatar>
								{userProfile?.is_premium && (
									<Box
										sx={{
											position: 'absolute',
											bottom: 0,
											right: 0,
											bgcolor: '#FFD700',
											borderRadius: '50%',
											width: 20,
											height: 20,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											border: `2px solid ${isDark ? '#1e293b' : '#0f172a'}`,
											boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
										}}>
										<VerifiedRounded sx={{ fontSize: 12, color: 'white' }} />
									</Box>
								)}
							</Box>
						</Box>

						{/* Statistiques */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: '1fr 1fr 1fr',
								gap: 1,
								pt: 1.5,
								borderTop: '1px solid rgba(139, 92, 246, 0.3)',
								alignItems: 'end',
							}}>
							{/* XP */}
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant='caption'
									sx={{
										color: 'rgba(6, 182, 212, 0.8)',
										fontSize: '0.65rem',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '0.1em',
									}}>
									XP
								</Typography>
								<Typography
									variant='h6'
									sx={{
										fontWeight: 700,
										background: 'linear-gradient(145deg, #06b6d4 0%, #67e8f9 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										lineHeight: 1,
										mt: 0.5,
										fontSize: '1rem',
									}}>
									{userProfile?.xp || 0}
								</Typography>
							</Box>

							{/* Niveau */}
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant='caption'
									sx={{
										color: 'rgba(167, 139, 250, 0.8)',
										fontSize: '0.75rem',
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: '0.12em',
									}}>
									Niveau
								</Typography>
								<Typography
									variant='h3'
									sx={{
										fontWeight: 800,
										background: 'linear-gradient(145deg, #a78bfa 0%, #c4b5fd 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										lineHeight: 1,
										mt: 0.5,
										textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
									}}>
									{userProfile?.level || 1}
								</Typography>
							</Box>

							{/* Or */}
							<Box sx={{ textAlign: 'center' }}>
								<Typography
									variant='caption'
									sx={{
										color: 'rgba(6, 182, 212, 0.8)',
										fontSize: '0.65rem',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '0.1em',
									}}>
									Or
								</Typography>
								<Typography
									variant='h6'
									sx={{
										fontWeight: 700,
										background: 'linear-gradient(145deg, #06b6d4 0%, #67e8f9 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										lineHeight: 1.2,
										mt: 0.5,
										fontSize: '0.85rem',
									}}>
									{userProfile?.gold || 0}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>

				<Box sx={{ mt: 1 }}>
					<Link href='/dictionary'>
						<MenuItem>
							<ListItemIcon>
								<SpellcheckRounded />
							</ListItemIcon>
							{t('mydictionary')}
						</MenuItem>
					</Link>
				<Link href='/my-materials'>
					<MenuItem>
						<ListItemIcon>
							<BookmarksRounded />
						</ListItemIcon>
						{t('mymaterials')}
					</MenuItem>
				</Link>
				<Link href='/statistics'>
					<MenuItem>
						<ListItemIcon>
							<BarChartRounded />
						</ListItemIcon>
						{t('statistics')}
					</MenuItem>
				</Link>
				<Link href='/leaderboard'>
					<MenuItem>
						<ListItemIcon>
							<EmojiEventsRounded />
						</ListItemIcon>
						{t('leaderboard')}
					</MenuItem>
				</Link>
				<Link href='/settings'>
					<MenuItem>
						<ListItemIcon>
							<SettingsRounded />
						</ListItemIcon>
						{t('settings')}
					</MenuItem>
				</Link>
				</Box>

				<Divider sx={{ mt: 1 }} />

				<Box sx={{ mb: 1 }}>
					<MenuItem
						onClick={() => {
							logout()
							dispatch(cleanUserMaterialStatus())
						}}>
						<ListItemIcon>
							<LogoutRounded />
						</ListItemIcon>
						{t('logout')}
					</MenuItem>
				</Box>
			</StyledMenu>
		</>
	)
}

export default UserMenu
