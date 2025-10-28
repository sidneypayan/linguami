import React from 'react'
import { sections } from '../data/sections'
import { useDispatch } from 'react-redux'
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
import { getFirstChapterOfBook } from '../features/materials/materialsSlice'
import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
} from '@mui/material'
import Link from 'next/link'
import { useUserContext } from '../context/user'

const SectionCard = ({ material, checkIfUserMaterialIsInMaterials }) => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { section } = router.query
	const { userLearningLanguage } = useUserContext()

	const handleClick = async () => {
		try {
			const chapter = await dispatch(
				getFirstChapterOfBook({
					bookId: material.id,
					userLearningLanguage,
				})
			).unwrap()

			router.push(`/materials/books/${chapter.id}`)
		} catch (error) {
			console.error('Erreur lors de la récupération du chapitre :', error)
			// Tu peux afficher un message d'erreur ici si besoin
		}
	}

	const changeLevelName = level => {
		let newLevel
		if (level === 'débutant') newLevel = 'A1/A2'
		if (level === 'intermédiaire') newLevel = 'B1/B2'
		if (level === 'avancé') newLevel = 'C1/C2'

		return newLevel
	}

	const changeBackgroundColorRegardingLevel = level => {
		let background
		if (level === 'débutant') background = `${styles.level} beginner`
		if (level === 'intermédiaire') background = `${styles.level} intermediate`
		if (level === 'avancé') background = `${styles.level} advanced`
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

	const SectionCardContent = () => (
		<CardActionArea
			sx={{
				maxWidth: '500px',
				margin: '0 auto',
			}}>
			<Card
				sx={{
					display: 'flex',
					alignItems: 'center',
					height: 135,
					boxShadow: 'none',
					backgroundColor: 'clrCardBg',
				}}>
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_being_studied && (
						<FontAwesomeIcon
							icon={faClock}
							className={styles.beingStudiedCard}
						/>
					)}
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_studied && (
						<FontAwesomeIcon
							icon={faCircleCheck}
							className={styles.studiedCard}
						/>
					)}
				<CardMedia
					component='img'
					sx={{ maxWidth: 135, height: 135, margin: 0 }}
					image={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.image}`}
					alt={material.title}
				/>

				<CardContent
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography
							component='div'
							variant='h6'
							color='clrPrimary1'
							sx={{ lineHeight: '1.5rem' }}>
							{material.title}
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Typography
								variant='subtitle1'
								component='div'
								sx={{ fontWeight: '500', color: 'clrGrey2' }}>
								{material.section}
							</Typography>
							<Typography
								variant='subtitle1'
								component='div'
								sx={{ fontWeight: '500', color: 'clrGrey2' }}>
								{material.level}
							</Typography>
						</Box>
					</Box>
					<Box
						sx={{
							justifySelf: 'end',
							color: 'clrGrey2',
							display: { xs: 'none', md: 'block' },
						}}>
						<FontAwesomeIcon
							icon={changeIconRegardingSection(material.section)}
							size='2xl'
						/>
					</Box>
				</CardContent>
				<span className={changeBackgroundColorRegardingLevel(material.level)}>
					{changeLevelName(material.level)}
				</span>
			</Card>
		</CardActionArea>
	)

	return section === 'books' ? (
		<button onClick={handleClick} className={styles.cardButton}>
			<SectionCardContent />
		</button>
	) : (
		<Link href={`${material.section}/${material.id}`}>
			<SectionCardContent />
		</Link>
	)
}

// Mémoïser le composant pour éviter re-renders dans les listes
export default React.memo(SectionCard)
