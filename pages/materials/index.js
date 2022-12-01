import styles from '../../styles/materials/Materials.module.css'
import MaterialsCarousel from '../../components/materials/MaterialsCarousel'
import { materials } from '../../data/materials'
import Head from 'next/head'
import { Container, Typography } from '@mui/material'

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
			<div style={{ margin: '10rem auto' }} className={styles.container}>
				<Typography variant='h5'>Textes & Audio</Typography>
				<MaterialsCarousel materials={textes} />
				<Typography variant='h5'>Vidéos</Typography>
				<MaterialsCarousel materials={video} />
				<Typography variant='h5'>Musique</Typography>
				<MaterialsCarousel materials={music} />
			</div>
		</>
	)
}

export default Material
