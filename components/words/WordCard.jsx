/**
 * Word card component
 * Displays a single saved word with source + translation
 */

import { Trash2 } from 'lucide-react'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { getWordDisplay } from '@/utils/wordMapping'

export function WordCard({ word, onDelete, userLearningLanguage, locale }) {
	const { isDark } = useThemeMode()
	const { sourceWord, translation } = getWordDisplay(word, userLearningLanguage, locale)

	return (
		<div
			className={cn(
				'group p-3 sm:p-4 rounded-2xl',
				'flex items-center justify-between gap-3 sm:gap-4',
				'border border-violet-500/20',
				'transition-all duration-200',
				isDark
					? 'bg-gradient-to-br from-slate-800/95 to-slate-900/90'
					: 'bg-gradient-to-br from-white/95 to-white/90',
				isDark
					? 'shadow-[0_20px_25px_-5px_rgba(139,92,246,0.2),0_8px_10px_-6px_rgba(139,92,246,0.2)]'
					: 'shadow-[0_20px_25px_-5px_rgba(196,181,253,0.3),0_8px_10px_-6px_rgba(196,181,253,0.3)]'
			)}
		>
			{/* Word content */}
			<div className="flex items-center flex-wrap gap-2 sm:gap-3 flex-1 min-w-0">
				{/* Source word chip */}
				<span
					className={cn(
						'px-3 sm:px-4 py-1.5 rounded-full',
						'text-sm sm:text-[0.9375rem] font-bold',
						'bg-gradient-to-r from-violet-500/15 to-cyan-500/10',
						'text-violet-500',
						'border border-violet-500/30',
						'whitespace-nowrap'
					)}
				>
					{sourceWord || '—'}
				</span>

				{/* Arrow and translation */}
				<div className="flex items-center gap-2 sm:gap-3">
					<span className={cn(
						'text-sm sm:text-[0.9375rem] font-medium flex-shrink-0',
						isDark ? 'text-slate-400' : 'text-slate-500'
					)}>
						→
					</span>
					<span className={cn(
						'text-sm sm:text-[0.9375rem] font-medium whitespace-nowrap',
						isDark ? 'text-slate-100' : 'text-slate-700'
					)}>
						{translation || '—'}
					</span>
				</div>
			</div>

			{/* Delete button */}
			<button
				onClick={() => onDelete(word.id)}
				className={cn(
					'p-2 rounded-lg',
					'opacity-100 md:opacity-0 group-hover:opacity-100',
					'transition-all duration-300',
					'text-red-500 hover:text-red-400',
					'hover:bg-red-500/10',
					'hover:scale-110'
				)}
			>
				<Trash2 className="w-5 h-5" />
			</button>
		</div>
	)
}
