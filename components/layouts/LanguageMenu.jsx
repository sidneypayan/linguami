import { styled, alpha } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Image from 'next/image'
import { useState } from 'react'
import { Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
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
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 100,
		color:
			theme.palette.mode === 'light'
				? 'rgb(55, 65, 81)'
				: theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
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
	const { t, lang } = useTranslation()
	const { learningLanguage, changeLearningLanguage } = useUserContext()

	const languages = [
		{
			lang: 'fr',
			name: t('common:french'),
			icon: (
				<Image
					alt='french'
					src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + '/france.png'}
					width={25}
					height={25}
				/>
			),
			href: process.env.NEXT_PUBLIC_SUPABASE_IMAGE + '/france.png',
		},
		{
			lang: 'ru',
			name: t('common:russian'),
			icon: (
				<Image
					alt='russia'
					src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + '/russia.png'}
					width={25}
					height={25}
				/>
			),
			href: process.env.NEXT_PUBLIC_SUPABASE_IMAGE + '/russia.png',
		},
	]
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = lang => {
		setAnchorEl(null)
		changeLearningLanguage(lang)
	}

	return (
		<div>
			<Button
				id='demo-customized-button'
				aria-controls={open ? 'demo-customized-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				variant='contained'
				disableElevation
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}>
				<Typography variant='body1' sx={{ marginRight: '.5rem' }}>
					{t('common:learn')}
				</Typography>
				<Image
					alt={learningLanguage}
					src={
						process.env.NEXT_PUBLIC_SUPABASE_IMAGE + `${learningLanguage}.png`
					}
					width={25}
					height={25}
				/>
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
						onClick={() => handleClose(language.lang)}
						disableRipple>
						<Image
							alt={language.name}
							src={language.href}
							width={25}
							height={25}
						/>
						<Typography sx={{ marginLeft: '.5rem', fontWeight: '500' }}>
							{language.name}
						</Typography>
					</MenuItem>
				))}

				{/* <MenuItem onClick={handleClose} disableRipple>
					<Image
						alt='french'
						src={process.env.NEXT_PUBLIC_SUPABASE_IMAGE + '/russia.png'}
						width={25}
						height={25}
					/>
					<Typography sx={{ marginLeft: '.5rem', fontWeight: '500' }}>
						{t('common:russian')}
					</Typography>
				</MenuItem> */}
			</StyledMenu>
		</div>
	)
}

export default LanguageMenu
