'use client'

import { useState, useEffect, useMemo } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, Trophy, RotateCcw, Move, Lightbulb } from 'lucide-react'

/**
 * DragAndDropSequential Component
 * Affiche les paires à associer avec une interface simple de sélection
 *
 * @param {Object} exercise - L'exercice Drag & Drop
 * @param {Function} onComplete - Callback quand l'exercice est terminé
 */
const DragAndDropSequential = ({ exercise, onComplete }) => {
	const { isDark } = useThemeMode()
	const { userProfile } = useUserContext()
	const router = useRouter()
	const t = useTranslations('common')
	const [matches, setMatches] = useState({}) // { leftId: rightId }
	const [selectedLeft, setSelectedLeft] = useState(null)
	const [isChecked, setIsChecked] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)
	const [shuffledRightItems, setShuffledRightItems] = useState([])

	// Add index as ID if pairs don't have IDs
	const pairs = useMemo(() =>
		(exercise.data?.pairs || []).map((pair, index) => ({
			...pair,
			id: pair.id || index
		})),
		[exercise.data?.pairs]
	)
	const leftItems = pairs.map(p => ({ id: p.id, ...p.left }))

	// Get user's spoken language
	const spokenLang = userProfile?.spoken_language || router.locale || 'fr'

	// Get text in user's spoken language
	const getText = (item) => {
		if (!item) return ''
		if (spokenLang === 'ru' && item.ru) return item.ru
		if (spokenLang === 'en' && item.en) return item.en
		return item.fr || item.en || item.ru || ''
	}

	// Shuffle right items when pairs are loaded
	useEffect(() => {
		if (pairs.length > 0) {
			const rightItems = pairs.map(p => ({ id: p.id, ...p.right }))
			const shuffled = [...rightItems].sort(() => Math.random() - 0.5)
			setShuffledRightItems(shuffled)
		}
	}, [pairs.length])

	// Calculate score
	const correctMatches = Object.entries(matches).filter(
		([leftId, rightId]) => String(leftId) === String(rightId)
	).length
	const score = pairs.length > 0 ? Math.round((correctMatches / pairs.length) * 100) : 0

	const handleLeftClick = (leftId) => {
		if (isChecked) return
		setSelectedLeft(leftId)
	}

	const handleRightClick = (rightId) => {
		if (isChecked || !selectedLeft) return
		setMatches({ ...matches, [selectedLeft]: rightId })
		setSelectedLeft(null)
	}

	const handleCheck = () => {
		setIsChecked(true)
		// Show completion screen after a short delay, regardless of score
		setTimeout(() => setIsCompleted(true), 1500)
	}

	const handleRetry = () => {
		// Re-shuffle right items
		const rightItems = pairs.map(p => ({ id: p.id, ...p.right }))
		const shuffled = [...rightItems].sort(() => Math.random() - 0.5)
		setShuffledRightItems(shuffled)
		setMatches({})
		setSelectedLeft(null)
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

	if (!pairs.length) {
		return (
			<Card className={cn('p-8 text-center', isDark ? 'bg-slate-800' : 'bg-white')}>
				<p className={cn('text-lg', isDark ? 'text-slate-300' : 'text-slate-600')}>
					{t('methode_exercise_no_pairs')}
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
								{correctMatches}/{pairs.length} {t('methode_exercise_correct_count')}
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
					{pairs.map((pair) => {
						const userMatchedRightId = matches[pair.id]
						const isCorrect = userMatchedRightId === pair.id
						const userMatchedRight = shuffledRightItems.find(item => item.id === userMatchedRightId)

						return (
							<Card key={pair.id} className={cn(
								'p-4 border-2',
								isDark ? 'bg-slate-700/50' : 'bg-slate-50',
								isCorrect
									? isDark ? 'border-emerald-500/40' : 'border-emerald-300'
									: isDark ? 'border-red-500/40' : 'border-red-300'
							)}>
								{/* Left Item (Question) */}
								<div className="mb-3">
									<p className={cn(
										'text-base font-medium mb-2',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{getText(pair.left)}
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
											{userMatchedRight ? getText(userMatchedRight) : <span className="italic text-slate-400">{t('methode_exercise_no_answer')}</span>}
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
												{getText(pair.right)}
											</p>
										</div>
									)}
								</div>

								{/* Tip/Explanation (if available) */}
								{(pair.hint || pair.explanation) && (
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
													{getText(pair.hint || pair.explanation)}
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
					<Move className={cn('w-5 h-5', isDark ? 'text-violet-400' : 'text-violet-600')} />
					<h3 className={cn(
						'text-lg font-bold',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						{t('methode_exercise_match_pairs')}
					</h3>
				</div>
				<p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
					{t('methode_exercise_match_instruction')}
				</p>
			</div>

			{/* Progress */}
			<div className="flex justify-between items-center mb-6">
				<span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
					{Object.keys(matches).length} / {pairs.length} {t('methode_exercise_associations')}
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

			{/* Matching interface */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				{/* Left column */}
				<div className="space-y-3">
					{leftItems.map((item) => {
						const isSelected = selectedLeft === item.id
						const rightId = matches[item.id]
						const isMatched = !!rightId
						const isCorrect = isChecked && rightId === item.id

						return (
							<button
								key={item.id}
								onClick={() => handleLeftClick(item.id)}
								disabled={isChecked}
								className={cn(
									'w-full p-4 rounded-xl text-left transition-all duration-200',
									'border-2 font-medium',
									!isMatched && !isSelected && (
										isDark
											? 'border-slate-700 bg-slate-900 hover:border-violet-500 hover:bg-slate-800'
											: 'border-slate-200 bg-white hover:border-violet-500 hover:bg-violet-50'
									),
									isSelected && !isMatched && 'border-violet-500 bg-violet-500/10',
									isMatched && !isChecked && 'border-blue-500 bg-blue-500/10',
									isMatched && isChecked && isCorrect && 'border-emerald-500 bg-emerald-500/10',
									isMatched && isChecked && !isCorrect && 'border-red-500 bg-red-500/10',
									isChecked && 'cursor-not-allowed'
								)}
							>
								<div className="flex items-center justify-between">
									<span className={cn(isDark ? 'text-slate-200' : 'text-slate-900')}>
										{getText(item)}
									</span>
									{isMatched && isChecked && (
										isCorrect
											? <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
											: <X className="w-5 h-5 text-red-500 flex-shrink-0" />
									)}
								</div>
							</button>
						)
					})}
				</div>

				{/* Right column */}
				<div className="space-y-3">
					{shuffledRightItems.map((item) => {
						const isUsed = Object.values(matches).includes(item.id)
						const leftId = Object.entries(matches).find(([_, rightId]) => rightId === item.id)?.[0]
						const isCorrect = isChecked && leftId === item.id

						return (
							<button
								key={item.id}
								onClick={() => handleRightClick(item.id)}
								disabled={isChecked || !selectedLeft}
								className={cn(
									'w-full p-4 rounded-xl text-left transition-all duration-200',
									'border-2 font-medium',
									!isUsed && (
										isDark
											? 'border-slate-700 bg-slate-900 hover:border-cyan-500 hover:bg-slate-800'
											: 'border-slate-200 bg-white hover:border-cyan-500 hover:bg-cyan-50'
									),
									isUsed && !isChecked && 'border-blue-500 bg-blue-500/10',
									isUsed && isChecked && isCorrect && 'border-emerald-500 bg-emerald-500/10',
									isUsed && isChecked && !isCorrect && 'border-red-500 bg-red-500/10',
									(isChecked || !selectedLeft) && 'cursor-not-allowed opacity-50'
								)}
							>
								<div className="flex items-center justify-between">
									<span className={cn(isDark ? 'text-slate-200' : 'text-slate-900')}>
										{getText(item)}
									</span>
									{isUsed && isChecked && (
										isCorrect
											? <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
											: <X className="w-5 h-5 text-red-500 flex-shrink-0" />
									)}
								</div>
							</button>
						)
					})}
				</div>
			</div>

			{/* Check button */}
			{!isChecked && (
				<Button
					onClick={handleCheck}
					disabled={Object.keys(matches).length !== pairs.length}
					className={cn(
						'w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600',
						Object.keys(matches).length !== pairs.length && 'opacity-50 cursor-not-allowed'
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

export default DragAndDropSequential
