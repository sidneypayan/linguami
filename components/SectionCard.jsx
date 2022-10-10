import Image from 'next/image'
import Link from 'next/link'
import { sections } from '../data/sections'
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

		if (sections.audio.includes(section)) {
			icon = faFileAudio
		}
		if (sections.music.includes(section)) {
			icon = faMusic
		}
		if (sections.video.includes(section)) {
			icon = faFilm
		}

		return icon
	}

	return (
		<div className={styles.container}>
			<div className={styles.imgContainer}>
				<Link
					href={`/materials/${material.section}/${
						section === 'book' ? material.id + 1 : material.id
					}`}>
					<Image
						src={`https://linguami.s3.eu-west-3.amazonaws.com/images/${material.img}`}
						layout='fill'
						objectFit='cover'
						quality={100}
						alt={material.title}
						loading='eager'
					/>
				</Link>
			</div>
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
