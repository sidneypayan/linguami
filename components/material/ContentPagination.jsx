'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

/**
 * Pagination controls for book chapter content
 */
const ContentPagination = ({
	currentPage,
	totalPages,
	onPrevPage,
	onNextPage,
	onGoToFirst,
	onGoToLast,
	hasPrevPage,
	hasNextPage,
}) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()

	if (totalPages <= 1) return null

	const buttonClass = cn(
		'p-2 rounded-lg transition-all duration-200',
		'hover:bg-violet-500/10 hover:scale-110',
		'disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-transparent'
	)

	const activeColor = 'text-violet-500'
	const disabledColor = isDark ? 'text-slate-600' : 'text-slate-400'

	return (
		<div
			className={cn(
				'flex items-center justify-center gap-1 sm:gap-2',
				'py-3 px-4 rounded-xl',
				'border',
				isDark
					? 'bg-gradient-to-r from-slate-800/80 to-slate-900/90 border-violet-500/30'
					: 'bg-gradient-to-r from-white/95 to-slate-50/95 border-violet-500/20',
				isDark
					? 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
					: 'shadow-[0_4px_20px_rgba(139,92,246,0.15)]'
			)}
		>
			{/* First Page */}
			<button
				onClick={onGoToFirst}
				disabled={!hasPrevPage}
				className={cn(buttonClass, hasPrevPage ? activeColor : disabledColor)}
			>
				<ChevronsLeft className="w-5 h-5" />
			</button>

			{/* Previous Page */}
			<button
				onClick={onPrevPage}
				disabled={!hasPrevPage}
				className={cn(buttonClass, hasPrevPage ? activeColor : disabledColor)}
			>
				<ChevronLeft className="w-5 h-5" />
			</button>

			{/* Page indicator */}
			<div
				className={cn(
					'flex items-center gap-2 px-3 sm:px-5 py-1.5 rounded-lg',
					'bg-gradient-to-r from-violet-500/10 to-cyan-500/10',
					'border border-violet-500/20'
				)}
			>
				<span className="font-bold text-sm sm:text-base text-violet-500">
					{currentPage}
				</span>
				<span className={cn('text-sm sm:text-base', isDark ? 'text-slate-400' : 'text-slate-500')}>
					/
				</span>
				<span className={cn('font-semibold text-sm sm:text-base', isDark ? 'text-slate-300' : 'text-slate-600')}>
					{totalPages}
				</span>
			</div>

			{/* Next Page */}
			<button
				onClick={onNextPage}
				disabled={!hasNextPage}
				className={cn(buttonClass, hasNextPage ? activeColor : disabledColor)}
			>
				<ChevronRight className="w-5 h-5" />
			</button>

			{/* Last Page */}
			<button
				onClick={onGoToLast}
				disabled={!hasNextPage}
				className={cn(buttonClass, hasNextPage ? activeColor : disabledColor)}
			>
				<ChevronsRight className="w-5 h-5" />
			</button>
		</div>
	)
}

export default ContentPagination
