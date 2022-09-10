import Image from 'next/image'
import styles from '../../styles/Teacher.module.css'

const Teacher = () => {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.teacherContainer}>
					<h3 className={styles.title}>Apprendre avec un locuteur natif</h3>
					<p>
						Prenez des cours à distance avec un professeur diplômé et
						bénéfissiez d'un apprentissage personnalisé.
					</p>
					<button className={`${styles.btn} btn`}>Commencez !</button>
				</div>
				<Image src='/img/teacher.png' alt='teacher' width={200} height={200} />
			</div>
			<hr className='hr' />
		</>
	)
}

export default Teacher
