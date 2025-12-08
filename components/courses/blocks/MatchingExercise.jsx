import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check, X, Play, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'

/**
 * MatchingExercise - Exercice de matching par click
 * Relier des questions à leurs réponses
 */
const MatchingExercise = ({ pairs, dialogue }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const audioRef = useRef(null)

	// Mélanger les réponses
	const [rightItems] = useState(() => {
		const items = [...pairs].map((p, i) => ({ text: p.right, id: i }))
		return items.sort(() => Math.random() - 0.5)
	})

	const [leftItems] = useState(() => {
		return pairs.map((p, i) => ({ text: p.left, id: i }))
	})

	const [selectedLeft, setSelectedLeft] = useState(null)
	const [selectedRight, setSelectedRight] = useState(null)
	const [matches, setMatches] = useState({}) // { leftId: rightId }
	const [validated, setValidated] = useState(false)
	const [score, setScore] = useState(null)
	const [showAnimation, setShowAnimation] = useState(false)
	const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null)

	const handleLeftClick = (id) => {
		if (validated) return

		if (selectedLeft === id) {
			setSelectedLeft(null)
		} else {
			setSelectedLeft(id)
			if (selectedRight !== null) {
				// Créer la connexion
				setMatches({ ...matches, [id]: selectedRight })
				setSelectedLeft(null)
				setSelectedRight(null)
			}
		}
	}

	const handleRightClick = (id) => {
		if (validated) return

		if (selectedRight === id) {
			setSelectedRight(null)
		} else {
			setSelectedRight(id)
			if (selectedLeft !== null) {
				// Créer la connexion
				setMatches({ ...matches, [selectedLeft]: id })
				setSelectedLeft(null)
				setSelectedRight(null)
			}
		}
	}

	const handleRemoveMatch = (leftId) => {
		if (validated) return
		const newMatches = { ...matches }
		delete newMatches[leftId]
		setMatches(newMatches)
	}

	const handleValidate = () => {
		if (Object.keys(matches).length !== pairs.length) return

		let correct = 0
		Object.entries(matches).forEach(([leftId, rightId]) => {
			if (parseInt(leftId) === parseInt(rightId)) {
				correct++
			}
		})

		const percentage = Math.round((correct / pairs.length) * 100)
		setScore(percentage)
		setValidated(true)

		if (percentage === 100) {
			// Success confetti
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 }
			})

			// Lancer l'animation + audio après 500ms
			setTimeout(() => {
				setShowAnimation(true)
				if (dialogue && dialogue.length > 0) {
					playDialogue(0)
				}
			}, 500)
		}
	}

	const playDialogue = (index) => {
		if (!dialogue || index >= dialogue.length) {
			setShowAnimation(false)
			setCurrentPlayingIndex(null)
			return
		}

		const line = dialogue[index]
		if (!line.audioUrl) {
			playDialogue(index + 1)
			return
		}

		setCurrentPlayingIndex(index)

		if (!audioRef.current) {
			audioRef.current = {}
		}

		if (!audioRef.current[index]) {
			audioRef.current[index] = new Audio(line.audioUrl)
		}

		audioRef.current[index].onended = () => {
			setTimeout(() => playDialogue(index + 1), 300)
		}

		audioRef.current[index].play()
	}

	const handleReset = () => {
		setMatches({})
		setSelectedLeft(null)
		setSelectedRight(null)
		setValidated(false)
		setScore(null)
		setShowAnimation(false)
		setCurrentPlayingIndex(null)
	}

	const isMatched = (side, id) => {
		if (side === 'left') {
			return matches[id] !== undefined
		} else {
			return Object.values(matches).includes(id)
		}
	}

	const getMatchedPartner = (side, id) => {
		if (side === 'left') {
			return matches[id]
		} else {
			const entry = Object.entries(matches).find(([_, rightId]) => rightId === id)
			return entry ? parseInt(entry[0]) : null
		}
	}

	const isCorrectMatch = (leftId, rightId) => {
		return leftId === rightId
	}

	useEffect(() => {
		return () => {
			if (audioRef.current) {
				Object.values(audioRef.current).forEach((audio) => {
					if (audio) audio.pause()
				})
			}
		}
	}, [])

	const allMatched = Object.keys(matches).length === pairs.length

	return (
		<div className={cn(
			'relative rounded-lg sm:rounded-2xl border sm:border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-blue-950/50 via-slate-900 to-purple-950/30 border-blue-500/30'
				: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

			<div className="relative p-4 sm:p-6 space-y-4">
				{/* Instructions */}
				<div className={cn(
					'text-center p-3 rounded-xl',
					isDark ? 'bg-blue-500/10 text-blue-200' : 'bg-blue-50 text-blue-800'
				)}>
					<p className="text-sm sm:text-base font-medium">
						{t('methode_matching_instructions')}
					</p>
				</div>

				{/* Grille de matching */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Colonne gauche - Questions */}
					<div className="space-y-2">
						{leftItems.map((item) => {
							const matched = isMatched('left', item.id)
							const partner = getMatchedPartner('left', item.id)
							const isSelected = selectedLeft === item.id
							const isCorrect = validated && matched && isCorrectMatch(item.id, partner)
							const isWrong = validated && matched && !isCorrectMatch(item.id, partner)

							return (
								<div key={item.id} className="relative">
									<button
										onClick={() => handleLeftClick(item.id)}
										disabled={matched && validated}
										className={cn(
											'w-full p-3 rounded-lg text-left transition-all duration-200 border-2',
											isSelected && !matched
												? isDark
													? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-400'
													: 'bg-blue-100 border-blue-400 ring-2 ring-blue-400'
												: matched
													? validated
														? isCorrect
															? isDark
																? 'bg-emerald-500/20 border-emerald-500/50'
																: 'bg-emerald-50 border-emerald-300'
															: isDark
																? 'bg-red-500/20 border-red-500/50'
																: 'bg-red-50 border-red-300'
														: isDark
															? 'bg-slate-700 border-slate-600'
															: 'bg-slate-100 border-slate-300'
													: isDark
														? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50'
														: 'bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300'
										)}
									>
										<span className={cn(
											'text-sm',
											isDark ? 'text-slate-200' : 'text-slate-800'
										)}>
											{item.text}
										</span>
									</button>

									{/* Bouton de suppression de match */}
									{matched && !validated && (
										<button
											onClick={() => handleRemoveMatch(item.id)}
											className={cn(
												'absolute -right-2 -top-2 p-1 rounded-full shadow-lg',
												isDark
													? 'bg-red-500 hover:bg-red-600'
													: 'bg-red-500 hover:bg-red-600'
											)}
										>
											<X className="w-3 h-3 text-white" />
										</button>
									)}

									{/* Icône de validation */}
									{validated && matched && (
										<div className={cn(
											'absolute -right-2 -top-2 p-1 rounded-full',
											isCorrect
												? 'bg-emerald-500'
												: 'bg-red-500'
										)}>
											{isCorrect ? (
												<Check className="w-3 h-3 text-white" />
											) : (
												<X className="w-3 h-3 text-white" />
											)}
										</div>
									)}
								</div>
							)
						})}
					</div>

					{/* Colonne droite - Réponses */}
					<div className="space-y-2">
						{rightItems.map((item) => {
							const matched = isMatched('right', item.id)
							const partner = getMatchedPartner('right', item.id)
							const isSelected = selectedRight === item.id
							const isCorrect = validated && matched && isCorrectMatch(partner, item.id)
							const isWrong = validated && matched && !isCorrectMatch(partner, item.id)

							return (
								<button
									key={item.id}
									onClick={() => handleRightClick(item.id)}
									disabled={matched && validated}
									className={cn(
										'w-full p-3 rounded-lg text-left transition-all duration-200 border-2',
										isSelected && !matched
											? isDark
												? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-400'
												: 'bg-blue-100 border-blue-400 ring-2 ring-blue-400'
											: matched
												? validated
													? isCorrect
														? isDark
															? 'bg-emerald-500/20 border-emerald-500/50'
															: 'bg-emerald-50 border-emerald-300'
														: isDark
															? 'bg-red-500/20 border-red-500/50'
															: 'bg-red-50 border-red-300'
													: isDark
														? 'bg-slate-700 border-slate-600'
														: 'bg-slate-100 border-slate-300'
												: isDark
													? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50'
													: 'bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300'
									)}
								>
									<span className={cn(
										'text-sm',
										isDark ? 'text-slate-200' : 'text-slate-800'
									)}>
										{item.text}
									</span>
								</button>
							)
						})}
					</div>
				</div>

				{/* Boutons d'action */}
				<div className="flex gap-2 justify-center">
					{!validated ? (
						<Button
							onClick={handleValidate}
							disabled={!allMatched}
							className={cn(
								'gap-2 font-semibold shadow-lg',
								allMatched
									? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
									: 'bg-slate-400 cursor-not-allowed'
							)}
						>
							<Check className="w-4 h-4" />
							{t('methode_validate')}
						</Button>
					) : (
						<Button
							onClick={handleReset}
							className="gap-2 font-semibold shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
						>
							{t('methode_exercise_retry')}
						</Button>
					)}
				</div>

				{/* Score */}
				{validated && score !== null && (
					<div className={cn(
						'text-center p-4 rounded-xl',
						score === 100
							? isDark
								? 'bg-emerald-500/20 text-emerald-300'
								: 'bg-emerald-50 text-emerald-700'
							: isDark
								? 'bg-orange-500/20 text-orange-300'
								: 'bg-orange-50 text-orange-700'
					)}>
						<p className="text-lg font-bold">
							{score === 100 ? '🎉 Parfait !' : `${score}% correct`}
						</p>
					</div>
				)}

				{/* Animation du dialogue */}
				{showAnimation && dialogue && (
					<div className={cn(
						'p-4 rounded-xl border-2',
						isDark
							? 'bg-emerald-500/10 border-emerald-500/30'
							: 'bg-emerald-50 border-emerald-200'
					)}>
						<div className="flex items-center gap-2 mb-3">
							<Sparkles className={cn(
								'w-5 h-5',
								isDark ? 'text-emerald-400' : 'text-emerald-600'
							)} />
							<h4 className={cn(
								'font-bold',
								isDark ? 'text-emerald-300' : 'text-emerald-700'
							)}>
								{t('methode_dialogue_replay')}
							</h4>
						</div>

						<div className="space-y-2">
							{dialogue.map((line, index) => (
								<div
									key={index}
									className={cn(
										'p-2 rounded-lg transition-all duration-300',
										currentPlayingIndex === index
											? isDark
												? 'bg-emerald-500/30 ring-2 ring-emerald-400'
												: 'bg-emerald-100 ring-2 ring-emerald-300'
											: isDark
												? 'bg-slate-800/30'
												: 'bg-white/50'
									)}
								>
									<div className="flex items-center gap-2">
										{currentPlayingIndex === index && (
											<Play className={cn(
												'w-3 h-3',
												isDark ? 'text-emerald-400' : 'text-emerald-600'
											)} />
										)}
										<span className={cn(
											'text-xs font-bold',
											isDark ? 'text-emerald-400' : 'text-emerald-600'
										)}>
											{line.speaker}
										</span>
									</div>
									<p className={cn(
										'text-sm mt-1',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{line.text}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default MatchingExercise
