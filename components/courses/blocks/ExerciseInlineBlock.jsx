import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
	Box,
	Paper,
	Typography,
	TextField,
	Button,
	useTheme,
	Alert,
} from '@mui/material'
import { Edit, CheckCircle, Cancel } from '@mui/icons-material'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'
import { logger } from '@/utils/logger'

const ExerciseInlineBlock = ({ block }) => {
	const t = useTranslations('common')
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { isUserLoggedIn } = useUserContext()

	const { title, questions, xpReward } = block
	const [answers, setAnswers] = useState({})
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({})
	const [xpAwarded, setXpAwarded] = useState(false)

	const handleAnswerChange = (index, value) => {
		setAnswers({ ...answers, [index]: value })
	}

	const handleSubmit = async () => {
		const newResults = {}
		let correctCount = 0

		questions.forEach((q, index) => {
			const userAnswer = (answers[index] || '').trim().toLowerCase()
			const isCorrect = q.acceptableAnswers?.some(
				(acceptable) => acceptable.toLowerCase() === userAnswer
			)
			newResults[index] = isCorrect
			if (isCorrect) correctCount++
		})

		setResults(newResults)
		setSubmitted(true)

		// Award XP if 100% score on first try
		const score = Math.round((correctCount / questions.length) * 100)

		if (score === 100 && !xpAwarded && isUserLoggedIn && xpReward) {
			try {
				const response = await fetch('/api/xp/add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						actionType: 'exercise_completed',
						customXp: xpReward,
						description: `Exercice: ${title}`,
					}),
				})

				if (response.ok) {
					const data = await response.json()
					setXpAwarded(true)
					toast.success(`+${xpReward} XP!`)

					// Check for level up
					if (data.leveledUp) {
						toast.success(`${t('methode_level_achieved', { level: data.currentLevel })} 🎉`)
					}
				}
			} catch (error) {
				logger.error('Error awarding XP:', error)
			}
		}
	}

	const handleReset = () => {
		setAnswers({})
		setResults({})
		setSubmitted(false)
	}

	const score = submitted
		? Math.round((Object.values(results).filter((r) => r).length / questions.length) * 100)
		: 0

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 2, sm: 3 },
				mb: 3,
				borderRadius: 3,
				border: '2px solid',
				borderColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.3)',
				background: isDark
					? 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(30, 41, 59, 0.8) 100%)'
					: 'linear-gradient(135deg, rgba(243, 232, 255, 0.5) 0%, rgba(255, 255, 255, 0.9) 100%)',
			}}>
			{/* Header */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
				<Edit sx={{ fontSize: 28, color: '#a855f7' }} />
				<Typography
					variant="h6"
					sx={{
						fontWeight: 700,
						color: isDark ? '#c084fc' : '#9333ea',
					}}>
					{title}
				</Typography>
			</Box>

			{/* Questions */}
			{questions?.map((q, index) => (
				<Box key={index} sx={{ mb: 3 }}>
					<Typography sx={{ mb: 1.5, fontWeight: 500, color: 'text.primary' }}>
						{index + 1}. {q.question}
					</Typography>

					<TextField
						fullWidth
						size="small"
						value={answers[index] || ''}
						onChange={(e) => handleAnswerChange(index, e.target.value)}
						disabled={submitted}
						placeholder={t('methode_exercise_placeholder')}
						sx={{
							'& .MuiOutlinedInput-root': {
								background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
							},
						}}
						InputProps={{
							endAdornment: submitted ? (
								results[index] ? (
									<CheckCircle sx={{ color: '#22c55e' }} />
								) : (
									<Cancel sx={{ color: '#ef4444' }} />
								)
							) : null,
						}}
					/>

					{/* Hint */}
					{q.hint && !submitted && (
						<Typography
							sx={{
								fontSize: '0.85rem',
								color: isDark ? '#94a3b8' : '#64748b',
								mt: 0.5,
								fontStyle: 'italic',
							}}>
							💡 {q.hint}
						</Typography>
					)}

					{/* Answer */}
					{submitted && !results[index] && (
						<Alert severity="error" sx={{ mt: 1 }}>
							{t('methode_exercise_correct_answer')} : <strong>{q.answer}</strong>
						</Alert>
					)}
				</Box>
			))}

			{/* Actions */}
			<Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
				{!submitted ? (
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={Object.keys(answers).length === 0}
						sx={{
							background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
						}}>
						{t('methode_exercise_check')}
					</Button>
				) : (
					<>
						<Alert severity={score === 100 ? 'success' : score >= 50 ? 'warning' : 'error'}>
							{t('methode_exercise_score')} : {score}% {xpReward && score === 100 && `(+${xpReward} XP)`}
						</Alert>
						<Button variant="outlined" onClick={handleReset}>
							{t('methode_exercise_retry')}
						</Button>
					</>
				)}
			</Box>
		</Paper>
	)
}

export default ExerciseInlineBlock
