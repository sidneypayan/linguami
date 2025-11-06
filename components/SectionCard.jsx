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
	CardContent,
	Typography,
	Chip,
	useTheme,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useUserContext } from '../context/user'
import useTranslation from 'next-translate/useTranslation'

const SectionCard = ({ material, checkIfUserMaterialIsInMaterials }) => {
	const { t } = useTranslation('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
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
		if (level === 'beginner') {
			return {
				label: t('beginner'),
				bg: 'rgba(16, 185, 129, 0.15)',
				border: '#10b981',
				text: '#059669',
			}
		}
		if (level === 'intermediate') {
			return {
				label: t('intermediate'),
				bg: 'rgba(245, 158, 11, 0.15)',
				border: '#f59e0b',
				text: '#d97706',
			}
		}
		if (level === 'advanced') {
			return {
				label: t('advanced'),
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

	// Déterminer la rareté selon le niveau
	const getRarity = () => {
		if (material.level === 'advanced') return 'legendary'
		if (material.level === 'intermediate') return 'epic'
		return 'common'
	}
	const rarity = getRarity()

	const SectionCardContent = () => (
		<Card
			sx={{
				maxWidth: '220px',
				margin: '0 auto',
				cursor: 'pointer',
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				height: { xs: 280, sm: 300 },
				boxShadow: isDark
					? rarity === 'legendary'
						? '0 8px 36px rgba(212, 175, 55, 0.6), 0 0 100px rgba(212, 175, 55, 0.3), inset 0 0 80px rgba(212, 175, 55, 0.08)'
						: rarity === 'epic'
						? '0 8px 32px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.25), inset 0 0 60px rgba(139, 92, 246, 0.06)'
						: '0 8px 28px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.15), inset 0 0 40px rgba(139, 92, 246, 0.04)'
					: rarity === 'legendary'
					? '0 8px 36px rgba(212, 175, 55, 0.4), 0 4px 20px rgba(212, 175, 55, 0.25)'
					: rarity === 'epic'
					? '0 8px 32px rgba(139, 92, 246, 0.35), 0 4px 18px rgba(139, 92, 246, 0.2)'
					: '0 8px 28px rgba(139, 92, 246, 0.25), 0 4px 14px rgba(139, 92, 246, 0.15)',
				background: isDark
					? 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%)'
					: 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%)',
				border: isDark
					? '3px solid transparent'
					: '3px solid transparent',
				backgroundImage: isDark
					? rarity === 'legendary'
						? 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%), linear-gradient(135deg, #d4af37 0%, #f4d03f 20%, #d4af37 40%, #f4d03f 60%, #d4af37 80%, #f4d03f 100%)'
						: rarity === 'epic'
						? 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%), linear-gradient(135deg, #8b5cf6 0%, #a78bfa 25%, #8b5cf6 50%, #a78bfa 75%, #8b5cf6 100%)'
						: 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%), linear-gradient(135deg, #64748b 0%, #8b5cf6 50%, #64748b 100%)'
					: rarity === 'legendary'
					? 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%), linear-gradient(135deg, #d4af37 0%, #f4d03f 20%, #d4af37 40%, #f4d03f 60%, #d4af37 80%, #f4d03f 100%)'
					: rarity === 'epic'
					? 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%), linear-gradient(135deg, #8b5cf6 0%, #a78bfa 25%, #8b5cf6 50%, #a78bfa 75%, #8b5cf6 100%)'
					: 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%), linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #8b5cf6 100%)',
				backgroundOrigin: 'border-box',
				backgroundClip: 'padding-box, border-box',
				borderRadius: '20px',
				overflow: 'hidden',
				transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
				// Texture subtile
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: isDark
						? 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 92, 246, 0.03) 2px, rgba(139, 92, 246, 0.03) 4px)'
						: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 92, 246, 0.02) 2px, rgba(139, 92, 246, 0.02) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 92, 246, 0.02) 2px, rgba(139, 92, 246, 0.02) 4px)',
					opacity: 0.3,
					zIndex: 0,
					pointerEvents: 'none',
				},
				'&::after': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: isDark
						? 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)'
						: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)',
					opacity: 0,
					transition: 'opacity 0.5s ease',
					zIndex: 0,
					pointerEvents: 'none',
				},
				'&:active': {
					transform: 'scale(0.97)',
				},
				'&:hover': {
					boxShadow: isDark
						? rarity === 'legendary'
							? '0 16px 48px rgba(212, 175, 55, 0.8), 0 0 140px rgba(212, 175, 55, 0.5), inset 0 0 100px rgba(212, 175, 55, 0.15)'
							: rarity === 'epic'
							? '0 14px 42px rgba(139, 92, 246, 0.7), 0 0 120px rgba(139, 92, 246, 0.45), inset 0 0 90px rgba(139, 92, 246, 0.12)'
							: '0 12px 36px rgba(139, 92, 246, 0.5), 0 0 100px rgba(139, 92, 246, 0.35), inset 0 0 80px rgba(139, 92, 246, 0.1)'
						: rarity === 'legendary'
						? '0 16px 48px rgba(212, 175, 55, 0.6), 0 8px 36px rgba(212, 175, 55, 0.4)'
						: rarity === 'epic'
						? '0 14px 42px rgba(139, 92, 246, 0.55), 0 7px 30px rgba(139, 92, 246, 0.35)'
						: '0 12px 36px rgba(139, 92, 246, 0.45), 0 6px 24px rgba(139, 92, 246, 0.3)',
					transform: 'translateY(-8px) scale(1.02)',
					'&::after': {
						opacity: 1,
					},
					'& .holographic-effect': {
						opacity: rarity === 'legendary' ? 0.5 : rarity === 'epic' ? 0.3 : 0.15,
					},
					'& .corner-ornament': {
						opacity: 1,
						transform: 'scale(1.1)',
					},
					'& .section-card-image img': {
						transform: 'scale(1.15)',
					},
					'& .card-title': {
						textShadow: isDark
							? rarity === 'legendary'
								? '0 0 30px rgba(212, 175, 55, 1), 0 0 60px rgba(212, 175, 55, 0.6)'
								: '0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)'
							: '0 2px 8px rgba(139, 92, 246, 0.3)',
					},
				},
			}}>
				{/* Effet holographique */}
				<Box
					className="holographic-effect"
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: 'linear-gradient(45deg, transparent 30%, rgba(255, 0, 128, 0.1) 40%, rgba(0, 255, 255, 0.1) 50%, rgba(255, 255, 0, 0.1) 60%, transparent 70%)',
						backgroundSize: '200% 200%',
						opacity: 0,
						transition: 'opacity 0.5s ease',
						zIndex: 1,
						pointerEvents: 'none',
						animation: 'holographicShine 3s ease-in-out infinite',
						'@keyframes holographicShine': {
							'0%': { backgroundPosition: '200% 0' },
							'100%': { backgroundPosition: '-200% 0' },
						},
					}}
				/>

				{/* Coins décoratifs */}
				{/* Coin supérieur gauche */}
				<Box
					className="corner-ornament"
					sx={{
						position: 'absolute',
						top: 8,
						left: 8,
						width: 14,
						height: 14,
						borderTop: `2px solid ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
						borderLeft: `2px solid ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
						opacity: 0.6,
						transition: 'all 0.3s ease',
						zIndex: 5,
						pointerEvents: 'none',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: -2,
							left: -2,
							width: 4,
							height: 4,
							background: rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b',
							borderRadius: '50%',
							boxShadow: `0 0 6px ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
						},
					}}
				/>

				{/* Coin supérieur droit */}
				<Box
					className="corner-ornament"
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						width: 14,
						height: 14,
						borderTop: `2px solid ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
						borderRight: `2px solid ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
						opacity: 0.6,
						transition: 'all 0.3s ease',
						zIndex: 5,
						pointerEvents: 'none',
						'&::before': {
							content: '""',
							position: 'absolute',
							top: -2,
							right: -2,
							width: 4,
							height: 4,
							background: rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b',
							borderRadius: '50%',
							boxShadow: `0 0 6px ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
						},
					}}
				/>

				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_being_studied && (
						<Schedule
							sx={{
								position: 'absolute',
								top: '10px',
								right: '10px',
								fontSize: '1.3rem',
								color: '#f59e0b',
								background: isDark
									? 'linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%)'
									: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 240, 0.95) 100%)',
								backdropFilter: 'blur(12px)',
								borderRadius: '50%',
								padding: '5px',
								boxShadow: '0 3px 15px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.4)',
								border: '2px solid rgba(245, 158, 11, 0.6)',
								zIndex: 4,
								pointerEvents: 'none',
								animation: 'pulse 2s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': { opacity: 1, transform: 'scale(1)' },
									'50%': { opacity: 0.8, transform: 'scale(1.05)' },
								},
							}}
						/>
					)}
				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_studied && (
						<CheckCircle
							sx={{
								position: 'absolute',
								top: '10px',
								right: '10px',
								fontSize: '1.3rem',
								color: '#22c55e',
								background: isDark
									? 'linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%)'
									: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 255, 245, 0.95) 100%)',
								backdropFilter: 'blur(12px)',
								borderRadius: '50%',
								padding: '5px',
								boxShadow: '0 3px 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)',
								border: '2px solid rgba(34, 197, 94, 0.6)',
								zIndex: 4,
								pointerEvents: 'none',
								filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))',
							}}
						/>
					)}
				<Box
					className="section-card-image"
					sx={{
						width: '100%',
						height: { xs: 160, sm: 180 },
						position: 'relative',
						overflow: 'hidden',
						// Vignette améliorée
						'&::before': {
							content: '""',
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: `radial-gradient(ellipse at center, transparent 20%, ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'} 100%)`,
							zIndex: 1,
							pointerEvents: 'none',
						},
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: '50%',
							background: isDark
								? 'linear-gradient(to top, rgba(20, 20, 35, 0.98) 0%, rgba(20, 20, 35, 0.7) 40%, transparent 100%)'
								: 'linear-gradient(to top, rgba(255, 252, 245, 0.95) 0%, rgba(255, 252, 245, 0.6) 40%, transparent 100%)',
							zIndex: 1,
						},
					}}>
					<Image
						src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.image}`}
						alt={material.title}
						fill
						sizes="(max-width: 640px) 340px, 340px"
						style={{
							objectFit: 'cover',
							transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
						}}
						quality={90}
						priority={false}
					/>
				</Box>

				<CardContent
					sx={{
						flex: 1,
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						py: { xs: 1.25, sm: 1.5 },
						px: { xs: 1.5, sm: 2 },
						position: 'relative',
						zIndex: 2,
						background: isDark
							? 'linear-gradient(to bottom, transparent 0%, rgba(20, 20, 35, 0.3) 100%)'
							: 'linear-gradient(to bottom, transparent 0%, rgba(212, 175, 55, 0.05) 100%)',
					}}>
					<Box sx={{ textAlign: 'center', mb: 0.5 }}>
						<Typography
							className="card-title"
							component='div'
							variant='h6'
							sx={{
								fontSize: { xs: '0.9rem', sm: '0.95rem' },
								fontWeight: 800,
								background: isDark
									? 'linear-gradient(135deg, #d4af37 0%, #f4e4a6 50%, #d4af37 100%)'
									: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #7c3aed 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								mb: 0.75,
								lineHeight: 1.3,
								textTransform: 'uppercase',
								letterSpacing: '0.3px',
								textShadow: isDark
									? '0 2px 10px rgba(212, 175, 55, 0.3)'
									: 'none',
								transition: 'all 0.3s ease',
							}}>
							{material.title}
						</Typography>

						<Box sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 0.75,
						}}>
							<Typography
								variant='body2'
								component='div'
								sx={{
									fontWeight: 600,
									color: isDark ? '#cbd5e1' : '#64748b',
									fontSize: { xs: '0.7rem', sm: '0.75rem' },
									textTransform: 'capitalize',
									letterSpacing: '0.3px',
								}}>
								{material.section}
							</Typography>
							<Box
								sx={{
									color: isDark ? '#a78bfa' : '#8b5cf6',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'all 0.3s ease',
									'& svg': {
										fontSize: '1rem',
										filter: isDark
											? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))'
											: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
									},
								}}>
								{changeIconRegardingSection(material.section)}
							</Box>
						</Box>
					</Box>

					{/* Decorative divider amélioré */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							my: 0.75,
							opacity: 0.8,
						}}>
						<Box
							sx={{
								flex: 1,
								height: '1.5px',
								background: isDark
									? `linear-gradient(90deg, transparent 0%, ${rarity === 'legendary' ? 'rgba(212, 175, 55, 0.8)' : rarity === 'epic' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.4)'} 100%)`
									: `linear-gradient(90deg, transparent 0%, ${rarity === 'legendary' ? 'rgba(212, 175, 55, 0.6)' : rarity === 'epic' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'} 100%)`,
							}}
						/>
						<Box
							sx={{
								width: 4,
								height: 4,
								background: rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b',
								transform: 'rotate(45deg)',
								boxShadow: `0 0 6px ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
							}}
						/>
						<Box
							sx={{
								width: 3,
								height: 3,
								background: rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b',
								borderRadius: '50%',
								opacity: 0.6,
							}}
						/>
						<Box
							sx={{
								width: 4,
								height: 4,
								background: rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b',
								transform: 'rotate(45deg)',
								boxShadow: `0 0 6px ${rarity === 'legendary' ? '#d4af37' : rarity === 'epic' ? '#8b5cf6' : '#64748b'}`,
							}}
						/>
						<Box
							sx={{
								flex: 1,
								height: '1.5px',
								background: isDark
									? `linear-gradient(90deg, ${rarity === 'legendary' ? 'rgba(212, 175, 55, 0.8)' : rarity === 'epic' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.4)'} 0%, transparent 100%)`
									: `linear-gradient(90deg, ${rarity === 'legendary' ? 'rgba(212, 175, 55, 0.6)' : rarity === 'epic' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(139, 92, 246, 0.3)'} 0%, transparent 100%)`,
							}}
						/>
					</Box>
				</CardContent>

				{/* Badge de niveau style RPG */}
				{material.level && (
					<Chip
						label={difficultyInfo.label}
						size="small"
						sx={{
							position: 'absolute',
							top: 10,
							left: 10,
							zIndex: 3,
							background: isDark
								? `linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%)`
								: `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 248, 245, 0.95) 100%)`,
							backdropFilter: 'blur(12px)',
							border: `1.5px solid ${difficultyInfo.border}`,
							color: difficultyInfo.text,
							fontWeight: 800,
							fontSize: '0.6rem',
							height: 22,
							boxShadow: isDark
								? `0 3px 15px ${difficultyInfo.border}60, 0 0 20px ${difficultyInfo.border}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
								: `0 3px 12px ${difficultyInfo.border}50, 0 2px 6px rgba(0, 0, 0, 0.1)`,
							transition: 'all 0.3s ease',
							pointerEvents: 'none',
							textTransform: 'uppercase',
							letterSpacing: '0.5px',
							'& .MuiChip-label': {
								px: 1.25,
								fontFamily: 'inherit',
								textShadow: isDark
									? `0 0 8px ${difficultyInfo.border}80`
									: 'none',
							},
							'&::before': {
								content: '""',
								position: 'absolute',
								top: '-2px',
								left: '-2px',
								right: '-2px',
								bottom: '-2px',
								background: `linear-gradient(135deg, ${difficultyInfo.border} 0%, transparent 100%)`,
								borderRadius: 'inherit',
								opacity: 0.3,
								zIndex: -1,
							},
						}}
					/>
				)}
			</Card>
	)

	return section === 'books' ? (
		<button type="button" onClick={handleClick} className={styles.cardButton}>
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
