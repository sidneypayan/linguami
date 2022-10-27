import styles from '../../styles/materials/Materials.module.css'
import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials } from '../../data/materials'
import Head from 'next/head'

const Material = () => {
	const textes = materials.filter(
		material => material.category === 'text & audio'
	)
	const video = materials.filter(material => material.category === 'video')
	const music = materials.filter(material => material.category === 'music')
	return (
		<>
			<Head>
				<title>Linguami | Matériels</title>
				<meta
					name='description'
					content='Apprenez le russe grâce à nos sections variées et interactives. Dialogues, livres audio, extraits de films, chansons et bien plus encore vous permettront de travailler sur la langue russe de manière ludique et efficace.'
				/>
			</Head>
			<div className={styles.container}>
				<h4 className={styles.carouselTitle}>Textes & Audio</h4>
				<MaterialsCarousel materials={textes} />
				<h4 className={styles.carouselTitle}>Vidéos</h4>
				<MaterialsCarousel materials={video} />
				<h4 className={styles.carouselTitle}>Musique</h4>
				<MaterialsCarousel materials={music} />
			</div>
		</>
	)
}

export default Material
