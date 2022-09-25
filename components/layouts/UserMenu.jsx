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
import styles from '../../styles/UserMenu.module.css'

const UserMenu = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { user, userProfile, logout } = useUserContext()

	const ref = useRef()

	useEffect(() => {
		const checkIfClickedOutside = e => {
			if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
				setIsMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', checkIfClickedOutside)

		return () => {
			document.removeEventListener('mousedown', checkIfClickedOutside)
		}
	}, [isMenuOpen])

	return (
		<div ref={ref} className={styles.wrapper}>
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
							<span>Réglages</span>
						</li>
						<li>
							<FontAwesomeIcon icon={faRightFromBracket} size='lg' />
							<span onClick={() => logout()}>Se déconnecter</span>
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

export default UserMenu
