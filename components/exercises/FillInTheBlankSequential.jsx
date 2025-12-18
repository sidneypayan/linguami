'use client'

import { useState, useEffect } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, Trophy, RotateCcw, Edit3, Lightbulb } from 'lucide-react'

/**
 * FillInTheBlankSequential Component
 * Affiche les phrases à compléter
 *
 * @param {Object} exercise - L'exercice Fill in the Blank
 * @param {Function} onComplete - Callback quand l'exercice est terminé
 */
const FillInTheBlankSequential = ({ exercise, onComplete }) => {
	const { isDark } = useThemeMode()
	const { userProfile } = useUserContext()
	const router = useRouter()
	const t = useTranslations('common')
	const [answers, setAnswers] = useState({})
	const [isChecked, setIsChecked] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)

	const sentences = exercise.data?.sentences || []

	// Get user's spoken language
	const spokenLang = userProfile?.spoken_language || router.locale || 'fr'

	// Get sentence text in user's spoken language
	const getSentenceText = (sentence) => {
		if (!sentence) return ''
		// The sentence might have different language versions
		if (typeof sentence.question === 'object') {
			if (spokenLang === 'ru' && sentence.question.ru) return sentence.question.ru
			if (spokenLang === 'en' && sentence.question.en) return sentence.question.en
			return sentence.question.fr || sentence.question.en || sentence.question.ru || ''
		}
		return sentence.question || sentence.sentence || ''
	}

	// Get hint in user's spoken language
	const getHint = (sentence) => {
		if (!sentence.hint) return ''
		if (typeof sentence.hint === 'object') {
			if (spokenLang === 'ru' && sentence.hint.ru) return sentence.hint.ru
			if (spokenLang === 'en' && sentence.hint.en) return sentence.hint.en
			return sentence.hint.fr || sentence.hint.en || sentence.hint.ru || ''
		}
		return sentence.hint || ''
	}

	// Check if answer is correct
	const isAnswerCorrect = (sentenceIndex) => {
		const sentence = sentences[sentenceIndex]
		const userAnswer = answers[sentenceIndex]?.trim().toLowerCase()
		if (!userAnswer) return false

		const acceptableAnswers = sentence.acceptableAnswers || [sentence.answer]
		return acceptableAnswers.some(ans => ans.toLowerCase() === userAnswer)
	}

	// Calculate score
	const correctAnswers = sentences.filter((_, idx) => isAnswerCorrect(idx)).length
	const score = sentences.length > 0 ? Math.round((correctAnswers / sentences.length) * 100) : 0

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

	// Play celebration sound when exercise is completed with 100%
	useEffect(() => {
		if (isCompleted && score === 100) {
			playPerfectSound()
		}
	}, [isCompleted, score])

	const handleAnswerChange = (index, value) => {
		if (isChecked) return
		setAnswers({ ...answers, [index]: value })
	}

	const handleCheck = () => {
		setIsChecked(true)
		// Show completion screen after a short delay, regardless of score
		setTimeout(() => setIsCompleted(true), 1500)
	}

	const handleRetry = () => {
		setAnswers({})
		setIsChecked(false)
		setIsCompleted(false)
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

	if (!sentences.length) {
		return (
			<Card className={cn('p-8 text-center', isDark ? 'bg-slate-800' : 'bg-white')}>
				<p className={cn('text-lg', isDark ? 'text-slate-300' : 'text-slate-600')}>
					{t('methode_exercise_no_sentences')}
				</p>
			</Card>
		)
	}

	// Completion screen
	if (isCompleted) {
		return (
			<Card className={cn(
				'p-6 sm:p-8',
				isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
			)}>
				{/* Result */}
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
								{correctAnswers}/{sentences.length} {t('methode_exercise_correct_count')}
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
					{sentences.map((sentence, index) => {
						const isCorrect = isAnswerCorrect(index)
						// Get the user's answer - check if it exists in the answers object
						const userAnswer = (index in answers) ? String(answers[index]) : ''
						const correctAnswer = sentence.answer
						const acceptableAnswers = sentence.acceptableAnswers || [sentence.answer]
						const hint = getHint(sentence)

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
										{getSentenceText(sentence)}
									</p>
								</div>

								{/* Answers */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
											{userAnswer.trim() ? userAnswer : <span className="italic text-slate-400">{t('methode_exercise_no_answer')}</span>}
										</p>
									</div>

									{/* Correct Answer */}
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
												{acceptableAnswers.join(' / ')}
											</p>
										</div>
									)}
								</div>

								{/* Tip */}
								{hint && (
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
													{hint}
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

	// Main exercise view
	return (
		<Card className={cn(
			'p-6 sm:p-8',
			isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
		)}>
			{/* Instructions */}
			<div className="mb-6 text-center">
				<div className="flex items-center justify-center gap-2 mb-2">
					<Edit3 className={cn('w-5 h-5', isDark ? 'text-violet-400' : 'text-violet-600')} />
					<h3 className={cn(
						'text-lg font-bold',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						{t('methode_exercise_fill_instruction')}
					</h3>
				</div>
				<p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
					{t('methode_exercise_fill_help')}
				</p>
			</div>

			{/* Progress */}
			<div className="flex justify-between items-center mb-6">
				<span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
					{Object.keys(answers).filter(k => answers[k]).length} / {sentences.length} {t('methode_exercise_answers')}
				</span>
				{isChecked && (
					<span className={cn(
						'text-sm font-bold',
						score === 100 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'
					)}>
						{score}%
					</span>
				)}
			</div>

			{/* Sentences */}
			<div className="space-y-6 mb-6">
				{sentences.map((sentence, idx) => {
					const sentenceText = getSentenceText(sentence)
					const parts = sentenceText.split('___')
					const isCorrect = isChecked && isAnswerCorrect(idx)
					const isIncorrect = isChecked && !isAnswerCorrect(idx)
					const hint = getHint(sentence)

					return (
						<div
							key={sentence.id || idx}
							className={cn(
								'p-4 rounded-xl border-2',
								!isChecked && (isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'),
								isCorrect && 'border-emerald-500 bg-emerald-500/5',
								isIncorrect && 'border-red-500 bg-red-500/5'
							)}
						>
							<div className="flex flex-wrap items-center gap-2 mb-2">
								<span className={cn(
									'text-base',
									isDark ? 'text-slate-200' : 'text-slate-900'
								)}>
									{parts[0]}
								</span>
								<input
									type="text"
									value={answers[idx] || ''}
									onChange={(e) => handleAnswerChange(idx, e.target.value)}
									disabled={isChecked}
									className={cn(
										'px-3 py-1.5 rounded-lg border-2 font-medium min-w-[120px] text-center',
										'focus:outline-none focus:ring-2 focus:ring-violet-500',
										!isChecked && (isDark
											? 'border-slate-600 bg-slate-800 text-slate-200'
											: 'border-slate-300 bg-white text-slate-900'),
										isCorrect && 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
										isIncorrect && 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300',
										isChecked && 'cursor-not-allowed'
									)}
									placeholder="___"
								/>
								<span className={cn(
									'text-base',
									isDark ? 'text-slate-200' : 'text-slate-900'
								)}>
									{parts[1]}
								</span>
								{isChecked && (
									isCorrect
										? <Check className="w-5 h-5 text-emerald-500 ml-2" />
										: <X className="w-5 h-5 text-red-500 ml-2" />
								)}
							</div>
						</div>
					)
				})}
			</div>

			{/* Check button */}
			{!isChecked && (
				<Button
					onClick={handleCheck}
					disabled={Object.keys(answers).filter(k => answers[k]).length !== sentences.length}
					className={cn(
						'w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600',
						Object.keys(answers).filter(k => answers[k]).length !== sentences.length && 'opacity-50 cursor-not-allowed'
					)}
				>
					{t('methode_exercise_check')}
				</Button>
			)}

			{/* Retry button after check */}
			{isChecked && score < 100 && (
				<div className="flex gap-4">
					<Button
						variant="outline"
						onClick={handleRetry}
						className={cn(
							'flex-1 gap-2',
							isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300'
						)}
					>
						<RotateCcw className="w-4 h-4" />
						{t('methode_exercise_retry')}
					</Button>
					<Button
						onClick={handleNextExercise}
						className="flex-1 gap-2 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
					>
						{t('methode_exercise_next')}
						<ArrowRight className="w-4 h-4" />
					</Button>
				</div>
			)}
		</Card>
	)
}

export default FillInTheBlankSequential
