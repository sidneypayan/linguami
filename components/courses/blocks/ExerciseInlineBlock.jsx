'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'
import {
	Flame,
	CheckCircle,
	XCircle,
	RotateCcw,
	Sparkles,
	Lightbulb,
	Trophy,
	Target,
} from 'lucide-react'

/**
 * ExerciseInlineBlock - Mini-defi d'exercice
 * Style gaming/fantasy avec systeme de score
 */
const ExerciseInlineBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const { isUserLoggedIn } = useUserContext()

	const { title, questions, xpReward } = block
	const [answers, setAnswers] = useState({})
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({})

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

		const score = Math.round((correctCount / questions.length) * 100)

		if (score === 100) {
			toast.success(t('methode_exercise_perfect_score'))
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

	const correctCount = Object.values(results).filter((r) => r).length

	return (
		<div className={cn(
			'relative rounded-2xl border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-purple-950/50 via-slate-900 to-pink-950/30 border-purple-500/30'
				: 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

			{/* Score badge quand soumis */}
			{submitted && (
				<div className={cn(
					'relative p-3 sm:p-4 border-b flex justify-end',
					isDark ? 'border-purple-500/20' : 'border-purple-200'
				)}>
					<Badge className={cn(
						'font-bold px-3 py-1',
						score === 100
							? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0'
							: score >= 50
								? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0'
								: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-0'
					)}>
						<Flame className="w-3 h-3 mr-1" />
						{score}%
					</Badge>
				</div>
			)}

			{/* Questions */}
			<div className="relative p-4 sm:p-5 space-y-4">
				{questions?.map((q, index) => (
					<div
						key={index}
						className={cn(
							'p-4 rounded-xl transition-all duration-200',
							submitted
								? results[index]
									? isDark
										? 'bg-emerald-500/10 ring-2 ring-emerald-500/30'
										: 'bg-emerald-50 ring-2 ring-emerald-200'
									: isDark
										? 'bg-red-500/10 ring-2 ring-red-500/30'
										: 'bg-red-50 ring-2 ring-red-200'
								: isDark
									? 'bg-slate-800/50'
									: 'bg-white shadow-sm'
						)}
					>
						{/* Question */}
						<p className={cn(
							'font-medium mb-3',
							isDark ? 'text-white' : 'text-slate-900'
						)}>
							{q.question}
						</p>

						{/* Input */}
						<div>
							<input
								type="text"
								value={answers[index] || ''}
								onChange={(e) => handleAnswerChange(index, e.target.value)}
								disabled={submitted}
								placeholder={t('methode_exercise_placeholder')}
								className={cn(
									'w-full px-4 py-2.5 rounded-lg border-2 transition-all',
									'focus:outline-none focus:ring-2 focus:ring-purple-500/50',
									submitted
										? results[index]
											? isDark
												? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
												: 'bg-emerald-50 border-emerald-300 text-emerald-700'
											: isDark
												? 'bg-red-500/10 border-red-500/30 text-red-300'
												: 'bg-red-50 border-red-300 text-red-700'
										: isDark
											? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500'
											: 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
								)}
							/>

							{/* Indice */}
							{q.hint && !submitted && (
								<div className={cn(
									'flex items-center gap-1.5 mt-2 text-sm',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									<Lightbulb className="w-4 h-4 text-amber-500" />
									<span className="italic">{q.hint}</span>
								</div>
							)}

							{/* Reponse correcte */}
							{submitted && !results[index] && (
								<div className={cn(
									'mt-2 p-2 rounded-lg flex items-center gap-2',
									isDark
										? 'bg-red-500/10 text-red-300'
										: 'bg-red-50 text-red-700'
								)}>
									<span className="font-medium">{t('methode_exercise_correct_answer')} :</span>
									<span className="font-bold">{q.answer}</span>
								</div>
							)}
						</div>
					</div>
				))}

				{/* Actions */}
				<div className={cn(
					'flex items-center gap-4 pt-4 border-t',
					isDark ? 'border-slate-800' : 'border-slate-100'
				)}>
					{!submitted ? (
						<Button
							onClick={handleSubmit}
							disabled={Object.keys(answers).length === 0}
							className={cn(
								'gap-2 font-bold shadow-lg',
								'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
							)}
						>
							<Sparkles className="w-4 h-4" />
							{t('methode_exercise_check')}
						</Button>
					) : (
						<>
							{/* Resultat */}
							<div className={cn(
								'flex items-center gap-3 px-4 py-2 rounded-xl',
								score === 100
									? isDark
										? 'bg-emerald-500/10'
										: 'bg-emerald-50'
									: score >= 50
										? isDark
											? 'bg-amber-500/10'
											: 'bg-amber-50'
										: isDark
											? 'bg-red-500/10'
											: 'bg-red-50'
							)}>
								{score === 100 ? (
									<Trophy className="w-5 h-5 text-amber-500" />
								) : (
									<Target className={cn(
										'w-5 h-5',
										score >= 50 ? 'text-amber-500' : 'text-red-500'
									)} />
								)}
								<div>
									<p className={cn(
										'font-bold',
										score === 100
											? 'text-emerald-500'
											: score >= 50
												? 'text-amber-500'
												: 'text-red-500'
									)}>
										{t('methode_exercise_score')} : {score}%
									</p>
									<p className={cn(
										'text-sm',
										isDark ? 'text-slate-400' : 'text-slate-500'
									)}>
										{correctCount}/{questions.length} {correctCount > 1 ? 'correctes' : 'correcte'}
									</p>
								</div>
							</div>

							<Button
								variant="outline"
								onClick={handleReset}
								className={cn(
									'gap-2 border-2',
									isDark
										? 'border-slate-700 hover:bg-slate-800'
										: 'border-slate-200 hover:bg-slate-50'
								)}
							>
								<RotateCcw className="w-4 h-4" />
								{t('methode_exercise_retry')}
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default ExerciseInlineBlock
