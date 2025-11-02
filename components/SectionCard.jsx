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
	Chip,
} from '@mui/material'
import Link from 'next/link'
import { useUserContext } from '../context/user'
import { getImageUrl } from '../utils/imageUtils'

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

	const getDifficultyInfo = level => {
		if (level === 'débutant') {
			return {
				label: 'Débutant',
				bg: 'rgba(16, 185, 129, 0.15)',
				border: '#10b981',
				text: '#059669',
			}
		}
		if (level === 'intermédiaire') {
			return {
				label: 'Intermédiaire',
				bg: 'rgba(245, 158, 11, 0.15)',
				border: '#f59e0b',
				text: '#d97706',
			}
		}
		if (level === 'avancé') {
			return {
				label: 'Avancé',
				bg: 'rgba(239, 68, 68, 0.15)',
				border: '#ef4444',
				text: '#dc2626',
			}
		}
		return { label: level, bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', text: '#7c3aed' }
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

	const difficultyInfo = getDifficultyInfo(material.level)

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
					height: { xs: 160, sm: 180 },
					boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
					background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
					border: '1px solid rgba(139, 92, 246, 0.2)',
					borderRadius: '16px',
					overflow: 'hidden',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
						opacity: 0,
						transition: 'opacity 0.3s ease',
						zIndex: 0,
					},
					'&:hover': {
						boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.3) inset',
						transform: 'translateY(-8px) scale(1.01)',
						borderColor: 'rgba(139, 92, 246, 0.4)',
						'&::before': {
							opacity: 1,
						},
						'& .section-card-image img': {
							transform: 'scale(1.1)',
						},
					},
				}}>
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_being_studied && (
						<Schedule
							sx={{
								position: 'absolute',
								top: '12px',
								right: '12px',
								fontSize: '2rem',
								color: '#f59e0b',
								background: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: '50%',
								padding: '6px',
								boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
								border: '2px solid rgba(245, 158, 11, 0.3)',
								zIndex: 2,
							}}
						/>
					)}
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_studied && (
						<CheckCircle
							sx={{
								position: 'absolute',
								top: '12px',
								right: '12px',
								fontSize: '2rem',
								color: '#22c55e',
								background: 'rgba(255, 255, 255, 0.95)',
								backdropFilter: 'blur(10px)',
								borderRadius: '50%',
								padding: '6px',
								boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
								border: '2px solid rgba(34, 197, 94, 0.3)',
								zIndex: 2,
							}}
						/>
					)}
				<Box
					className="section-card-image"
					sx={{
						width: { xs: 140, sm: 160 },
						minWidth: { xs: 140, sm: 160 },
						maxWidth: { xs: 140, sm: 160 },
						height: '100%',
						position: 'relative',
						overflow: 'hidden',
					}}>
					<CardMedia
						component='img'
						sx={{
							width: '100%',
							height: '100%',
							margin: 0,
							objectFit: 'cover',
							flexShrink: 0,
							transition: 'transform 0.4s ease',
						}}
						image={getImageUrl(material.image)}
						alt={material.title}
					/>
				</Box>

				<CardContent
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						py: { xs: 2, sm: 2.5 },
						px: { xs: 1.5, sm: 2.5 },
						position: 'relative',
						zIndex: 1,
					}}>
					<Box sx={{ display: 'flex', flexDirection: 'column' }}>
						<Typography
							component='div'
							variant='h6'
							sx={{
								lineHeight: '1.6rem',
								fontSize: { xs: '1.1rem', sm: '1.25rem' },
								fontWeight: 700,
								color: '#7c3aed',
								mb: 0.5,
							}}>
							{material.title}
						</Typography>

						<Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5, gap: 0.25 }}>
							<Typography
								variant='subtitle2'
								component='div'
								sx={{
									fontWeight: 600,
									color: '#718096',
									fontSize: { xs: '0.875rem', sm: '0.95rem' },
								}}>
								{material.section}
							</Typography>
						</Box>
					</Box>
					<Box
						sx={{
							justifySelf: 'end',
							color: '#8b5cf6',
							display: { xs: 'none', md: 'flex' },
							alignItems: 'center',
							justifyContent: 'center',
							transition: 'all 0.3s ease',
						}}>
						{changeIconRegardingSection(material.section)}
					</Box>
				</CardContent>

				{/* Badge de niveau élégant */}
				{material.level && (
					<Chip
						label={difficultyInfo.label}
						size="small"
						sx={{
							position: 'absolute',
							top: 10,
							left: 10,
							zIndex: 3,
							background: 'rgba(255, 255, 255, 0.96)',
							backdropFilter: 'blur(8px)',
							border: `1.5px solid ${difficultyInfo.border}`,
							color: difficultyInfo.text,
							fontWeight: 700,
							fontSize: '0.7rem',
							height: 26,
							boxShadow: `0 2px 12px ${difficultyInfo.border}30, 0 1px 4px rgba(0, 0, 0, 0.12)`,
							transition: 'all 0.2s ease',
							'& .MuiChip-label': {
								px: 1.75,
								fontFamily: 'inherit',
							},
							'&:hover': {
								boxShadow: `0 4px 16px ${difficultyInfo.border}50, 0 2px 6px rgba(0, 0, 0, 0.15)`,
								transform: 'translateY(-1px)',
							},
						}}
					/>
				)}
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
