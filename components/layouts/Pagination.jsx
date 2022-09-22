import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/Pagination.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { changePage } from '../../features/materials/materialsSlice'
import { useRouter } from 'next/router'

const Pagination = () => {
	const { numOfPages, page, totalMaterials, materialsPerPage } = useSelector(
		store => store.materials
	)
	const dispatch = useDispatch()
	const router = useRouter()

	const { section } = router.query

	const pages = Array.from({ length: numOfPages }, (_, index) => {
		return index + 1
	})

	const nextPage = () => {
		let newPage = page + 1

		if (newPage > numOfPages) {
			newPage = 1
		}
		dispatch(changePage(newPage))
	}

	const prevPage = () => {
		let newPage = page - 1

		if (newPage < 1) {
			newPage = numOfPages
		}
		dispatch(changePage(newPage))
	}

	return (
		<div className={styles.container}>
			<button onClick={prevPage} className={styles.arrowBtn}>
				<FontAwesomeIcon icon={faArrowLeft} />
			</button>
			{pages.map(pageNumber => (
				<button
					key={pageNumber}
					className={pageNumber === page && styles.pageBtnActive}
					onClick={() => dispatch(changePage(pageNumber))}>
					{pageNumber}
				</button>
			))}
			<button onClick={nextPage} className={styles.arrowBtn}>
				<FontAwesomeIcon icon={faArrowRight} />
			</button>
		</div>
	)
}

export default Pagination
