'use client'

import { useState, useEffect } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, RotateCcw, Edit3 } from 'lucide-react'
import ExerciseResults from './ExerciseResults'

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
		// Build review items
		const reviewItems = sentences.map((sentence, index) => {
			const isCorrect = isAnswerCorrect(index)
			const userAnswer = (index in answers) ? String(answers[index]) : ''
			const acceptableAnswers = sentence.acceptableAnswers || [sentence.answer]

			return {
				question: getSentenceText(sentence),
				userAnswer: userAnswer || t('methode_exercise_no_answer'),
				correctAnswer: acceptableAnswers.join(' / '),
				isCorrect,
				explanation: getHint(sentence)
			}
		})

		return (
			<ExerciseResults
				score={score}
				correctCount={correctAnswers}
				totalCount={sentences.length}
				onRetry={handleRetry}
				onNext={handleNextExercise}
				reviewItems={reviewItems}
				playSound={true}
			/>
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
