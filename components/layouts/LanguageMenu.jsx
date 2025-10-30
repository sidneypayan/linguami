import useTranslation from 'next-translate/useTranslation'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { ExpandMoreRounded, TranslateRounded, CheckCircleRounded } from '@mui/icons-material'
import { useState } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { useUserContext } from '../../context/user.js'

// Composant drapeau français
const FrenchFlag = ({ size = 32 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<circle cx="16" cy="16" r="16" fill="#ED2939"/>
		<path d="M 16 0 A 16 16 0 0 0 16 32 L 16 0" fill="#002395"/>
		<path d="M 16 0 L 16 32 A 16 16 0 0 0 16 0" fill="#ED2939"/>
		<rect x="10.67" width="10.67" height="32" fill="white"/>
	</svg>
)

// Composant drapeau russe
const RussianFlag = ({ size = 32 }) => (
	<svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
		<circle cx="16" cy="16" r="16" fill="#0039A6"/>
		<rect width="32" height="10.67" fill="white"/>
		<rect y="10.67" width="32" height="10.67" fill="#0039A6"/>
		<rect y="21.33" width="32" height="10.67" fill="#D52B1E"/>
	</svg>
)

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
		borderRadius: 12,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color:
			theme.palette.mode === 'light'
				? 'rgb(55, 65, 81)'
				: theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '8px',
		},
		'& .MuiMenuItem-root': {
			borderRadius: '8px',
			padding: '10px 12px',
			margin: '4px 0',
			fontSize: '0.95rem',
			fontWeight: 500,
			transition: 'all 0.2s ease',
			display: 'flex',
			alignItems: 'center',
			gap: '12px',
			'& .MuiSvgIcon-root': {
				fontSize: 20,
				color: '#667eea',
				transition: 'transform 0.2s ease',
			},
			'&:hover': {
				backgroundColor: alpha(theme.palette.primary.main, 0.08),
				transform: 'translateX(4px)',
				'& .MuiSvgIcon-root': {
					transform: 'scale(1.1)',
				},
			},
			'&:active': {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity
				),
			},
		},
	},
}))

const LanguageMenu = () => {
	const { t, lang } = useTranslation('common')
	const { userLearningLanguage, changeLearningLanguage } = useUserContext()

	const languages = [
		{
			lang: 'fr',
			name: t('french'),
		},
		{
			lang: 'ru',
			name: t('russian'),
		},
	]

	// Helper pour obtenir le drapeau selon la langue
	const getFlag = (langCode, size = 32) => {
		if (langCode === 'fr') return <FrenchFlag size={size} />
		if (langCode === 'ru') return <RussianFlag size={size} />
		return null
	}

	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleLanguageChange = lang => {
		setAnchorEl(null)
		changeLearningLanguage(lang)
	}

	return (
		<Box>
			{/* Version desktop - bouton complet */}
			<Button
				id='demo-customized-button'
				aria-controls={open ? 'demo-customized-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				variant='contained'
				disableElevation
				onClick={handleClick}
				startIcon={<TranslateRounded sx={{ fontSize: '1.3rem' }} />}
				endIcon={
					<ExpandMoreRounded
						sx={{
							fontSize: '1.3rem',
							transition: 'transform 0.3s ease',
							transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
						}}
					/>
				}
				sx={{
					display: { xs: 'none', sm: 'flex' },
					background: 'rgba(255, 255, 255, 0.15)',
					backdropFilter: 'blur(10px)',
					color: 'white',
					fontWeight: 600,
					textTransform: 'none',
					px: 2.5,
					py: 0.75,
					borderRadius: 2.5,
					border: '1px solid rgba(255, 255, 255, 0.2)',
					transition: 'all 0.3s ease',
					gap: 1,
					'&:hover': {
						background: 'rgba(255, 255, 255, 0.25)',
						transform: 'translateY(-2px) scale(1.02)',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
					},
					'&:active': {
						transform: 'scale(0.98)',
					},
				}}>
				<Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
					{t('learn')}
				</Typography>

				{userLearningLanguage && (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 26,
							height: 26,
							borderRadius: '50%',
							overflow: 'hidden',
							border: '2px solid rgba(255, 255, 255, 0.3)',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
						}}>
						{getFlag(userLearningLanguage, 26)}
					</Box>
				)}
			</Button>

			{/* Version mobile - IconButton compact avec drapeau */}
			<IconButton
				id='demo-customized-button-mobile'
				aria-controls={open ? 'demo-customized-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				sx={{
					display: { xs: 'flex', sm: 'none' },
					width: '44px',
					height: '44px',
					background: 'rgba(255, 255, 255, 0.15)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					transition: 'all 0.3s ease',
					position: 'relative',
					'&:hover': {
						background: 'rgba(255, 255, 255, 0.25)',
						transform: 'scale(1.08)',
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
					},
					'&:active': {
						transform: 'scale(0.95)',
					},
				}}>
				{userLearningLanguage && (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: 28,
							height: 28,
							borderRadius: '50%',
							overflow: 'hidden',
							border: '2px solid rgba(255, 255, 255, 0.4)',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
						}}>
						{getFlag(userLearningLanguage, 28)}
					</Box>
				)}
				<TranslateRounded
					sx={{
						position: 'absolute',
						bottom: -2,
						right: -2,
						fontSize: '0.9rem',
						color: 'white',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						borderRadius: '50%',
						padding: '2px',
						boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
					}}
				/>
			</IconButton>

			<StyledMenu
				id='demo-customized-menu'
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}>
				{languages.map(language => {
					const isSelected = userLearningLanguage === language.lang
					return (
						<MenuItem
							key={language.lang}
							onClick={() => handleLanguageChange(language.lang)}
							disableRipple
							sx={{
								backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
								position: 'relative',
								'&:hover': {
									backgroundColor: isSelected
										? 'rgba(102, 126, 234, 0.12)'
										: 'rgba(102, 126, 234, 0.08)',
								},
							}}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: 32,
									height: 32,
									borderRadius: '50%',
									overflow: 'hidden',
									border: isSelected
										? '2px solid #667eea'
										: '2px solid rgba(0, 0, 0, 0.1)',
									boxShadow: isSelected
										? '0 2px 8px rgba(102, 126, 234, 0.3)'
										: '0 1px 3px rgba(0, 0, 0, 0.1)',
									transition: 'all 0.2s ease',
								}}>
								{getFlag(language.lang, 32)}
							</Box>
							<Typography
								sx={{
									fontWeight: isSelected ? 600 : 500,
									color: isSelected ? '#667eea' : '#2d3748',
									flex: 1,
								}}>
								{language.name}
							</Typography>
							{isSelected && (
								<CheckCircleRounded
									sx={{
										fontSize: '1.2rem',
										color: '#667eea',
										animation: 'checkAppear 0.3s ease',
										'@keyframes checkAppear': {
											'0%': {
												opacity: 0,
												transform: 'scale(0.5)',
											},
											'100%': {
												opacity: 1,
												transform: 'scale(1)',
											},
										},
									}}
								/>
							)}
						</MenuItem>
					)
				})}
			</StyledMenu>
		</Box>
	)
}

export default LanguageMenu
