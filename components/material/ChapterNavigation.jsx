'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
	Box,
	Button,
	Typography,
	Paper,
	useTheme,
	Chip,
} from '@mui/material'
import {
	ArrowBackRounded,
	ArrowForwardRounded,
	CheckCircleRounded,
	Schedule,
} from '@mui/icons-material'

/**
 * ChapterNavigation component - Previous/Next navigation buttons for book chapters
 * Displays at the bottom of chapter content with chapter titles
 *
 * @param {Object} previousChapter - Previous chapter object (null if first chapter)
 * @param {Object} nextChapter - Next chapter object (null if last chapter)
 * @param {Array} userMaterialsStatus - User's material completion status
 */
const ChapterNavigation = ({ previousChapter, nextChapter, userMaterialsStatus = [] }) => {
	const t = useTranslations('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()

	// Get completion status for a chapter
	const getChapterStatus = (chapterId) => {
		return userMaterialsStatus.find(um => um.material_id === chapterId)
	}

	const handleNavigate = (chapterId) => {
		router.push(`/materials/book-chapters/${chapterId}`)
	}

	if (!previousChapter && !nextChapter) {
		return null // Don't render if there are no navigation options
	}

	return (
		<Box
			sx={{
				mt: 6,
				mb: 4,
				px: { xs: 2, sm: 3 },
			}}
		>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: previousChapter && nextChapter
						? { xs: '1fr', sm: '1fr 1fr' }
						: '1fr',
					gap: { xs: 2, sm: 3 },
					maxWidth: '1200px',
					mx: 'auto',
				}}
			>
				{/* Previous Chapter Button */}
				{previousChapter && (
					<Paper
						onClick={() => handleNavigate(previousChapter.id)}
						sx={{
							p: 3,
							cursor: 'pointer',
							borderRadius: 3,
							border: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
							background: isDark
								? 'linear-gradient(135deg, rgba(20, 20, 35, 0.9) 0%, rgba(30, 25, 50, 0.85) 100%)'
								: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 245, 255, 0.9) 100%)',
							backdropFilter: 'blur(10px)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)',
								opacity: 0,
								transition: 'opacity 0.3s ease',
							},
							'&:hover': {
								transform: 'translateX(-4px) translateY(-2px)',
								boxShadow: isDark
									? '0 12px 32px rgba(139, 92, 246, 0.3)'
									: '0 12px 32px rgba(139, 92, 246, 0.2)',
								borderColor: '#8b5cf6',
								'&::before': {
									opacity: 1,
								},
							},
							'&:active': {
								transform: 'translateX(-2px) translateY(-1px)',
							},
						}}
					>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							{/* Header */}
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
								<ArrowBackRounded
									sx={{
										fontSize: '1.8rem',
										color: '#8b5cf6',
									}}
								/>
								<Typography
									sx={{
										fontSize: '0.9rem',
										fontWeight: 700,
										color: isDark ? 'rgba(139, 92, 246, 0.85)' : 'rgba(139, 92, 246, 0.75)',
										textTransform: 'uppercase',
										letterSpacing: '0.8px',
									}}
								>
									{t('previous') || 'Chapitre précédent'}
								</Typography>
							</Box>

							{/* Chapter Title */}
							<Typography
								sx={{
									fontSize: { xs: '1.05rem', sm: '1.15rem' },
									fontWeight: 700,
									color: isDark ? '#e5e7eb' : '#1f2937',
									lineHeight: 1.4,
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}}
							>
								{previousChapter.title}
							</Typography>

							{/* Status Badge */}
							{getChapterStatus(previousChapter.id)?.is_studied && (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<CheckCircleRounded
										sx={{
											fontSize: '1.3rem',
											color: '#10b981',
											filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))',
										}}
									/>
									<Typography
										sx={{
											fontSize: '0.9rem',
											fontWeight: 700,
											color: '#10b981',
										}}
									>
										{t('completed_badge')}
									</Typography>
								</Box>
							)}
							{!getChapterStatus(previousChapter.id)?.is_studied && getChapterStatus(previousChapter.id)?.is_being_studied && (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Schedule
										sx={{
											fontSize: '1.3rem',
											color: '#a855f7',
											filter: 'drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3))',
										}}
									/>
									<Typography
										sx={{
											fontSize: '0.9rem',
											fontWeight: 700,
											color: '#a855f7',
										}}
									>
										{t('being_studied') || 'En cours'}
									</Typography>
								</Box>
							)}
						</Box>
					</Paper>
				)}

				{/* Spacer for grid when only one button */}
				{!previousChapter && nextChapter && (
					<Box sx={{ display: { xs: 'none', sm: 'block' } }} />
				)}

				{/* Next Chapter Button */}
				{nextChapter && (
					<Paper
						onClick={() => handleNavigate(nextChapter.id)}
						sx={{
							p: 3,
							cursor: 'pointer',
							borderRadius: 3,
							border: `2px solid ${isDark ? 'rgba(6, 182, 212, 0.3)' : 'rgba(6, 182, 212, 0.2)'}`,
							background: isDark
								? 'linear-gradient(135deg, rgba(20, 35, 45, 0.9) 0%, rgba(15, 40, 50, 0.85) 100%)'
								: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 250, 255, 0.9) 100%)',
							backdropFilter: 'blur(10px)',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							position: 'relative',
							overflow: 'hidden',
							'&::before': {
								content: '""',
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'linear-gradient(135deg, transparent 0%, rgba(6, 182, 212, 0.05) 100%)',
								opacity: 0,
								transition: 'opacity 0.3s ease',
							},
							'&:hover': {
								transform: 'translateX(4px) translateY(-2px)',
								boxShadow: isDark
									? '0 12px 32px rgba(6, 182, 212, 0.3)'
									: '0 12px 32px rgba(6, 182, 212, 0.2)',
								borderColor: '#06b6d4',
								'&::before': {
									opacity: 1,
								},
							},
							'&:active': {
								transform: 'translateX(2px) translateY(-1px)',
							},
						}}
					>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
							{/* Header */}
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
								<Typography
									sx={{
										fontSize: '0.9rem',
										fontWeight: 700,
										color: isDark ? 'rgba(6, 182, 212, 0.85)' : 'rgba(6, 182, 212, 0.75)',
										textTransform: 'uppercase',
										letterSpacing: '0.8px',
									}}
								>
									{t('next') || 'Chapitre suivant'}
								</Typography>
								<ArrowForwardRounded
									sx={{
										fontSize: '1.8rem',
										color: '#06b6d4',
									}}
								/>
							</Box>

							{/* Chapter Title */}
							<Typography
								sx={{
									fontSize: { xs: '1.05rem', sm: '1.15rem' },
									fontWeight: 700,
									color: isDark ? '#e5e7eb' : '#1f2937',
									lineHeight: 1.4,
									textAlign: { xs: 'left', sm: 'right' },
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}}
							>
								{nextChapter.title}
							</Typography>

							{/* Status Badge */}
							{getChapterStatus(nextChapter.id)?.is_studied && (
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
									<CheckCircleRounded
										sx={{
											fontSize: '1.3rem',
											color: '#10b981',
											filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))',
										}}
									/>
									<Typography
										sx={{
											fontSize: '0.9rem',
											fontWeight: 700,
											color: '#10b981',
										}}
									>
										{t('completed_badge')}
									</Typography>
								</Box>
							)}
							{!getChapterStatus(nextChapter.id)?.is_studied && getChapterStatus(nextChapter.id)?.is_being_studied && (
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
									<Schedule
										sx={{
											fontSize: '1.3rem',
											color: '#a855f7',
											filter: 'drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3))',
										}}
									/>
									<Typography
										sx={{
											fontSize: '0.9rem',
											fontWeight: 700,
											color: '#a855f7',
										}}
									>
										{t('being_studied') || 'En cours'}
									</Typography>
								</Box>
							)}
						</Box>
					</Paper>
				)}
			</Box>
		</Box>
	)
}

export default ChapterNavigation
