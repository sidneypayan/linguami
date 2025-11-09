import { useState, useRef, useEffect } from 'react'
import {
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Chip,
	Alert,
	useTheme,
	IconButton,
} from '@mui/material'
import {
	CheckCircle,
	Cancel,
	Lightbulb,
	Refresh,
	EmojiEvents,
} from '@mui/icons-material'
import { useUserContext } from '../../context/user'
import toast from '../../utils/toast'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { getLocalizedQuestion } from '../../utils/exerciseHelpers'

/**
 * Fill in the Blank Exercise Component
 * Displays all questions at once as a complete text with blanks
 *
 * @param {Object} exercise - Exercise data from database
 * @param {Function} onComplete - Callback when exercise is completed
 */
const FillInTheBlank = ({ exercise, onComplete }) => {
	const { t } = useTranslation('exercises')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user } = useUserContext()
	const router = useRouter()

	// State
	const [userAnswers, setUserAnswers] = useState({}) // { questionIndex: { blankIndex: value } }
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({}) // { questionIndex: { blankIndex: { correct, userAnswer, correctAnswer } } }
	const [showHints, setShowHints] = useState({}) // { questionIndex-blankIndex: boolean }
	const [exerciseCompleted, setExerciseCompleted] = useState(false)
	const [totalScore, setTotalScore] = useState(0)
	const [isFirstCompletion, setIsFirstCompletion] = useState(false)

	const locale = router.locale || 'fr'
	const rawQuestions = exercise?.data?.questions || []
	// Localize all questions
	const questions = rawQuestions.map(q => getLocalizedQuestion(q, locale))

	// Refs pour les champs de texte
	const inputRefs = useRef({})

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
		}
	}

	// Fonction pour obtenir le titre traduit
	const getTranslatedTitle = () => {
		const locale = router.locale || 'fr'
		const originalTitle = exercise?.title || ''

		// Si une traduction existe pour ce titre
		if (titleTranslations[originalTitle]) {
			return titleTranslations[originalTitle][locale] || originalTitle
		}

		// Sinon, retourner le titre original
		return originalTitle
	}

	// Créer une liste ordonnée de tous les blanks
	const getAllBlanks = () => {
		const blanks = []
		questions.forEach((question, qIndex) => {
			const questionBlanks = question.blanks || []
			questionBlanks.forEach((_, bIndex) => {
				blanks.push({ qIndex, bIndex })
			})
		})
		return blanks
	}

	// Parse text to identify blanks
	const parseQuestionText = (text) => {
		if (!text) return []

		// Split by ___ (blank markers)
		const parts = text.split(/(_+)/)

		// Further split text parts to separate leading punctuation
		const result = []
		parts.forEach((part, index) => {
			if (part.match(/^_+$/)) {
				// This is a blank
				result.push({
					isBlank: true,
					text: part,
					blankIndex: Math.floor(index / 2)
				})
			} else if (part) {
				// Check if text starts with punctuation
				const match = part.match(/^([.,;:!?]+)(.*)/)
				if (match) {
					// Separate punctuation from the rest
					result.push({
						isBlank: false,
						text: match[1], // Punctuation
						blankIndex: null,
						isPunctuation: true
					})
					if (match[2]) {
						result.push({
							isBlank: false,
							text: match[2], // Rest of text
							blankIndex: null
						})
					}
				} else {
					result.push({
						isBlank: false,
						text: part,
						blankIndex: null
					})
				}
			}
		})

		return result
	}

	// Handle answer input
	const handleAnswerChange = (questionIndex, blankIndex, value) => {
		setUserAnswers(prev => ({
			...prev,
			[questionIndex]: {
				...prev[questionIndex],
				[blankIndex]: value.trim()
			}
		}))
	}

	// Normalize Russian characters (е/ё are treated as equivalent)
	const normalizeRussianText = (text) => {
		return text.replace(/ё/g, 'е').replace(/Ё/g, 'Е')
	}

	// Check if answer is correct
	const checkAnswer = (questionIndex, blankIndex, userAnswer) => {
		const question = questions[questionIndex]
		const blank = question?.blanks?.[blankIndex]
		if (!blank || !userAnswer) return false

		const correctAnswers = blank.correctAnswers || []
		const normalizedUserAnswer = normalizeRussianText(userAnswer.toLowerCase())

		return correctAnswers.some(correct => {
			const normalizedCorrect = normalizeRussianText(correct.toLowerCase())
			return normalizedCorrect === normalizedUserAnswer
		})
	}

	// Submit all answers
	const handleSubmit = () => {
		const allResults = {}
		let totalCorrect = 0
		let totalBlanks = 0

		questions.forEach((question, qIndex) => {
			const questionResults = {}
			const blanks = question.blanks || []

			blanks.forEach((blank, bIndex) => {
				totalBlanks++
				const userAnswer = userAnswers[qIndex]?.[bIndex] || ''
				const isCorrect = checkAnswer(qIndex, bIndex, userAnswer)

				questionResults[bIndex] = {
					correct: isCorrect,
					userAnswer,
					correctAnswers: blank.correctAnswers || []
				}

				if (isCorrect) totalCorrect++
			})

			allResults[qIndex] = questionResults
		})

		setResults(allResults)
		setSubmitted(true)

		// Calculate score
		const finalScore = Math.round((totalCorrect / totalBlanks) * 100)

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

			// Call the callback (may submit to API) and get response
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
		setShowHints({})
		setExerciseCompleted(false)
		setTotalScore(0)
		setIsFirstCompletion(false)
	}

	// Toggle hint
	const toggleHint = (questionIndex, blankIndex) => {
		const key = `${questionIndex}-${blankIndex}`
		setShowHints(prev => ({
			...prev,
			[key]: !prev[key]
		}))
	}

	// Check if all blanks are filled
	const allBlanksFilled = () => {
		return questions.every((question, qIndex) => {
			const blanks = question.blanks || []
			return blanks.every((_, bIndex) => {
				const answer = userAnswers[qIndex]?.[bIndex]
				return answer && answer.trim().length > 0
			})
		})
	}

	// Gérer la navigation avec Enter
	const handleKeyDown = (e, currentQIndex, currentBIndex) => {
		if (e.key === 'Enter' && !submitted) {
			e.preventDefault()

			const allBlanks = getAllBlanks()
			const currentIndex = allBlanks.findIndex(
				b => b.qIndex === currentQIndex && b.bIndex === currentBIndex
			)

			if (currentIndex !== -1 && currentIndex < allBlanks.length - 1) {
				// Passer au blanc suivant
				const nextBlank = allBlanks[currentIndex + 1]
				const nextKey = `${nextBlank.qIndex}-${nextBlank.bIndex}`
				const nextInput = inputRefs.current[nextKey]
				if (nextInput) {
					nextInput.focus()
				}
			} else if (currentIndex === allBlanks.length - 1) {
				// C'est le dernier blanc, vérifier si tous sont remplis
				if (allBlanksFilled()) {
					handleSubmit()
				}
			}
		}
	}

	if (!exercise || questions.length === 0) {
		return (
			<Alert severity="info">
				{t('noExerciseAvailable')}
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
								const blanks = question.blanks || []
								const hasError = blanks.some((blank, bIndex) => {
									const result = results[qIndex]?.[bIndex]
									return result && !result.correct
								})

								if (!hasError) return null

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
											{t('question')} {qIndex + 1}
										</Typography>
										{blanks.map((blank, bIndex) => {
											const result = results[qIndex]?.[bIndex]
											if (!result || result.correct) return null

											return (
												<Box key={bIndex} sx={{ mb: 1.5 }}>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
														<Cancel sx={{ color: '#ef4444', fontSize: '1.2rem' }} />
														<Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>
															{t('yourAnswer')}: {result.userAnswer || t('empty')}
														</Typography>
													</Box>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														<CheckCircle sx={{ color: '#10b981', fontSize: '1.2rem' }} />
														<Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
															{t('correctAnswer')}: {result.correctAnswers.join(' / ')}
														</Typography>
													</Box>
												</Box>
											)
										})}
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

	// Main exercise view - display all questions at once
	return (
		<Box>
			{/* Exercise Instructions */}
			<Paper
				elevation={0}
				sx={{
					p: { xs: 2, md: 3 },
					mb: 3,
					borderRadius: 3,
					background: isDark
						? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
						: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
					border: isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(139, 92, 246, 0.15)',
				}}>
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#8b5cf6' }}>
					{getTranslatedTitle()}
				</Typography>
				<Alert severity="info" sx={{ mb: 0, backgroundColor: isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.1)' }}>
					<Typography variant="body2" sx={{ fontWeight: 600 }}>
						🎧 {t('listenToAudio')}
					</Typography>
				</Alert>
			</Paper>

			{/* All Questions displayed as continuous text */}
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
				{questions.map((question, qIndex) => {
					const parsedText = parseQuestionText(question.text)
					const blanks = question.blanks || []

					return (
						<Box key={question.id || qIndex} sx={{ mb: 0 }}>
							{/* Question text with inline blanks */}
							<Typography
								component="div"
								sx={{
									fontSize: { xs: '1rem', md: '1.1rem' },
									lineHeight: 1.8,
									mb: 0,
								}}>
								{parsedText.map((part, partIndex) => {
									if (part.isBlank) {
										const blankIndex = part.blankIndex
										const blank = blanks[blankIndex]
										const userAnswer = userAnswers[qIndex]?.[blankIndex] || ''
										const result = results[qIndex]?.[blankIndex]
										const isCorrect = result?.correct
										const showHint = showHints[`${qIndex}-${blankIndex}`]

										return (
											<Box
												key={partIndex}
												sx={{
													display: 'inline-flex',
													alignItems: 'center',
													gap: 0.5,
												}}>
												<TextField
													size="small"
													value={userAnswer}
													onChange={(e) => handleAnswerChange(qIndex, blankIndex, e.target.value)}
													onKeyDown={(e) => handleKeyDown(e, qIndex, blankIndex)}
													disabled={submitted}
													placeholder="___"
													inputRef={(el) => {
														const key = `${qIndex}-${blankIndex}`
														inputRefs.current[key] = el
													}}
													sx={{
														width: { xs: '120px', sm: '150px' },
														'& .MuiOutlinedInput-root': {
															height: '28px',
															backgroundColor: submitted
																? isCorrect
																	? 'rgba(16, 185, 129, 0.1)'
																	: 'rgba(239, 68, 68, 0.1)'
																: isDark ? 'rgba(139, 92, 246, 0.05)' : 'white',
															borderColor: submitted
																? isCorrect ? '#10b981' : '#ef4444'
																: undefined,
															'& fieldset': {
																borderColor: submitted
																	? isCorrect ? '#10b981 !important' : '#ef4444 !important'
																	: undefined,
															},
															'& input': {
																padding: '4px 8px',
																fontSize: '0.95rem',
															}
														}
													}}
												/>
												{submitted && (
													isCorrect ? (
														<CheckCircle sx={{ color: '#10b981', fontSize: '1.2rem' }} />
													) : (
														<Cancel sx={{ color: '#ef4444', fontSize: '1.2rem' }} />
													)
												)}
												{!submitted && blank?.hint && (
													<IconButton
														size="small"
														onClick={() => toggleHint(qIndex, blankIndex)}
														sx={{ color: '#8b5cf6' }}>
														<Lightbulb fontSize="small" />
													</IconButton>
												)}
											</Box>
										)
									} else {
										// Texte normal ou ponctuation
										return (
											<span
												key={partIndex}
												style={{
													display: 'inline',
													whiteSpace: 'pre-wrap',
													marginLeft: part.isPunctuation ? '1px' : '0',
													marginRight: part.isPunctuation ? '0' : '4px',
												}}>
												{part.text}
											</span>
										)
									}
								})}
							</Typography>

							{/* Show hints if requested */}
							{blanks.map((blank, bIndex) => {
								const showHint = showHints[`${qIndex}-${bIndex}`]
								if (!showHint || !blank.hint) return null

								return (
									<Alert
										key={bIndex}
										severity="info"
										icon={<Lightbulb />}
										sx={{ mt: 2 }}>
										<Typography variant="body2">
											💡 {blank.hint}
										</Typography>
									</Alert>
								)
							})}

							{/* Show correction after submission */}
							{submitted && results[qIndex] && (
								<Box sx={{ mt: 2 }}>
									{blanks.map((blank, bIndex) => {
										const result = results[qIndex]?.[bIndex]
										if (!result || result.correct) return null

										return (
											<Alert key={bIndex} severity="error" sx={{ mt: 1 }}>
												<Typography variant="body2">
													<strong>{t('yourAnswer')}:</strong> {result.userAnswer || '(vide)'} →
													<strong> {t('correctAnswer')}:</strong> {result.correctAnswer}
												</Typography>
												{blank.hint && (
													<Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
														💡 {blank.hint}
													</Typography>
												)}
											</Alert>
										)
									})}
									{question.explanation && (
										<Alert severity="info" sx={{ mt: 1 }}>
											<Typography variant="body2">
												<strong>{t('explanation')}:</strong> {question.explanation}
											</Typography>
										</Alert>
									)}
								</Box>
							)}
						</Box>
					)
				})}
			</Paper>

			{/* Submit Button */}
			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
				{!submitted ? (
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={!allBlanksFilled()}
						sx={{
							background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
							px: 4,
							py: 1.5,
							fontSize: '1rem',
							fontWeight: 600,
							'&:disabled': {
								background: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)',
							}
						}}>
						{t('checkAnswer')}
					</Button>
				) : (
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
				)}
			</Box>
		</Box>
	)
}

export default FillInTheBlank
