import { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Button, Paper, Alert, useTheme, Grid, Chip } from '@mui/material'
import { CheckCircle, Cancel, DragIndicator, CompareArrows, EmojiEvents, Refresh } from '@mui/icons-material'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { getLocalizedQuestion } from '@/utils/exerciseHelpers'

/**
 * Matching/Pairing Exercise Component
 * Allows users to match items from left column to right column
 *
 * @param {Object} exercise - The exercise data
 * @param {Function} onComplete - Callback when exercise is completed
 */
const DragAndDrop = ({ exercise, onComplete }) => {
	const { t } = useTranslation('exercises')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const router = useRouter()

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [rightItems, setRightItems] = useState([])
	const [matches, setMatches] = useState({}) // { leftId: rightId }
	const [isChecked, setIsChecked] = useState(false)
	const [isCorrect, setIsCorrect] = useState(false)
	const [draggedItem, setDraggedItem] = useState(null)
	const [score, setScore] = useState(0)
	const [exerciseCompleted, setExerciseCompleted] = useState(false)
	const [totalScore, setTotalScore] = useState(0)
	const [isFirstCompletion, setIsFirstCompletion] = useState(false)
	const [questionResults, setQuestionResults] = useState([]) // Store results for each question

	const locale = router.locale || 'fr'

	// Memoize the current question to avoid re-renders and flickering
	const currentQuestion = useMemo(() => {
		const rawQuestion = exercise.data?.questions?.[currentQuestionIndex]
		return getLocalizedQuestion(rawQuestion, locale)
	}, [exercise.data?.questions, currentQuestionIndex, locale])

	// Traductions des titres d'exercices
	const titleTranslations = {
		"Compréhension de l'audio": {
			en: "Audio comprehension",
			ru: "Понимание аудио",
			fr: "Compréhension de l'audio"
		},
		"Association de vocabulaire": {
			en: "Vocabulary matching",
			ru: "Словарные пары",
			fr: "Association de vocabulaire"
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

	// Initialize/shuffle right items when question changes
	useEffect(() => {
		if (currentQuestion?.pairs) {
			// Shuffle right items
			const shuffled = [...currentQuestion.pairs]
				.sort(() => Math.random() - 0.5)
			setRightItems(shuffled)
			setMatches({})
			setIsChecked(false)
			setIsCorrect(false)
		}
	}, [currentQuestion])

	// Drag handlers
	const handleDragStart = (e, item) => {
		setDraggedItem(item)
		e.dataTransfer.effectAllowed = 'move'
	}

	const handleDragOver = (e) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	const handleDropOnLeft = (e, leftPair) => {
		e.preventDefault()
		if (!draggedItem) return

		// Create the match
		const newMatches = { ...matches }

		// Remove any existing match with this right item
		Object.keys(newMatches).forEach(key => {
			if (newMatches[key] === draggedItem.id) {
				delete newMatches[key]
			}
		})

		// Add new match
		newMatches[leftPair.id] = draggedItem.id
		setMatches(newMatches)
		setDraggedItem(null)
	}

	const handleDragEnd = () => {
		setDraggedItem(null)
	}

	// Remove a match
	const handleRemoveMatch = (leftId) => {
		const newMatches = { ...matches }
		delete newMatches[leftId]
		setMatches(newMatches)
	}

	// Check if answer is correct
	const checkAnswer = () => {
		// Check if all pairs are matched
		if (Object.keys(matches).length !== currentQuestion.pairs.length) {
			setIsCorrect(false)
			setIsChecked(true)
			return
		}

		// Check if all matches are correct
		const correct = currentQuestion.pairs.every(pair =>
			matches[pair.id] === pair.id
		)

		setIsCorrect(correct)
		setIsChecked(true)

		if (correct) {
			setScore(score + 1)
		}
	}

	// Move to next question or complete
	const handleNext = async () => {
		// Save current question results
		const currentResults = {
			questionIndex: currentQuestionIndex,
			correct: isCorrect,
			matches: { ...matches },
			correctPairs: currentQuestion.pairs
		}
		setQuestionResults(prev => [...prev, currentResults])

		if (currentQuestionIndex < exercise.data.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1)
		} else {
			// Exercise complete - calculate final score
			// Note: score has already been updated in checkAnswer for the last question
			const totalQuestions = exercise.data.questions.length
			const percentage = Math.round((score / totalQuestions) * 100)

			setTotalScore(percentage)
			setExerciseCompleted(true)

			// Call onComplete callback
			if (onComplete) {
				const apiResponse = await onComplete({
					exerciseId: exercise.id,
					score: percentage,
					completed: true
				})
				if (apiResponse?.isFirstCompletion) {
					setIsFirstCompletion(true)
				}
			}
		}
	}

	// Reset exercise
	const handleReset = () => {
		setCurrentQuestionIndex(0)
		setScore(0)
		setMatches({})
		setIsChecked(false)
		setIsCorrect(false)
		setExerciseCompleted(false)
		setTotalScore(0)
		setIsFirstCompletion(false)
		setQuestionResults([])
	}

	// Try again
	const handleTryAgain = () => {
		const shuffled = [...currentQuestion.pairs].sort(() => Math.random() - 0.5)
		setRightItems(shuffled)
		setMatches({})
		setIsChecked(false)
		setIsCorrect(false)
	}

	if (!currentQuestion) {
		return (
			<Alert severity="error">
				{t('exerciseNotFound')}
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
							{questionResults.map((result, idx) => {
								if (result.correct) return null

								return (
									<Paper
										key={idx}
										elevation={0}
										sx={{
											p: 2,
											mb: 2,
											borderRadius: 2,
											border: '2px solid #ef4444',
											backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
										}}>
										<Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
											{t('question')} {result.questionIndex + 1}
										</Typography>
										{result.correctPairs.map(pair => {
											const userMatchedId = result.matches[pair.id]
											const isIncorrect = userMatchedId !== pair.id

											if (!isIncorrect) return null

											const userMatchedPair = result.correctPairs.find(p => p.id === userMatchedId)

											return (
												<Box key={pair.id} sx={{ mb: 1.5 }}>
													<Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
														{pair.left}
													</Typography>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, ml: 2 }}>
														<Cancel sx={{ color: '#ef4444', fontSize: '1.2rem' }} />
														<Typography variant="body2" sx={{ color: '#ef4444' }}>
															{t('yourAnswer')}: {userMatchedPair?.right || t('empty')}
														</Typography>
													</Box>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
														<CheckCircle sx={{ color: '#10b981', fontSize: '1.2rem' }} />
														<Typography variant="body2" sx={{ color: '#10b981' }}>
															{t('correctAnswer')}: {pair.right}
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

	// Get the right item that's matched to a left item
	const getMatchedRightItem = (leftId) => {
		const rightId = matches[leftId]
		if (!rightId) return null
		return currentQuestion.pairs.find(p => p.id === rightId)
	}

	// Check if a right item is already used
	const isRightItemUsed = (rightId) => {
		return Object.values(matches).includes(rightId)
	}

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 3, md: 4 },
				borderRadius: 4,
				border: isDark ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
				background: isDark
					? 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
					: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Progress */}
			<Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
					{t('question')} {currentQuestionIndex + 1} / {exercise.data.questions.length}
				</Typography>
				<Typography variant="body2" sx={{ fontWeight: 600, color: '#8b5cf6' }}>
					{score} / {exercise.data.questions.length}
				</Typography>
			</Box>

			{/* Instruction */}
			<Typography
				variant="h6"
				sx={{
					mb: 3,
					fontWeight: 600,
					fontSize: { xs: '1.1rem', md: '1.25rem' },
				}}>
				{currentQuestion.instruction}
			</Typography>

			{/* Hint */}
			<Alert severity="info" sx={{ mb: 3 }}>
				{t('dragInstruction')}
			</Alert>

			{/* Two Columns */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				{/* Left Column - Fixed items */}
				<Grid item xs={12} md={6}>
					<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#8b5cf6' }}>
						{t('leftColumn')}
					</Typography>
					{currentQuestion.pairs.map((pair) => {
						const matchedRight = getMatchedRightItem(pair.id)
						const isCorrectMatch = isChecked && matches[pair.id] === pair.id

						return (
							<Paper
								key={pair.id}
								onDragOver={!isChecked ? handleDragOver : undefined}
								onDrop={!isChecked ? (e) => handleDropOnLeft(e, pair) : undefined}
								elevation={2}
								sx={{
									p: 2,
									mb: 2,
									minHeight: '60px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									gap: 2,
									border: isChecked
										? isCorrectMatch
											? '2px solid #10b981'
											: '2px solid #ef4444'
										: matchedRight
											? '2px solid #8b5cf6'
											: '2px dashed rgba(139, 92, 246, 0.3)',
									background: isChecked
										? isCorrectMatch
											? 'rgba(16, 185, 129, 0.1)'
											: 'rgba(239, 68, 68, 0.1)'
										: matchedRight
											? 'rgba(139, 92, 246, 0.1)'
											: isDark
												? 'rgba(30, 41, 59, 0.5)'
												: 'white',
									transition: 'all 0.2s',
								}}>
								<Typography sx={{ fontWeight: 500, flex: 1 }}>
									{pair.left}
								</Typography>

								{matchedRight ? (
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<CompareArrows sx={{ color: '#8b5cf6' }} />
										<Paper
											elevation={0}
											sx={{
												px: 2,
												py: 1,
												backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
												border: '1px solid rgba(139, 92, 246, 0.3)',
											}}>
											<Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
												{matchedRight.right}
											</Typography>
										</Paper>
										{!isChecked && (
											<Button
												size="small"
												onClick={() => handleRemoveMatch(pair.id)}
												sx={{ minWidth: 'auto', p: 0.5 }}>
												✕
											</Button>
										)}
										{isChecked && (
											isCorrectMatch ? (
												<CheckCircle sx={{ color: '#10b981' }} />
											) : (
												<Cancel sx={{ color: '#ef4444' }} />
											)
										)}
									</Box>
								) : (
									<Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b' }}>
										{t('dragInstruction').split(' ')[0]}...
									</Typography>
								)}
							</Paper>
						)
					})}
				</Grid>

				{/* Right Column - Draggable items */}
				<Grid item xs={12} md={6}>
					<Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#06b6d4' }}>
						{t('rightColumn')}
					</Typography>
					{rightItems.map((pair) => {
						const isUsed = isRightItemUsed(pair.id)
						const isDragging = draggedItem?.id === pair.id

						return (
							<Paper
								key={pair.id}
								draggable={!isChecked && !isUsed}
								onDragStart={(e) => !isUsed && handleDragStart(e, pair)}
								onDragEnd={handleDragEnd}
								elevation={isDragging ? 4 : 1}
								sx={{
									p: 2,
									mb: 2,
									minHeight: '60px',
									display: 'flex',
									alignItems: 'center',
									gap: 2,
									cursor: isChecked || isUsed ? 'default' : 'grab',
									opacity: isUsed ? 0.4 : isDragging ? 0.5 : 1,
									transition: 'all 0.2s',
									border: '1px solid rgba(6, 182, 212, 0.2)',
									background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'white',
									'&:active': {
										cursor: isChecked || isUsed ? 'default' : 'grabbing',
									},
									'&:hover': {
										transform: isChecked || isUsed ? 'none' : 'translateY(-2px)',
										boxShadow: isChecked || isUsed ? 1 : 3,
									},
								}}>
								{!isUsed && !isChecked && (
									<DragIndicator sx={{ color: '#06b6d4' }} />
								)}
								<Typography
									sx={{
										flex: 1,
										fontWeight: 500,
										textDecoration: isUsed ? 'line-through' : 'none',
									}}>
									{pair.right}
								</Typography>
							</Paper>
						)
					})}
				</Grid>
			</Grid>

			{/* Result */}
			{isChecked && (
				<Alert
					severity={isCorrect ? 'success' : 'error'}
					sx={{ mb: 3 }}>
					<Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
						{isCorrect ? t('correct') : t('incorrect')}
					</Typography>
					{currentQuestion.explanation && (
						<Typography variant="body2">
							{currentQuestion.explanation}
						</Typography>
					)}
				</Alert>
			)}

			{/* Action Buttons */}
			<Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
				{!isChecked ? (
					<Button
						variant="contained"
						onClick={checkAnswer}
						disabled={Object.keys(matches).length !== currentQuestion.pairs.length}
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
					<>
						{!isCorrect && (
							<Button
								variant="outlined"
								onClick={handleTryAgain}
								sx={{
									borderColor: '#8b5cf6',
									color: '#8b5cf6',
									px: 4,
									py: 1.5,
									fontSize: '1rem',
									fontWeight: 600,
								}}>
								{t('tryAgain')}
							</Button>
						)}
						<Button
							variant="contained"
							onClick={handleNext}
							sx={{
								background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
								px: 4,
								py: 1.5,
								fontSize: '1rem',
								fontWeight: 600,
							}}>
							{currentQuestionIndex < exercise.data.questions.length - 1
								? t('next')
								: t('finish')}
						</Button>
					</>
				)}
			</Box>
		</Paper>
	)
}

export default DragAndDrop
