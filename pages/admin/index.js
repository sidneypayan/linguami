import styles from '../../styles/admin/Admin.module.css'
import Link from 'next/link'

const Admin = () => {
	return (
		<div className='wrapper-large'>
			<Link href='/admin/create'>
				<button className={`${styles.btn} mainBtn`}> Créer un materiel</button>
			</Link>
			<h2>Sections</h2>
			<div className={styles.container}>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
				<div className={styles.adminCard}>
					<h3>Section</h3>
					<p>25</p>
				</div>
			</div>
			<h2>Derniers utilisateurs enregistrés</h2>
			<ul>
				<li>Sidney</li>
				<li>Natacha</li>
				<li>Sidney</li>
				<li>Natacha</li>
				<li>Natacha</li>
			</ul>
		</div>
	)
}

export default Admin
