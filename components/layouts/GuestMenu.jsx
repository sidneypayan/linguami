import { useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'
import { styled, useTheme } from '@mui/material/styles'
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
	Button,
} from '@mui/material'
import {
	SpellcheckRounded,
	PersonRounded,
	EmojiEventsRounded,
	LoginRounded,
	PersonAddRounded,
} from '@mui/icons-material'
import { Link } from '@/i18n/navigation'

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

const GuestMenu = () => {
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	// Avatar par défaut pour les guests (Human Male)
	const avatarUrl = useMemo(() => getAvatarUrl('avatar12'), [])

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

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
					aria-controls={open ? 'guest-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={open ? 'true' : undefined}>
					<Avatar
						src={avatarUrl}
						alt="Guest"
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
				id='guest-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}>
				{/* Header CTA */}
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
					}}
					onClick={e => e.stopPropagation()}>
					<Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
						<Typography
							variant='subtitle1'
							sx={{
								fontWeight: 700,
								color: 'white',
								mb: 1,
								fontSize: '1rem',
							}}>
							{t('guest_mode')}
						</Typography>
						<Typography
							variant='body2'
							sx={{
								color: 'rgba(255, 255, 255, 0.8)',
								mb: 2,
								fontSize: '0.85rem',
							}}>
							{t('guest_mode_description')}
						</Typography>
						<Link href="/signup">
							<Button
								variant="contained"
								fullWidth
								size="small"
								sx={{
									background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
									color: 'white',
									fontWeight: 700,
									textTransform: 'none',
									py: 1,
									borderRadius: 2,
									boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)',
									'&:hover': {
										background: 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)',
										transform: 'translateY(-2px)',
										boxShadow: '0 6px 20px rgba(6, 182, 212, 0.5)',
									},
								}}>
								{t('create_account')}
							</Button>
						</Link>
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
					<Link href='/leaderboard'>
						<MenuItem>
							<ListItemIcon>
								<EmojiEventsRounded />
							</ListItemIcon>
							{t('leaderboard')}
						</MenuItem>
					</Link>
				</Box>

				<Divider sx={{ mt: 1 }} />

				<Box sx={{ mb: 1 }}>
					<Link href='/login'>
						<MenuItem>
							<ListItemIcon>
								<LoginRounded />
							</ListItemIcon>
							{t('signin')}
						</MenuItem>
					</Link>
					<Link href='/signup'>
						<MenuItem>
							<ListItemIcon>
								<PersonAddRounded />
							</ListItemIcon>
							{t('signup')}
						</MenuItem>
					</Link>
				</Box>
			</StyledMenu>
		</>
	)
}

export default GuestMenu
