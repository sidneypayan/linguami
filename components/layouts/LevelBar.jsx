import styles from '../../styles/LevelBar.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons'
import {
	filterMaterials,
	showAllMaterials,
} from '../../features/materials/materialsSlice'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { searchMaterial } from '../../features/materials/materialsSlice'

const LevelBar = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { section } = router.query
	const [search, setSearch] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		dispatch(searchMaterial(search))
	}

	const handleClear = () => {
		dispatch(showAllMaterials())
		setSearch('')
	}

	return (
		<div className={styles.filtersContainer}>
			<form onSubmit={handleSubmit} className={styles.searchContainer}>
				<input
					type='text'
					placeholder='Rechercher...'
					name='search'
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<button>
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</form>
			<div className={styles.lvlContainer}>
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
					<p onClick={handleClear} className={styles.icon}>
						<FontAwesomeIcon icon={faArrowRotateLeft} size='lg' />
					</p>
					<span className={styles.tooltiptext}>Montrer tout</span>
				</div>
			</div>
		</div>
	)
}

export default LevelBar
