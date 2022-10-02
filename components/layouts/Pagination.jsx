import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import styles from '../../styles/Pagination.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { changePage } from '../../features/materials/materialsSlice'
import { useEffect, useState } from 'react'

const Pagination = () => {
	const { numOfPages, page, totalMaterials, materialsPerPage } = useSelector(
		store => store.materials
	)
	const dispatch = useDispatch()

	const [sliceStart, setSliceStart] = useState(0)
	const [sliceEnd, setSliceEnd] = useState(0)

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

	useEffect(() => {
		if (page === 1) {
			setSliceStart(page)
			setSliceEnd(page + 1)
		}
		if (page === 2) {
			setSliceStart(page - 1)
			setSliceEnd(page + 1)
		}
		if (page > 2) {
			setSliceStart(page - 2)
			setSliceEnd(page + 1)
		}

		if (numOfPages == 2) {
			setSliceStart(numOfPages)
			return
		}

		if (numOfPages - page == 2) {
			setSliceEnd(page + 1)
		}

		if (numOfPages - page == 1) {
			setSliceEnd(page)
		}

		if (numOfPages === page) {
			setSliceStart(page - 2)
			setSliceEnd(page - 1)
		}
	}, [numOfPages, page])

	return (
		<div className={styles.container}>
			<button onClick={prevPage} className={styles.arrowBtn}>
				<FontAwesomeIcon icon={faArrowLeft} />
			</button>

			<button
				className={page === 1 ? styles.pageBtnActive : undefined}
				onClick={() => dispatch(changePage(1))}>
				1
			</button>

			{pages.slice(sliceStart, sliceEnd).map(pageNumber => (
				<button
					key={pageNumber}
					className={page === pageNumber ? styles.pageBtnActive : undefined}
					onClick={() => dispatch(changePage(pageNumber))}>
					{pageNumber}
				</button>
			))}

			<button
				className={page === numOfPages ? styles.pageBtnActive : undefined}
				onClick={() => dispatch(changePage(numOfPages))}>
				{numOfPages}
			</button>

			<button onClick={nextPage} className={styles.arrowBtn}>
				<FontAwesomeIcon icon={faArrowRight} />
			</button>
		</div>
	)
}

export default Pagination
