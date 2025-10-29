import React from 'react'
import { sections } from '../data/sections'
import { useDispatch } from 'react-redux'
import styles from '../styles/sections/SectionCard.module.css'
import {
	Movie,
	MusicNote,
	Audiotrack,
	CheckCircle,
	Schedule,
} from '@mui/icons-material'
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
		if (sections.audio.includes(section)) {
			return <Audiotrack sx={{ fontSize: '2.5rem' }} />
		}
		if (sections.music.includes(section)) {
			return <MusicNote sx={{ fontSize: '2.5rem' }} />
		}
		if (sections.video.includes(section)) {
			return <Movie sx={{ fontSize: '2.5rem' }} />
		}
		return null
	}

	const SectionCardContent = () => (
		<CardActionArea
			sx={{
				maxWidth: '500px',
				margin: '0 auto',
				borderRadius: '8px',
				transition: 'all 0.2s ease',
				'&:active': {
					transform: 'scale(0.98)',
				},
			}}>
			<Card
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'stretch',
					height: { xs: 140, sm: 160 },
					boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
					background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
					border: '1px solid rgba(102, 126, 234, 0.08)',
					borderRadius: '12px',
					overflow: 'hidden',
					transition: 'all 0.3s ease',
					'&:hover': {
						boxShadow: '0 8px 24px rgba(102, 126, 234, 0.12)',
						transform: 'translateY(-4px)',
						borderColor: 'rgba(102, 126, 234, 0.2)',
					},
				}}>
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_being_studied && (
						<Schedule
							sx={{
								position: 'absolute',
								top: '8px',
								right: '8px',
								fontSize: '1.8rem',
								color: '#f59e0b',
								background: 'rgba(255, 255, 255, 0.95)',
								borderRadius: '50%',
								padding: '4px',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
								zIndex: 1,
							}}
						/>
					)}
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_studied && (
						<CheckCircle
							sx={{
								position: 'absolute',
								top: '8px',
								right: '8px',
								fontSize: '1.8rem',
								color: '#22c55e',
								background: 'rgba(255, 255, 255, 0.95)',
								borderRadius: '50%',
								padding: '4px',
								boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
								zIndex: 1,
							}}
						/>
					)}
				<CardMedia
					component='img'
					sx={{
						width: { xs: 140, sm: 160 },
						minWidth: { xs: 140, sm: 160 },
						maxWidth: { xs: 140, sm: 160 },
						height: '100%',
						margin: 0,
						objectFit: 'cover',
						flexShrink: 0,
					}}
					image={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.image}`}
					alt={material.title}
				/>

				<CardContent
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						py: { xs: 2, sm: 2 },
						px: { xs: 1.5, sm: 2 },
					}}>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography
							component='div'
							variant='h6'
							sx={{
								lineHeight: '1.5rem',
								fontSize: { xs: '0.95rem', sm: '1.125rem' },
								fontWeight: 700,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								mb: 0.5,
							}}>
							{material.title}
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
							<Typography
								variant='subtitle2'
								component='div'
								sx={{
									fontWeight: 600,
									color: '#718096',
									fontSize: { xs: '0.8rem', sm: '0.875rem' },
								}}>
								{material.section}
							</Typography>
							<Typography
								variant='subtitle2'
								component='div'
								sx={{
									fontWeight: 600,
									color: '#667eea',
									fontSize: { xs: '0.8rem', sm: '0.875rem' },
								}}>
								{material.level}
							</Typography>
						</Box>
					</Box>
					<Box
						sx={{
							justifySelf: 'end',
							color: '#718096',
							display: { xs: 'none', md: 'flex' },
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{changeIconRegardingSection(material.section)}
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
		<Link href={`/materials/${material.section}/${material.id}`}>
			<SectionCardContent />
		</Link>
	)
}

// Mémoïser le composant pour éviter re-renders dans les listes
export default React.memo(SectionCard)
