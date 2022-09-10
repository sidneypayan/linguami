import Link from 'next/link'
import styles from '../styles/Nav.module.css'

const Nav = () => {
	return (
		<div className={styles.container}>
			<nav>
				<ul className={styles.menuContainer}>
					<li>
						<Link href='/'>Accueil</Link>
					</li>
					<li>
						<Link href='/material'>Materiel</Link>
					</li>
					<li>
						<Link href='/cours'>Cours</Link>
					</li>
					<li>
						<Link href='/blog'>Blog</Link>
					</li>
				</ul>
			</nav>
			<div className={styles.btnContainer}>
				<button className={`btn ${styles.btn} ${styles.loginBtn}`}>
					Se connecter
				</button>
				<button className={`btn login ${styles.btn} ${styles.registerBtn}`}>
					S'inscrire
				</button>
			</div>
		</div>
	)
}

export default Nav
