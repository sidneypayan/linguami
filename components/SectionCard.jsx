import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/sections/SectionCard.module.css'
import { useRouter } from 'next/router'

const SectionCard = ({ material }) => {
	const router = useRouter()
	const { section } = router.query

	const changeLevelDescription = level => {
		let newLevel
		if (material.level === 'débutant') newLevel = 'A1/A2'
		if (material.level === 'intermédiaire') newLevel = 'B1/B2'
		if (material.level === 'avancé') newLevel = 'C1/C2'

		return newLevel
	}

	const changeBackgroundLevel = level => {
		let background
		if (material.level === 'débutant') background = `${styles.level} beginner`
		if (material.level === 'intermédiaire')
			background = `${styles.level} intermediate`
		if (material.level === 'avancé') background = `${styles.level} advanced`
		return background
	}

	return (
		<div className={styles.container}>
			<Link href={`/materials/${material.section}/${material.id}`} passHref>
				<a href=''>
					<div
						className={styles.img}
						style={{
							backgroundImage: `url(https://linguami.s3.eu-west-3.amazonaws.com/images/${material.img})`,
						}}></div>
				</a>
			</Link>
			<div className={styles.textContainer}>
				<Link
					href={`/materials/${material.section}/${
						section === 'book' ? material.id + 1 : material.id
					}`}
					passHref>
					<a href=''>
						<h4 className={styles.title}>{material.title_ru.slice(0, 20)}</h4>
					</a>
				</Link>

				<div className={styles.infoContainer}>
					<div>
						{/* <span>{material.section}</span>
						<span> {material.level}</span> */}
						<h5 className={styles.titleTranslation}>
							{material.title_ru.slice(0, 20)}
						</h5>
					</div>
				</div>
			</div>
			<div className={styles.icon}>
				<FontAwesomeIcon icon={faFilm} size='2xl' />
			</div>
			{/* <span className={styles.section}>{material.section}</span> */}
			<span className={changeBackgroundLevel(material.level)}>
				{changeLevelDescription(material.level)}
			</span>
		</div>
	)
}

export default SectionCard
