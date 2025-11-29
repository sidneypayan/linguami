/**
 * Session configuration modal - allows user to configure flashcard session
 * before starting: choose number of cards or time duration
 */

import { useState } from 'react'
import { Layers, Timer, Zap, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { SESSION_MODE } from '@/context/flashcards'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
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
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className={cn(
				"sm:max-w-md rounded-2xl border-2",
				isDark
					? "bg-slate-900 border-violet-500/30"
					: "bg-white border-violet-500/20",
				"shadow-2xl shadow-violet-500/25"
			)}>
				<DialogHeader className="pb-2">
					<DialogTitle className="flex items-center gap-3">
						<Zap className="w-7 h-7 text-violet-500" />
						<span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent">
							{t('session_config_title')}
						</span>
					</DialogTitle>
				</DialogHeader>

				<div className="pt-4">
					<p className={cn(
						"text-sm font-semibold mb-3",
						isDark ? "text-slate-400" : "text-slate-600"
					)}>
						{t('session_mode_label')}
					</p>

					{/* Mode Toggle */}
					<div className="grid grid-cols-2 gap-3 mb-6">
						<button
							onClick={() => setMode(SESSION_MODE.CARDS)}
							className={cn(
								"py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
								"border-2",
								mode === SESSION_MODE.CARDS
									? "bg-gradient-to-r from-violet-500/90 to-cyan-500/80 text-white border-violet-500/60"
									: isDark
										? "border-violet-500/20 hover:border-violet-500/40"
										: "border-violet-500/20 hover:border-violet-500/40"
							)}
						>
							<Layers className="w-5 h-5" />
							{t('session_mode_cards')}
						</button>
						<button
							onClick={() => setMode(SESSION_MODE.TIME)}
							className={cn(
								"py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
								"border-2",
								mode === SESSION_MODE.TIME
									? "bg-gradient-to-r from-violet-500/90 to-cyan-500/80 text-white border-violet-500/60"
									: isDark
										? "border-violet-500/20 hover:border-violet-500/40"
										: "border-violet-500/20 hover:border-violet-500/40"
							)}
						>
							<Timer className="w-5 h-5" />
							{t('session_mode_time')}
						</button>
					</div>

					{mode === SESSION_MODE.CARDS && (
						<div>
							<p className={cn(
								"text-sm font-semibold mb-3",
								isDark ? "text-slate-400" : "text-slate-600"
							)}>
								{t('session_cards_count')}
							</p>

							<div className="flex flex-wrap gap-2">
								{CARDS_OPTIONS.map((count) => (
									<button
										key={count}
										onClick={() => setCardsLimit(count)}
										disabled={count > totalWords}
										className={cn(
											"flex-1 min-w-[60px] py-3 px-2 rounded-xl font-bold text-base transition-all",
											"border-2",
											cardsLimit === count
												? "bg-gradient-to-r from-violet-500/90 to-cyan-500/80 text-white border-violet-500/60"
												: isDark
													? "border-violet-500/20 hover:border-violet-500/40"
													: "border-violet-500/20 hover:border-violet-500/40",
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

					{mode === SESSION_MODE.TIME && (
						<div>
							<p className={cn(
								"text-sm font-semibold mb-3",
								isDark ? "text-slate-400" : "text-slate-600"
							)}>
								{t('session_time_duration')}
							</p>

							<div className="flex flex-wrap gap-2">
								{TIME_OPTIONS.map((minutes) => (
									<button
										key={minutes}
										onClick={() => setTimeLimit(minutes)}
										className={cn(
											"flex-1 min-w-[70px] py-3 px-2 rounded-xl font-bold text-base transition-all whitespace-nowrap",
											"border-2",
											timeLimit === minutes
												? "bg-gradient-to-r from-violet-500/90 to-cyan-500/80 text-white border-violet-500/60"
												: isDark
													? "border-violet-500/20 hover:border-violet-500/40"
													: "border-violet-500/20 hover:border-violet-500/40"
										)}
									>
										{minutes} min
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

				<DialogFooter className="pt-4 gap-3">
					<Button
						variant="ghost"
						onClick={onClose}
						className={cn(
							"font-semibold",
							isDark ? "text-slate-400" : "text-slate-600"
						)}
					>
						{t('session_cancel')}
					</Button>
					<Button
						onClick={handleStart}
						disabled={mode === SESSION_MODE.CARDS && totalWords === 0}
						className={cn(
							"px-6 py-2 rounded-xl font-bold",
							"bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700",
							"shadow-lg shadow-violet-500/40"
						)}
					>
						<Zap className="w-5 h-5 mr-2" />
						{t('session_start')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
