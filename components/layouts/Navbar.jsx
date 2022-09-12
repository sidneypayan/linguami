import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import styles from '../../styles/Navbar.module.css'

const Navbar = () => {
	const [isNavExpanded, setIsNavExpanded] = useState(false)

	return (
		<nav className={styles.nav}>
			<div className={`${styles.container} ${isNavExpanded && styles.show}`}>
				<ul className={styles.menuContainer}>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/'>Accueil</Link>
					</li>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/material'>Materiel</Link>
					</li>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/cours'>Cours</Link>
					</li>
					<li onClick={() => setIsNavExpanded(false)}>
						<Link href='/blog'>Blog</Link>
					</li>
				</ul>

				<div className={styles.btnContainer}>
					<button className={`mainBtn ${styles.btn} ${styles.loginBtn}`}>
						Se connecter
					</button>
					<button
						className={`mainBtn login ${styles.btn} ${styles.registerBtn}`}>
						S'inscrire
					</button>
				</div>

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
