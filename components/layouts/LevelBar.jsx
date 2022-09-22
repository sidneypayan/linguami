import Link from 'next/link'
import styles from '../../styles/LevelBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { filterMaterials } from '../../features/materials/materialsSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

const LevelBar = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { section } = router.query

	return (
		<div className={styles.container}>
			<div className={styles.tooltip}>
				<p
					onClick={() =>
						dispatch(filterMaterials({ section, level: 'débutant' }))
					}
					className={styles.icon}>
					A1/A2
				</p>
				<span className={styles.tooltiptext}>Débutant</span>
			</div>
			<div className={styles.tooltip}>
				<p
					onClick={() =>
						dispatch(filterMaterials({ section, level: 'intermédiaire' }))
					}
					className={styles.icon}>
					B1/B2
				</p>
				<span className={styles.tooltiptext}>Intermédiaire</span>
			</div>
			<div className={styles.tooltip}>
				<p
					onClick={() =>
						dispatch(filterMaterials({ section, level: 'avancé' }))
					}
					className={styles.icon}>
					C1/C2
				</p>
				<span className={styles.tooltiptext}>Avancé</span>
			</div>
			<div className={styles.tooltip}>
				<p className={styles.icon}>
					<FontAwesomeIcon icon={faArrowRotateLeft} size='lg' />
				</p>
				<span className={styles.tooltiptext}>Montrer tout</span>
			</div>
		</div>
	)
}

export default LevelBar
