import styles from '../../styles/materials/Materials.module.css'
import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials } from '../../data/materials'

const Material = () => {
	const textes = materials.filter(
		material => material.category === 'text & audio'
	)
	const video = materials.filter(material => material.category === 'video')
	const music = materials.filter(material => material.category === 'music')
	return (
		<div className={styles.container}>
			<h4 className={styles.carouselTitle}>Textes & Audio</h4>
			<MaterialsCarousel materials={textes} />
			<h4 className={styles.carouselTitle}>Vidéos</h4>
			<MaterialsCarousel materials={video} />
			<h4 className={styles.carouselTitle}>Musique</h4>
			<MaterialsCarousel materials={music} />
		</div>
	)
}

export default Material
