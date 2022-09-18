import SectionCard from '../../../components/SectionCard'
import LevelBar from '../../../components/layouts/LevelBar'
import Pagination from '../../../components/layouts/Pagination'
import styles from '../../../styles/sections/Sections.module.css'

import supabase from '../../../utils/supabase'

export const getServerSideProps = async ({ params }) => {
	let { data: materials, error } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.eq('section', params.section)

	if (error) {
		throw new Error(error)
	}
	return {
		props: {
			materials,
			img: process.env.IMG_URL,
		},
	}
}

const Section = ({ materials, img }) => {
	return (
		<>
			<LevelBar />
			<div className={styles.container}>
				{materials.map(material => (
					<SectionCard key={material.id} material={material} img={img} />
				))}
			</div>
			<Pagination />
		</>
	)
}

export default Section
