'use client'

import { MonitorPlay } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

const MaterialsFilter = ({ selectedCategory, onCategoryChange }) => {
	const t = useTranslations('materials')
	const { isDark } = useThemeMode()

	const categories = ['all', 'text & audio', 'video', 'music']

	const getCategoryStyles = (category, isSelected) => {
		const baseStyles = {
			all: {
				border: 'border-violet-500',
				bg: isSelected ? 'bg-gradient-to-r from-violet-500 to-violet-600' : '',
				hover: 'hover:border-violet-500 hover:bg-violet-500/20',
				shadow: 'shadow-violet-500/30',
				hoverShadow: 'hover:shadow-[0_8px_28px_rgba(139,92,246,0.4)]',
			},
			'text & audio': {
				border: 'border-emerald-500',
				bg: isSelected ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : '',
				hover: 'hover:border-emerald-500 hover:bg-emerald-500/20',
				shadow: 'shadow-emerald-500/30',
				hoverShadow: 'hover:shadow-[0_8px_28px_rgba(16,185,129,0.4)]',
			},
			video: {
				border: 'border-red-500',
				bg: isSelected ? 'bg-gradient-to-r from-red-500 to-red-600' : '',
				hover: 'hover:border-red-500 hover:bg-red-500/20',
				shadow: 'shadow-red-500/30',
				hoverShadow: 'hover:shadow-[0_8px_28px_rgba(239,68,68,0.4)]',
			},
			music: {
				border: 'border-amber-500',
				bg: isSelected ? 'bg-gradient-to-r from-amber-500 to-amber-600' : '',
				hover: 'hover:border-amber-500 hover:bg-amber-500/20',
				shadow: 'shadow-amber-500/30',
				hoverShadow: 'hover:shadow-[0_8px_28px_rgba(245,158,11,0.4)]',
			},
		}
		return baseStyles[category] || baseStyles.all
	}

	return (
		<div
			className={cn(
				'mb-4 md:mb-6 p-2.5 sm:p-5 rounded-2xl',
				'border',
				isDark
					? 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/30'
					: 'bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border-violet-500/20'
			)}
		>
			{/* Filter header */}
			<div className="flex items-center gap-2 mb-3">
				<MonitorPlay
					className={cn(
						'w-5 h-5',
						isDark ? 'text-violet-400' : 'text-violet-500'
					)}
				/>
				<h3
					className={cn(
						'font-bold text-sm sm:text-base',
						isDark ? 'text-slate-200' : 'text-indigo-950'
					)}
				>
					{t('filterByCategory')}
				</h3>
			</div>

			{/* Category chips */}
			<div className="flex flex-wrap gap-2">
				{categories.map((category) => {
					const isSelected = selectedCategory === category
					const styles = getCategoryStyles(category, isSelected)
					const labelKey = category === 'text & audio' ? 'textAudio' : category

					return (
						<button
							key={category}
							onClick={() => onCategoryChange(category)}
							className={cn(
								'px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl',
								'text-sm sm:text-[0.95rem] font-semibold',
								'cursor-pointer transition-all duration-300',
								'border-2',
								isSelected
									? [
											styles.border,
											styles.bg,
											'text-white',
											'border-[3px]',
											'shadow-lg',
											styles.shadow,
											'ring-4 ring-opacity-20',
											category === 'all' && 'ring-violet-500/20',
											category === 'text & audio' && 'ring-emerald-500/20',
											category === 'video' && 'ring-red-500/20',
											category === 'music' && 'ring-amber-500/20',
									  ]
									: [
											styles.border + '/50',
											isDark ? 'bg-slate-800/80' : 'bg-white/90',
											isDark ? 'text-slate-300' : 'text-slate-600',
											'shadow-sm',
									  ],
								!isSelected && styles.hover,
								!isSelected && styles.hoverShadow,
								'hover:-translate-y-0.5 hover:scale-105',
								'active:scale-100'
							)}
						>
							{t(labelKey)}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default MaterialsFilter
