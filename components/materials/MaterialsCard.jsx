import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Box, Typography, Chip } from '@mui/material'
import { PlayCircleOutline } from '@mui/icons-material'

const MaterialsCard = ({ material }) => {
	const { t } = useTranslation('materials')

	// Déterminer le niveau de difficulté
	const getDifficultyColor = (level) => {
		switch (level) {
			case 'beginner':
				return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#059669' }
			case 'intermediate':
				return { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#d97706' }
			case 'advanced':
				return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#dc2626' }
			default:
				return { bg: 'rgba(139, 92, 246, 0.15)', border: '#8b5cf6', text: '#7c3aed' }
		}
	}

	const difficultyColors = getDifficultyColor(material.level)

	return (
		<Link href={`/materials/${material.section}`}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}>
				<Box
					sx={{
						position: 'relative',
						cursor: 'pointer',
						width: '100%',
						height: { xs: 160, sm: 170, md: 180 },
						borderRadius: 4,
						overflow: 'hidden',
						background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
						border: '1px solid rgba(139, 92, 246, 0.2)',
						boxShadow: '0 4px 20px rgba(139, 92, 246, 0.15)',
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
							zIndex: 1,
						},
						'&:hover': {
							transform: 'translateY(-8px) scale(1.02)',
							boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.3) inset',
							borderColor: 'rgba(139, 92, 246, 0.4)',
							'&::before': {
								opacity: 1,
							},
							'& .play-overlay': {
								opacity: 1,
								transform: 'translate(-50%, -50%) scale(1)',
							},
							'& .material-image': {
								transform: 'scale(1.1)',
							},
						},
						'&:active': {
							transform: 'translateY(-4px) scale(1)',
						},
					}}>
					{/* Image */}
					<Box
						className="material-image"
						sx={{
							position: 'relative',
							width: '100%',
							height: '100%',
							transition: 'transform 0.4s ease',
						}}>
						<Box
							component='img'
							src={`${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${material.img}`}
							alt={material.title}
							sx={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
							}}
						/>
					</Box>

					{/* Overlay au hover */}
					<Box
						className="play-overlay"
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%) scale(0.8)',
							opacity: 0,
							zIndex: 3,
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							pointerEvents: 'none',
						}}>
						<Box
							sx={{
								width: 64,
								height: 64,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.95) 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5)',
								border: '2px solid rgba(255, 255, 255, 0.5)',
							}}>
							<PlayCircleOutline sx={{ fontSize: '2.5rem', color: 'white' }} />
						</Box>
					</Box>
				</Box>

				{/* Titre et badge de difficulté */}
				<Box
					sx={{
						mt: 2,
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						justifyContent: 'space-between',
					}}>
					<Typography
						variant='subtitle1'
						sx={{
							fontWeight: 700,
							fontSize: { xs: '0.95rem', sm: '1.05rem' },
							background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							lineHeight: 1.3,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							flex: 1,
						}}>
						{t(material.section)}
					</Typography>

					{/* Badge de difficulté */}
					{material.level && (
						<Chip
							label={t(material.level)}
							size="small"
							sx={{
								background: difficultyColors.bg,
								border: `1.5px solid ${difficultyColors.border}`,
								color: difficultyColors.text,
								fontWeight: 700,
								fontSize: '0.7rem',
								height: 26,
								flexShrink: 0,
								pointerEvents: 'none',
								'& .MuiChip-label': {
									px: 1.5,
								},
							}}
						/>
					)}
				</Box>
			</Box>
		</Link>
	)
}

export default MaterialsCard
