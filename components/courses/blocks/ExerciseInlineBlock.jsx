'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUserContext } from '@/context/user'
import toast from '@/utils/toast'
import { triggerCelebration } from '@/components/shared/CelebrationOverlay'
import {
	Flame,
	CheckCircle,
	XCircle,
	RotateCcw,
	Sparkles,
	Lightbulb,
	Trophy,
	Target,
	GripVertical,
	ArrowLeftRight,
	Star,
	PartyPopper,
} from 'lucide-react'

/**
 * ExerciseInlineBlock - Mini-defi d'exercice
 * Style gaming/fantasy avec systeme de score
 * Supporte: fillInBlank, dragAndDrop
 */
const ExerciseInlineBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const { isUserLoggedIn } = useUserContext()
	const params = useParams()
	const locale = params?.locale || 'fr'

	const { title, questions, xpReward, exerciseType, pairs } = block

	// Detecter le type d'exercice
	const isDragAndDrop = exerciseType === 'dragAndDrop' || pairs

	// State pour fill-in-blank
	const [answers, setAnswers] = useState({})
	const [submitted, setSubmitted] = useState(false)
	const [results, setResults] = useState({})

	// State pour drag-and-drop
	const [shuffledPairs, setShuffledPairs] = useState([])
	const [matches, setMatches] = useState({})
	const [draggedItem, setDraggedItem] = useState(null)

	// Initialize shuffled pairs for drag and drop
	useEffect(() => {
		if (isDragAndDrop && pairs) {
			const shuffled = [...pairs].sort(() => Math.random() - 0.5)
			setShuffledPairs(shuffled)
		}
	}, [isDragAndDrop, pairs])

	// Fill-in-blank handlers
	const handleAnswerChange = (index, value) => {
		setAnswers({ ...answers, [index]: value })
	}

	const handleSubmit = async () => {
		if (isDragAndDrop) {
			// Check drag and drop
			const newResults = {}
			let correctCount = 0

			pairs.forEach((pair) => {
				const isCorrect = matches[pair.id] === pair.id
				newResults[pair.id] = isCorrect
				if (isCorrect) correctCount++
			})

			setResults(newResults)
			setSubmitted(true)

			const score = Math.round((correctCount / pairs.length) * 100)
			if (score === 100) {
				toast.success(t('methode_exercise_perfect_score'))
				// Trigger celebration animation
				setTimeout(() => {
					triggerCelebration({
						type: 'lesson',
						xpGained: xpReward || 10,
						goldGained: 0
					})
				}, 500)
			}
		} else {
			// Check fill-in-blank
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
				// Trigger celebration animation
				setTimeout(() => {
					triggerCelebration({
						type: 'lesson',
						xpGained: xpReward || 10,
						goldGained: 0
					})
				}, 500)
			}
		}
	}

	const handleReset = () => {
		setAnswers({})
		setResults({})
		setSubmitted(false)
		setMatches({})
		if (isDragAndDrop && pairs) {
			const shuffled = [...pairs].sort(() => Math.random() - 0.5)
			setShuffledPairs(shuffled)
		}
	}

	// Drag and drop handlers
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

		const newMatches = { ...matches }

		// Remove existing match with this right item
		Object.keys(newMatches).forEach((key) => {
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

	const handleRemoveMatch = (leftId) => {
		const newMatches = { ...matches }
		delete newMatches[leftId]
		setMatches(newMatches)
	}

	const getMatchedRightItem = (leftId) => {
		const rightId = matches[leftId]
		if (!rightId) return null
		return pairs.find((p) => p.id === rightId)
	}

	const isRightItemUsed = (rightId) => {
		const used = Object.values(matches).includes(rightId)
		console.log('isRightItemUsed', { rightId, matches, matchValues: Object.values(matches), used })
		return used
	}

	const score = submitted
		? isDragAndDrop
			? Math.round((Object.values(results).filter((r) => r).length / pairs.length) * 100)
			: Math.round((Object.values(results).filter((r) => r).length / questions.length) * 100)
		: 0

	const correctCount = Object.values(results).filter((r) => r).length
	const totalCount = isDragAndDrop ? pairs?.length : questions?.length

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

			{/* Title */}
			{title && (
				<div className={cn(
					'relative p-3 sm:p-4 border-b',
					isDark ? 'border-purple-500/20' : 'border-purple-200'
				)}>
					<h4 className={cn(
						'font-bold text-lg',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						{title}
					</h4>
				</div>
			)}

			{/* Content */}
			<div className="relative p-4 sm:p-5 space-y-4">
				{/* Drag and Drop */}
				{isDragAndDrop && pairs ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Left Column */}
						<div>
							<p className="text-sm font-semibold text-purple-500 mb-3">
								{t('methode_drag_left') || 'Expressions'}
							</p>
							{pairs.map((pair) => {
								const matchedRight = getMatchedRightItem(pair.id)
								const isCorrectMatch = submitted && matches[pair.id] === pair.id

								return (
									<div
										key={pair.id}
										onDragOver={!submitted ? handleDragOver : undefined}
										onDrop={!submitted ? (e) => handleDropOnLeft(e, pair) : undefined}
										className={cn(
											'p-3 mb-2 min-h-[60px] rounded-xl flex items-center justify-between gap-2',
											'transition-all duration-200',
											submitted
												? isCorrectMatch
													? 'border-2 border-emerald-500 bg-emerald-500/10'
													: 'border-2 border-red-500 bg-red-500/10'
												: matchedRight
													? 'border-2 border-purple-500 bg-purple-500/10'
													: cn(
														'border-2 border-dashed',
														isDark
															? 'border-purple-500/30 bg-slate-800/50'
															: 'border-purple-500/30 bg-white'
													)
										)}
									>
										<span className={cn(
											'font-medium flex-1 text-sm',
											isDark ? 'text-slate-200' : 'text-slate-700'
										)}>
											{pair.left[locale] || pair.left.fr}
										</span>

										{matchedRight ? (
											<div className="flex items-center gap-2">
												<ArrowLeftRight className="w-4 h-4 text-purple-500" />
												<div className={cn(
													'px-2 py-1 rounded-lg text-sm',
													isDark
														? 'bg-purple-500/20 border border-purple-500/30'
														: 'bg-purple-500/10 border border-purple-500/30'
												)}>
													<span className="font-medium">
														{matchedRight.right[locale] || matchedRight.right.fr}
													</span>
												</div>
												{!submitted && (
													<button
														onClick={() => handleRemoveMatch(pair.id)}
														className="p-1 text-slate-400 hover:text-slate-600 text-xs"
													>
														×
													</button>
												)}
												{submitted && (
													isCorrectMatch ? (
														<CheckCircle className="w-5 h-5 text-emerald-500" />
													) : (
														<XCircle className="w-5 h-5 text-red-500" />
													)
												)}
											</div>
										) : (
											<span className={cn(
												'text-xs',
												isDark ? 'text-slate-500' : 'text-slate-400'
											)}>
												{t('methode_drag_here') || 'Glissez ici'}
											</span>
										)}
									</div>
								)
							})}
						</div>

						{/* Right Column */}
						<div>
							<p className="text-sm font-semibold text-cyan-500 mb-3">
								{t('methode_drag_right') || 'Traductions'}
							</p>
							{shuffledPairs.map((pair) => {
								const isUsed = isRightItemUsed(pair.id)
								const isDragging = draggedItem?.id === pair.id

								return (
									<div
										key={pair.id}
										draggable={!submitted && !isUsed}
										onDragStart={(e) => !isUsed && handleDragStart(e, pair)}
										onDragEnd={handleDragEnd}
										className={cn(
											'p-3 mb-2 min-h-[60px] rounded-xl flex items-center gap-2',
											'transition-all duration-200 border',
											isDark
												? 'border-cyan-500/20 bg-slate-800/50'
												: 'border-cyan-500/20 bg-white',
											submitted || isUsed ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
											isUsed ? 'opacity-40' : isDragging ? 'opacity-50' : 'opacity-100',
											!submitted && !isUsed && 'hover:-translate-y-0.5 hover:shadow-md'
										)}
									>
										{!isUsed && !submitted && (
											<GripVertical className="w-4 h-4 text-cyan-500" />
										)}
										<span className={cn(
											'flex-1 font-medium text-sm',
											isUsed ? 'line-through' : '',
											isDark ? 'text-slate-200' : 'text-slate-700'
										)}>
											{pair.right[locale] || pair.right.fr}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				) : (
					/* Fill-in-blank questions */
					questions?.map((q, index) => (
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
				))
				)}

				{/* Actions */}
				<div className={cn(
					'flex items-center gap-4 pt-4 border-t',
					isDark ? 'border-slate-800' : 'border-slate-100'
				)}>
					{!submitted ? (
						<Button
							onClick={handleSubmit}
							disabled={
								isDragAndDrop
									? Object.keys(matches).length !== pairs?.length
									: Object.keys(answers).length === 0
							}
							className={cn(
								'gap-2 font-bold shadow-lg',
								'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
							)}
						>
							<Sparkles className="w-4 h-4" />
							{t('methode_exercise_check')}
						</Button>
					) : (
						<div className="w-full">
							{/* Resultat - Version améliorée */}
							<div className={cn(
								'relative overflow-hidden rounded-2xl p-6 mb-4',
								'border-2 shadow-lg',
								score === 100
									? cn(
										'bg-gradient-to-br',
										isDark
											? 'from-emerald-500/20 via-emerald-600/10 to-teal-500/20 border-emerald-500/40'
											: 'from-emerald-50 via-emerald-100/50 to-teal-50 border-emerald-300'
									)
									: score >= 50
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
								{/* Particules décoratives */}
								{score === 100 && (
									<>
										<Star className={cn(
											'absolute w-6 h-6 top-4 right-12',
											'text-amber-400 fill-amber-400 animate-pulse'
										)} />
										<Sparkles className={cn(
											'absolute w-5 h-5 top-8 right-4',
											'text-emerald-400 animate-pulse'
										)} style={{ animationDelay: '0.3s' }} />
										<Star className={cn(
											'absolute w-4 h-4 bottom-6 right-8',
											'text-yellow-400 fill-yellow-400 animate-pulse'
										)} style={{ animationDelay: '0.6s' }} />
									</>
								)}

								<div className="relative flex items-center gap-4">
									{/* Icon */}
									<div className={cn(
										'w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0',
										'shadow-lg',
										score === 100
											? 'bg-gradient-to-br from-amber-400 to-amber-500'
											: score >= 50
												? 'bg-gradient-to-br from-amber-400 to-orange-500'
												: 'bg-gradient-to-br from-red-400 to-rose-500'
									)}>
										{score === 100 ? (
											<Trophy className="w-8 h-8 text-white" />
										) : score >= 50 ? (
											<Target className="w-8 h-8 text-white" />
										) : (
											<XCircle className="w-8 h-8 text-white" />
										)}
									</div>

									{/* Content */}
									<div className="flex-1">
										<p className={cn(
											'text-2xl font-extrabold mb-1',
											score === 100
												? 'text-emerald-600 dark:text-emerald-400'
												: score >= 50
													? 'text-amber-600 dark:text-amber-400'
													: 'text-red-600 dark:text-red-400'
										)}>
											{score === 100 ? '🎉 ' : ''}{t('methode_exercise_score')} : {score}%
										</p>
										<div className="flex items-center gap-2">
											<p className={cn(
												'text-base font-medium',
												isDark ? 'text-slate-300' : 'text-slate-700'
											)}>
												{correctCount}/{totalCount} {t('methode_exercise_correct_count', { count: correctCount })}
											</p>
											{score === 100 && (
												<Badge className={cn(
													'bg-emerald-500 text-white border-0 shadow-md',
													'animate-pulse'
												)}>
													{t('methode_exercise_perfect')}
												</Badge>
											)}
										</div>
										{xpReward > 0 && (
											<div className="flex items-center gap-1.5 mt-2">
												<Star className="w-4 h-4 text-amber-500 fill-amber-500" />
												<span className={cn(
													'text-sm font-bold',
													isDark ? 'text-amber-400' : 'text-amber-600'
												)}>
													+{xpReward} XP
												</span>
											</div>
										)}
									</div>

									{/* Retry Button */}
									<Button
										variant="outline"
										onClick={handleReset}
										className={cn(
											'gap-2 border-2 flex-shrink-0',
											score === 100
												? isDark
													? 'border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400'
													: 'border-emerald-500 hover:bg-emerald-50 text-emerald-700'
												: isDark
													? 'border-slate-700 hover:bg-slate-800'
													: 'border-slate-300 hover:bg-slate-50'
										)}
									>
										<RotateCcw className="w-4 h-4" />
										{t('methode_exercise_retry')}
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ExerciseInlineBlock
