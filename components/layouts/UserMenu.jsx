import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faUser,
	faGear,
	faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons'
import { useUserContext } from '../../context/user.js'
import { useState, useEffect, useRef } from 'react'
// import styles from '../../styles/UserMenu.module.css'
import useTranslation from 'next-translate/useTranslation'
import {
	Avatar,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from '@mui/material'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'

const UserMenu = () => {
	const { t, lang } = useTranslation()
	// const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { user, userProfile, logout } = useUserContext()

	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)
	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	// const ref = useRef()

	// useEffect(() => {
	// 	const checkIfClickedOutside = e => {
	// 		if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
	// 			setIsMenuOpen(false)
	// 		}
	// 	}
	// 	document.addEventListener('mousedown', checkIfClickedOutside)

	// 	return () => {
	// 		document.removeEventListener('mousedown', checkIfClickedOutside)
	// 	}
	// }, [isMenuOpen])

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					textAlign: 'center',
				}}>
				<Tooltip title='Account settings'>
					<IconButton
						onClick={handleClick}
						size='small'
						sx={{ ml: 2 }}
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}>
						<Avatar sx={{ width: 32, height: 32 }}>
							{userProfile?.name[0]}
						</Avatar>
					</IconButton>
				</Tooltip>
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
				<MenuItem>
					<Avatar /> My account
				</MenuItem>
				<Divider />

				<MenuItem>
					<ListItemIcon>
						<Settings fontSize='small' />
					</ListItemIcon>
					Settings
				</MenuItem>
				<MenuItem onClick={() => logout()}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	)
}

export default UserMenu

{
	/* <div ref={ref} className={styles.wrapper}>
<div
  className={styles.userNameContainer}
  onMouseEnter={() => setIsMenuOpen(true)}
  onClick={() => setIsMenuOpen(!isMenuOpen)}>
  <FontAwesomeIcon
    className={styles.userNameIcon}
    icon={faUser}
    size='lg'
  />
  <span className={styles.userNameText}>
    {userProfile?.user_metadata.name}
  </span>
</div>
{isMenuOpen && (
  <div className={styles.userMenucontainer}>
    <ul>
      <li>
        <FontAwesomeIcon icon={faGear} size='lg' />
        <span>{t('common:settings')}</span>
      </li>
      <li>
        <FontAwesomeIcon icon={faRightFromBracket} size='lg' />
        <span onClick={() => logout()}>{t('common:logout')}</span>
      </li>
    </ul>
  </div>
)}
</div> */
}
