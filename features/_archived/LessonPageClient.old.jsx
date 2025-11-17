'use client'

import { useState, useEffect } from 'react'
import { useRouterCompat } from '@/hooks/shared/useRouterCompat'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslations, useLocale } from 'next-intl'
import {
	Container,
	Box,
	Typography,
	Button,
	Chip,
	useTheme,
	Breadcrumbs,
	Link as MuiLink,
} from '@mui/material'
import {
	CheckCircle,
	ArrowBack,
	ArrowForward,
	AccessTime,
	NavigateNext,
} from '@mui/icons-material'
import { Link } from '@/i18n/navigation'
import LessonNavigator from '@/components/courses/LessonNavigator'
import PaywallBlock from '@/components/courses/PaywallBlock'
import UpsellModal from '@/components/courses/UpsellModal'
import {
	completeCourseLesson,
	loadLocalProgress,
	completeLocalLessonAction,
} from '@/features/courses/coursesSlice'
import toast from '@/utils/toast'
import { logger } from '@/utils/logger'

const LessonPageClient = ({
	level,
	course,
	lesson,
	spokenLanguage,
	userHasAccess,
	isPremium,
	isUserLoggedIn,
	initialProgress,
}) => {
	const router = useRouterCompat()
	const t = useTranslations('common')
	const locale = useLocale()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	// Local state
	const [lessonCompleted, setLessonCompleted] = useState(false)
	const [showUpsellModal, setShowUpsellModal] = useState(false)

	// Redux state for progress tracking
	const { userProgress } = useSelector((state) => state.courses)

	// Load local progress for non-authenticated users
	useEffect(() => {
		if (!isUserLoggedIn) {
			dispatch(loadLocalProgress())
		}
	}, [isUserLoggedIn, dispatch])

	// Check if lesson is completed
	useEffect(() => {
		if (lesson && userProgress) {
			const progress = userProgress.find((p) => p.lesson_id === lesson.id)
			setLessonCompleted(progress?.is_completed || false)
		} else if (lesson && initialProgress) {
			const progress = initialProgress.find((p) => p.lesson_id === lesson.id)
			setLessonCompleted(progress?.is_completed || false)
		}
	}, [lesson, userProgress, initialProgress])

	const handleMarkComplete = async () => {
		if (!lesson) return

		try {
			if (isUserLoggedIn) {
				// Save to database for logged in users
				await dispatch(completeCourseLesson(lesson.id)).unwrap()
				setLessonCompleted(true)
				toast.success(t('methode_lesson_completed_toast'))
			} else {
				// Save to localStorage for non-logged in users
				dispatch(completeLocalLessonAction(lesson.id))
				setLessonCompleted(true)
				toast.success(t('methode_lesson_completed_toast'))
			}

			// Check if we should show upsell modal
			const isFirstLesson = course?.course_lessons?.[0]?.id === lesson.id
			const levelIsFree = level?.is_free === true

			// Show upsell modal if: 1st lesson + level not free + user doesn't have access
			if (isFirstLesson && !levelIsFree && !userHasAccess) {
				setShowUpsellModal(true)
			}
		} catch (error) {
			toast.error(t('methode_save_error'))
		}
	}

	const handlePurchase = () => {
		// TODO: Implement purchase flow
		logger.log('Purchase clicked')
		toast.info('Fonctionnalité de paiement à venir !')
		setShowUpsellModal(false)
	}

	const titleKey = `title_${locale}`
	const objectivesKey = `objectives_${locale}`
	const blocksKey = `blocks_${spokenLanguage}` // Use spoken language for lesson content
	const levelName = level?.[`name_${locale}`] || level?.slug

	// Get objectives in current language, fallback to objectives or objectives_fr
	const objectives =
		lesson?.[objectivesKey] ||
		lesson?.objectives ||
		lesson?.objectives_fr ||
		[]

	// Get blocks in spoken language (user's native language for translations)
	// Prefer blocks_fr/blocks_ru/blocks_en based on spoken language, fallback to blocks
	const blocks =
		lesson?.[blocksKey] && lesson[blocksKey].length > 0
			? lesson[blocksKey]
			: lesson?.blocks && lesson.blocks.length > 0
				? lesson.blocks
				: []

	return (
		<>
			{/* Header */}
			<Box
				sx={{
					pt: { xs: '4rem', md: '5rem' },
					pb: { xs: 2, md: 3 },
					borderBottom: '1px solid',
					borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
					background: isDark
						? 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
						: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
				}}>
				<Container maxWidth="lg">
					{/* Breadcrumbs */}
					<Breadcrumbs
						separator={<NavigateNext fontSize="small" />}
						sx={{ mb: 2 }}
						aria-label="breadcrumb">
						<MuiLink
							component={Link}
							href="/method"
							sx={{
								color: 'text.secondary',
								textDecoration: 'none',
								'&:hover': { color: 'primary.main' },
							}}>
							{t('methode_title')}
						</MuiLink>
						<MuiLink
							component={Link}
							href={`/method/${level?.slug}`}
							sx={{
								color: 'text.secondary',
								textDecoration: 'none',
								'&:hover': { color: 'primary.main' },
							}}>
							{levelName}
						</MuiLink>
						<Typography color="text.primary">{lesson?.[titleKey]}</Typography>
					</Breadcrumbs>

					{/* Title */}
					<Typography
						variant="h3"
						sx={{
							fontWeight: 700,
							mb: 2,
							fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
						}}>
						{lesson?.[titleKey]}
					</Typography>

					{/* Meta info */}
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
						{lesson?.estimated_minutes && (
							<Chip
								icon={<AccessTime />}
								label={`${lesson.estimated_minutes} min`}
								size="small"
								variant="outlined"
							/>
						)}
						{lessonCompleted && (
							<Chip
								icon={<CheckCircle />}
								label={t('methode_completed')}
								size="small"
								color="success"
							/>
						)}
					</Box>

					{/* Objectives */}
					{objectives && objectives.length > 0 && (
						<Box>
							<Typography
								variant="subtitle2"
								sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
								{t('methode_objectives')} :
							</Typography>
							<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
								{objectives.map((obj, index) => (
									<Chip
										key={index}
										label={obj}
										size="small"
										sx={{
											background: isDark
												? 'rgba(139, 92, 246, 0.2)'
												: 'rgba(139, 92, 246, 0.1)',
											color: '#8b5cf6',
											fontWeight: 500,
										}}
									/>
								))}
							</Box>
						</Box>
					)}
				</Container>
			</Box>

			{/* Content */}
			<Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
				{/* Show paywall if user doesn't have access */}
				{!userHasAccess ? (
					<PaywallBlock isLoggedIn={isUserLoggedIn} />
				) : (
					<>
						{/* Lesson Navigator - Mode guidé / Vue d'ensemble */}
						<LessonNavigator
							blocks={blocks}
							lessonId={lesson?.id}
							onComplete={handleMarkComplete}
						/>

						{/* Navigation */}
						<Box
							sx={{
								mt: 6,
								pt: 4,
								borderTop: '1px solid',
								borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
								display: 'flex',
								justifyContent: 'space-between',
								gap: 2,
								flexWrap: 'wrap',
							}}>
							<Button
								variant="outlined"
								startIcon={<ArrowBack />}
								onClick={() => router.push(`/${locale}/method/${level?.slug}`)}>
								{t('methode_back_to_course')}
							</Button>

							{/* TODO: Add next lesson navigation */}
							<Button
								variant="contained"
								endIcon={<ArrowForward />}
								sx={{
									background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
								}}
								disabled>
								{t('methode_next_lesson')}
							</Button>
						</Box>
					</>
				)}
			</Container>

			{/* Upsell Modal */}
			{showUpsellModal && level && (
				<UpsellModal
					open={showUpsellModal}
					onClose={() => setShowUpsellModal(false)}
					levelName={level[`name_${locale}`] || level.slug}
					isPremium={isPremium}
					onPurchase={handlePurchase}
				/>
			)}
		</>
	)
}

export default LessonPageClient
