import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/sections/SectionCard.module.css'

const SectionCard = ({ material, img }) => {
	return (
		<div className={styles.container}>
			<Link href={`/materials/${material.section}/${material.id}`}>
				<a href=''>
					<div
						className={styles.img}
						style={{
							backgroundImage: `url(${img}${material.img})`,
						}}></div>
				</a>
			</Link>
			<div className={styles.textContainer}>
				<Link href={`/materials/${material.section}/${material.id}`}>
					<a href=''>
						<h4 className={styles.title}>{material.title}</h4>
					</a>
				</Link>
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
