import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'
import { getFirstChapterOfBook } from '../features/materials/materialsSlice'
import { useUserContext } from '../context/user'
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Typography,
	Avatar,
	Chip,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import {
	Movie,
	MusicNote,
	Audiotrack,
	CheckCircle,
	Schedule,
	MenuBook,
} from '@mui/icons-material'
import { sections } from '../data/sections'
import { getImageUrl } from '../utils/imageUtils'

const MaterialsTable = ({ materials, checkIfUserMaterialIsInMaterials }) => {
	const { t } = useTranslation('materials')
	const router = useRouter()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { section } = router.query
	const { userLearningLanguage } = useUserContext()

	const handleRowClick = async (material) => {
		if (section === 'books') {
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
			}
		} else {
			router.push(`/materials/${material.section}/${material.id}`)
		}
	}

	const getIcon = (section) => {
		if (sections.audio.includes(section)) {
			return <Audiotrack sx={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
		}
		if (sections.music.includes(section)) {
			return <MusicNote sx={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
		}
		if (sections.video.includes(section)) {
			return <Movie sx={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
		}
		return <MenuBook sx={{ fontSize: '1.5rem', color: '#8b5cf6' }} />
	}

	const getLevelColor = (level) => {
		if (level === 'beginner') return '#10b981'
		if (level === 'intermediate') return '#f59e0b'
		if (level === 'advanced') return '#ef4444'
		return '#8b5cf6'
	}

	const getRarity = (level) => {
		if (level === 'advanced') return 'legendary'
		if (level === 'intermediate') return 'epic'
		return 'common'
	}

	const getLevelLabel = (level) => {
		if (level === 'beginner') return t('beginner')
		if (level === 'intermediate') return t('intermediate')
		if (level === 'advanced') return t('advanced')
		return level
	}

	const getStatusIcon = (materialId) => {
		const status = checkIfUserMaterialIsInMaterials(materialId)
		if (!status) return null

		if (status.is_studied) {
			return (
				<CheckCircle
					sx={{
						fontSize: '1.5rem',
						color: '#22c55e',
					}}
				/>
			)
		}
		if (status.is_being_studied) {
			return (
				<Schedule
					sx={{
						fontSize: '1.5rem',
						color: '#f59e0b',
					}}
				/>
			)
		}
		return null
	}

	// Version mobile - liste de cartes compactes
	if (isMobile) {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
				{materials.map((material, index) => {
					const rarity = getRarity(material.level)
					const levelColor = getLevelColor(material.level)
					const status = checkIfUserMaterialIsInMaterials(material.id)

					return (
					<Paper
						key={material.id}
						onClick={() => handleRowClick(material)}
						sx={{
							position: 'relative',
							p: 0,
							borderRadius: '16px',
							cursor: 'pointer',
							overflow: 'hidden',
							border: '2px solid transparent',
							backgroundImage: isDark
								? rarity === 'legendary'
									? 'linear-gradient(145deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%), linear-gradient(135deg, #ef4444 0%, #f87171 25%, #ef4444 50%, #f87171 75%, #ef4444 100%)'
									: rarity === 'epic'
									? 'linear-gradient(145deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%), linear-gradient(135deg, #f59e0b 0%, #fbbf24 25%, #f59e0b 50%, #fbbf24 75%, #f59e0b 100%)'
									: 'linear-gradient(145deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%), linear-gradient(135deg, #10b981 0%, #34d399 25%, #10b981 50%, #34d399 75%, #10b981 100%)'
								: rarity === 'legendary'
								? 'linear-gradient(145deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 100%), linear-gradient(135deg, #ef4444 0%, #f87171 25%, #ef4444 50%, #f87171 75%, #ef4444 100%)'
								: rarity === 'epic'
								? 'linear-gradient(145deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 100%), linear-gradient(135deg, #f59e0b 0%, #fbbf24 25%, #f59e0b 50%, #fbbf24 75%, #f59e0b 100%)'
								: 'linear-gradient(145deg, rgba(255, 252, 245, 0.98) 0%, rgba(250, 245, 235, 0.95) 100%), linear-gradient(135deg, #10b981 0%, #34d399 25%, #10b981 50%, #34d399 75%, #10b981 100%)',
							backgroundOrigin: 'border-box',
							backgroundClip: 'padding-box, border-box',
							boxShadow: isDark
								? rarity === 'legendary'
									? '0 6px 24px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.2)'
									: rarity === 'epic'
									? '0 6px 24px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.15)'
									: '0 6px 24px rgba(16, 185, 129, 0.25), 0 0 60px rgba(16, 185, 129, 0.1)'
								: rarity === 'legendary'
								? '0 6px 24px rgba(239, 68, 68, 0.3), 0 2px 12px rgba(239, 68, 68, 0.2)'
								: rarity === 'epic'
								? '0 6px 24px rgba(245, 158, 11, 0.25), 0 2px 12px rgba(245, 158, 11, 0.15)'
								: '0 6px 24px rgba(16, 185, 129, 0.2), 0 2px 12px rgba(16, 185, 129, 0.1)',
							transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
										? 'radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)'
										: rarity === 'epic'
										? 'radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)'
										: 'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
									: rarity === 'legendary'
									? 'radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(239, 68, 68, 0.08) 0%, transparent 50%)'
									: rarity === 'epic'
									? 'radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)'
									: 'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)',
								opacity: 0,
								transition: 'opacity 0.5s ease',
								zIndex: 0,
								pointerEvents: 'none',
							},
							'&:hover': {
								boxShadow: isDark
									? rarity === 'legendary'
										? '0 10px 36px rgba(239, 68, 68, 0.7), 0 0 90px rgba(239, 68, 68, 0.35)'
										: rarity === 'epic'
										? '0 10px 36px rgba(245, 158, 11, 0.6), 0 0 90px rgba(245, 158, 11, 0.3)'
										: '0 10px 36px rgba(16, 185, 129, 0.4), 0 0 90px rgba(16, 185, 129, 0.2)'
									: rarity === 'legendary'
									? '0 10px 36px rgba(239, 68, 68, 0.45), 0 4px 20px rgba(239, 68, 68, 0.3)'
									: rarity === 'epic'
									? '0 10px 36px rgba(245, 158, 11, 0.4), 0 4px 20px rgba(245, 158, 11, 0.25)'
									: '0 10px 36px rgba(16, 185, 129, 0.35), 0 4px 20px rgba(16, 185, 129, 0.2)',
								transform: 'translateY(-4px) scale(1.01)',
								'&::after': {
									opacity: 1,
								},
							},
							'&:active': {
								transform: 'scale(0.98)',
							},
						}}>
						{/* Badge de statut positionné en haut à droite */}
						{status?.is_being_studied && (
							<Schedule
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
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
									zIndex: 10,
									pointerEvents: 'none',
								}}
							/>
						)}
						{status?.is_studied && (
							<CheckCircle
								sx={{
									position: 'absolute',
									top: 8,
									right: 8,
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
									zIndex: 10,
									pointerEvents: 'none',
								}}
							/>
						)}

						<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, position: 'relative', zIndex: 1 }}>
							{/* Image */}
							{index === 0 ? (
								<Box
									sx={{
										width: 90,
										height: 90,
										flexShrink: 0,
										borderRadius: 2,
										overflow: 'hidden',
										position: 'relative',
										boxShadow: isDark
											? `0 4px 16px ${levelColor}40`
											: `0 4px 16px ${levelColor}30`,
										border: `2px solid ${levelColor}40`,
									}}>
									<Box
										component='img'
										src={getImageUrl(material.image)}
										alt={material.title}
										sx={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
										}}
									/>
								</Box>
							) : (
								<Avatar
									src={getImageUrl(material.image)}
									alt={material.title}
									variant="rounded"
									sx={{
										width: 90,
										height: 90,
										flexShrink: 0,
										boxShadow: isDark
											? `0 4px 16px ${levelColor}40`
											: `0 4px 16px ${levelColor}30`,
										border: `2px solid ${levelColor}40`,
									}}
								/>
							)}

							{/* Content */}
							<Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
								<Typography
									sx={{
										fontSize: '0.95rem',
										fontWeight: 800,
										background: isDark
											? rarity === 'legendary'
												? 'linear-gradient(135deg, #ef4444 0%, #f87171 50%, #ef4444 100%)'
												: rarity === 'epic'
												? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)'
												: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #10b981 100%)'
											: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #7c3aed 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										lineHeight: 1.3,
										mb: 1,
										textTransform: 'uppercase',
										letterSpacing: '0.3px',
										pr: 2,
									}}>
									{material.title}
								</Typography>

								<Box>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', mb: 0.5 }}>
										<Typography
											variant="caption"
											sx={{
												color: isDark ? '#cbd5e1' : '#64748b',
												fontWeight: 600,
												fontSize: '0.75rem',
												textTransform: 'capitalize',
											}}>
											{material.section}
										</Typography>
										<Chip
											label={getLevelLabel(material.level)}
											size="small"
											sx={{
												background: isDark
													? 'linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%)'
													: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 248, 245, 0.95) 100%)',
												backdropFilter: 'blur(12px)',
												border: `1.5px solid ${levelColor}`,
												color: levelColor,
												fontWeight: 800,
												fontSize: '0.65rem',
												height: 22,
												boxShadow: isDark
													? `0 3px 15px ${levelColor}60, 0 0 20px ${levelColor}40`
													: `0 3px 12px ${levelColor}50`,
												textTransform: 'uppercase',
												letterSpacing: '0.5px',
												'& .MuiChip-label': {
													px: 1,
													textShadow: isDark ? `0 0 8px ${levelColor}80` : 'none',
												},
											}}
										/>
									</Box>

									{/* Decorative divider */}
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 0.5,
											opacity: 0.8,
											mt: 2.5,
											mb: -2.5,
										}}>
										<Box
											sx={{
												flex: 1,
												height: '1px',
												background: isDark
													? `linear-gradient(90deg, transparent 0%, ${rarity === 'legendary' ? 'rgba(239, 68, 68, 0.6)' : rarity === 'epic' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.4)'} 100%)`
													: `linear-gradient(90deg, transparent 0%, ${rarity === 'legendary' ? 'rgba(239, 68, 68, 0.5)' : rarity === 'epic' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)'} 100%)`,
											}}
										/>
										<Box
											sx={{
												width: 3,
												height: 3,
												background: levelColor,
												transform: 'rotate(45deg)',
												boxShadow: `0 0 4px ${levelColor}`,
											}}
										/>
										<Box
											sx={{
												width: 2,
												height: 2,
												background: levelColor,
												borderRadius: '50%',
												opacity: 0.6,
											}}
										/>
										<Box
											sx={{
												width: 3,
												height: 3,
												background: levelColor,
												transform: 'rotate(45deg)',
												boxShadow: `0 0 4px ${levelColor}`,
											}}
										/>
										<Box
											sx={{
												flex: 1,
												height: '1px',
												background: isDark
													? `linear-gradient(90deg, ${rarity === 'legendary' ? 'rgba(239, 68, 68, 0.6)' : rarity === 'epic' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.4)'} 0%, transparent 100%)`
													: `linear-gradient(90deg, ${rarity === 'legendary' ? 'rgba(239, 68, 68, 0.5)' : rarity === 'epic' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)'} 0%, transparent 100%)`,
											}}
										/>
									</Box>
								</Box>
							</Box>
						</Box>
					</Paper>
					)
				})}
			</Box>
		)
	}

	// Version desktop - tableau
	return (
		<TableContainer
			component={Paper}
			sx={{
				borderRadius: 4,
				boxShadow: isDark
					? '0 4px 20px rgba(139, 92, 246, 0.25)'
					: '0 4px 20px rgba(139, 92, 246, 0.15)',
				border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
				overflow: 'hidden',
				background: isDark
					? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
					: 'background.paper',
			}}>
			<Table>
				<TableHead>
					<TableRow
						sx={{
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						}}>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '60px',
							}}>
							{/* Empty for icon */}
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
							}}>
							Title
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '150px',
							}}>
							Section
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '120px',
								textAlign: 'center',
							}}>
							Level
						</TableCell>
						<TableCell
							sx={{
								color: 'white',
								fontWeight: 700,
								fontSize: '0.95rem',
								py: 2,
								width: '80px',
								textAlign: 'center',
							}}>
							Status
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{materials.map((material, index) => (
						<TableRow
							key={material.id}
							onClick={() => handleRowClick(material)}
							sx={{
								cursor: 'pointer',
								backgroundColor: index % 2 === 0
									? 'rgba(139, 92, 246, 0.03)'
									: isDark ? 'rgba(15, 23, 42, 0.5)' : 'white',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								'&:hover': {
									backgroundColor: 'rgba(139, 92, 246, 0.08)',
									transform: 'scale(1.005)',
									boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
								},
								'&:active': {
									transform: 'scale(0.99)',
								},
							}}>
							{/* Image/Icon Column */}
							<TableCell sx={{ py: 2 }}>
								{index === 0 ? (
									<Box
										sx={{
											width: 50,
											height: 50,
											borderRadius: 1.5,
											overflow: 'hidden',
											position: 'relative',
											boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
										}}>
										<Box
											component='img'
											src={getImageUrl(material.image)}
											alt={material.title}
											sx={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
										/>
									</Box>
								) : (
									<Avatar
										src={getImageUrl(material.image)}
										alt={material.title}
										variant="rounded"
										sx={{
											width: 50,
											height: 50,
											boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
										}}
									/>
								)}
							</TableCell>

							{/* Title Column */}
							<TableCell sx={{ py: 2 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
									{getIcon(material.section)}
									<Typography
										sx={{
											fontSize: '1rem',
											fontWeight: 700,
											background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text',
										}}>
										{material.title}
									</Typography>
								</Box>
							</TableCell>

							{/* Section Column */}
							<TableCell sx={{ py: 2 }}>
								<Typography
									sx={{
										fontSize: '0.9rem',
										fontWeight: 600,
										color: isDark ? '#94a3b8' : '#718096',
									}}>
									{material.section}
								</Typography>
							</TableCell>

							{/* Level Column */}
							<TableCell sx={{ py: 2, textAlign: 'center' }}>
								<Chip
									label={getLevelLabel(material.level)}
									sx={{
										backgroundColor: getLevelColor(material.level),
										color: 'white',
										fontWeight: 600,
										fontSize: '0.85rem',
										height: '28px',
										boxShadow: `0 2px 8px ${getLevelColor(material.level)}40`,
									}}
								/>
							</TableCell>

							{/* Status Column */}
							<TableCell sx={{ py: 2, textAlign: 'center' }}>
								{getStatusIcon(material.id)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default React.memo(MaterialsTable)
