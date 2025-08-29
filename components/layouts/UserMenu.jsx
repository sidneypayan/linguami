import useTranslation from 'next-translate/useTranslation'
import { useUserContext } from '../../context/user.js'
import { useState } from 'react'
import {
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
} from '@mui/material'
import { Article, Logout, MenuBook, AccountCircle } from '@mui/icons-material'
// import LanguageMenu from './LanguageMenu.jsx'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { cleanUserMaterialStatus } from '../../features/materials/materialsSlice.js'

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
					sx={{ ml: 2 }}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={open ? 'true' : undefined}>
					<AccountCircle sx={{ color: '#fff', fontSize: '2rem' }} />
				</IconButton>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
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
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
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
			</Menu>
		</>
	)
}

export default UserMenu
