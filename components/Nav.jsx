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
						<Link href='/ressources'>Ressouces</Link>
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
				<button className={`btn ${styles.btn}`}>S'enregistrer</button>
				<button className={`btn login ${styles.btn}`}>Se connecter</button>
			</div>
		</div>
	)
}

export default Nav
