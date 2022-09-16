import styles from '../../styles/SectionPage.module.css'
import SectionCard from '../../components/material/SectionCard'
import LevelBar from '../../components/layouts/LevelBar'
import Pagination from '../../components/layouts/Pagination'

import supabase from '../../utils/supabase'

export const getServerSideProps = async context => {
	let { data: materials, error } = await supabase
		.from('materials')
		.select('*')
		.eq('lang', 'ru')
		.eq('section', context.params.id)

	if (error) {
		throw new Error(error)
	}
	return {
		props: {
			materials,
		},
	}
}

const Section = ({ materials }) => {
	console.log(materials)
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
