import Image from 'next/image'
import Link from 'next/link'
import { sections } from '../data/sections'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faFilm,
	faMusic,
	faFileAudio,
	faCircleCheck,
} from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import styles from '../styles/sections/SectionCard.module.css'
import { useRouter } from 'next/router'
const SectionCard = ({ material, checkIfUserMaterialIsInMaterials }) => {
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
			{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
				checkIfUserMaterialIsInMaterials.is_being_studied && (
					<FontAwesomeIcon icon={faClock} className={styles.beingStudiedCard} />
				)}
			{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
				checkIfUserMaterialIsInMaterials.is_studied && (
					<FontAwesomeIcon
						icon={faCircleCheck}
						className={styles.studiedCard}
					/>
				)}
			<div className={styles.imgContainer}>
				<Link
					href={`/materials/${material.section}/${
						section === 'book' ? material.id + 1 : material.id
					}`}>
					<Image
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.img}`}
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
							{material.title.length > 20
								? material.title.slice(0, 20) + '...'
								: material.title}
						</h4>
					</a>
				</Link>
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
