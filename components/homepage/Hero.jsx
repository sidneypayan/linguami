import Image from 'next/image'
import styles from '../../styles/Hero.module.css'

const Hero = () => {
	return (
		<div className={styles.container}>
			<div className={styles.titleContainer}>
				<h2 className={styles.title}>
					Linguami, <br />
					bien plus qu'un site de langue !
				</h2>
				<p className={styles.subtitle}>
					Apprenez une langue moderne et parlée par les locuteurs natifs.
					Découvrez une culture et rejoignez une communauté basée sur l'entraide
					et l'amitié entre les peuples.
				</p>
				<button className={`${styles.btn} btn`}>Commencez !</button>
			</div>
			<Image
				className={styles.img}
				src='/img/bear.png'
				alt='bear'
				width={200}
				height={200}
				objectFit='contain'
			/>
		</div>
	)
}

export default Hero
