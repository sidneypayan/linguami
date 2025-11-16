'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouterCompat } from '@/hooks/useRouterCompat'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslations, useLocale } from 'next-intl'
import {
	Container,
	Box,
	Typography,
	Card,
	CardContent,
	LinearProgress,
	Chip,
	Button,
	Grid,
	useTheme,
	Breadcrumbs,
	Link as MuiLink,
} from '@mui/material'
import {
	CheckCircle,
	AccessTime,
	ArrowBack,
	NavigateNext,
} from '@mui/icons-material'
import { Link } from '@/i18n/navigation'
import SEO from '@/components/SEO'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getCoursesByLevel, getLevels, getUserProgressForCourse } from '@/features/courses/coursesSlice'
import { useUserContext } from '@/context/user'

const LevelLessonsPage = () => {
	const router = useRouterCompat()
	const params = useParams()
	const levelSlug = params.level
	const t = useTranslations('common')
	const locale = useLocale()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

	const { isUserLoggedIn, userProfile, userLearningLanguage, isUserAdmin, isBootstrapping } = useUserContext()

	// Redux state - MUST be before any conditional returns
	const { levels, courses, courses_loading, courses_error, userProgress } = useSelector(
		(state) => state.courses
	)

	// Get learning language from context (handles both authenticated and non-authenticated users)
	const learningLanguage = userLearningLanguage

	// Find current level
	const currentLevel = levels.find((l) => l.slug === levelSlug)

	// Find single course for this level (Option A: one course per level)
	const currentCourse = courses.find(
		(c) => c.level_id === currentLevel?.id && c.target_language === learningLanguage
	)

	const lessons = currentCourse?.course_lessons || []
	const titleKey = `title_${locale}`
	const descriptionKey = `description_${locale}`
	const levelName = currentLevel?.[`name_${locale}`] || levelSlug

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

	// Load user progress for this course
	useEffect(() => {
		if (currentCourse && isUserLoggedIn) {
			dispatch(getUserProgressForCourse(currentCourse.id))
		}
	}, [currentCourse, isUserLoggedIn, dispatch])

	// Redirect non-admins (temporary until courses are finalized)
	useEffect(() => {
		if (!isBootstrapping && !isUserAdmin) {
			router.replace('/')
		}
	}, [isBootstrapping, isUserAdmin, router])

	// Show loading while bootstrapping or if not admin
	if (isBootstrapping) {
		return <LoadingSpinner />
	}

	// Don't render for non-admins
	if (!isUserAdmin) {
		return null
	}

	// Calculate progress
	const completedLessons = userProgress.filter((p) => p.is_completed).length
	const totalLessons = lessons.length
	const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

	// Check if lesson is completed
	const isLessonCompleted = (lessonId) => {
		return userProgress.some((p) => p.lesson_id === lessonId && p.is_completed)
	}

	if (courses_loading || !currentLevel) {
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
					onClick={() => router.push(`/${locale}/method`)}>
					{t('methode_back')}
				</Button>
			</Container>
		)
	}

	if (!currentCourse) {
		return (
			<Container maxWidth="md" sx={{ pt: 10, textAlign: 'center' }}>
				<Typography variant="h5">{t('methode_no_courses')}</Typography>
				<Button
					variant="contained"
					sx={{ mt: 2 }}
					onClick={() => router.push(`/${locale}/method`)}>
					{t('methode_back')}
				</Button>
			</Container>
		)
	}

	return (
		<>
			<SEO
				title={`${levelName} | Linguami`}
				description={currentLevel?.[descriptionKey] || ''}
				path={`/method/${levelSlug}`}
			/>

			{/* Header */}
			<Box
				sx={{
					pt: { xs: '4rem', md: '5rem' },
					pb: { xs: 3, md: 4 },
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
						<Typography color="text.primary">{levelName}</Typography>
					</Breadcrumbs>

					{/* Title */}
					<Typography
						variant="h3"
						sx={{
							fontWeight: 700,
							mb: 2,
							fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
						}}>
						{levelName}
					</Typography>

					{/* Description */}
					{currentLevel?.[descriptionKey] && (
						<Typography
							variant="body1"
							sx={{
								mb: 3,
								color: 'text.secondary',
								fontSize: '1.1rem',
								maxWidth: '800px',
							}}>
							{currentLevel[descriptionKey]}
						</Typography>
					)}

					{/* Progress */}
					{isUserLoggedIn && totalLessons > 0 && (
						<Box sx={{ mb: 2 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
								<Typography variant="body2" sx={{ fontWeight: 600 }}>
									{t('methode_progress')}
								</Typography>
								<Typography variant="body2" sx={{ color: 'text.secondary' }}>
									{completedLessons} / {totalLessons} {t('methode_lessons_completed')}
								</Typography>
							</Box>
							<LinearProgress
								variant="determinate"
								value={progressPercentage}
								sx={{
									height: 8,
									borderRadius: 4,
									backgroundColor: isDark
										? 'rgba(139, 92, 246, 0.2)'
										: 'rgba(139, 92, 246, 0.1)',
									'& .MuiLinearProgress-bar': {
										background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
										borderRadius: 4,
									},
								}}
							/>
						</Box>
					)}

					{/* Stats */}
					<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
						<Chip
							icon={<AccessTime />}
							label={`${totalLessons} ${totalLessons > 1 ? t('methode_lessons') : t('methode_lesson')}`}
							size="small"
							variant="outlined"
						/>
						{currentCourse.estimated_hours && (
							<Chip
								icon={<AccessTime />}
								label={`~${currentCourse.estimated_hours} ${t('methode_hours_course')}`}
								size="small"
								variant="outlined"
							/>
						)}
					</Box>
				</Container>
			</Box>

			{/* Lessons List */}
			<Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
				<Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
					{t('methode_lessons')}
				</Typography>

				<Grid container spacing={3}>
					{lessons.map((lesson, index) => {
						const isCompleted = isLessonCompleted(lesson.id)
						const lessonTitle = lesson[titleKey]
						const objectivesKey = `objectives_${locale}`
						const lessonObjectives = lesson[objectivesKey] || lesson.objectives || lesson.objectives_fr || []

						return (
							<Grid item xs={12} key={lesson.id}>
								<Card
									elevation={0}
									sx={{
										border: '1px solid',
										borderColor: isDark
											? 'rgba(255, 255, 255, 0.1)'
											: 'rgba(0, 0, 0, 0.1)',
										background: isDark
											? 'rgba(30, 41, 59, 0.5)'
											: 'rgba(255, 255, 255, 0.9)',
										transition: 'all 0.2s',
										cursor: 'pointer',
										'&:hover': {
											borderColor: '#8b5cf6',
											transform: 'translateY(-2px)',
											boxShadow: isDark
												? '0 8px 16px rgba(139, 92, 246, 0.3)'
												: '0 8px 16px rgba(139, 92, 246, 0.2)',
										},
									}}
									onClick={() => router.push(`/${locale}/method/${levelSlug}/${lesson.slug}`)}>
									<CardContent>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												gap: 2,
											}}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
												{/* Lesson number */}
												<Box
													sx={{
														width: 48,
														height: 48,
														borderRadius: '50%',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														background: isCompleted
															? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
															: isDark
																? 'rgba(139, 92, 246, 0.2)'
																: 'rgba(139, 92, 246, 0.1)',
														color: isCompleted ? 'white' : '#8b5cf6',
														fontWeight: 700,
														fontSize: '1.2rem',
													}}>
													{isCompleted ? <CheckCircle /> : index + 1}
												</Box>

												<Box sx={{ flex: 1 }}>
													<Typography
														variant="h6"
														sx={{
															fontWeight: 600,
															mb: 0.5,
															fontSize: { xs: '1rem', sm: '1.25rem' },
														}}>
														{lessonTitle}
													</Typography>

													{/* Objectives chips */}
													{lessonObjectives && lessonObjectives.length > 0 && (
														<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
															{lessonObjectives.slice(0, 3).map((obj, idx) => (
																<Chip
																	key={idx}
																	label={obj}
																	size="small"
																	sx={{
																		fontSize: '0.75rem',
																		height: '24px',
																		background: isDark
																			? 'rgba(139, 92, 246, 0.2)'
																			: 'rgba(139, 92, 246, 0.1)',
																		color: '#8b5cf6',
																	}}
																/>
															))}
														</Box>
													)}
												</Box>
											</Box>

											{/* Duration & Status */}
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												{lesson.estimated_minutes && (
													<Chip
														icon={<AccessTime />}
														label={`${lesson.estimated_minutes} min`}
														size="small"
														variant="outlined"
													/>
												)}
												{isCompleted && (
													<Chip
														icon={<CheckCircle />}
														label={t('methode_completed')}
														size="small"
														color="success"
													/>
												)}
											</Box>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						)
					})}
				</Grid>

				{/* No lessons */}
				{lessons.length === 0 && (
					<Box
						sx={{
							textAlign: 'center',
							py: 8,
							color: 'text.secondary',
						}}>
						<Typography variant="h6">{t('methode_no_lessons')}</Typography>
					</Box>
				)}

				{/* Back button */}
				<Box sx={{ mt: 4 }}>
					<Button
						variant="outlined"
						startIcon={<ArrowBack />}
						onClick={() => router.push(`/${locale}/method`)}>
						{t('methode_back')}
					</Button>
				</Box>
			</Container>
		</>
	)
}

export default LevelLessonsPage
