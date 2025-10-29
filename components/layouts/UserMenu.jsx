import useTranslation from 'next-translate/useTranslation'
import { useUserContext } from '../../context/user.js'
import { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import {
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
} from '@mui/material'
import { Article, Logout, MenuBook, AccountCircle } from '@mui/icons-material'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { cleanUserMaterialStatus } from '../../features/materials/materialsSlice.js'

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
		minWidth: 200,
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
			'& .MuiListItemIcon-root': {
				minWidth: 36,
			},
			'& .MuiSvgIcon-root': {
				fontSize: 20,
				color: theme.palette.primary.main,
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
		'& .MuiDivider-root': {
			margin: '8px 0',
		},
		'&:before': {
			content: '""',
			display: 'block',
			position: 'absolute',
			top: 0,
			right: 14,
			width: 10,
			height: 10,
			bgcolor: 'background.paper',
			transform: 'translateY(-50%) rotate(45deg)',
			zIndex: 0,
		},
	},
}))

const UserMenu = () => {
	const { t, lang } = useTranslation('common')
	const { user, userProfile, logout } = useUserContext()
	const dispatch = useDispatch()

	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)
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
				}}>
				<IconButton
					onClick={handleClick}
					size='small'
					sx={{
						ml: 2,
						background: 'rgba(255, 255, 255, 0.15)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(255, 255, 255, 0.2)',
						transition: 'all 0.2s ease',
						'&:hover': {
							background: 'rgba(255, 255, 255, 0.25)',
							transform: 'translateY(-2px)',
						},
					}}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={open ? 'true' : undefined}>
					<AccountCircle sx={{ color: '#fff', fontSize: '2rem' }} />
				</IconButton>
			</Box>
			<StyledMenu
				id='account-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				onClick={handleClose}>
				<Link href='/dictionary'>
					<MenuItem>
						<ListItemIcon>
							<MenuBook />
						</ListItemIcon>
						{t('mydictionary')}
					</MenuItem>
				</Link>
				<Link href='/my-materials'>
					<MenuItem>
						<ListItemIcon>
							<Article />
						</ListItemIcon>
						{t('mymaterials')}
					</MenuItem>
				</Link>
				<Divider />

				<MenuItem
					onClick={() => {
						logout()
						dispatch(cleanUserMaterialStatus())
					}}>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					{t('logout')}
				</MenuItem>
			</StyledMenu>
		</>
	)
}

export default UserMenu
