'use client'

import { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	Button,
	Paper,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Alert,
	LinearProgress,
	useTheme,
	Chip,
} from '@mui/material'
import {
	CheckCircle,
	Cancel,
	Refresh,
	EmojiEvents,
} from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { getLocalizedQuestion } from '@/utils/exerciseHelpers'

/**
 * Multiple Choice Questions Exercise Component
 *
 * @param {Object} exercise - Exercise data from database
 * @param {Function} onComplete - Callback when exercise is completed
 */
const MultipleChoice = ({ exercise, onComplete }) => {
	const t = useTranslations('exercises')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user } = useUserContext()
	const router = useRouter()
	const pathname = usePathname()
	const params = useParams()

	// State
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [userAnswers, setUserAnswers] = useState({})
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({})
	const [exerciseCompleted, setExerciseCompleted] = useState(false)
	const [totalScore, setTotalScore] = useState(0)
	const [isFirstCompletion, setIsFirstCompletion] = useState(false)

	const questions = exercise?.data?.questions || []
	const locale = params.locale || 'fr'
	const currentQuestion = getLocalizedQuestion(questions[currentQuestionIndex], locale)
	const totalQuestions = questions.length

	// Traductions des titres d'exercices
	const titleTranslations = {
		"Compréhension de l'audio": {
			en: "Audio comprehension",
			ru: "Понимание аудио",
			fr: "Compréhension de l'audio"
		},
		"Questions de compréhension": {
			en: "Comprehension questions",
			ru: "Вопросы на понимание",
			fr: "Questions de compréhension"
		},
		"Compréhension du texte": {
			en: "Text Comprehension",
			ru: "Понимание текста",
			fr: "Compréhension du texte"
		},
		"Text Comprehension": {
			en: "Text Comprehension",
			ru: "Понимание текста",
			fr: "Compréhension du texte"
		},
		"Понимание текста": {
			en: "Text Comprehension",
			ru: "Понимание текста",
			fr: "Compréhension du texte"
		}
	}

	// Fonction pour obtenir le titre traduit
	const getTranslatedTitle = () => {
		const locale = params.locale || 'fr'
		const originalTitle = exercise?.title || ''

		// Si une traduction existe pour ce titre
		if (titleTranslations[originalTitle]) {
			return titleTranslations[originalTitle][locale] || originalTitle
		}

		// Sinon, retourner le titre original
		return originalTitle
	}

	// Handle answer selection
	const handleAnswerChange = (event) => {
		setUserAnswers(prev => ({
			...prev,
			[currentQuestionIndex]: event.target.value
		}))
	}

	// Check if answer is correct
	const checkAnswer = (userAnswer) => {
		const correctAnswer = currentQuestion?.correctAnswer
		return userAnswer === correctAnswer
	}

	// Submit current question
	const handleSubmit = () => {
		if (!currentQuestion) return

		const userAnswer = userAnswers[currentQuestionIndex]
		const isCorrect = checkAnswer(userAnswer)

		setResults(prev => ({
			...prev,
			[currentQuestionIndex]: {
				correct: isCorrect,
				userAnswer,
				correctAnswer: currentQuestion.correctAnswer
			}
		}))
		setSubmitted(true)

		// Show feedback
		if (isCorrect) {
			toast.success('✅ Bonne réponse !')
		} else {
			toast.error('❌ Mauvaise réponse')
		}
	}

	// Next question
	const handleNext = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex(prev => prev + 1)
			setSubmitted(false)
		} else {
			// Exercise completed
			completeExercise()
		}
	}

	// Complete exercise and calculate final score
	const completeExercise = async () => {
		let correctCount = 0

		questions.forEach((question, qIndex) => {
			const result = results[qIndex]
			if (result?.correct) {
				correctCount++
			}
		})

		const finalScore = Math.round((correctCount / totalQuestions) * 100)
		setTotalScore(finalScore)
		setExerciseCompleted(true)

		// Call onComplete callback
		if (onComplete) {
			const result = {
				exerciseId: exercise.id,
				score: finalScore,
				completed: true
			}

			// Call the callback (may submit to API) and get response
			const apiResponse = await onComplete(result)
			if (apiResponse?.isFirstCompletion) {
				setIsFirstCompletion(true)
			}
		}
	}

	// Reset exercise
	const handleReset = () => {
		setCurrentQuestionIndex(0)
		setUserAnswers({})
		setSubmitted(false)
		setResults({})
		setExerciseCompleted(false)
		setTotalScore(0)
		setIsFirstCompletion(false)
	}

	if (!exercise || questions.length === 0) {
		return (
			<Alert severity="info">
				Aucun exercice disponible
			</Alert>
		)
	}

	// Exercise completion screen
	if (exerciseCompleted) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: { xs: 3, md: 4 },
					borderRadius: 4,
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
					textAlign: 'center',
				}}>
				<EmojiEvents sx={{ fontSize: '4rem', color: '#fbbf24', mb: 2 }} />
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
					{t('exerciseCompleted')}
				</Typography>
				<Typography variant="h3" sx={{
					fontWeight: 800,
					mb: 3,
					background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
				}}>
					{t('yourScore')} : {totalScore}%
				</Typography>
				<Typography variant="body1" sx={{ mb: 3, color: isDark ? '#cbd5e1' : '#64748b' }}>
					{totalScore === 100 && t('perfectScore')}
					{totalScore >= 80 && totalScore < 100 && t('greatJob')}
					{totalScore >= 60 && totalScore < 80 && t('goodWork')}
					{totalScore < 60 && t('keepPracticing')}
				</Typography>
				{totalScore === 100 && isFirstCompletion && (
					<Chip
						label={`+${exercise.xp_reward} XP`}
						color="primary"
						sx={{
							fontSize: '1rem',
							fontWeight: 700,
							mb: 3,
						}}
					/>
				)}
				{totalScore < 100 && (
					<>
						<Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								💡 {t('perfectScoreForXP')}
							</Typography>
						</Alert>

						{/* Correction Section */}
						<Box sx={{ mb: 4, textAlign: 'left' }}>
							<Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#ef4444' }}>
								{t('corrections')}
							</Typography>
							{questions.map((question, qIndex) => {
								const result = results[qIndex]
								if (!result || result.correct) return null

								const localizedQuestion = getLocalizedQuestion(question, locale)

								return (
									<Paper
										key={qIndex}
										elevation={0}
										sx={{
											p: 2,
											mb: 2,
											borderRadius: 2,
											border: '2px solid #ef4444',
											backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
										}}>
										<Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
											{t('question')} {qIndex + 1}: {localizedQuestion.question}
										</Typography>
										<Box sx={{ mb: 1.5 }}>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
												<Cancel sx={{ color: '#ef4444', fontSize: '1.2rem' }} />
												<Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
													{t('yourAnswer')}: {localizedQuestion.options.find(opt => opt.key === result.userAnswer)?.text || t('empty')}
												</Typography>
											</Box>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
												<CheckCircle sx={{ color: '#10b981', fontSize: '1.2rem' }} />
												<Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
													{t('correctAnswer')}: {localizedQuestion.options.find(opt => opt.key === result.correctAnswer)?.text}
												</Typography>
											</Box>
										</Box>
										{localizedQuestion.explanation && (
											<Alert severity="info" sx={{ mt: 2 }}>
												<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
													{t('explanation')}:
												</Typography>
												{localizedQuestion.explanation}
											</Alert>
										)}
									</Paper>
								)
							})}
						</Box>
					</>
				)}
				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
					<Button
						variant="contained"
						onClick={handleReset}
						startIcon={<Refresh />}
						sx={{
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							px: 4,
							py: 1.5,
							fontSize: '1rem',
							fontWeight: 600,
						}}>
						{t('tryAgain')}
					</Button>
				</Box>
			</Paper>
		)
	}

	const userAnswer = userAnswers[currentQuestionIndex]
	const result = results[currentQuestionIndex]

	return (
		<Box>
			{/* Progress bar */}
			<Box sx={{ mb: 3 }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						Question {currentQuestionIndex + 1} / {totalQuestions}
					</Typography>
					<Typography variant="body2" sx={{ color: isDark ? '#a78bfa' : '#8b5cf6' }}>
						{Math.round(((currentQuestionIndex + (submitted ? 1 : 0)) / totalQuestions) * 100)}%
					</Typography>
				</Box>
				<LinearProgress
					variant="determinate"
					value={((currentQuestionIndex + (submitted ? 1 : 0)) / totalQuestions) * 100}
					sx={{
						height: 8,
						borderRadius: 4,
						backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
						'& .MuiLinearProgress-bar': {
							background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
							borderRadius: 4,
						}
					}}
				/>
			</Box>

			{/* Question */}
			<Paper
				elevation={0}
				sx={{
					p: { xs: 3, md: 4 },
					mb: 3,
					borderRadius: 4,
					background: isDark
						? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
						: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
				}}>
				<Typography
					variant="h5"
					sx={{
						fontWeight: 600,
						mb: 4,
						fontSize: { xs: '1.25rem', md: '1.5rem' },
						lineHeight: 1.6,
					}}>
					{currentQuestion?.question}
				</Typography>

				{/* Options */}
				<FormControl component="fieldset" fullWidth>
					<RadioGroup
						value={userAnswer || ''}
						onChange={handleAnswerChange}>
						{currentQuestion?.options?.map((option, index) => {
							const optionKey = option.key || String.fromCharCode(65 + index) // A, B, C, D
							const isSelected = userAnswer === optionKey
							const isCorrect = result?.correctAnswer === optionKey
							const showCorrect = submitted && isCorrect
							const showIncorrect = submitted && isSelected && !result?.correct

							return (
								<Paper
									key={optionKey}
									elevation={0}
									sx={{
										mb: 2,
										p: 2,
										borderRadius: 3,
										border: '2px solid',
										borderColor: showCorrect
											? '#10b981'
											: showIncorrect
												? '#ef4444'
												: isSelected
													? '#8b5cf6'
													: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
										backgroundColor: showCorrect
											? 'rgba(16, 185, 129, 0.1)'
											: showIncorrect
												? 'rgba(239, 68, 68, 0.1)'
												: isSelected
													? 'rgba(139, 92, 246, 0.05)'
													: 'transparent',
										cursor: submitted ? 'default' : 'pointer',
										transition: 'all 0.2s',
										'&:hover': {
											borderColor: submitted ? undefined : '#8b5cf6',
											backgroundColor: submitted ? undefined : 'rgba(139, 92, 246, 0.05)',
										}
									}}>
									<FormControlLabel
										value={optionKey}
										disabled={submitted}
										control={
											<Radio
												sx={{
													color: isDark ? '#a78bfa' : '#8b5cf6',
													'&.Mui-checked': {
														color: showCorrect ? '#10b981' : showIncorrect ? '#ef4444' : '#8b5cf6',
													}
												}}
											/>
										}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
												<Chip
													label={optionKey}
													size="small"
													sx={{
														fontWeight: 700,
														backgroundColor: showCorrect
															? '#10b981'
															: showIncorrect
																? '#ef4444'
																: '#8b5cf6',
														color: 'white',
													}}
												/>
												<Typography
													sx={{
														fontSize: { xs: '1rem', md: '1.1rem' },
														fontWeight: isSelected ? 600 : 400,
														color: isDark ? '#f1f5f9' : '#1a202c',
													}}>
													{option.text}
												</Typography>
												{showCorrect && (
													<CheckCircle sx={{ color: '#10b981', ml: 'auto' }} />
												)}
												{showIncorrect && (
													<Cancel sx={{ color: '#ef4444', ml: 'auto' }} />
												)}
											</Box>
										}
										sx={{ width: '100%', m: 0 }}
									/>
								</Paper>
							)
						})}
					</RadioGroup>
				</FormControl>

				{/* Explanation after submission */}
				{submitted && currentQuestion?.explanation && (
					<Alert severity="info" sx={{ mt: 3 }}>
						<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
							Explication :
						</Typography>
						{currentQuestion.explanation}
					</Alert>
				)}

				{/* Action buttons */}
				<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
					{!submitted ? (
						<Button
							variant="contained"
							onClick={handleSubmit}
							disabled={!userAnswer}
							sx={{
								background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
								px: 4,
								py: 1.5,
								fontSize: '1rem',
								fontWeight: 600,
							}}>
							{t('checkAnswer')}
						</Button>
					) : (
						<Button
							variant="contained"
							onClick={handleNext}
							sx={{
								background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
								px: 4,
								py: 1.5,
								fontSize: '1rem',
								fontWeight: 600,
							}}>
							{currentQuestionIndex < totalQuestions - 1 ? t('next') : t('finish')}
						</Button>
					)}
				</Box>
			</Paper>
		</Box>
	)
}

export default MultipleChoice
