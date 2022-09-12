import styles from '../../styles/SectionPage.module.css'
import SectionCard from '../../components/material/SectionCard'
import LevelBar from '../../components/layouts/LevelBar'
import Pagination from '../../components/layouts/Pagination'

const Section = () => {
	return (
		<>
			<LevelBar />
			<div className={styles.container}>
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/rostov.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/kurshskaja_kosa.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/petergof.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/krasnaja_ploshhad.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/plato_ukok.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/mamaev_kurgan.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/vottovaara.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/halaktyrskij_pljazh.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/vottovaara.jpg' />
				<SectionCard img='https://linguami.s3.eu-west-3.amazonaws.com/images/halaktyrskij_pljazh.jpg' />
			</div>
			<Pagination />
		</>
	)
}

export default Section
