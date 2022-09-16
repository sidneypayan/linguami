import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/SectionCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'

const SectionCard = ({ material }) => {
	return (
		<div className={styles.container}>
			<div
				className={styles.img}
				style={{
					backgroundImage: `url(${process.env.IMG_URL}${material.img})`,
				}}></div>
			<div className={styles.textContainer}>
				<h4 className={styles.title}>{material.title}</h4>
				<div className={styles.infoContainer}>
					<div>
						<span>{material.section}</span>
						<span> {material.level}</span>
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
