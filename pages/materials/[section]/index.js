import Image from 'next/image'
import SectionCard from '../../../components/SectionCard'
import LevelBar from '../../../components/layouts/LevelBar'
import Pagination from '../../../components/layouts/Pagination'
import styles from '../../../styles/sections/Sections.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { getMaterials } from '../../../features/materials/materialsSlice'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Section = () => {
	const router = useRouter()
	const { section } = router.query
	const dispatch = useDispatch()
	const { materials, materials_loading } = useSelector(store => store.materials)

	useEffect(() => {
		if (section) {
			dispatch(getMaterials(section))
		}
	}, [section])

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
			<LevelBar />
			<div className={styles.container}>
				{materials.map(material => (
					<SectionCard key={material.id} material={material} />
				))}
			</div>
			<Pagination />
		</>
	)
}

export default Section
