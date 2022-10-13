import Image from 'next/image'
import styles from '../../styles/Teacher.module.css'
import Link from 'next/link'
import { FaSkype, FaEnvelope } from 'react-icons/fa'

const Teacher = () => {
	return (
		<div className={styles.container}>
			<Image
				width={200}
				height={200}
				className={styles.teacherPic}
				src='/img/natacha.jpg'
				alt='teacher'
			/>
			{/* <p>Contacter Natacha</p> */}
			<div className={styles.iconContainer}>
				<Link href='skype:red.fox000?chat'>
					<FaSkype />
				</Link>
				<Link href='mailto:redfox000@yandex.ru?Subject=Cours%20de%20russe'>
					<FaEnvelope />
				</Link>
			</div>

			<h2 className={`${styles.titleTeacher} 'headline'`}>
				Cours de russe par Skype
			</h2>
			<h3 className={styles.subTitleTeacher}>
				Professeure de l&apos;Alliance française <br /> diplômée de
				l&apos;université de Moscou
			</h3>
			<p className={styles.teacherText}>
				Natacha est passionnée par l&apos;apprentissage et l&apos;enseignement
				des langues. Elle vous guidera dans votre apprentissage du russe à
				travers un accompagnement personnalisé. Le russe est une langue
				compliquée, mais son apprentissage peut-être grandement facilité grâce à
				un professeur attentionné qui connaît vos difficultés et suit la bonne
				méthodologie. Grâce à son expérience avec des élèves français, elle est
				familière des difficultés que rencontrent les apprenants francophones de
				la langue russe. Elle parle aussi anglais ce qui lui permet de prendre
				en charge des élèves anglophones si besoin. Natacha est la principale
				rédactrice du contenu de ce site.
			</p>

			{/* <hr class="main-hr mt-4"> */}
			<h3 className={styles.titleAvis}>L&apos;avis des élèves</h3>

			<div className={styles.teacherAvis}>
				<div>
					<h3>David</h3>
					Natacha se donne beaucoup de mal pour préparer le cours suivant en
					fonction du besoin du moment. Les moyens pour apprendre sont sur
					mesure. Super ambiance. J&apos;attends chaque cours avec impatience.
					{/* <Image
						className={styles.avisImg}
						width={75}
						height={75}
						src='/img/avis1.png'
						alt='student one'
					/> */}
				</div>
				<div>
					<h3>Carole</h3>
					Je suis très satisfaite du cours. Natalia est attentive aux différents
					besoins des élèves, gentille et agréable. L&apos;apprentissage est
					rapide et facile grâce à sa pedagogie. Autres points forts, la
					flexibilité pour les horaires et le bon matériel didactique (livres,
					audios) mis à disposition.
					{/* <Image
						className={styles.avisImg}
						width={75}
						height={75}
						src='/img/avis2.png'
						alt='student two'
					/> */}
				</div>
				<div>
					<h3>Daniel</h3>
					Depuis 1 an j&apos;apprends le Russe avec Natacha et je suis très
					satisfait de ma professeure, je progresse facilement et j&apos;ai pu
					commencer quelques dialogues lors de 2 voyages à Saint Petersbourg. Sa
					méthode d&apos;apprentissage est facile et complète.
					{/* <Image
						className={styles.avisImg}
						width={75}
						height={75}
						src='/img/avis3.png'
						alt='student three'
					/> */}
				</div>
			</div>
		</div>
	)
}

export default Teacher
