/**
 * Session configuration modal - allows user to configure flashcard session
 * before starting: choose number of cards or time duration
 * Mobile: Full-screen view | Desktop: Centered dialog
 */

import { useState } from 'react'
import { Layers, Timer, Zap, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { SESSION_MODE } from '@/context/flashcards'
import {
	MobileModal,
	MobileModalContent,
	MobileModalHeader,
	MobileModalTitle,
	MobileModalFooter,
} from '@/components/ui/mobile-modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CARDS_OPTIONS = [10, 20, 30, 50, 100]
const TIME_OPTIONS = [3, 5, 10, 15, 20] // in minutes

export function SessionConfigModal({ open, onClose, onStart, totalWords = 0 }) {
	const t = useTranslations('words')
	const { isDark } = useThemeMode()

	const [mode, setMode] = useState(SESSION_MODE.CARDS)
	const [cardsLimit, setCardsLimit] = useState(20)
	const [timeLimit, setTimeLimit] = useState(5)

	const handleStart = () => {
		onStart({
			mode,
			cardsLimit: mode === SESSION_MODE.CARDS ? cardsLimit : 9999,
			timeLimit: mode === SESSION_MODE.TIME ? timeLimit : null,
		})
		onClose()
	}

	return (
		<MobileModal open={open} onOpenChange={onClose}>
			<MobileModalContent isDark={isDark} className="sm:max-w-md">
				<MobileModalHeader>
					{/* Header with icon */}
					<div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
						<div className={cn(
							"w-16 h-16 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center",
							"bg-gradient-to-br from-violet-500 to-cyan-500",
							"shadow-lg shadow-violet-500/30"
						)}>
							<Zap className="w-8 h-8 sm:w-7 sm:h-7 text-white" />
						</div>
						<div className="text-center sm:text-left">
							<MobileModalTitle className={cn(
								"text-2xl sm:text-xl",
								"bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent"
							)}>
								{t('session_config_title')}
							</MobileModalTitle>
							<p className={cn(
								"text-sm mt-1",
								isDark ? "text-slate-400" : "text-slate-500"
							)}>
								{t('session_config_subtitle') || 'Personnalisez votre session'}
							</p>
						</div>
					</div>
				</MobileModalHeader>

				<div className="space-y-6 mt-2">
					{/* Mode Selection */}
					<div>
						<p className={cn(
							"text-sm font-semibold mb-3 flex items-center gap-2",
							isDark ? "text-slate-300" : "text-slate-700"
						)}>
							<Sparkles className="w-4 h-4 text-violet-500" />
							{t('session_mode_label')}
						</p>

						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => setMode(SESSION_MODE.CARDS)}
								className={cn(
									"py-4 px-4 rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 transition-all",
									"border-2",
									mode === SESSION_MODE.CARDS
										? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white border-transparent shadow-lg shadow-violet-500/30"
										: isDark
											? "border-slate-700 hover:border-violet-500/50 text-slate-300"
											: "border-slate-200 hover:border-violet-500/50 text-slate-700"
								)}
							>
								<Layers className={cn(
									"w-7 h-7 sm:w-6 sm:h-6",
									mode === SESSION_MODE.CARDS ? "text-white" : "text-violet-500"
								)} />
								<span className="text-sm sm:text-base">{t('session_mode_cards')}</span>
							</button>
							<button
								onClick={() => setMode(SESSION_MODE.TIME)}
								className={cn(
									"py-4 px-4 rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 transition-all",
									"border-2",
									mode === SESSION_MODE.TIME
										? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white border-transparent shadow-lg shadow-violet-500/30"
										: isDark
											? "border-slate-700 hover:border-violet-500/50 text-slate-300"
											: "border-slate-200 hover:border-violet-500/50 text-slate-700"
								)}
							>
								<Timer className={cn(
									"w-7 h-7 sm:w-6 sm:h-6",
									mode === SESSION_MODE.TIME ? "text-white" : "text-cyan-500"
								)} />
								<span className="text-sm sm:text-base">{t('session_mode_time')}</span>
							</button>
						</div>
					</div>

					{/* Cards Options */}
					{mode === SESSION_MODE.CARDS && (
						<div>
							<p className={cn(
								"text-sm font-semibold mb-3",
								isDark ? "text-slate-300" : "text-slate-700"
							)}>
								{t('session_cards_count')}
							</p>

							<div className="grid grid-cols-5 gap-2">
								{CARDS_OPTIONS.map((count) => (
									<button
										key={count}
										onClick={() => setCardsLimit(count)}
										disabled={count > totalWords}
										className={cn(
											"py-4 sm:py-3 rounded-xl font-bold text-lg sm:text-base transition-all",
											"border-2",
											cardsLimit === count
												? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white border-transparent shadow-md"
												: isDark
													? "border-slate-700 hover:border-violet-500/50 text-slate-300"
													: "border-slate-200 hover:border-violet-500/50 text-slate-700",
											count > totalWords && "opacity-40 cursor-not-allowed"
										)}
									>
										{count}
									</button>
								))}
							</div>

							{totalWords > 0 && (
								<p className={cn(
									"text-xs text-center mt-3",
									isDark ? "text-slate-500" : "text-slate-400"
								)}>
									{t('session_available_words', { count: totalWords })}
								</p>
							)}
						</div>
					)}

					{/* Time Options */}
					{mode === SESSION_MODE.TIME && (
						<div>
							<p className={cn(
								"text-sm font-semibold mb-3",
								isDark ? "text-slate-300" : "text-slate-700"
							)}>
								{t('session_time_duration')}
							</p>

							<div className="grid grid-cols-5 gap-2">
								{TIME_OPTIONS.map((minutes) => (
									<button
										key={minutes}
										onClick={() => setTimeLimit(minutes)}
										className={cn(
											"py-4 sm:py-3 rounded-xl font-bold text-base sm:text-sm transition-all",
											"border-2 whitespace-nowrap",
											timeLimit === minutes
												? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white border-transparent shadow-md"
												: isDark
													? "border-slate-700 hover:border-violet-500/50 text-slate-300"
													: "border-slate-200 hover:border-violet-500/50 text-slate-700"
										)}
									>
										{minutes}m
									</button>
								))}
							</div>

							<p className={cn(
								"text-xs text-center mt-3",
								isDark ? "text-slate-500" : "text-slate-400"
							)}>
								{t('session_time_hint')}
							</p>
						</div>
					)}
				</div>

				<MobileModalFooter>
					<Button
						variant="ghost"
						onClick={onClose}
						className={cn(
							"w-full sm:w-auto font-semibold rounded-xl h-12 sm:h-10",
							isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
						)}
					>
						{t('session_cancel')}
					</Button>
					<Button
						onClick={handleStart}
						disabled={mode === SESSION_MODE.CARDS && totalWords === 0}
						className={cn(
							"w-full sm:w-auto px-8 rounded-xl font-bold h-14 sm:h-11 text-base sm:text-sm",
							"bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700",
							"shadow-lg shadow-violet-500/40 hover:shadow-violet-500/60",
							"transition-all hover:-translate-y-0.5"
						)}
					>
						<Zap className="w-5 h-5 mr-2" />
						{t('session_start')}
					</Button>
				</MobileModalFooter>
			</MobileModalContent>
		</MobileModal>
	)
}
