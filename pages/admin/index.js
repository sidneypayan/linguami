import styles from '../../styles/admin/Admin.module.css'
import Link from 'next/link'
import jwtDecode from 'jwt-decode'
import { supabase } from '../../lib/supabase'

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

export const getServerSideProps = async ({ req }) => {
	if (req.cookies['sb-access-token']) {
		const decodedToken = jwtDecode(req.cookies['sb-access-token'])

		const { data: user, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', decodedToken.sub)
			.single()

		if (user.role !== 'admin') {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}
	} else {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		}
	}

	return {
		props: { user: 'user' },
	}
}

export default Admin
