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
