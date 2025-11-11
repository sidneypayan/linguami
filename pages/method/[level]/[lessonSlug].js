import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import useTranslation from 'next-translate/useTranslation'
import {
	Container,
	Box,
	Typography,
	Button,
	Chip,
	LinearProgress,
	IconButton,
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
import Link from 'next/link'
import SEO from '@/components/SEO'
import LoadingSpinner from '@/components/LoadingSpinner'
import LessonNavigator from '@/components/courses/LessonNavigator'
import PaywallBlock from '@/components/courses/PaywallBlock'
import UpsellModal from '@/components/courses/UpsellModal'
import {
	getCoursesByLevel,
	getLevels,
	completeCourseLesson,
	getUserAccess,
	loadLocalProgress,
	completeLocalLessonAction,
} from '@/features/courses/coursesSlice'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'

const LessonPage = () => {
	const router = useRouter()
	const { level: levelSlug, lessonSlug } = router.query
	const { t, lang } = useTranslation('common')
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { isUserLoggedIn, userProfile, userLearningLanguage, isUserAdmin } = useUserContext()

	// Redux state - MUST be before conditional return
	const { levels, courses, courses_loading, courses_error, userProgress, userAccess } = useSelector(
		(state) => state.courses
	)

	// State - MUST be before conditional return
	const [lessonCompleted, setLessonCompleted] = useState(false)
	const [showUpsellModal, setShowUpsellModal] = useState(false)

	// Get learning language from context (handles both authenticated and non-authenticated users)
	const learningLanguage = userLearningLanguage

	// Get spoken language (for translations in lessons)
	// Use interface language as fallback for non-authenticated users
	const spokenLanguage = userProfile?.spoken_language || lang

	// Find current level, course, and lesson
	const currentLevel = levels.find((l) => l.slug === levelSlug)
	const currentCourse = courses.find(
		(c) => c.level_id === currentLevel?.id && c.target_language === learningLanguage
	)
	const currentLesson = currentCourse?.course_lessons?.find((l) => l.slug === lessonSlug)

	// Load levels if not loaded
	useEffect(() => {
		if (levels.length === 0) {
			dispatch(getLevels())
		}
	}, [levels.length, dispatch])

	// Load courses for this level
	useEffect(() => {
		if (!currentLevel) return

		dispatch(getCoursesByLevel({ levelId: currentLevel.id }))
	}, [currentLevel, dispatch])

	// Load user access if logged in
	useEffect(() => {
		if (isUserLoggedIn) {
			dispatch(getUserAccess(lang))
		}
	}, [isUserLoggedIn, lang, dispatch])

	// Load local progress if not logged in
	useEffect(() => {
		if (!isUserLoggedIn) {
			dispatch(loadLocalProgress())
		}
	}, [isUserLoggedIn, dispatch])

	// Check if lesson is completed
	useEffect(() => {
		if (currentLesson && userProgress) {
			const progress = userProgress.find((p) => p.lesson_id === currentLesson.id)
			setLessonCompleted(progress?.is_completed || false)
		}
	}, [currentLesson, userProgress])

	// Redirect non-admins
	useEffect(() => {
		if (!isUserAdmin) {
			router.replace('/')
		}
	}, [isUserAdmin, router])

	// Don't render for non-admins
	if (!isUserAdmin) {
		return null
	}

	const handleMarkComplete = async () => {
		if (!currentLesson) return

		try {
			if (isUserLoggedIn) {
				// Save to database for logged in users
				await dispatch(completeCourseLesson(currentLesson.id)).unwrap()
				setLessonCompleted(true)
				toast.success(t('methode_lesson_completed_toast'))
			} else {
				// Save to localStorage for non-logged in users
				dispatch(completeLocalLessonAction(currentLesson.id))
				setLessonCompleted(true)
				toast.success(t('methode_lesson_completed_toast'))
			}

			// Check if we should show upsell modal
			const isFirstLesson = currentCourse?.course_lessons?.[0]?.id === currentLesson.id
			const levelIsFree = currentLevel?.is_free === true
			const hasLevelAccess = isUserLoggedIn
				? userAccess?.some((access) => access.level_id === currentLevel?.id)
				: false

			// Show upsell modal if: 1st lesson + level not free + user doesn't have access
			if (isFirstLesson && !levelIsFree && !hasLevelAccess) {
				setShowUpsellModal(true)
			}
		} catch (error) {
			toast.error(t('methode_save_error'))
		}
	}

	// Check if user has premium status
	const isPremiumUser = userProfile?.is_premium || false

	const handlePurchase = () => {
		// TODO: Implement purchase flow
		console.log('Purchase clicked')
		toast.info('Fonctionnalité de paiement à venir !')
		setShowUpsellModal(false)
	}

	if (courses_loading) {
		return <LoadingSpinner />
	}

	if (courses_error) {
		return (
			<Container maxWidth="md" sx={{ pt: 10, textAlign: 'center' }}>
				<Typography variant="h5" color="error">
					{t('methode_error')} : {courses_error}
				</Typography>
				<Button
					variant="contained"
					sx={{ mt: 2 }}
					onClick={() => router.push('/method')}>
					{t('methode_back')}
				</Button>
			</Container>
		)
	}

	if (!currentLesson) {
		return (
			<Container maxWidth="md" sx={{ pt: 10, textAlign: 'center' }}>
				<Typography variant="h5">{t('methode_lesson_not_found')}</Typography>
				<Button
					variant="contained"
					sx={{ mt: 2 }}
					onClick={() => router.push('/method')}>
					{t('methode_back')}
				</Button>
			</Container>
		)
	}

	const titleKey = `title_${lang}`
	const objectivesKey = `objectives_${lang}`
	const blocksKey = `blocks_${spokenLanguage}` // Use spoken language for lesson content
	const levelName = currentLevel?.[`name_${lang}`] || levelSlug

	// Get objectives in current language, fallback to objectives or objectives_fr
	const objectives = currentLesson[objectivesKey] || currentLesson.objectives || currentLesson.objectives_fr || []

	// Get blocks in spoken language (user's native language for translations)
	const blocks = currentLesson[blocksKey] || currentLesson.blocks || currentLesson.blocks_fr || []

	// Check if user has access to this lesson
	const isFreeLesson = currentLesson.is_free === true
	const userHasAccess = isFreeLesson || isUserLoggedIn // TODO: Add premium check later

	return (
		<>
			<SEO
				title={`${currentLesson[titleKey]} | ${t('methode_title')}`}
				description={`${t('methode_lesson')} ${currentLesson[titleKey]} - ${objectives.join(', ')}`}
				path={`/method/${levelSlug}/${lessonSlug}`}
			/>

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
							href={`/method/${levelSlug}`}
							sx={{
								color: 'text.secondary',
								textDecoration: 'none',
								'&:hover': { color: 'primary.main' },
							}}>
							{levelName}
						</MuiLink>
						<Typography color="text.primary">{currentLesson[titleKey]}</Typography>
					</Breadcrumbs>

					{/* Title */}
					<Typography
						variant="h3"
						sx={{
							fontWeight: 700,
							mb: 2,
							fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
						}}>
						{currentLesson[titleKey]}
					</Typography>

					{/* Meta info */}
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
						{currentLesson.estimated_minutes && (
							<Chip
								icon={<AccessTime />}
								label={`${currentLesson.estimated_minutes} min`}
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
							lessonId={currentLesson?.id}
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
								onClick={() => router.push(`/method/${levelSlug}`)}>
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
			<UpsellModal
				open={showUpsellModal}
				onClose={() => setShowUpsellModal(false)}
				levelName={currentLevel?.[`name_${lang}`] || levelSlug}
				isPremium={isPremiumUser}
				onPurchase={handlePurchase}
			/>
		</>
	)
}

export default LessonPage
