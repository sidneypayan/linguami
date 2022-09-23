import Link from 'next/link'
import styles from '../../styles/Navbar.module.css'
import { useState } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useUserContext } from '../../context/user.js'
import UserMenu from './UserMenu'

const Navbar = () => {
	const { user, userProfile, isUserLoggedIn, logout } = useUserContext()
	const [isNavExpanded, setIsNavExpanded] = useState(false)

	return (
		<nav className={styles.nav}>
			<div className={`${styles.container} ${isNavExpanded && styles.show}`}>
				<ul className={styles.menuContainer}>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/'>Accueil</Link>
					</li>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/materials'>Materiel</Link>
					</li>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/cours'>Cours</Link>
					</li>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/blog'>Blog</Link>
					</li>
				</ul>

				{isUserLoggedIn ? (
					<UserMenu />
				) : (
					<div className={styles.btnContainer}>
						<Link href='/login'>
							<button
								onClick={() => setIsNavExpanded(false)}
								className={`mainBtn ${styles.btn} ${styles.loginBtn}`}>
								Se connecter
							</button>
						</Link>

						<Link href='/register'>
							<button
								onClick={() => setIsNavExpanded(false)}
								className={`mainBtn login ${styles.btn} ${styles.registerBtn}`}>
								S&apos;inscrire
							</button>
						</Link>
					</div>
				)}

				{isNavExpanded && (
					<FontAwesomeIcon
						onClick={() => setIsNavExpanded(!isNavExpanded)}
						className={styles.mobileIconClose}
						icon={faXmark}
						size='xl'
					/>
				)}
			</div>
			{!isNavExpanded && (
				<FontAwesomeIcon
					onClick={() => setIsNavExpanded(!isNavExpanded)}
					className={styles.mobileIconOpen}
					icon={faBars}
					size='xl'
				/>
			)}
		</nav>
	)
}

export default Navbar
