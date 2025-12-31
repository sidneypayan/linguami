'use client'

import { useEffect } from 'react'
import { useThemeMode } from '@/context/ThemeContext'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, X, ArrowRight, Trophy, RotateCcw, Lightbulb } from 'lucide-react'

/**
 * ExerciseResults Component - Unified results screen for all exercise types
 *
 * @param {number} score - Score percentage (0-100)
 * @param {number} correctCount - Number of correct answers
 * @param {number} totalCount - Total number of questions/pairs
 * @param {function} onRetry - Callback to retry the exercise
 * @param {function} onNext - Callback to go to next exercise
 * @param {array} reviewItems - Array of review items to display (optional)
 * @param {boolean} playSound - Whether to play celebration sound (default: true)
 */
const ExerciseResults = ({
	score,
	correctCount,
	totalCount,
	onRetry,
	onNext,
	reviewItems = [],
	playSound = true
}) => {
	const { isDark } = useThemeMode()
	const t = useTranslations('common')

	// Play celebration sound for 100% score
	useEffect(() => {
		if (score === 100 && playSound) {
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
	}, [score, playSound])

	return (
		<Card className={cn(
			'p-6 sm:p-8',
			isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
		)}>
			{/* Result */}
			<div className={cn(
				'relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-6',
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
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center w-full">
					{/* Icon */}
					<div className={cn(
						'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg',
						score === 100
							? 'bg-gradient-to-br from-amber-400 to-amber-500'
							: score >= 60
								? 'bg-gradient-to-br from-amber-400 to-orange-500'
								: 'bg-gradient-to-br from-red-400 to-rose-500'
					)}>
						<Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
					</div>

					{/* Content */}
					<div>
						<p className={cn(
							'text-3xl sm:text-4xl font-extrabold mb-2',
							score === 100
								? 'text-emerald-600 dark:text-emerald-400'
								: score >= 60
									? 'text-amber-600 dark:text-amber-400'
									: 'text-red-600 dark:text-red-400'
						)}>
							{score === 100 ? t('methode_exercise_perfect') : score >= 60 ? t('methode_exercise_good_job') : t('methode_exercise_keep_practicing')}
						</p>
						<p className={cn(
							'text-xl sm:text-2xl font-bold mb-1',
							isDark ? 'text-slate-200' : 'text-slate-700'
						)}>
							{t('methode_exercise_score')} : {score}%
						</p>
						<p className={cn(
							'text-base sm:text-lg',
							isDark ? 'text-slate-400' : 'text-slate-600'
						)}>
							{correctCount}/{totalCount} {t('methode_exercise_correct_count')}
						</p>
					</div>
				</div>
			</div>

			{/* Review Section */}
			{reviewItems.length > 0 && (
				<div className="space-y-4 mb-8">
					<h4 className={cn(
						'text-lg font-bold mb-4',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						{t('methode_exercise_review')}
					</h4>
					{reviewItems.map((item, index) => (
						<Card key={index} className={cn(
							'p-4 border-2',
							isDark ? 'bg-slate-700/50' : 'bg-slate-50',
							item.isCorrect
								? isDark ? 'border-emerald-500/40' : 'border-emerald-300'
								: isDark ? 'border-red-500/40' : 'border-red-300'
						)}>
							{/* Question */}
							{item.question && (
								<div className="mb-3">
									<p className={cn(
										'text-base font-medium mb-2',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{item.question}
									</p>
								</div>
							)}

							{/* Answers */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
								{/* User Answer */}
								<div className={cn(
									'p-3 rounded-lg border-2',
									item.isCorrect
										? isDark ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
										: isDark ? 'bg-red-950/30 border-red-500/40' : 'bg-red-50 border-red-300'
								)}>
									<div className="flex items-center gap-2 mb-1">
										{item.isCorrect ? (
											<Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
										) : (
											<X className="w-4 h-4 text-red-500 flex-shrink-0" />
										)}
										<span className={cn(
											'text-xs font-semibold uppercase',
											item.isCorrect
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
										{item.userAnswer || <span className="italic text-slate-400">{t('methode_exercise_no_answer')}</span>}
									</p>
								</div>

								{/* Correct Answer */}
								{!item.isCorrect && item.correctAnswer && (
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
											{item.correctAnswer}
										</p>
									</div>
								)}
							</div>

							{/* Tip/Explanation */}
							{item.explanation && (
								<div className={cn(
									'p-3 rounded-lg border-2',
									isDark ? 'bg-cyan-950/30 border-cyan-500/40' : 'bg-cyan-50 border-cyan-300'
								)}>
									<div className="flex items-start gap-2">
										<Lightbulb className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
										<div className="flex-1 min-w-0">
											<span className="text-xs font-semibold uppercase text-cyan-600 dark:text-cyan-400 block mb-1">
												{t('methode_exercise_tip')}
											</span>
											<p className={cn(
												'text-sm',
												isDark ? 'text-slate-300' : 'text-slate-700'
											)}>
												{item.explanation}
											</p>
										</div>
									</div>
								</div>
							)}
						</Card>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
				<Button
					variant="outline"
					onClick={onRetry}
					className={cn(
						'gap-2 w-full sm:w-auto',
						isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-300'
					)}
				>
					<RotateCcw className="w-4 h-4" />
					{t('methode_exercise_retry')}
				</Button>
				<Button
					onClick={onNext}
					className={cn(
						'gap-2 w-full sm:w-auto bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600'
					)}
				>
					{t('methode_exercise_next')}
					<ArrowRight className="w-4 h-4" />
				</Button>
			</div>
		</Card>
	)
}

export default ExerciseResults
