import { useUserContext } from '../../context/user.js'
import { useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import {
	Avatar,
	Box,
	Divider,
	IconButton,
	Link,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
} from '@mui/material'
import {
	Article,
	KeyboardArrowDown,
	Logout,
	MenuBook,
	Settings,
} from '@mui/icons-material'

const UserMenu = () => {
	const { t, lang } = useTranslation()
	const { user, userProfile, logout } = useUserContext()

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
					<Avatar sx={{ width: 32, height: 32 }}>{userProfile?.name[0]}</Avatar>
					<KeyboardArrowDown sx={{ color: '#fff', marginLeft: '.5rem' }} />
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
				{/* <MenuItem>
					<Avatar /> My account
				</MenuItem>
				<Divider /> */}
				<MenuItem component={Link} href='/dictionary'>
					<ListItemIcon>
						<MenuBook />
					</ListItemIcon>
					{t('common:mydictionary')}
				</MenuItem>
				<MenuItem component={Link} href='/my-materials'>
					<ListItemIcon>
						<Article />
					</ListItemIcon>
					{t('common:mymaterials')}
				</MenuItem>
				<Divider />
				{/* <MenuItem>
					<ListItemIcon>
						<Settings />
					</ListItemIcon>
					Settings
				</MenuItem> */}
				<MenuItem onClick={() => logout()}>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	)
}

export default UserMenu
