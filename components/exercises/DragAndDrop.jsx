'use client'

import { useState, useEffect, useMemo } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, Trophy, RotateCcw, GripVertical, Lightbulb } from 'lucide-react'
import ExerciseResults from './ExerciseResults'

/**
 * DragAndDrop Component with HTML5 Drag & Drop API
 * Displays all pairs at once with real drag and drop functionality
 *
 * @param {Object} exercise - The exercise data
 * @param {Function} onComplete - Callback when exercise is completed
 */
const DragAndDrop = ({ exercise, onComplete }) => {
	const { isDark } = useThemeMode()
	const { userProfile } = useUserContext()
	const router = useRouter()
	const t = useTranslations('common')
	const [matches, setMatches] = useState({}) // { leftId: rightId }
	const [isChecked, setIsChecked] = useState(false)
	const [isCompleted, setIsCompleted] = useState(false)
	const [shuffledRightItems, setShuffledRightItems] = useState([])
	const [draggedItem, setDraggedItem] = useState(null)
	const [selectedRightItem, setSelectedRightItem] = useState(null) // For mobile tap-to-select
	const [currentPairIndex, setCurrentPairIndex] = useState(0) // For mobile one-by-one mode
	const [isMobile, setIsMobile] = useState(false) // For mobile tap-to-select

	// Add index as ID if pairs don't have IDs
	const pairs = useMemo(() =>
		(exercise.data?.pairs || []).map((pair, index) => ({
			...pair,
			id: pair.id || index
		})),
		[exercise.data?.pairs]
	)

	// Create left items - handle both object and string formats
	const leftItems = pairs.map(p => {
		if (typeof p.left === 'object') {
			return { id: p.id, ...p.left }
		}
		return { id: p.id, text: p.left }
	})

	// Get user's spoken language
	const spokenLang = userProfile?.spoken_language || router.locale || 'fr'

	// Get text in user's spoken language
	const getText = (item) => {
		if (!item) return ''
		// Handle simple text property (for string-based pairs)
		if (item.text) return item.text
		// Handle multilingual object properties
		if (spokenLang === 'ru' && item.ru) return item.ru
		if (spokenLang === 'en' && item.en) return item.en
		return item.fr || item.en || item.ru || ''
	}

	
	// Detect mobile screen size
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	// Shuffle right items when pairs are loaded
	useEffect(() => {
		if (pairs.length > 0) {
			// Handle both object and string formats
			const rightItems = pairs.map(p => {
				if (typeof p.right === 'object') {
					return { id: p.id, ...p.right }
				}
				return { id: p.id, text: p.right }
			})
			const shuffled = [...rightItems].sort(() => Math.random() - 0.5)
			setShuffledRightItems(shuffled)
		}
	}, [pairs.length])

	// Calculate score
	const correctMatches = Object.entries(matches).filter(
		([leftId, rightId]) => String(leftId) === String(rightId)
	).length
	const score = pairs.length > 0 ? Math.round((correctMatches / pairs.length) * 100) : 0

	// Play a celebration sound for 100% score
	const playPerfectSound = () => {
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)()
			const masterGain = audioContext.createGain()
			masterGain.connect(audioContext.destination)
			masterGain.gain.setValueAtTime(0.12, audioContext.currentTime)

			// Victory melody: C5 -> E5 -> G5 (ascending major chord)
			const notes = [
				{ freq: 523.25, time: 0, duration: 0.15 },      // C5
				{ freq: 659.25, time: 0.12, duration: 0.15 },   // E5
				{ freq: 783.99, time: 0.24, duration: 0.2 }     // G5
			]

			notes.forEach(({ freq, time, duration }) => {
				const osc = audioContext.createOscillator()
				const gain = audioContext.createGain()
				osc.connect(gain)
				gain.connect(masterGain)
				osc.frequency.setValueAtTime(freq, audioContext.currentTime + time)
				osc.type = 'sine'
				gain.gain.setValueAtTime(1, audioContext.currentTime + time)
				gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + duration)
				osc.start(audioContext.currentTime + time)
				osc.stop(audioContext.currentTime + time + duration)
			})

			setTimeout(() => audioContext.close(), 600)
		} catch (error) {
			// Silently fail if audio context is not supported
		}
	}

	// Play celebration sound when exercise is completed with 100%
	useEffect(() => {
		if (isCompleted && score === 100) {
			playPerfectSound()
		}
	}, [isCompleted, score])

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
		if (!draggedItem || isChecked) return

		// Create the match
		const newMatches = { ...matches }

		// Remove any existing match with this right item
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

	
	
	// Mobile one-by-one navigation
	const handleNextPair = () => {
		if (currentPairIndex < pairs.length - 1) {
			setCurrentPairIndex(currentPairIndex + 1)
			setSelectedRightItem(null)
		}
	}

	const handlePrevPair = () => {
		if (currentPairIndex > 0) {
			setCurrentPairIndex(currentPairIndex - 1)
			setSelectedRightItem(null)
		}
	}

	const handleMobileMatch = (rightItem) => {
		if (isChecked) return
		const leftPair = leftItems[currentPairIndex]
		
		const newMatches = { ...matches }
		Object.keys(newMatches).forEach((key) => {
			if (newMatches[key] === rightItem.id) {
				delete newMatches[key]
			}
		})
		newMatches[leftPair.id] = rightItem.id
		setMatches(newMatches)
		
		// Auto-advance to next pair if not last
		if (currentPairIndex < pairs.length - 1) {
			setTimeout(() => {
				setCurrentPairIndex(currentPairIndex + 1)
			}, 300)
		}
	}

	// Tap handler for mobile (select right item)
	const handleTapRightItem = (item) => {
		if (isChecked || isRightItemUsed(item.id)) return
		setSelectedRightItem(selectedRightItem?.id === item.id ? null : item)
	}

	// Tap handler for mobile (match to left item)
	const handleTapLeftItem = (leftPair) => {
		if (!selectedRightItem || isChecked) return
		
		// Create the match
		const newMatches = { ...matches }
		
		// Remove any existing match with this right item
		Object.keys(newMatches).forEach((key) => {
			if (newMatches[key] === selectedRightItem.id) {
				delete newMatches[key]
			}
		})
		
		// Add new match
		newMatches[leftPair.id] = selectedRightItem.id
		setMatches(newMatches)
		setSelectedRightItem(null)
	}

	// Remove a match
	const handleRemoveMatch = (leftId) => {
		if (isChecked) return
		const newMatches = { ...matches }
		delete newMatches[leftId]
		setMatches(newMatches)
	}

	const handleCheck = () => {
		setIsChecked(true)
		// Show completion screen after a short delay
		setTimeout(() => setIsCompleted(true), 1500)
	}

	const handleRetry = () => {
		// Re-shuffle right items
		const rightItems = pairs.map(p => {
			if (typeof p.right === 'object') {
				return { id: p.id, ...p.right }
			}
			return { id: p.id, text: p.right }
		})
		const shuffled = [...rightItems].sort(() => Math.random() - 0.5)
		setShuffledRightItems(shuffled)
		setMatches({})
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

	// Get the right item that's matched to a left item
	const getMatchedRightItem = (leftId) => {
		const rightId = matches[leftId]
		if (!rightId) return null
		return shuffledRightItems.find(item => item.id === rightId)
	}

	// Check if a right item is already used
	const isRightItemUsed = (rightId) => {
		return Object.values(matches).includes(rightId)
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
		// Prepare review items for ExerciseResults
		const reviewItems = pairs.map((pair) => {
			const userMatchedRightId = matches[pair.id]
			const isCorrect = userMatchedRightId === pair.id
			const userMatchedRight = shuffledRightItems.find(item => item.id === userMatchedRightId)

			return {
				question: getText(pair.left),
				userAnswer: userMatchedRight ? getText(userMatchedRight) : null,
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
			/>
		)
	}

	// Mobile one-by-one mode
	if (isMobile && !isChecked && !isCompleted) {
		const currentLeft = leftItems[currentPairIndex]
		const currentMatch = matches[currentLeft?.id]

		return (
			<Card className={cn(
				'p-6',
				isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
			)}>
				{/* Progress */}
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<span className={cn(
							'text-sm font-medium',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{currentPairIndex + 1} / {pairs.length}
						</span>
						<span className={cn(
							'text-xs font-medium',
							isDark ? 'text-violet-400' : 'text-violet-600'
						)}>
							{Object.keys(matches).length} {t('methode_exercise_matched')}
						</span>
					</div>
					<div className={cn(
						'h-2 rounded-full overflow-hidden',
						isDark ? 'bg-slate-700' : 'bg-slate-200'
					)}>
						<div
							className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
							style={{ width: `${((currentPairIndex + 1) / pairs.length) * 100}%` }}
						/>
					</div>
				</div>

				{/* Question */}
				<div className={cn(
					'p-4 rounded-xl mb-6 border-2',
					isDark
						? 'bg-violet-500/10 border-violet-500/30'
						: 'bg-violet-50 border-violet-200'
				)}>
					<p className={cn(
						'text-sm font-semibold mb-2',
						isDark ? 'text-violet-400' : 'text-violet-700'
					)}>
						{t('methode_exercise_match_this')}
					</p>
					<p className={cn(
						'text-lg font-bold',
						isDark ? 'text-slate-100' : 'text-slate-900'
					)}>
						{getText(currentLeft)}
					</p>
				</div>

				{/* Options */}
				<div className="space-y-3 mb-6">
					<p className={cn(
						'text-sm font-semibold mb-3',
						isDark ? 'text-cyan-400' : 'text-cyan-600'
					)}>
						{t('methode_exercise_select_answer')}
					</p>
					{shuffledRightItems.map((rightItem) => {
						const isSelected = currentMatch === rightItem.id
						const isUsedElsewhere = Object.values(matches).includes(rightItem.id) && !isSelected

						return (
							<button
								key={rightItem.id}
								onClick={() => handleMobileMatch(rightItem)}
								disabled={isUsedElsewhere}
								className={cn(
									'w-full p-4 rounded-xl text-left transition-all duration-200',
									'border-2',
									isSelected
										? 'border-cyan-500 bg-cyan-500/20 ring-4 ring-cyan-500/30'
										: isUsedElsewhere
											? cn(
												'opacity-40 cursor-not-allowed',
												isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-100 border-slate-300'
											)
											: cn(
												'hover:border-cyan-500/50 hover:bg-cyan-500/10',
												isDark
													? 'bg-slate-700/50 border-cyan-500/30'
													: 'bg-slate-50 border-cyan-500/30'
											)
									)}
								>
									<span className={cn(
										'font-medium',
										isSelected
											? 'text-cyan-300'
											: isUsedElsewhere
												? 'text-slate-500 line-through'
												: isDark ? 'text-slate-200' : 'text-slate-800'
									)}>
										{getText(rightItem)}
									</span>
								</button>
							)
						})}
				</div>

				{/* Navigation */}
				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={handlePrevPair}
						disabled={currentPairIndex === 0}
						className="flex-1"
					>
						{t('methode_exercise_previous')}
					</Button>
					{currentPairIndex === pairs.length - 1 ? (
						<Button
							onClick={handleCheck}
							disabled={Object.keys(matches).length !== pairs.length}
							className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500"
						>
							{t('methode_exercise_check')}
						</Button>
					) : (
						<Button
							onClick={handleNextPair}
							className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500"
						>
							{t('methode_exercise_next')}
						</Button>
					)}
				</div>
			</Card>
		)
	}

	// Exercise view
	return (
		<Card className={cn(
			'p-6 sm:p-8',
			isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
		)}>
			{/* Instruction */}
			<div className={cn(
				'p-4 rounded-lg mb-6',
				isDark
					? 'bg-blue-500/10 border border-blue-500/30'
					: 'bg-blue-50 border border-blue-200'
			)}>
				<p className={cn(
					'text-sm font-medium',
					isDark ? 'text-blue-300' : 'text-blue-700'
				)}>
					💡 {t('methode_exercise_drag_instruction') || 'Glissez ou tapez sur les éléments de droite, puis tapez sur la case de gauche pour les associer'}
				</p>
			</div>

			{/* Two Columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Left Column - Drop zones */}
				<div>
					<p className={cn(
						'text-sm font-semibold mb-4',
						isDark ? 'text-violet-400' : 'text-violet-600'
					)}>
						{t('methode_exercise_left_column') || 'Éléments à associer'}
					</p>
					<div className="space-y-3">
						{leftItems.map((leftItem) => {
							const matchedRight = getMatchedRightItem(leftItem.id)
							const isCorrectMatch = isChecked && matches[leftItem.id] === leftItem.id

							return (
								<div
									key={`left-${leftItem.id}`}
									onDragOver={!isChecked ? handleDragOver : undefined}
									onDrop={!isChecked ? (e) => handleDropOnLeft(e, leftItem) : undefined}
							onClick={(e) => {
								// Mobile: tap to match selected item
								if (selectedRightItem && !matchedRight && !isChecked) {
									e.preventDefault()
									handleTapLeftItem(leftItem)
								}
							}}
									className={cn(
										'p-4 min-h-[70px] rounded-xl flex items-center justify-between gap-3',
										'transition-all duration-200',
										isChecked
											? isCorrectMatch
												? 'border-2 border-emerald-500 bg-emerald-500/10'
												: 'border-2 border-red-500 bg-red-500/10'
											: matchedRight
												? 'border-2 border-violet-500 bg-violet-500/10'
												: cn(
													'border-2 border-dashed',
													isDark
														? 'border-violet-500/30 bg-slate-700/50 hover:bg-slate-700'
														: 'border-violet-500/30 bg-slate-50 hover:bg-slate-100'
												)
									)}
								>
									<span className={cn(
										'font-medium flex-1',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{getText(leftItem)}
									</span>

									{matchedRight ? (
										<div className="flex items-center gap-2">
											<div className={cn(
												'px-3 py-2 rounded-lg font-medium text-sm',
												isDark
													? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-300'
													: 'bg-cyan-50 border border-cyan-300 text-cyan-700'
											)}>
												{getText(matchedRight)}
											</div>
											{!isChecked && (
												<button
													onClick={() => handleRemoveMatch(leftItem.id)}
													className={cn(
														'p-1 rounded hover:bg-slate-500/20',
														isDark ? 'text-slate-400' : 'text-slate-500'
													)}
												>
													<X className="w-4 h-4" />
												</button>
											)}
											{isChecked && (
												isCorrectMatch ? (
													<Check className="w-5 h-5 text-emerald-500" />
												) : (
													<X className="w-5 h-5 text-red-500" />
												)
											)}
										</div>
									) : (
										<span className={cn(
											'text-xs',
											isDark ? 'text-slate-500' : 'text-slate-400'
										)}>
											{t('methode_exercise_drop_here') || 'Déposez ici'}
										</span>
									)}
								</div>
							)
						})}
					</div>
				</div>

				{/* Right Column - Draggable items */}
				<div>
					<p className={cn(
						'text-sm font-semibold mb-4',
						isDark ? 'text-cyan-400' : 'text-cyan-600'
					)}>
						{t('methode_exercise_right_column') || 'Réponses'}
					</p>
					<div className="space-y-3">
						{shuffledRightItems.map((rightItem) => {
							const isUsed = isRightItemUsed(rightItem.id)
							const isDragging = draggedItem?.id === rightItem.id

							return (
								<div
									key={`right-${rightItem.id}`}
						onClick={() => handleTapRightItem(rightItem)}
									draggable={!isChecked && !isUsed}
									onDragStart={(e) => !isUsed && handleDragStart(e, rightItem)}
									onDragEnd={handleDragEnd}
									className={cn(
										'p-4 min-h-[70px] rounded-xl flex items-center gap-3',
										'transition-all duration-200',
										'border-2',
										isDark
											? 'border-cyan-500/30 bg-slate-700/50'
											: 'border-cyan-500/30 bg-slate-50',
										isChecked || isUsed ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
										isUsed ? 'opacity-30' : isDragging ? 'opacity-50' : 'opacity-100',
									selectedRightItem?.id === rightItem.id && !isUsed && 'ring-4 ring-cyan-500/50 scale-105',
										!isChecked && !isUsed && 'hover:border-cyan-500/50 hover:shadow-md'
									)}
								>
									{!isUsed && !isChecked && (
										<GripVertical className={cn(
											'w-5 h-5',
											isDark ? 'text-cyan-400' : 'text-cyan-600'
										)} />
									)}
									<span className={cn(
										'flex-1 font-medium',
										isUsed && 'line-through',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{getText(rightItem)}
									</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			{/* Action Button */}
			<div className="flex justify-center">
				<Button
					onClick={handleCheck}
					disabled={Object.keys(matches).length !== pairs.length || isChecked}
					className={cn(
						'px-8 py-3 text-base font-semibold',
						'bg-gradient-to-r from-violet-500 to-cyan-500',
						'hover:from-violet-600 hover:to-cyan-600',
						'disabled:opacity-50 disabled:cursor-not-allowed'
					)}
				>
					{t('methode_exercise_check')}
				</Button>
			</div>
		</Card>
	)
}

export default DragAndDrop
