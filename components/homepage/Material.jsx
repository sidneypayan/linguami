import Image from 'next/image'
import styles from '../../styles/Material.module.css'

const Material = () => {
	return (
		<div className={styles.container}>
			<h3 className={styles.title}>Apprentissage multisupport</h3>
			<div className={styles.materialContainer}>
				<div className={styles.materialItem}>
					<Image src='/img/video.png' alt='video' width={100} height={100} />
					<h4>Video</h4>
					<p>
						Extraits de films, bandes-annonces, clips musicaux, découvrez nos
						ressources vidéos pour apprendre tout en vous divertissant.
					</p>
				</div>
				<div className={styles.materialItem}>
					<Image src='/img/audio.png' alt='audio' width={100} height={100} />
					<h4>Audio</h4>
					<p>
						Dialogues, chansons, audiobooks, évadez-vous avec nos contenus
						audio.
					</p>
				</div>
				<div className={styles.materialItem}>
					<Image src='/img/text.png' alt='text' width={100} height={100} />
					<h4>Textes</h4>
					<p>
						Découvrez nos textes sur la culture, les mythes et légendes, plongez
						vous dans des histoires toutes plus passionantes les unes que les
						autres.
					</p>
				</div>
			</div>
			<br />
			<hr className='hr' />
		</div>
	)
}

export default Material
