import Image from 'next/image'
import styles from '../../styles/Translate.module.css'

const Translate = () => {
	return (
		<div className={styles.container}>
			<Image
				src='/img/translate.png'
				alt='translate'
				width={200}
				height={200}
			/>
			<div className={styles.teacherContainer}>
				<h3 className={styles.title}>Outlil de traduction intégré</h3>
				<p>
					Inscrivez-vous et traduisez n'importe quel mot de n'importe quel texte
				</p>
				<button className={`${styles.btn} btn`}>S'inscrire</button>
			</div>
		</div>
	)
}

export default Translate
