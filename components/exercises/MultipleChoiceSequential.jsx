'use client'

import { useState, useEffect } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, Trophy, RotateCcw, Lightbulb } from 'lucide-react'

/**
 * MultipleChoiceSequential Component
 * Affiche les questions MCQ une par une de manière séquentielle
 *
 * @param {Object} exercise - L'exercice MCQ
 * @param {Function} onComplete - Callback quand l'exercice est terminé
 */
const MultipleChoiceSequential = ({ exercise, onComplete }) => {
	const { isDark } = useThemeMode()
	const { userProfile } = useUserContext()
	const router = useRouter()
	const t = useTranslations('common')
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [selectedAnswer, setSelectedAnswer] = useState(null)
	const [isAnswered, setIsAnswered] = useState(false)
	const [userAnswers, setUserAnswers] = useState([])
	const [isCompleted, setIsCompleted] = useState(false)
	const [shuffledQuestions, setShuffledQuestions] = useState([])

	const questions = exercise.data?.questions || []
	const totalQuestions = questions.length

	// Shuffle options for each question when questions are loaded
	useEffect(() => {
		if (questions.length > 0) {
			const shuffled = questions.map(q => {
				const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5)
				return {
					...q,
					options: shuffledOptions
				}
			})
			setShuffledQuestions(shuffled)
		}
	}, [questions.length]) // Run when questions are loaded

	const currentQuestion = shuffledQuestions[currentQuestionIndex]

	// Get user's spoken language for displaying questions
	const spokenLang = userProfile?.spoken_language || router.locale || 'fr'

	// Get question text in user's spoken language
	const getQuestionText = (question) => {
		if (spokenLang === 'ru' && question.question_ru) return question.question_ru
		if (spokenLang === 'en' && question.question_en) return question.question_en
		return question.question || question.question_fr || question.question_en
	}

	// Get explanation text in user's spoken language
	const getExplanationText = (question) => {
		if (spokenLang === 'ru' && question.explanation_ru) return question.explanation_ru
		if (spokenLang === 'en' && question.explanation_en) return question.explanation_en
		return question.explanation || question.explanation_fr || question.explanation_en || ''
	}

	// Calculer le score
	const correctAnswers = userAnswers.filter(a => a.isCorrect).length
	const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

	// Play celebration sound when exercise is completed with 100%
	useEffect(() => {
		if (isCompleted && score === 100) {
			playPerfectSound()
		}
	}, [isCompleted, score])

	// Play a gentle success sound
	const playCorrectSound = () => {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const masterGain = audioContext.createGain()
			masterGain.connect(audioContext.destination)
			masterGain.gain.setValueAtTime(0.1, audioContext.currentTime)

			// Single pleasant tone
			const osc = audioContext.createOscillator()
			const gain = audioContext.createGain()

			osc.connect(gain)
			gain.connect(masterGain)

			osc.frequency.setValueAtTime(659.25, audioContext.currentTime) // E5
			osc.type = 'sine'
			gain.gain.setValueAtTime(1, audioContext.currentTime)
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

			osc.start(audioContext.currentTime)
			osc.stop(audioContext.currentTime + 0.2)

			setTimeout(() => audioContext.close(), 300)
		} catch (error) {
			// Silently fail if audio context is not supported
		}
	}

	// Play a gentle error sound
	const playIncorrectSound = () => {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const masterGain = audioContext.createGain()
			masterGain.connect(audioContext.destination)
			masterGain.gain.setValueAtTime(0.08, audioContext.currentTime)

			const osc = audioContext.createOscillator()
			const gain = audioContext.createGain()

			osc.connect(gain)
			gain.connect(masterGain)

			osc.frequency.setValueAtTime(329.63, audioContext.currentTime) // E4
			osc.type = 'sine'
			gain.gain.setValueAtTime(1, audioContext.currentTime)
			gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

			osc.start(audioContext.currentTime)
			osc.stop(audioContext.currentTime + 0.2)

			setTimeout(() => audioContext.close(), 300)
		} catch (error) {
			// Silently fail if audio context is not supported
		}
	}

	// Play a celebration sound for 100% score
	const playPerfectSound = () => {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const masterGain = audioContext.createGain()
			masterGain.connect(audioContext.destination)
			masterGain.gain.setValueAtTime(0.12, audioContext.currentTime)

			// Simple ascending notes played sequentially
			const notes = [
				{ freq: 523.25, time: 0, duration: 0.15 },      // C5
				{ freq: 659.25, time: 0.12, duration: 0.15 },   // E5
				{ freq: 783.99, time: 0.24, duration: 0.2 }     // G5
			]

			notes.forEach(({ freq, time, duration }) => {
				const osc = audioContext.createOscillator()
				const gain = audioContext.createGain()

				osc.connect(gain)
				gain.connect(masterGain)

				osc.frequency.setValueAtTime(freq, audioContext.currentTime + time)
				osc.type = 'sine'
				gain.gain.setValueAtTime(1, audioContext.currentTime + time)
				gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + duration)

				osc.start(audioContext.currentTime + time)
				osc.stop(audioContext.currentTime + time + duration)
			})

			setTimeout(() => audioContext.close(), 600)
		} catch (error) {
			// Silently fail if audio context is not supported
		}
	}

	const handleOptionClick = (option) => {
		if (isAnswered) return

		// Check both key and text to support both formats
		const isCorrect = option.key === currentQuestion.correctAnswer || option.text === currentQuestion.correctAnswer
		setSelectedAnswer(option.key)
		setIsAnswered(true)

		// Play sound feedback
		if (isCorrect) {
			playCorrectSound()
		} else {
			playIncorrectSound()
		}

		// Enregistrer la réponse - save both key and text for easier retrieval in review
		setUserAnswers([...userAnswers, {
			questionId: currentQuestionIndex,
			selectedAnswer: option.key,
			selectedAnswerText: option.text,
			correctAnswer: currentQuestion.correctAnswer,
			isCorrect
		}])

		// Passer automatiquement à la question suivante après 1.5s
		setTimeout(() => {
			if (currentQuestionIndex < totalQuestions - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1)
				setSelectedAnswer(null)
				setIsAnswered(false)
			} else {
				// Exercice terminé
				setIsCompleted(true)
			}
		}, 1500)
	}

	const handleNextExercise = async () => {
		if (onComplete) {
			await onComplete({
				exerciseId: exercise.id,
				score,
				completed: true
			})
		}
	}

	const handleRetry = () => {
		// Re-shuffle options when retrying
		const shuffled = questions.map(q => {
			const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5)
			return {
				...q,
				options: shuffledOptions
			}
		})
		setShuffledQuestions(shuffled)
		setCurrentQuestionIndex(0)
		setSelectedAnswer(null)
		setIsAnswered(false)
		setUserAnswers([])
		setIsCompleted(false)
	}

	if (!currentQuestion && !isCompleted) {
		return (
			<Card className={cn('p-8 text-center', isDark ? 'bg-slate-800' : 'bg-white')}>
				<p className={cn('text-lg', isDark ? 'text-slate-300' : 'text-slate-600')}>
					{t('methode_exercise_no_questions')}
				</p>
			</Card>
		)
	}

	// Vue de l'exercice terminé
	if (isCompleted) {
		return (
			<Card className={cn(
				'p-6 sm:p-8',
				isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
			)}>
				{/* Résultat */}
				<div className={cn(
					'relative overflow-hidden rounded-2xl p-8 mb-6',
					'border-2',
					score === 100
						? cn(
							'bg-gradient-to-br',
							isDark
								? 'from-emerald-500/20 via-emerald-600/10 to-teal-500/20 border-emerald-500/40'
								: 'from-emerald-50 via-emerald-100/50 to-teal-50 border-emerald-300'
						)
						: score >= 60
							? cn(
								'bg-gradient-to-br',
								isDark
									? 'from-amber-500/20 via-orange-500/10 to-yellow-500/20 border-amber-500/40'
									: 'from-amber-50 via-orange-50/50 to-yellow-50 border-amber-300'
							)
							: cn(
								'bg-gradient-to-br',
								isDark
									? 'from-red-500/20 via-rose-500/10 to-pink-500/20 border-red-500/40'
									: 'from-red-50 via-rose-50/50 to-pink-50 border-red-300'
							)
				)}>
					<div className="flex items-center gap-6">
						{/* Icon */}
						<div className={cn(
							'w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg',
							score === 100
								? 'bg-gradient-to-br from-amber-400 to-amber-500'
								: score >= 60
									? 'bg-gradient-to-br from-amber-400 to-orange-500'
									: 'bg-gradient-to-br from-red-400 to-rose-500'
						)}>
							<Trophy className="w-10 h-10 text-white" />
						</div>

						{/* Content */}
						<div className="flex-1">
							<p className={cn(
								'text-3xl font-extrabold mb-2',
								score === 100
									? 'text-emerald-600 dark:text-emerald-400'
									: score >= 60
										? 'text-amber-600 dark:text-amber-400'
										: 'text-red-600 dark:text-red-400'
							)}>
								{score === 100 ? t('methode_exercise_perfect') : score >= 60 ? t('methode_exercise_good_job') : t('methode_exercise_keep_practicing')}
							</p>
							<p className={cn(
								'text-xl font-bold mb-1',
								isDark ? 'text-slate-200' : 'text-slate-700'
							)}>
								{t('methode_exercise_score')} : {score}%
							</p>
							<p className={cn(
								'text-base',
								isDark ? 'text-slate-400' : 'text-slate-600'
							)}>
								{correctAnswers}/{totalQuestions} {t('methode_exercise_correct_count')}
							</p>
						</div>
					</div>
				</div>

				{/* Review Section */}
				<div className="space-y-4 mb-8">
					<h4 className={cn(
						'text-lg font-bold mb-4',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						{t('methode_exercise_review')}
					</h4>
					{questions.map((question, index) => {
						// Find the user's answer by matching questionId with current index
						const userAnswer = userAnswers.find(ua => ua?.questionId === index)
						const isCorrect = userAnswer?.isCorrect || false
						const explanation = getExplanationText(question)

						// Get the user's answer text directly from saved data
						const userAnswerText = userAnswer?.selectedAnswerText

						// Find the correct option text from the original question
						const correctOption = question.options?.find(opt =>
							(typeof opt === 'string' ? opt : opt.key) === question.correctAnswer ||
							(typeof opt === 'string' ? opt : opt.text) === question.correctAnswer ||
							opt === question.correctAnswer
						)
						const correctAnswerText = typeof correctOption === 'string' ? correctOption : correctOption?.text

						return (
							<Card key={index} className={cn(
								'p-4 border-2',
								isDark ? 'bg-slate-700/50' : 'bg-slate-50',
								isCorrect
									? isDark ? 'border-emerald-500/40' : 'border-emerald-300'
									: isDark ? 'border-red-500/40' : 'border-red-300'
							)}>
								{/* Question */}
								<div className="mb-3">
									<p className={cn(
										'text-base font-medium mb-2',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{getQuestionText(question)}
									</p>
								</div>

								{/* Answers */}
								<div className={cn(
									"grid gap-3 mb-3",
									isCorrect ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
								)}>
									{/* User Answer */}
									<div className={cn(
										'p-3 rounded-lg border-2',
										isCorrect
											? isDark ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
											: isDark ? 'bg-red-950/30 border-red-500/40' : 'bg-red-50 border-red-300'
									)}>
										<div className="flex items-center gap-2 mb-1">
											{isCorrect ? (
												<Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
											) : (
												<X className="w-4 h-4 text-red-500 flex-shrink-0" />
											)}
											<span className={cn(
												'text-xs font-semibold uppercase',
												isCorrect
													? 'text-emerald-600 dark:text-emerald-400'
													: 'text-red-600 dark:text-red-400'
											)}>
												{t('methode_exercise_your_answer')}
											</span>
										</div>
										<p className={cn(
											'text-base font-medium',
											isDark ? 'text-slate-200' : 'text-slate-800'
										)}>
											{userAnswerText || <span className="italic text-slate-400">{t('methode_exercise_no_answer')}</span>}
										</p>
									</div>

									{/* Correct Answer - only show when answer is wrong */}
									{!isCorrect && (
										<div className={cn(
											'p-3 rounded-lg border-2',
											isDark ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
										)}>
											<div className="flex items-center gap-2 mb-1">
												<Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
												<span className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">
													{t('methode_exercise_correct_answer')}
												</span>
											</div>
											<p className={cn(
												'text-base font-medium',
												isDark ? 'text-slate-200' : 'text-slate-800'
											)}>
												{correctAnswerText}
											</p>
										</div>
									)}
								</div>

								{/* Explanation/Tip */}
								{explanation && (
									<div className={cn(
										'p-3 rounded-lg border-2',
										isDark ? 'bg-cyan-950/30 border-cyan-500/40' : 'bg-cyan-50 border-cyan-300'
									)}>
										<div className="flex items-start gap-2">
											<Lightbulb className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
											<div>
												<span className="text-xs font-semibold uppercase text-cyan-600 dark:text-cyan-400 block mb-1">
													{t('methode_exercise_tip')}
												</span>
												<p className={cn(
													'text-sm',
													isDark ? 'text-slate-300' : 'text-slate-700'
												)}>
													{explanation}
												</p>
											</div>
										</div>
									</div>
								)}
							</Card>
						)
					})}
				</div>

				{/* Actions */}
				<div className="flex gap-4 justify-center">
					<Button
						variant="outline"
						onClick={handleRetry}
						className={cn(
							'gap-2',
							isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300'
						)}
					>
						<RotateCcw className="w-4 h-4" />
						{t('methode_exercise_retry')}
					</Button>
					<Button
						onClick={handleNextExercise}
						className={cn(
							'gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600'
						)}
					>
						{t('methode_exercise_next')}
						<ArrowRight className="w-4 h-4" />
					</Button>
				</div>
			</Card>
		)
	}

	// Vue de la question en cours
	return (
		<Card className={cn(
			'p-6 sm:p-8',
			isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
		)}>
			{/* Progress bar */}
			<div className="mb-6">
				<div className="flex justify-between items-center mb-2">
					<span className={cn(
						'text-sm font-medium',
						isDark ? 'text-slate-400' : 'text-slate-600'
					)}>
						{t('methode_exercise_question_of', { current: currentQuestionIndex + 1, total: totalQuestions })}
					</span>
					<span className={cn(
						'text-sm font-bold',
						isDark ? 'text-violet-400' : 'text-violet-600'
					)}>
						{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
					</span>
				</div>
				<div className={cn(
					'h-2 rounded-full overflow-hidden',
					isDark ? 'bg-slate-700' : 'bg-slate-200'
				)}>
					<div
						className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
						style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
					/>
				</div>
			</div>

			{/* Question */}
			<h3 className={cn(
				'text-xl sm:text-2xl font-bold mb-6',
				isDark ? 'text-white' : 'text-slate-900'
			)}>
				{getQuestionText(currentQuestion)}
			</h3>

			{/* Options */}
			<div className="space-y-3">
				{currentQuestion.options?.map((option, idx) => {
					// Support both formats: array of strings OR array of objects
					const optionKey = typeof option === 'string' ? String.fromCharCode(65 + idx) : option.key // A, B, C, ...
					const optionText = typeof option === 'string' ? option : option.text

					const isSelected = selectedAnswer === optionKey
					// Check both key and text to support both correctAnswer formats
					const isCorrect = optionKey === currentQuestion.correctAnswer || optionText === currentQuestion.correctAnswer || option === currentQuestion.correctAnswer
					const showResult = isAnswered

					return (
						<button
							key={`${currentQuestionIndex}-${optionKey}`}
							onClick={() => handleOptionClick({ key: optionKey, text: optionText })}
							disabled={isAnswered}
							className={cn(
								'w-full p-4 rounded-xl text-left transition-all duration-200',
								'border-2 font-medium',
								!showResult && !isSelected && (
									isDark
										? 'border-slate-700 bg-slate-900 hover:border-violet-500 hover:bg-slate-800'
										: 'border-slate-200 bg-white hover:border-violet-500 hover:bg-violet-50'
								),
								!showResult && isSelected && 'border-violet-500 bg-violet-500/10',
								showResult && isSelected && isCorrect && 'border-emerald-500 bg-emerald-500/10',
								showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500/10',
								showResult && !isSelected && isCorrect && 'border-emerald-500 bg-emerald-500/5',
								isAnswered && 'cursor-not-allowed'
							)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className={cn(
										'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold',
										!showResult && (
											isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
										),
										showResult && isCorrect && 'bg-emerald-500 text-white',
										showResult && !isCorrect && isSelected && 'bg-red-500 text-white',
										showResult && !isCorrect && !isSelected && (
											isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
										)
									)}>
										{optionKey}
									</span>
									<span className={cn(
										isDark ? 'text-slate-200' : 'text-slate-900'
									)}>
										{optionText}
									</span>
								</div>

								{/* Result icon */}
								{showResult && isCorrect && (
									<Check className="w-6 h-6 text-emerald-500 flex-shrink-0" />
								)}
								{showResult && isSelected && !isCorrect && (
									<X className="w-6 h-6 text-red-500 flex-shrink-0" />
								)}
							</div>
						</button>
					)
				})}
			</div>
		</Card>
	)
}

export default MultipleChoiceSequential
