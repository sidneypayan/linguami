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
import { useState } from 'react'
import styles from '../../styles/UserMenu.module.css'

const UserMenu = () => {
	const [isMenuDisplayed, setIsMenuDisplayed] = useState(false)
	const { user, userProfile, logout } = useUserContext()

	return (
		<div className={styles.wrapper}>
			<div
				className={styles.userNameContainer}
				onClick={() => setIsMenuDisplayed(!isMenuDisplayed)}>
				<FontAwesomeIcon
					className={styles.userNameIcon}
					icon={faUser}
					size='l'
				/>
				<span className={styles.userNameText}>{userProfile?.name}</span>
			</div>
			{isMenuDisplayed && (
				<div className={styles.userMenucontainer}>
					<ul>
						<li>
							<FontAwesomeIcon icon={faGear} size='l' />
							<span>Réglages</span>
						</li>
						<li>
							<FontAwesomeIcon icon={faRightFromBracket} size='l' />
							<span onClick={() => logout()}>Se déconnecter</span>
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

export default UserMenu
