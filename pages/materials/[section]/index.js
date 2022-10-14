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
	getUserMaterialsStatus,
	filterMaterials,
} from '../../../features/materials/materialsSlice'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Section = () => {
	const router = useRouter()
	const { section } = router.query
	const dispatch = useDispatch()
	const {
		materials_loading,
		filtered_materials: materials,
		user_materials_status: user_materials,
		level,
		sliceStart,
		sliceEnd,
		numOfPages,
	} = useSelector(store => store.materials)

	const checkIfUserMaterialIsInMaterials = id => {
		const matchingMaterials = user_materials.find(
			userMaterial => userMaterial.material_id === id
		)
		return matchingMaterials
	}

	useEffect(() => {
		if (section) {
			dispatch(getMaterials(section))
			dispatch(getUserMaterialsStatus(section))
		}
	}, [section, dispatch])

	useEffect(() => {
		if (level) {
			dispatch(filterMaterials({ section, level }))
		}
	}, [section, level, dispatch])

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
				className='back-arrow'
				icon={faArrowLeft}
				size='2xl'
			/>
			<div className={styles.sectionsWrapper}>
				<LevelBar />
				<div className={styles.container}>
					{materials.slice(sliceStart, sliceEnd).map(material => {
						return (
							<SectionCard
								checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(
									material.id
								)}
								key={material.id}
								material={material}
							/>
						)
					})}
				</div>
				{numOfPages > 1 && <Pagination />}
			</div>
		</>
	)
}

export default Section
