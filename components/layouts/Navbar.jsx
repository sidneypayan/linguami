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
import { GiBookmarklet } from 'react-icons/gi'
import { HiOutlineAcademicCap } from 'react-icons/hi'

const Navbar = () => {
	const { user, userProfile, isUserLoggedIn, logout, toggleMember } =
		useUserContext()
	const [isNavExpanded, setIsNavExpanded] = useState(false)

	const handleClickOnLogin = type => {
		if (type === 'login') {
			toggleMember(true)
		}

		if (type === 'register') {
			toggleMember(false)
		}

		setIsNavExpanded(!isNavExpanded)
	}

	return (
		<nav className={styles.nav}>
			<div className={`${styles.container} ${isNavExpanded && styles.show}`}>
				<ul className={styles.menuContainer}>
					<Link href='/'>
						<li onClick={() => setIsNavExpanded(false)}>Accueil</li>
					</Link>
					<Link href='/materials'>
						<li onClick={() => setIsNavExpanded(false)}>Materiel</li>
					</Link>
					<Link href='/blog'>
						<li onClick={() => setIsNavExpanded(false)}>Blog</li>
					</Link>
				</ul>

				{isUserLoggedIn ? (
					<UserMenu />
				) : (
					<div className={styles.btnContainer}>
						<Link href='/register'>
							<button
								onClick={() => handleClickOnLogin('login')}
								className={`mainBtn ${styles.btn} ${styles.loginBtn}`}>
								Se connecter
							</button>
						</Link>
						{/* 
						<Link href='/register'>
							<button
								onClick={() => handleClickOnLogin('register')}
								className={`mainBtn login ${styles.btn} ${styles.registerBtn}`}>
								S&apos;inscrire
							</button>
						</Link> */}
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
				<div className={styles.educationalMenuContainer}>
					{isUserLoggedIn && (
						<ul>
							<Link href='/dictionary'>
								<li>
									<GiBookmarklet />
									<span>Mon dictionnaire</span>
								</li>
							</Link>
							<Link href='/my-materials'>
								<li>
									<HiOutlineAcademicCap />
									<span>Mes matériels</span>
								</li>
							</Link>
						</ul>
					)}
					<FontAwesomeIcon
						onClick={() => setIsNavExpanded(!isNavExpanded)}
						className={styles.mobileIconOpen}
						icon={faBars}
						size='xl'
					/>
				</div>
			)}
		</nav>
	)
}

export default Navbar
