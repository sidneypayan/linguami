import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Button,
	Paper,
	Alert,
	Collapse,
	useTheme,
	Chip,
} from '@mui/material'
import { School, ExpandMore, ExpandLess, LockOpen, EmojiEvents, TrendingUp } from '@mui/icons-material'
import { createBrowserClient } from '../../lib/supabase'
import { useUserContext } from '../../context/user'
import { useRouter } from 'next/router'
import toast from '../../utils/toast'
import useTranslation from 'next-translate/useTranslation'
import FillInTheBlank from './FillInTheBlank'
import MultipleChoice from './MultipleChoice'
import DragAndDrop from './DragAndDrop'
import LoadingSpinner from '../LoadingSpinner'

/**
 * Exercise Section Component
 * Displays exercises associated with a material
 *
 * @param {number} materialId - ID of the material
 */
const ExerciseSection = ({ materialId }) => {
	const { t } = useTranslation('materials')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user, isUserLoggedIn, refreshUserProfile } = useUserContext()
	const supabase = createBrowserClient()
	const router = useRouter()

	const [exercises, setExercises] = useState([])
	const [loading, setLoading] = useState(true)
	const [activeExerciseId, setActiveExerciseId] = useState(null)
	const [expanded, setExpanded] = useState(false)
	const [exerciseProgress, setExerciseProgress] = useState({}) // { exerciseId: { score, attempts } }

	// Traductions des titres d'exercices
	const titleTranslations = {
		"Compréhension de l'audio": {
			en: "Audio comprehension",
			ru: "Понимание аудио",
			fr: "Compréhension de l'audio"
		},
		"Compréhension du texte": {
			en: "Text comprehension",
			ru: "Понимание текста",
			fr: "Compréhension du texte"
		},
		"Questions de compréhension": {
			en: "Comprehension questions",
			ru: "Вопросы на понимание",
			fr: "Questions de compréhension"
		},
		"Association de vocabulaire": {
			en: "Vocabulary matching",
			ru: "Словарные пары",
			fr: "Association de vocabulaire"
		}
	}

	// Fonction pour obtenir le titre traduit
	const getTranslatedTitle = (exerciseTitle) => {
		const locale = router.locale || 'fr'

		// Si une traduction existe pour ce titre
		if (titleTranslations[exerciseTitle]) {
			return titleTranslations[exerciseTitle][locale] || exerciseTitle
		}

		// Sinon, retourner le titre original
		return exerciseTitle
	}

	// Load exercises for this material
	useEffect(() => {
		const loadData = async () => {
			if (!materialId) return

			setLoading(true)

			// Load exercises
			const { data: exercisesData, error: exercisesError } = await supabase
				.from('exercises')
				.select('*')
				.eq('material_id', materialId)
				.order('id', { ascending: true })

			if (exercisesError) {
				console.error('Error loading exercises:', exercisesError)
			} else {
				setExercises(exercisesData || [])
				// Auto-expand if there are exercises
				if (exercisesData && exercisesData.length > 0) {
					setExpanded(true)
				}

				// Load user progress for these exercises if logged in
				if (isUserLoggedIn && user && exercisesData && exercisesData.length > 0) {
					const exerciseIds = exercisesData.map(ex => ex.id)
					const { data: progressData } = await supabase
						.from('user_exercise_progress')
						.select('*')
						.eq('user_id', user.id)
						.in('exercise_id', exerciseIds)

					if (progressData) {
						const progressMap = {}
						progressData.forEach(p => {
							progressMap[p.exercise_id] = {
								score: p.score,
								attempts: p.attempts
							}
						})
						setExerciseProgress(progressMap)
					}
				}
			}

			setLoading(false)
		}

		loadData()
	}, [materialId, isUserLoggedIn, user, supabase])

	// Handle exercise completion
	const handleExerciseComplete = async (result) => {
		if (!isUserLoggedIn) {
			toast.info('Connectez-vous pour sauvegarder votre progression !')
			return { isFirstCompletion: false, xpAwarded: 0 }
		}

		try {
			const response = await fetch('/api/exercises/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(result),
			})

			const data = await response.json()

			if (response.ok && data.success) {
				// Reload progress for this exercise
				const { data: progressData } = await supabase
					.from('user_exercise_progress')
					.select('*')
					.eq('user_id', user.id)
					.eq('exercise_id', result.exerciseId)
					.single()

				if (progressData) {
					setExerciseProgress(prev => ({
						...prev,
						[result.exerciseId]: {
							score: progressData.score,
							attempts: progressData.attempts
						}
					}))
				}

				// Refresh user profile to update XP and Gold display
				if (data.xpAwarded > 0 || data.goldAwarded > 0) {
					await refreshUserProfile()
				}

				if (data.isFirstCompletion && data.xpAwarded > 0) {
					toast.success(t('exerciseCompletedXP', { xp: data.xpAwarded }))
				} else if (result.score === 100 && !data.isFirstCompletion) {
					// 100% but already completed before - show different message
					toast.info(t('exerciseCompletedAlready'))
				} else {
					toast.success(t('exerciseCompleted'))
				}
				return { isFirstCompletion: data.isFirstCompletion, xpAwarded: data.xpAwarded }
			} else {
				toast.error(t('saveError'))
				return { isFirstCompletion: false, xpAwarded: 0 }
			}
		} catch (error) {
			console.error('Error submitting exercise:', error)
			toast.error(t('saveError'))
			return { isFirstCompletion: false, xpAwarded: 0 }
		}
	}

	// Start exercise
	const handleStartExercise = (exerciseId) => {
		setActiveExerciseId(exerciseId)
	}

	// Close exercise
	const handleCloseExercise = () => {
		setActiveExerciseId(null)
	}

	if (loading) {
		return null // Don't show anything while loading
	}

	if (exercises.length === 0) {
		return null // Don't show section if no exercises
	}

	const activeExercise = exercises.find(e => e.id === activeExerciseId)

	return (
		<Box sx={{ mb: 4 }}>
			{/* Section Header */}
			<Paper
				elevation={0}
				sx={{
					p: 3,
					borderRadius: 4,
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
					cursor: 'pointer',
				}}
				onClick={() => !activeExerciseId && setExpanded(!expanded)}>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box
							sx={{
								width: 48,
								height: 48,
								borderRadius: 3,
								background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
								border: '1px solid rgba(139, 92, 246, 0.3)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<School sx={{ fontSize: '1.75rem', color: '#8b5cf6' }} />
						</Box>
						<Box>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 700,
									fontSize: { xs: '1.25rem', md: '1.5rem' },
								}}>
								{t('exercises')}
							</Typography>
							<Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
								{t('exercisesAvailable', { count: exercises.length })}
							</Typography>
						</Box>
					</Box>
					{!activeExerciseId && (
						expanded ? (
							<ExpandLess sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
						) : (
							<ExpandMore sx={{ color: '#8b5cf6', fontSize: '2rem' }} />
						)
					)}
				</Box>
			</Paper>

			{/* Exercises List or Active Exercise */}
			<Collapse in={expanded}>
				<Box sx={{ mt: 2 }}>
					{activeExercise ? (
						<Box>
							<Button
								variant="text"
								onClick={handleCloseExercise}
								sx={{ mb: 2 }}>
								{t('backToExercises')}
							</Button>
							{activeExercise.type === 'fill_in_blank' && (
								<FillInTheBlank
									exercise={activeExercise}
									onComplete={handleExerciseComplete}
								/>
							)}
							{activeExercise.type === 'mcq' && (
								<MultipleChoice
									exercise={activeExercise}
									onComplete={handleExerciseComplete}
								/>
							)}
							{activeExercise.type === 'drag_and_drop' && (
								<DragAndDrop
									exercise={activeExercise}
									onComplete={handleExerciseComplete}
								/>
							)}
						</Box>
					) : (
						<Box sx={{ display: 'grid', gap: 2 }}>
							{!isUserLoggedIn && (
								<Paper
									elevation={0}
									sx={{
										p: 4,
										borderRadius: 4,
										background: isDark
											? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
											: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
										border: isDark ? '2px solid rgba(139, 92, 246, 0.4)' : '2px solid rgba(139, 92, 246, 0.3)',
										position: 'relative',
										overflow: 'hidden',
										'&::before': {
											content: '""',
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											height: '4px',
											background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
										}
									}}>
									<Box sx={{ textAlign: 'center' }}>
										{/* Icon */}
										<Box
											sx={{
												display: 'inline-flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: 80,
												height: 80,
												borderRadius: '50%',
												background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
												mb: 3,
												boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
											}}>
											<LockOpen sx={{ fontSize: '2.5rem', color: 'white' }} />
										</Box>

										{/* Title */}
										<Typography
											variant="h5"
											sx={{
												fontWeight: 700,
												mb: 2,
												background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
												WebkitBackgroundClip: 'text',
												WebkitTextFillColor: 'transparent',
												backgroundClip: 'text',
												fontSize: { xs: '1.5rem', md: '1.75rem' },
											}}>
											{t('unlockExercisesTitle')}
										</Typography>

										{/* Description */}
										<Typography
											variant="body1"
											sx={{
												color: isDark ? '#cbd5e1' : '#475569',
												mb: 3,
												fontSize: { xs: '0.95rem', md: '1.05rem' },
												lineHeight: 1.6,
											}}>
											{t('unlockExercisesDescription')}
										</Typography>

										{/* Benefits */}
										<Box
											sx={{
												display: 'grid',
												gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
												gap: 2,
												mb: 4,
											}}>
											<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
												<EmojiEvents sx={{ fontSize: '2rem', color: '#fbbf24' }} />
												<Typography
													variant="body2"
													sx={{
														fontWeight: 600,
														color: isDark ? '#e2e8f0' : '#334155',
														textAlign: 'center',
													}}>
													{t('earnXP')}
													<br />
													<Typography component="span" variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
														{t('levelUp')}
													</Typography>
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
												<TrendingUp sx={{ fontSize: '2rem', color: '#10b981' }} />
												<Typography
													variant="body2"
													sx={{
														fontWeight: 600,
														color: isDark ? '#e2e8f0' : '#334155',
														textAlign: 'center',
													}}>
													{t('trackProgress')}
													<br />
													<Typography component="span" variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
														{t('overTime')}
													</Typography>
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
												<School sx={{ fontSize: '2rem', color: '#8b5cf6' }} />
												<Typography
													variant="body2"
													sx={{
														fontWeight: 600,
														color: isDark ? '#e2e8f0' : '#334155',
														textAlign: 'center',
													}}>
													{t('exercisesCount', { count: exercises.length })}
													<br />
													<Typography component="span" variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
														{t('forThisMaterial')}
													</Typography>
												</Typography>
											</Box>
										</Box>

										{/* CTA Button */}
										<Button
											variant="contained"
											size="large"
											onClick={() => router.push('/register')}
											sx={{
												background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
												color: 'white',
												px: 4,
												py: 1.5,
												fontSize: '1rem',
												fontWeight: 700,
												borderRadius: 3,
												textTransform: 'none',
												boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
												transition: 'all 0.3s',
												'&:hover': {
													transform: 'translateY(-2px)',
													boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)',
												},
											}}>
											{t('createFreeAccount')}
										</Button>

										{/* Small text */}
										<Typography
											variant="caption"
											sx={{
												display: 'block',
												mt: 2,
												color: isDark ? '#94a3b8' : '#64748b',
												fontSize: '0.85rem',
											}}>
											{t('alreadyHaveAccount')}{' '}
											<Typography
												component="span"
												sx={{
													color: '#8b5cf6',
													fontWeight: 600,
													cursor: 'pointer',
													'&:hover': {
														textDecoration: 'underline',
													},
												}}
												onClick={() => router.push('/login')}>
												{t('signIn')}
											</Typography>
										</Typography>
									</Box>
								</Paper>
							)}
							{exercises.map((exercise) => {
								const progress = exerciseProgress[exercise.id]
								const isCompleted = progress?.score === 100
								const hasProgress = progress && progress.score > 0 && progress.score < 100

								return (
									<Paper
										key={exercise.id}
										elevation={0}
										sx={{
											p: 3,
											borderRadius: 3,
											border: isCompleted
												? '2px solid #10b981'
												: hasProgress
													? '2px solid #fbbf24'
													: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.1)',
											transition: 'all 0.2s',
											opacity: !isUserLoggedIn ? 0.7 : 1,
											background: isCompleted
												? isDark
													? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)'
													: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)'
												: hasProgress
													? isDark
														? 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.03) 100%)'
														: 'linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(251, 191, 36, 0.02) 100%)'
													: 'transparent',
											'&:hover': {
												borderColor: isCompleted ? '#10b981' : hasProgress ? '#fbbf24' : '#8b5cf6',
												transform: 'translateY(-2px)',
												boxShadow: isCompleted
													? '0 4px 12px rgba(16, 185, 129, 0.3)'
													: hasProgress
														? '0 4px 12px rgba(251, 191, 36, 0.3)'
														: '0 4px 12px rgba(139, 92, 246, 0.2)',
											}
										}}>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
										<Box sx={{ flex: 1 }}>
											<Typography
												variant="h6"
												sx={{
													fontWeight: 600,
													mb: 1,
													fontSize: { xs: '1rem', md: '1.25rem' }
												}}>
												{getTranslatedTitle(exercise.title)}
											</Typography>
											<Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
												<Typography
													variant="caption"
													sx={{
														px: 1.5,
														py: 0.5,
														borderRadius: 2,
														backgroundColor: exercise.level === 'beginner'
															? 'rgba(16, 185, 129, 0.1)'
															: exercise.level === 'intermediate'
																? 'rgba(251, 191, 36, 0.1)'
																: 'rgba(239, 68, 68, 0.1)',
														color: exercise.level === 'beginner'
															? '#10b981'
															: exercise.level === 'intermediate'
																? '#fbbf24'
																: '#ef4444',
														fontWeight: 600,
													}}>
													{t(exercise.level)}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														px: 1.5,
														py: 0.5,
														borderRadius: 2,
														backgroundColor: 'rgba(139, 92, 246, 0.1)',
														color: '#8b5cf6',
														fontWeight: 600,
													}}>
													{t('questionsCount', { count: exercise.data?.questions?.length || 0 })}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														px: 1.5,
														py: 0.5,
														borderRadius: 2,
														backgroundColor: 'rgba(6, 182, 212, 0.1)',
														color: '#06b6d4',
														fontWeight: 600,
													}}>
													+{exercise.xp_reward} XP
												</Typography>
												{isUserLoggedIn && exerciseProgress[exercise.id] && (
													<Typography
														variant="caption"
														sx={{
															px: 1.5,
															py: 0.5,
															borderRadius: 2,
															backgroundColor: exerciseProgress[exercise.id].score === 100
																? '#10b981'
																: 'rgba(251, 191, 36, 0.1)',
															color: exerciseProgress[exercise.id].score === 100
																? 'white'
																: '#fbbf24',
															fontWeight: exerciseProgress[exercise.id].score === 100 ? 700 : 600,
															boxShadow: exerciseProgress[exercise.id].score === 100
																? '0 2px 8px rgba(16, 185, 129, 0.3)'
																: 'none',
														}}>
														{exerciseProgress[exercise.id].score === 100 ? (
															<>✅ {t('completed')}</>
														) : (
															<>
																{Math.round((exerciseProgress[exercise.id].score / 100) * (exercise.data?.questions?.length || 0))}/{exercise.data?.questions?.length || 0} {t('correct')}
															</>
														)}
													</Typography>
												)}
											</Box>
										</Box>
										{isUserLoggedIn ? (
											<Button
												variant="contained"
												onClick={() => handleStartExercise(exercise.id)}
												sx={{
													background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
													px: 3,
													py: 1,
													fontSize: '0.875rem',
													fontWeight: 600,
													whiteSpace: 'nowrap',
												}}>
												{t('startExercise')}
											</Button>
										) : (
											<Button
												variant="outlined"
												disabled
												sx={{
													px: 3,
													py: 1,
													fontSize: '0.875rem',
													fontWeight: 600,
													whiteSpace: 'nowrap',
													borderColor: '#8b5cf6',
													color: '#8b5cf6',
													opacity: 0.6,
												}}>
												{t('lockedExercise')}
											</Button>
										)}
									</Box>
								</Paper>
							)
						})}
						</Box>
					)}
				</Box>
			</Collapse>
		</Box>
	)
}

export default ExerciseSection
