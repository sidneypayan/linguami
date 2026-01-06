'use client'

import { useState, useEffect, useMemo } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, RotateCcw, Move } from 'lucide-react'
import ExerciseResults from './ExerciseResults'

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
		// Build review items
		const reviewItems = pairs.map((pair) => {
			const userMatchedRightId = matches[pair.id]
			const isCorrect = userMatchedRightId === pair.id
			const userMatchedRight = shuffledRightItems.find(item => item.id === userMatchedRightId)

			return {
				question: getText(pair.left),
				userAnswer: userMatchedRight ? getText(userMatchedRight) : t('methode_exercise_no_answer'),
				correctAnswer: getText(pair.right),
				isCorrect,
				explanation: getText(pair.hint || pair.explanation)
			}
		})

		return (
			<ExerciseResults
				score={score}
				correctCount={correctMatches}
				totalCount={pairs.length}
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
