import useTranslation from 'next-translate/useTranslation'
import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Image from 'next/image'
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useUserContext } from '../../context/user.js'

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
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:hover': {
				backgroundColor: alpha(theme.palette.primary.main, 0.08),
				transform: 'translateX(4px)',
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
			href: 'fr.png',
		},
		{
			lang: 'ru',
			name: t('russian'),
			href: 'ru.png',
		},
	]
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
			<Button
				id='demo-customized-button'
				aria-controls={open ? 'demo-customized-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				variant='contained'
				disableElevation
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
				sx={{
					background: 'rgba(255, 255, 255, 0.15)',
					backdropFilter: 'blur(10px)',
					color: 'white',
					fontWeight: 600,
					textTransform: 'none',
					px: 2,
					borderRadius: 2,
					border: '1px solid rgba(255, 255, 255, 0.2)',
					transition: 'all 0.2s ease',
					'&:hover': {
						background: 'rgba(255, 255, 255, 0.25)',
						transform: 'translateY(-2px)',
					},
				}}>
				<Typography variant='body2' sx={{ marginRight: '.5rem', fontWeight: 600 }}>
					{t('learn')}
				</Typography>

				{userLearningLanguage && (
					<Image
						alt={userLearningLanguage}
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${userLearningLanguage}.png`}
						width={25}
						height={25}
					/>
				)}
			</Button>

			<StyledMenu
				id='demo-customized-menu'
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}>
				{languages.map(language => (
					<MenuItem
						key={language.lang}
						onClick={() => handleLanguageChange(language.lang)}
						disableRipple>
						<Image
							style={{ margin: 0 }}
							alt={language.name}
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${language.href}`}
							width={25}
							height={25}
						/>
						<Typography sx={{ marginLeft: '.5rem', fontWeight: '500' }}>
							{language.name}
						</Typography>
					</MenuItem>
				))}
			</StyledMenu>
		</Box>
	)
}

export default LanguageMenu
