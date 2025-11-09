import { useState, useRef } from 'react'
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
	Refresh,
	EmojiEvents,
	PlayArrow,
	Pause,
} from '@mui/icons-material'
import { useUserContext } from '../../context/user'
import toast from '../../utils/toast'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { getLocalizedField } from '../../utils/exerciseHelpers'

/**
 * Audio Dictation Exercise Component
 * User listens to audio and types what they hear
 *
 * @param {Object} exercise - Exercise data from database
 * @param {Function} onComplete - Callback when exercise is completed
 */
const AudioDictation = ({ exercise, onComplete }) => {
	const { t } = useTranslation('exercises')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { user } = useUserContext()
	const router = useRouter()

	// State
	const [userAnswers, setUserAnswers] = useState({}) // { sentenceId: text }
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({}) // { sentenceId: { correct, userAnswer, correctAnswer } }
	const [exerciseCompleted, setExerciseCompleted] = useState(false)
	const [totalScore, setTotalScore] = useState(0)
	const [isFirstCompletion, setIsFirstCompletion] = useState(false)
	const [playingAudio, setPlayingAudio] = useState({}) // { sentenceId: boolean }

	const locale = router.locale || 'fr'
	const sentences = exercise?.data?.sentences || []
	const materialLang = exercise?.lang || 'ru' // Exercise language = Material language

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
					<Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
						<Typography variant="body2" sx={{ fontWeight: 600 }}>
							💡 {t('perfectScoreForXP')}
						</Typography>
					</Alert>
				)}
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
			</Paper>
		)
	}

	// Main exercise view
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
						🎧 {t('listenAndType')}
					</Typography>
				</Alert>
			</Paper>

			{/* Sentences */}
			{sentences.map((sentence, index) => {
				const result = results[sentence.id]
				const isCorrect = result?.correct
				// Use base field (in material language), not translated version
			const sentenceWithBlank = sentence.sentenceWithBlank
				const { before, after } = parseSentence(sentenceWithBlank)

				return (
					<Paper
						key={sentence.id}
						elevation={0}
						sx={{
							p: { xs: 2, md: 3 },
							mb: 2,
							borderRadius: 3,
							background: isDark
								? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
								: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
							border: submitted
								? isCorrect
									? '2px solid #10b981'
									: '2px solid #ef4444'
								: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
						}}>
						{/* Sentence with inline blank */}
						<Box
							sx={{
								fontSize: { xs: '1rem', md: '1.1rem' },
								lineHeight: 1.8,
								display: 'flex',
								alignItems: 'center',
								gap: 2,
							}}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: '#8b5cf6', flexShrink: 0 }}>
								{index + 1}.
							</Typography>
							<IconButton
								onClick={() => toggleAudio(sentence.id)}
								sx={{
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									color: 'white',
									flexShrink: 0,
									'&:hover': {
										background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
									}
								}}>
								{playingAudio[sentence.id] ? <Pause /> : <PlayArrow />}
							</IconButton>
							<audio
								ref={(el) => audioRefs.current[sentence.id] = el}
								src={sentence.audioUrl}
								onEnded={() => handleAudioEnded(sentence.id)}
								preload="metadata"
							/>
							<Box sx={{ flex: 1, fontSize: 'inherit', lineHeight: 'inherit' }}>
								<Typography component="span" sx={{ fontSize: 'inherit' }}>
									{before}
								</Typography>
								<TextField
									size="small"
									value={userAnswers[sentence.id] || ''}
									onChange={(e) => handleAnswerChange(sentence.id, e.target.value)}
									disabled={submitted}
									placeholder="___"
									sx={{
										minWidth: { xs: '120px', sm: '180px' },
										display: 'inline-flex',
										verticalAlign: 'middle',
										mx: 0.5,
										'& .MuiOutlinedInput-root': {
											height: '40px',
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
												padding: '8px 12px',
												fontSize: '1rem',
											}
										}
									}}
								/>
								{submitted && (
									<Box component="span" sx={{ display: 'inline-flex', verticalAlign: 'middle', mx: 0.5 }}>
										{isCorrect ? (
											<CheckCircle sx={{ color: '#10b981', fontSize: '1.5rem' }} />
										) : (
											<Cancel sx={{ color: '#ef4444', fontSize: '1.5rem' }} />
										)}
									</Box>
								)}
								<Typography component="span" sx={{ fontSize: 'inherit' }}>
									{after}
								</Typography>
							</Box>
						</Box>

						{submitted && result && !isCorrect && (
							<Box sx={{ mt: 2 }}>
								<Alert severity="error" icon={<Cancel />}>
									<Typography variant="body2">
										<strong>{t('yourAnswer')}:</strong> {result.userAnswer || t('empty')}
									</Typography>
									<Typography variant="body2">
										<strong>{t('correctAnswer')}:</strong> {result.correctAnswer}
									</Typography>
								</Alert>
							</Box>
						)}
					</Paper>
				)
			})}

			{/* Submit Button */}
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
				<Button
					variant="contained"
					onClick={submitted ? handleReset : handleSubmit}
					startIcon={submitted ? <Refresh /> : null}
					disabled={!submitted && !allFieldsFilled()}
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
					{submitted ? t('tryAgain') : t('checkAnswer')}
				</Button>
			</Box>
		</Box>
	)
}

export default AudioDictation
