import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/SectionCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'

const SectionCard = ({ img }) => {
	return (
		<div className={styles.container}>
			<div
				className={styles.img}
				style={{
					backgroundImage: `url(${img})`,
				}}></div>
			<div className={styles.textContainer}>
				<h4 className={styles.title}>Ведьмы</h4>
				<div className={styles.infoContainer}>
					<div>
						<span>bandes-annonces</span>
						<span> intermédiaire</span>
					</div>
				</div>
			</div>
			<div className={styles.icon}>
				<FontAwesomeIcon icon={faFilm} size='2xl' />
			</div>
		</div>
	)
}

export default SectionCard
