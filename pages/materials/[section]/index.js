import Image from 'next/image'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import SectionCard from '../../../components/SectionCard'
import LevelBar from '../../../components/layouts/LevelBar'
import Pagination from '../../../components/layouts/Pagination'
import styles from '../../../styles/sections/Sections.module.css'
import { useSelector, useDispatch } from 'react-redux'
import {
	getMaterials,
	filterMaterials,
} from '../../../features/materials/materialsSlice'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import BookMenu from '../../../components/layouts/BookMenu'
// import { supabase } from '../../../lib/supabase'

const Section = () => {
	const router = useRouter()
	const { section } = router.query
	const dispatch = useDispatch()
	const {
		materials_loading,
		filtered_materials: materials,
		level,
		page,
		sliceStart,
		sliceEnd,
		numOfPages,
	} = useSelector(store => store.materials)

	// const [isBookMenuOpen, setIsBookMenuOpen] = useState(false)
	// const [bookName, setBookName] = useState(null)
	// const [chapters, setChapters] = useState(null)

	// const toggleBookMenu = bookName => {
	// 	setIsBookMenuOpen(!isBookMenuOpen)
	// 	setBookName(bookName)
	// }
	// const closeBookMenu = () => {
	// 	setIsBookMenuOpen(false)
	// }

	// const left = () => {
	// 	if (isBookMenuOpen) return 0
	// 	return '300px'
	// }

	// const getChapters = async bookName => {
	// 	let { data: chapters, error } = await supabase
	// 		.from('materials')
	// 		.select('*')
	// 		.eq('lang', 'ru')
	// 		.eq('section', 'book-chapter')
	// 		.eq('book_name', bookName)
	// 		.order('id')

	// 	if (error) {
	// 		console.log(error)
	// 	}

	// 	setChapters(chapters)
	// }

	// useEffect(() => {
	// 	if (bookName) {
	// 		getChapters(bookName)
	// 	}
	// }, [bookName])

	useEffect(() => {
		if (section) {
			dispatch(getMaterials(section))
		}
	}, [section, dispatch])

	useEffect(() => {
		if (level) {
			dispatch(filterMaterials({ section, level }))
		}
	}, [level, dispatch])

	if (materials_loading) {
		return (
			<div className='loader'>
				<Image
					src='/img/loader.gif'
					width={200}
					height={200}
					alt='loader'></Image>
			</div>
		)
	}

	return (
		<>
			<FontAwesomeIcon
				onClick={() => router.back()}
				className='back-arrow '
				icon={faArrowLeft}
				size='2xl'
			/>
			<div className={styles.sectionsWrapper}>
				<LevelBar />
				<div className={styles.container}>
					{/* <div style={{ left: left() }} className={styles.bookMenu}>
						<BookMenu
							isBookMenuOpen={isBookMenuOpen}
							closeBookMenu={closeBookMenu}
							chapters={chapters}
						/>
					</div> */}
					{materials.slice(sliceStart, sliceEnd).map(material => {
						const bookName = material.book_name || null
						return <SectionCard key={material.id} material={material} />
					})}
				</div>
				{numOfPages > 1 && <Pagination />}
			</div>
		</>
	)
}

export default Section
