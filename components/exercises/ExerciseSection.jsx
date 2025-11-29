'use client'

import { useState, useEffect } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { GraduationCap, ChevronDown, ChevronUp, LockOpen, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@/lib/supabase'
import { useUserContext } from '@/context/user'
import { useRouter, usePathname, useParams } from 'next/navigation'
import toast from '@/utils/toast'
import { useTranslations } from 'next-intl'
import FillInTheBlank from './FillInTheBlank'
import AudioDictation from './AudioDictation'
import MultipleChoice from './MultipleChoice'
import DragAndDrop from './DragAndDrop'
import { logger } from '@/utils/logger'
import { submitExercise } from '@/lib/exercises-client'

/**
 * Exercise Section Component
 * Displays exercises associated with a material
 *
 * @param {number} materialId - ID of the material
 */
const ExerciseSection = ({ materialId }) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()
	const { user, isUserLoggedIn, refreshUserProfile } = useUserContext()
	const supabase = createBrowserClient()
	const router = useRouter()
	const params = useParams()

	const [exercises, setExercises] = useState([])
	const [loading, setLoading] = useState(true)
	const [activeExerciseId, setActiveExerciseId] = useState(null)
	const [expanded, setExpanded] = useState(false)
	const [exerciseProgress, setExerciseProgress] = useState({})

	// Traductions des titres d'exercices
	const titleTranslations = {
		"Comprehension de l'audio": {
			en: "Audio comprehension",
			ru: "Понимание аудио",
			fr: "Comprehension de l'audio"
		},
		"Comprehension du texte": {
			en: "Text comprehension",
			ru: "Понимание текста",
			fr: "Comprehension du texte"
		},
		"Questions de comprehension": {
			en: "Comprehension questions",
			ru: "Вопросы на понимание",
			fr: "Questions de comprehension"
		},
		"Association de vocabulaire": {
			en: "Vocabulary matching",
			ru: "Словарные пары",
			fr: "Association de vocabulaire"
		}
	}

	const getTranslatedTitle = (exerciseTitle) => {
		const locale = params.locale || 'fr'
		if (titleTranslations[exerciseTitle]) {
			return titleTranslations[exerciseTitle][locale] || exerciseTitle
		}
		return exerciseTitle
	}

	useEffect(() => {
		const loadData = async () => {
			if (!materialId) return

			setLoading(true)

			const { data: exercisesData, error: exercisesError } = await supabase
				.from('exercises')
				.select('*')
				.eq('material_id', materialId)
				.order('id', { ascending: true })

			if (exercisesError) {
				logger.error('Error loading exercises:', exercisesError)
			} else {
				setExercises(exercisesData || [])
				if (exercisesData && exercisesData.length > 0) {
					setExpanded(true)
				}

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

	const handleExerciseComplete = async (result) => {
		if (!isUserLoggedIn) {
			toast.info('Connectez-vous pour sauvegarder votre progression !')
			return { isFirstCompletion: false, xpAwarded: 0 }
		}

		try {
			const data = await submitExercise(result)

			if (data.success) {
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

				if (data.xpAwarded > 0 || data.goldAwarded > 0) {
					await refreshUserProfile()
				}

				if (data.isFirstCompletion && data.xpAwarded > 0) {
					toast.success(t('exerciseCompletedXP', { xp: data.xpAwarded }))
				} else if (result.score === 100 && !data.isFirstCompletion) {
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
			logger.error('Error submitting exercise:', error)
			toast.error(t('saveError'))
			return { isFirstCompletion: false, xpAwarded: 0 }
		}
	}

	const handleStartExercise = (exerciseId) => {
		setActiveExerciseId(exerciseId)
	}

	const handleCloseExercise = () => {
		setActiveExerciseId(null)
	}

	if (loading) {
		return null
	}

	if (exercises.length === 0) {
		return null
	}

	const activeExercise = exercises.find(e => e.id === activeExerciseId)

	return (
		<div className="mb-8">
			{/* Section Header */}
			<Card
				className={cn(
					'p-4 rounded-2xl cursor-pointer',
					isDark
						? 'bg-gradient-to-br from-slate-800/95 to-slate-900/90 border-violet-500/30'
						: 'bg-gradient-to-br from-white/95 to-white/90 border-violet-500/20'
				)}
				onClick={() => !activeExerciseId && setExpanded(!expanded)}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className={cn(
							'w-12 h-12 rounded-xl flex items-center justify-center',
							'bg-gradient-to-br from-violet-500/15 to-cyan-500/10',
							'border border-violet-500/30'
						)}>
							<GraduationCap className="w-7 h-7 text-violet-500" />
						</div>
						<div>
							<h3 className={cn('font-bold text-xl md:text-2xl', isDark ? 'text-white' : 'text-slate-900')}>
								{t('exercises')}
							</h3>
							<p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
								{t('exercisesAvailable', { count: exercises.length })}
							</p>
						</div>
					</div>
					{!activeExerciseId && (
						expanded ? (
							<ChevronUp className="w-8 h-8 text-violet-500" />
						) : (
							<ChevronDown className="w-8 h-8 text-violet-500" />
						)
					)}
				</div>
			</Card>

			{/* Exercises List or Active Exercise */}
			{expanded && (
				<div className="mt-4">
					{activeExercise ? (
						<div>
							<Button
								variant="ghost"
								onClick={handleCloseExercise}
								className="mb-4"
							>
								{t('backToExercises')}
							</Button>
							{activeExercise.type === 'fill_in_blank' && (
								activeExercise.data?.sentences?.[0]?.audioUrl ? (
									<AudioDictation
										exercise={activeExercise}
										onComplete={handleExerciseComplete}
									/>
								) : (
									<FillInTheBlank
										exercise={activeExercise}
										onComplete={handleExerciseComplete}
									/>
								)
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
						</div>
					) : (
						<div className="grid gap-4">
							{!isUserLoggedIn && (
								<Card
									className={cn(
										'p-6 rounded-2xl relative overflow-hidden',
										isDark
											? 'bg-gradient-to-br from-violet-500/15 to-cyan-500/15 border-2 border-violet-500/40'
											: 'bg-gradient-to-br from-violet-500/8 to-cyan-500/8 border-2 border-violet-500/30'
									)}
								>
									{/* Top gradient bar */}
									<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500" />

									<div className="text-center">
										{/* Icon */}
										<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 mb-6 shadow-lg shadow-violet-500/30">
											<LockOpen className="w-10 h-10 text-white" />
										</div>

										{/* Title */}
										<h4 className="font-bold text-2xl md:text-3xl mb-4 bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
											{t('unlockExercisesTitle')}
										</h4>

										{/* Description */}
										<p className={cn(
											'mb-6 text-base md:text-lg leading-relaxed',
											isDark ? 'text-slate-300' : 'text-slate-600'
										)}>
											{t('unlockExercisesDescription')}
										</p>

										{/* Benefits */}
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
											<div className="flex flex-col items-center gap-2">
												<Trophy className="w-8 h-8 text-amber-400" />
												<p className={cn('font-semibold text-sm text-center', isDark ? 'text-slate-200' : 'text-slate-700')}>
													{t('earnXP')}
													<br />
													<span className={cn('font-normal text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
														{t('levelUp')}
													</span>
												</p>
											</div>
											<div className="flex flex-col items-center gap-2">
												<TrendingUp className="w-8 h-8 text-emerald-500" />
												<p className={cn('font-semibold text-sm text-center', isDark ? 'text-slate-200' : 'text-slate-700')}>
													{t('trackProgress')}
													<br />
													<span className={cn('font-normal text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
														{t('overTime')}
													</span>
												</p>
											</div>
											<div className="flex flex-col items-center gap-2">
												<GraduationCap className="w-8 h-8 text-violet-500" />
												<p className={cn('font-semibold text-sm text-center', isDark ? 'text-slate-200' : 'text-slate-700')}>
													{t('exercisesCount', { count: exercises.length })}
													<br />
													<span className={cn('font-normal text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
														{t('forThisMaterial')}
													</span>
												</p>
											</div>
										</div>

										{/* CTA Button */}
										<Button
											size="lg"
											onClick={() => router.push('/signup')}
											className={cn(
												'px-8 py-6 text-base font-bold rounded-xl',
												'bg-gradient-to-r from-violet-500 to-cyan-500 text-white',
												'shadow-lg shadow-violet-500/40',
												'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50',
												'transition-all duration-300'
											)}
										>
											{t('createFreeAccount')}
										</Button>

										{/* Small text */}
										<p className={cn('mt-4 text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
											{t('alreadyHaveAccount')}{' '}
											<span
												className="text-violet-500 font-semibold cursor-pointer hover:underline"
												onClick={() => router.push('/login')}
											>
												{t('signIn')}
											</span>
										</p>
									</div>
								</Card>
							)}

							{exercises.map((exercise) => {
								const progress = exerciseProgress[exercise.id]
								const isCompleted = progress?.score === 100
								const hasProgress = progress && progress.score > 0 && progress.score < 100

								return (
									<Card
										key={exercise.id}
										className={cn(
											'p-4 rounded-xl transition-all duration-200',
											!isUserLoggedIn && 'opacity-70',
											isCompleted
												? 'border-2 border-emerald-500 bg-gradient-to-br from-emerald-500/8 to-emerald-500/3'
												: hasProgress
													? 'border-2 border-amber-400 bg-gradient-to-br from-amber-400/8 to-amber-400/3'
													: isDark
														? 'border-violet-500/20'
														: 'border-violet-500/10',
											'hover:-translate-y-0.5',
											isCompleted
												? 'hover:shadow-lg hover:shadow-emerald-500/30'
												: hasProgress
													? 'hover:shadow-lg hover:shadow-amber-400/30'
													: 'hover:shadow-lg hover:shadow-violet-500/20 hover:border-violet-500'
										)}
									>
										<div className="flex justify-between items-start gap-4">
											<div className="flex-1">
												<h4 className={cn(
													'font-semibold text-base md:text-lg mb-2',
													isDark ? 'text-white' : 'text-slate-900'
												)}>
													{getTranslatedTitle(exercise.title)}
												</h4>
												<div className="flex gap-2 flex-wrap">
													<span className={cn(
														'px-2.5 py-1 rounded-lg text-xs font-semibold',
														exercise.level === 'beginner'
															? 'bg-emerald-500/10 text-emerald-500'
															: exercise.level === 'intermediate'
																? 'bg-amber-400/10 text-amber-500'
																: 'bg-red-500/10 text-red-500'
													)}>
														{t(exercise.level)}
													</span>
													<span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-500/10 text-violet-500">
														{t('questionsCount', { count: exercise.data?.questions?.length || exercise.data?.sentences?.length || 0 })}
													</span>
													<span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-500">
														+{exercise.xp_reward} XP
													</span>
													{isUserLoggedIn && exerciseProgress[exercise.id] && (
														<span className={cn(
															'px-2.5 py-1 rounded-lg text-xs font-semibold',
															exerciseProgress[exercise.id].score === 100
																? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
																: 'bg-amber-400/10 text-amber-500'
														)}>
															{exerciseProgress[exercise.id].score === 100 ? (
																<>&#10003; {t('completed')}</>
															) : (
																<>
																	{Math.round((exerciseProgress[exercise.id].score / 100) * (exercise.data?.questions?.length || exercise.data?.sentences?.length || 0))}/{exercise.data?.questions?.length || exercise.data?.sentences?.length || 0} {t('correct')}
																</>
															)}
														</span>
													)}
												</div>
											</div>
											{isUserLoggedIn ? (
												<Button
													onClick={() => handleStartExercise(exercise.id)}
													className={cn(
														'px-4 py-2 font-semibold whitespace-nowrap',
														'bg-gradient-to-r from-violet-500 to-cyan-500 text-white',
														'hover:opacity-90'
													)}
												>
													{t('startExercise')}
												</Button>
											) : (
												<Button
													variant="outline"
													disabled
													className="px-4 py-2 font-semibold whitespace-nowrap border-violet-500 text-violet-500 opacity-60"
												>
													{t('lockedExercise')}
												</Button>
											)}
										</div>
									</Card>
								)
							})}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default ExerciseSection
