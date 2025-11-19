'use client'

import React from 'react'
import { sections } from '@/data/sections'
import styles from '@/styles/sections/SectionCard.module.css'
import { getMaterialImageUrl } from '@/utils/mediaUrls'
import {
	Movie,
	MusicNote,
	Audiotrack,
	CheckCircle,
	Schedule,
} from '@mui/icons-material'
import { useRouter, usePathname, useParams } from 'next/navigation'
import {
	Box,
	Card,
	CardContent,
	Typography,
	Chip,
	useTheme,
} from '@mui/material'
import { Link } from '@/i18n/navigation'
import { useUserContext } from '@/context/user'
import { useTranslations, useLocale } from 'next-intl'
import { logger } from '@/utils/logger'

const SectionCard = ({ material, checkIfUserMaterialIsInMaterials }) => {
	const t = useTranslations('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()
	const { section } = params
	const { userLearningLanguage } = useUserContext()

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
				bg: 'rgba(168, 85, 247, 0.15)',
				border: '#a855f7',
				text: '#9333ea',
			}
		}
		if (level === 'advanced') {
			return {
				label: t('advanced'),
				bg: 'rgba(251, 191, 36, 0.15)',
				border: '#fbbf24',
				text: '#d97706',
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
						? '0 8px 36px rgba(251, 191, 36, 0.6), 0 0 100px rgba(251, 191, 36, 0.3), inset 0 0 80px rgba(251, 191, 36, 0.08)'
						: rarity === 'epic'
						? '0 8px 32px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.25), inset 0 0 60px rgba(168, 85, 247, 0.06)'
						: '0 8px 28px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.15), inset 0 0 40px rgba(16, 185, 129, 0.04)'
					: rarity === 'legendary'
					? '0 8px 36px rgba(251, 191, 36, 0.4), 0 4px 20px rgba(251, 191, 36, 0.25)'
					: rarity === 'epic'
					? '0 8px 32px rgba(168, 85, 247, 0.35), 0 4px 18px rgba(168, 85, 247, 0.2)'
					: '0 8px 28px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(16, 185, 129, 0.15)',
				background: isDark
					? 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%)'
					: 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%)',
				border: isDark
					? '3px solid transparent'
					: '3px solid transparent',
				backgroundImage: isDark
					? rarity === 'legendary'
						? 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%), linear-gradient(135deg, #fbbf24 0%, #fcd34d 25%, #fbbf24 50%, #fcd34d 75%, #fbbf24 100%)'
						: rarity === 'epic'
						? 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%), linear-gradient(135deg, #a855f7 0%, #c084fc 25%, #a855f7 50%, #c084fc 75%, #a855f7 100%)'
						: 'linear-gradient(180deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 50%, rgba(15, 10, 30, 0.98) 100%), linear-gradient(135deg, #10b981 0%, #34d399 25%, #10b981 50%, #34d399 75%, #10b981 100%)'
					: rarity === 'legendary'
					? 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%), linear-gradient(135deg, #fbbf24 0%, #fcd34d 25%, #fbbf24 50%, #fcd34d 75%, #fbbf24 100%)'
					: rarity === 'epic'
					? 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%), linear-gradient(135deg, #a855f7 0%, #c084fc 25%, #a855f7 50%, #c084fc 75%, #a855f7 100%)'
					: 'linear-gradient(180deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 50%, rgba(245, 240, 230, 0.98) 100%), linear-gradient(135deg, #10b981 0%, #34d399 25%, #10b981 50%, #34d399 75%, #10b981 100%)',
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
						? rarity === 'legendary'
							? 'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.1) 0%, transparent 60%)'
							: rarity === 'epic'
							? 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)'
							: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 60%)'
						: rarity === 'legendary'
						? 'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.1) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)'
						: rarity === 'epic'
						? 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.08) 0%, transparent 60%)'
						: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)',
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
							? '0 16px 48px rgba(251, 191, 36, 0.8), 0 0 140px rgba(251, 191, 36, 0.5), inset 0 0 100px rgba(251, 191, 36, 0.15)'
							: rarity === 'epic'
							? '0 14px 42px rgba(168, 85, 247, 0.7), 0 0 120px rgba(168, 85, 247, 0.45), inset 0 0 90px rgba(168, 85, 247, 0.12)'
							: '0 12px 36px rgba(16, 185, 129, 0.5), 0 0 100px rgba(16, 185, 129, 0.35), inset 0 0 80px rgba(16, 185, 129, 0.1)'
						: rarity === 'legendary'
						? '0 16px 48px rgba(251, 191, 36, 0.6), 0 8px 36px rgba(251, 191, 36, 0.4)'
						: rarity === 'epic'
						? '0 14px 42px rgba(168, 85, 247, 0.55), 0 7px 30px rgba(168, 85, 247, 0.35)'
						: '0 12px 36px rgba(16, 185, 129, 0.45), 0 6px 24px rgba(16, 185, 129, 0.3)',
					transform: 'translateY(-8px) scale(1.02)',
					'&::after': {
						opacity: 1,
					},
					'& .holographic-effect': {
						opacity: rarity === 'legendary' ? 0.5 : rarity === 'epic' ? 0.3 : 0.15,
					},
					'& .section-card-image img': {
						transform: 'scale(1.15)',
					},
					'& .card-title': {
						textShadow: isDark
							? rarity === 'legendary'
								? '0 0 30px rgba(251, 191, 36, 1), 0 0 60px rgba(251, 191, 36, 0.6)'
								: rarity === 'epic'
								? '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5)'
								: '0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.5)'
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

				{typeof checkIfUserMaterialIsInMaterials !== 'undefined' &&
					checkIfUserMaterialIsInMaterials.is_being_studied && (
						<Schedule
							sx={{
								position: 'absolute',
								top: '10px',
								right: '10px',
								fontSize: '1.3rem',
								color: '#a855f7',
								background: isDark
									? 'linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%)'
									: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 240, 0.95) 100%)',
								backdropFilter: 'blur(12px)',
								borderRadius: '50%',
								padding: '5px',
								boxShadow: '0 3px 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(168, 85, 247, 0.4)',
								border: '2px solid rgba(168, 85, 247, 0.6)',
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
					}}>
					<Box
						component='img'
						src={getMaterialImageUrl(material)}
						alt={material.title}
						sx={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
						}}
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
							: rarity === 'legendary'
							? 'linear-gradient(to bottom, transparent 0%, rgba(251, 191, 36, 0.05) 100%)'
							: rarity === 'epic'
							? 'linear-gradient(to bottom, transparent 0%, rgba(168, 85, 247, 0.05) 100%)'
							: 'linear-gradient(to bottom, transparent 0%, rgba(16, 185, 129, 0.05) 100%)',
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
									? rarity === 'legendary'
										? 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #fbbf24 100%)'
										: rarity === 'epic'
										? 'linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #a855f7 100%)'
										: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #10b981 100%)'
									: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #7c3aed 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								mb: 0.75,
								lineHeight: 1.3,
								textTransform: 'uppercase',
								letterSpacing: '0.3px',
								textShadow: isDark
									? rarity === 'legendary'
										? '0 2px 10px rgba(251, 191, 36, 0.3)'
										: rarity === 'epic'
										? '0 2px 10px rgba(168, 85, 247, 0.3)'
										: '0 2px 10px rgba(16, 185, 129, 0.3)'
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
									? `linear-gradient(90deg, transparent 0%, ${rarity === 'legendary' ? 'rgba(251, 191, 36, 0.8)' : rarity === 'epic' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(16, 185, 129, 0.4)'} 100%)`
									: `linear-gradient(90deg, transparent 0%, ${rarity === 'legendary' ? 'rgba(251, 191, 36, 0.6)' : rarity === 'epic' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(16, 185, 129, 0.3)'} 100%)`,
							}}
						/>
						<Box
							sx={{
								width: 4,
								height: 4,
								background: rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#a855f7' : '#10b981',
								transform: 'rotate(45deg)',
								boxShadow: `0 0 6px ${rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#a855f7' : '#10b981'}`,
							}}
						/>
						<Box
							sx={{
								width: 3,
								height: 3,
								background: rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#a855f7' : '#10b981',
								borderRadius: '50%',
								opacity: 0.6,
							}}
						/>
						<Box
							sx={{
								width: 4,
								height: 4,
								background: rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#a855f7' : '#10b981',
								transform: 'rotate(45deg)',
								boxShadow: `0 0 6px ${rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#a855f7' : '#10b981'}`,
							}}
						/>
						<Box
							sx={{
								flex: 1,
								height: '1.5px',
								background: isDark
									? `linear-gradient(90deg, ${rarity === 'legendary' ? 'rgba(251, 191, 36, 0.8)' : rarity === 'epic' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(16, 185, 129, 0.4)'} 0%, transparent 100%)`
									: `linear-gradient(90deg, ${rarity === 'legendary' ? 'rgba(251, 191, 36, 0.6)' : rarity === 'epic' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(16, 185, 129, 0.3)'} 0%, transparent 100%)`,
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

	return (
		<Link href={`/materials/${material.section}/${material.id}`}>
			<SectionCardContent />
		</Link>
	)
}

// Mémoïser le composant pour éviter re-renders dans les listes
export default React.memo(SectionCard)
