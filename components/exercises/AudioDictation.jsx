'use client'

import { useState, useRef } from 'react'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import toast from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { CheckCircle2, XCircle, RotateCcw, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ExerciseResults from './ExerciseResults'

/**
 * Audio Dictation Exercise Component
 * User listens to audio and types what they hear
 *
 * @param {Object} exercise - Exercise data from database
 * @param {Function} onComplete - Callback when exercise is completed
 */
const AudioDictation = ({ exercise, onComplete }) => {
	const t = useTranslations('exercises')
	const { isDark } = useThemeMode()
	const { user } = useUserContext()
	const params = useParams()

	// State
	const [userAnswers, setUserAnswers] = useState({}) // { sentenceId: text }
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({}) // { sentenceId: { correct, userAnswer, correctAnswer } }
	const [exerciseCompleted, setExerciseCompleted] = useState(false)
	const [totalScore, setTotalScore] = useState(0)
	const [isFirstCompletion, setIsFirstCompletion] = useState(false)
	const [playingAudio, setPlayingAudio] = useState({}) // { sentenceId: boolean }

	const locale = params.locale || 'fr'
	const sentences = exercise?.data?.sentences || []
	const materialLang = exercise?.locale || 'ru' // Exercise language = Material language

	const audioRefs = useRef({})

	// Traductions des titres d'exercices
	const titleTranslations = {
		"Compréhension auditive": {
			en: "Listening Comprehension",
			ru: "Понимание на слух",
			fr: "Compréhension auditive"
		},
		"Понимание на слух": {
			en: "Listening Comprehension",
			ru: "Понимание на слух",
			fr: "Compréhension auditive"
		},
		"Listening Comprehension": {
			en: "Listening Comprehension",
			ru: "Понимание на слух",
			fr: "Compréhension auditive"
		}
	}

	// Fonction pour obtenir le titre traduit
	const getTranslatedTitle = () => {
		const originalTitle = exercise?.title || ''

		// Si une traduction existe pour ce titre
		if (titleTranslations[originalTitle]) {
			return titleTranslations[originalTitle][locale] || originalTitle
		}

		// Sinon, retourner le titre original
		return originalTitle
	}

	// Normalize Russian characters (е/ё are treated as equivalent)
	const normalizeText = (text) => {
		return text
			.replace(/ё/g, 'е')
			.replace(/Ё/g, 'Е')
			.toLowerCase()
			.trim()
	}

	// Parse sentence with blank to get parts
	const parseSentence = (sentenceWithBlank) => {
		if (!sentenceWithBlank) return { before: '', after: '' }
		const parts = sentenceWithBlank.split('___')
		return {
			before: parts[0] || '',
			after: parts[1] || ''
		}
	}

	// Check if answer is correct
	const checkAnswer = (sentenceId, userAnswer) => {
		const sentence = sentences.find(s => s.id === sentenceId)
		if (!sentence || !userAnswer) return false

		// Use base field (in material language), not translated version
		const correctAnswer = sentence.correctAnswer
		const normalizedUserAnswer = normalizeText(userAnswer)
		const normalizedCorrect = normalizeText(correctAnswer)

		return normalizedCorrect === normalizedUserAnswer
	}

	// Handle answer input
	const handleAnswerChange = (sentenceId, value) => {
		setUserAnswers(prev => ({
			...prev,
			[sentenceId]: value
		}))
	}

	// Submit all answers
	const handleSubmit = () => {
		const allResults = {}
		let totalCorrect = 0

		sentences.forEach(sentence => {
			const userAnswer = userAnswers[sentence.id] || ''
			const isCorrect = checkAnswer(sentence.id, userAnswer)
			// Use base field (in material language), not translated version
			const correctText = sentence.correctAnswer

			allResults[sentence.id] = {
				correct: isCorrect,
				userAnswer,
				correctAnswer: correctText
			}

			if (isCorrect) totalCorrect++
		})

		setResults(allResults)
		setSubmitted(true)

		// Calculate score
		const finalScore = Math.round((totalCorrect / sentences.length) * 100)

		// Show feedback
		if (finalScore === 100) {
			toast.success(t('allCorrect'))
		} else if (finalScore >= 80) {
			toast.success(`${t('yourScore')}: ${finalScore}%`)
		} else if (finalScore >= 60) {
			toast.warning(`${t('yourScore')}: ${finalScore}%`)
		} else {
			toast.error(`${t('yourScore')}: ${finalScore}%`)
		}

		// Complete exercise
		completeExercise(finalScore, allResults)
	}

	// Complete exercise
	const completeExercise = async (finalScore, allResults) => {
		setTotalScore(finalScore)
		setExerciseCompleted(true)

		// Call onComplete callback
		if (onComplete) {
			const result = {
				exerciseId: exercise.id,
				score: finalScore,
				completed: true
			}

			// Call the callback and get response
			const apiResponse = await onComplete(result)
			if (apiResponse?.isFirstCompletion) {
				setIsFirstCompletion(true)
			}
		}
	}

	// Reset exercise
	const handleReset = () => {
		setUserAnswers({})
		setSubmitted(false)
		setResults({})
		setExerciseCompleted(false)
		setTotalScore(0)
		setIsFirstCompletion(false)

		// Stop all playing audio
		Object.values(audioRefs.current).forEach(audio => {
			if (audio) {
				audio.pause()
				audio.currentTime = 0
			}
		})
		setPlayingAudio({})
	}

	// Play/pause audio
	const toggleAudio = (sentenceId) => {
		const audio = audioRefs.current[sentenceId]
		if (!audio) return

		if (playingAudio[sentenceId]) {
			audio.pause()
			setPlayingAudio(prev => ({ ...prev, [sentenceId]: false }))
		} else {
			audio.play()
			setPlayingAudio(prev => ({ ...prev, [sentenceId]: true }))
		}
	}

	// Handle audio ended
	const handleAudioEnded = (sentenceId) => {
		setPlayingAudio(prev => ({ ...prev, [sentenceId]: false }))
	}

	// Check if all fields are filled
	const allFieldsFilled = () => {
		return sentences.every(sentence => {
			const answer = userAnswers[sentence.id]
			return answer && answer.trim().length > 0
		})
	}

	if (!exercise || sentences.length === 0) {
		return (
			<div className={cn(
				"p-4 rounded-xl border-2",
				isDark
					? "bg-blue-500/10 border-blue-500/30 text-blue-300"
					: "bg-blue-50 border-blue-200 text-blue-700"
			)}>
				{t('noExerciseAvailable')}
			</div>
		)
	}

	// Exercise completion screen
	if (exerciseCompleted) {
		// Build review items
		const reviewItems = sentences.map((sentence) => {
			const result = results[sentence.id]
			const sentenceWithBlank = sentence.sentenceWithBlank

			return {
				question: sentenceWithBlank.replace('___', '______'),
				userAnswer: result?.userAnswer || t('empty'),
				correctAnswer: result?.correctAnswer || sentence.correctAnswer,
				isCorrect: result?.correct || false,
				explanation: sentence.explanation || sentence.hint || ''
			}
		})

		const correctCount = Object.values(results).filter(r => r.correct).length

		return (
			<ExerciseResults
				score={totalScore}
				correctCount={correctCount}
				totalCount={sentences.length}
				onRetry={handleReset}
				onNext={handleReset}
				reviewItems={reviewItems}
				playSound={true}
			/>
		)
	}

	// Main exercise view
	return (
		<div>
			{/* Exercise Instructions */}
			<Card className={cn(
				"p-4 md:p-6 mb-6 rounded-xl",
				isDark
					? "bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-violet-500/20"
					: "bg-gradient-to-r from-violet-500/5 to-cyan-500/5 border-violet-500/15"
			)}>
				<h6 className="font-semibold mb-2 text-violet-500">
					{getTranslatedTitle()}
				</h6>
				<div className={cn(
					"p-3 rounded-lg",
					isDark
						? "bg-cyan-500/15"
						: "bg-cyan-500/10"
				)}>
					<p className={cn(
						"font-semibold text-sm",
						isDark ? "text-cyan-300" : "text-cyan-700"
					)}>
						{t('listenAndType')}
					</p>
				</div>
			</Card>

			{/* Sentences */}
			{sentences.map((sentence, index) => {
				const result = results[sentence.id]
				const isCorrect = result?.correct
				// Use base field (in material language), not translated version
				const sentenceWithBlank = sentence.sentenceWithBlank
				const { before, after } = parseSentence(sentenceWithBlank)

				return (
					<Card
						key={sentence.id}
						className={cn(
							"p-4 md:p-6 mb-4 rounded-xl",
							submitted
								? isCorrect
									? "border-2 border-emerald-500"
									: "border-2 border-red-500"
								: isDark
									? "border-violet-500/30"
									: "border-violet-500/20",
							isDark
								? "bg-gradient-to-br from-slate-800/95 to-slate-900/90"
								: "bg-gradient-to-br from-white/95 to-white/90"
						)}
					>
						{/* Sentence with inline blank */}
						<div className="flex items-center gap-4 text-base md:text-lg leading-relaxed">
							<span className="font-bold text-violet-500 flex-shrink-0">
								{index + 1}.
							</span>
							<button
								type="button"
								onClick={() => toggleAudio(sentence.id)}
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
									"bg-gradient-to-r from-violet-600 to-cyan-600 text-white",
									"hover:from-violet-700 hover:to-cyan-700 transition-all"
								)}
							>
								{playingAudio[sentence.id] ? (
									<Pause className="w-5 h-5" />
								) : (
									<Play className="w-5 h-5 ml-0.5" />
								)}
							</button>
							<audio
								ref={(el) => audioRefs.current[sentence.id] = el}
								src={sentence.audioUrl}
								onEnded={() => handleAudioEnded(sentence.id)}
								preload="metadata"
							/>
							<div className="flex-1 flex flex-wrap items-center gap-1">
								<span>{before}</span>
								<Input
									value={userAnswers[sentence.id] || ''}
									onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
									disabled={submitted}
									placeholder="___"
									className={cn(
										"w-[120px] sm:w-[180px] h-10 px-3 text-base inline-block",
										submitted
											? isCorrect
												? "border-emerald-500 bg-emerald-500/10"
												: "border-red-500 bg-red-500/10"
											: isDark
												? "bg-violet-500/5"
												: "bg-white"
									)}
								/>
								{submitted && (
									<span className="inline-flex">
										{isCorrect ? (
											<CheckCircle2 className="w-6 h-6 text-emerald-500" />
										) : (
											<XCircle className="w-6 h-6 text-red-500" />
										)}
									</span>
								)}
								<span>{after}</span>
							</div>
						</div>

						{submitted && result && !isCorrect && (
							<div className={cn(
								"mt-4 p-3 rounded-lg",
								isDark
									? "bg-red-500/10 border border-red-500/30"
									: "bg-red-50 border border-red-200"
							)}>
								<p className={cn(
									"text-sm",
									isDark ? "text-red-300" : "text-red-700"
								)}>
									<strong>{t('yourAnswer')}:</strong> {result.userAnswer || t('empty')}
								</p>
								<p className={cn(
									"text-sm",
									isDark ? "text-red-300" : "text-red-700"
								)}>
									<strong>{t('correctAnswer')}:</strong> {result.correctAnswer}
								</p>
							</div>
						)}
					</Card>
				)
			})}

			{/* Submit Button */}
			<div className="flex justify-center mt-6">
				<Button
					onClick={submitted ? handleReset : handleSubmit}
					disabled={!submitted && !allFieldsFilled()}
					className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 disabled:opacity-50"
				>
					{submitted && <RotateCcw className="w-5 h-5 mr-2" />}
					{submitted ? t('tryAgain') : t('checkAnswer')}
				</Button>
			</div>
		</div>
	)
}

export default AudioDictation
