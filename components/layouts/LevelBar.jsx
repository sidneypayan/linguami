import Link from 'next/link'
import styles from '../../styles/LevelBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons'

const LevelBar = () => {
	return (
		<div className={styles.container}>
			<div className={styles.tooltip}>
				<Link href="{{route('materials.section', $section . '/débutant')}}">
					<p className={styles.icon}>A1/A2</p>
				</Link>
				<span className={styles.tooltiptext}>Débutant</span>
			</div>
			<div className={styles.tooltip}>
				<Link href="{{route('materials.section', $section . '/intermédiaire')}}">
					<p className={styles.icon}>B1/B2</p>
				</Link>
				<span className={styles.tooltiptext}>Intermédiaire</span>
			</div>
			<div className={styles.tooltip}>
				<Link href="{{route('materials.section', $section . '/avancé')}}">
					<p className={styles.icon}>C1/C2</p>
				</Link>
				<span className={styles.tooltiptext}>Avancé</span>
			</div>
			<div className={styles.tooltip}>
				<Link href="{{route('materials.section', $section)}}">
					<p className={styles.icon}>
						<FontAwesomeIcon icon={faArrowRotateLeft} size='l' />
					</p>
				</Link>
				<span className={styles.tooltiptext}>Montrer tout</span>
			</div>
		</div>
	)
}

export default LevelBar
