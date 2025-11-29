/**
 * Empty state component for words list
 * Shows when user has no saved words in current material
 */

import { BookmarkPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export function EmptyWordsState({ isGuest }) {
	const t = useTranslations('words')
	const { isDark } = useThemeMode()

	// Different translations for guests vs logged-in users
	const titleKey = isGuest ? 'guest_no_words_yet_title' : 'no_words_yet_title'
	const descriptionKey = isGuest ? 'guest_no_words_yet_description' : 'no_words_yet_description'
	const tipKey = isGuest ? 'guest_no_words_yet_tip' : 'no_words_yet_tip'

	return (
		<Card
			className={cn(
				'mt-4 md:mt-6 border-violet-500/20',
				isDark
					? 'bg-gradient-to-br from-slate-800/95 to-slate-900/90'
					: 'bg-gradient-to-br from-white/95 to-white/90',
				isDark
					? 'shadow-[0_20px_25px_-5px_rgba(139,92,246,0.2),0_8px_10px_-6px_rgba(139,92,246,0.2)]'
					: 'shadow-[0_20px_25px_-5px_rgba(196,181,253,0.3),0_8px_10px_-6px_rgba(196,181,253,0.3)]'
			)}
		>
			<CardContent className="p-6 sm:p-8 md:p-10">
				<div className="flex flex-col items-center gap-6">
					{/* Icon */}
					<div
						className={cn(
							'w-20 h-20 rounded-2xl',
							'bg-gradient-to-br from-violet-500 to-cyan-500',
							'flex items-center justify-center',
							'border-2 border-white/50',
							'shadow-lg shadow-violet-500/30'
						)}
					>
						<BookmarkPlus className="w-10 h-10 text-white" />
					</div>

					{/* Title */}
					<h3
						className={cn(
							'text-2xl sm:text-3xl font-extrabold text-center',
							'bg-gradient-to-r from-indigo-900 via-violet-500 to-cyan-500 bg-clip-text text-transparent'
						)}
					>
						{t(titleKey)}
					</h3>

					{/* Description */}
					<p
						className={cn(
							'text-base sm:text-lg text-center leading-relaxed max-w-[500px]',
							isDark ? 'text-slate-300' : 'text-slate-600'
						)}
					>
						{t(descriptionKey)}
					</p>

					{/* Tip box */}
					<Card
						className={cn(
							'w-full max-w-[400px]',
							'bg-gradient-to-r from-violet-500/10 to-cyan-500/8',
							'border-violet-500/20'
						)}
					>
						<CardContent className="p-4">
							<p
								className={cn(
									'text-sm sm:text-[0.9375rem] font-semibold text-center leading-relaxed',
									isDark ? 'text-slate-300' : 'text-slate-600'
								)}
							>
								{t(tipKey)}
							</p>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>
	)
}
