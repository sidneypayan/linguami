import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faMusic, faFileAudio } from '@fortawesome/free-solid-svg-icons'
import styles from '../styles/sections/SectionCard.module.css'
import { useRouter } from 'next/router'

const SectionCard = ({ material }) => {
	const router = useRouter()
	const { section } = router.query

	const changeLevelName = level => {
		let newLevel
		if (material.level === 'débutant') newLevel = 'A1/A2'
		if (material.level === 'intermédiaire') newLevel = 'B1/B2'
		if (material.level === 'avancé') newLevel = 'C1/C2'

		return newLevel
	}

	const changeBackgroundColorRegardingLevel = level => {
		let background
		if (material.level === 'débutant') background = `${styles.level} beginner`
		if (material.level === 'intermédiaire')
			background = `${styles.level} intermediate`
		if (material.level === 'avancé') background = `${styles.level} advanced`
		return background
	}

	const changeIconRegardingSection = section => {
		let icon
		if (
			material.section === 'dialogue' ||
			material.section === 'culture' ||
			material.section === 'slice-of-life' ||
			material.section === 'place' ||
			material.section === 'book' ||
			material.section === 'podcast'
		) {
			icon = faFileAudio
		}
		if (
			material.section === 'rock' ||
			material.section === 'pop' ||
			material.section === 'trad' ||
			material.section === 'variety' ||
			material.section === 'kids'
		) {
			icon = faMusic
		}
		if (
			material.section === 'trailer' ||
			material.section === 'extract' ||
			material.section === 'cartoon' ||
			material.section === 'eralash' ||
			material.section === 'diverse' ||
			material.section === 'galileo'
		) {
			icon = faFilm
		}
		return icon
	}

	return (
		<div className={styles.container}>
			<Link
				href={`/materials/${material.section}/${
					section === 'book' ? material.id + 1 : material.id
				}`}>
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
					}`}>
					<a href=''>
						<h4 className={styles.title}>
							{material.title_ru.length > 20
								? material.title_ru.slice(0, 20) + '...'
								: material.title_ru}
						</h4>
					</a>
				</Link>

				<div className={styles.infoContainer}>
					<div>
						<h5 className={styles.titleTranslation}>
							{material.title_ru.length > 20
								? material.title_ru.slice(0, 20) + '...'
								: material.title_ru}
						</h5>
					</div>
				</div>
			</div>
			<div className={styles.icon}>
				<FontAwesomeIcon
					icon={changeIconRegardingSection(material.section)}
					size='2xl'
				/>
			</div>
			<span className={changeBackgroundColorRegardingLevel(material.level)}>
				{changeLevelName(material.level)}
			</span>
		</div>
	)
}

export default SectionCard
