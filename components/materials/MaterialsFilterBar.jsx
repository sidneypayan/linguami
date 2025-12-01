'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import {
	Search,
	RotateCcw,
	Grid3X3,
	Table,
	SignalLow,
	SignalMedium,
	SignalHigh,
	Clock,
	CircleDashed,
	CheckCircle2,
	ChevronDown,
	Check,
	Layers,
	Headphones,
	Film,
	Music,
	MessagesSquare,
	Sparkles,
	Mountain,
	ScrollText,
	Landmark,
	Mic,
	BookOpen,
	Library,
	Clapperboard,
	Theater,
	Tv,
	Guitar,
	Baby,
} from 'lucide-react'

// ============================================
// CUSTOM SECTION DROPDOWN
// ============================================
const SectionDropdown = ({ selectedSection, onSectionChange, isDark, t, sectionsByCategory }) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef(null)

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Close on Escape
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') setIsOpen(false)
		}
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	// Find selected section info
	const getSelectedInfo = () => {
		if (!selectedSection) return { label: t('allMaterials'), icon: Layers }
		for (const category of Object.values(sectionsByCategory)) {
			const found = category.find(s => s.key === selectedSection)
			if (found) return found
		}
		return { label: t('allMaterials'), icon: Layers }
	}

	const selected = getSelectedInfo()
	const SelectedIcon = selected.icon || Layers

	const categoryLabels = {
		'text & audio': { label: t('textAudio'), icon: Headphones },
		'video': { label: t('video'), icon: Film },
		'music': { label: t('music'), icon: Music },
	}

	return (
		<div ref={dropdownRef} className="relative">
			{/* Trigger Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl font-semibold text-sm',
					'border-2 transition-all cursor-pointer',
					'focus:outline-none focus:ring-2 focus:ring-violet-500/50',
					selectedSection
						? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-400/50'
						: isDark
							? 'bg-slate-800/50 border-violet-500/30 text-slate-300 hover:border-violet-500/50'
							: 'bg-white border-violet-200 text-slate-600 hover:border-violet-400'
				)}
			>
				<SelectedIcon className="w-4 h-4 flex-shrink-0" />
				<span className="text-left">{selected.label}</span>
				<ChevronDown className={cn(
					'w-4 h-4 ml-1 transition-transform flex-shrink-0',
					isOpen && 'rotate-180'
				)} />
			</button>

			{/* Dropdown Panel */}
			{isOpen && (
				<div className={cn(
					'absolute top-full left-0 mt-2 w-64 max-h-[400px] overflow-y-auto rounded-xl z-[9999]',
					'border-2 shadow-xl',
					isDark
						? 'bg-slate-900 border-violet-500/30 shadow-black/50'
						: 'bg-white border-violet-200 shadow-violet-200/50'
				)}>
					{/* All Materials Option */}
					<button
						onClick={() => { onSectionChange(null); setIsOpen(false) }}
						className={cn(
							'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium',
							'transition-all',
							!selectedSection
								? isDark
									? 'bg-violet-500/20 text-violet-300'
									: 'bg-violet-50 text-violet-700'
								: isDark
									? 'text-slate-300 hover:bg-slate-800/80'
									: 'text-slate-600 hover:bg-slate-50'
						)}
					>
						<Layers className="w-4 h-4" />
						<span className="flex-1 text-left">{t('allMaterials')}</span>
						{!selectedSection && <Check className="w-4 h-4 text-violet-500" />}
					</button>

					{/* Divider */}
					<div className={cn(
						'h-px mx-3',
						isDark ? 'bg-slate-700' : 'bg-slate-200'
					)} />

					{/* Categories */}
					{Object.entries(sectionsByCategory).map(([categoryKey, sections]) => {
						const catInfo = categoryLabels[categoryKey]
						const CatIcon = catInfo?.icon || Layers

						return (
							<div key={categoryKey}>
								{/* Category Header */}
								<div className={cn(
									'flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider',
									isDark
										? 'text-violet-300 bg-gradient-to-r from-violet-500/20 to-transparent border-l-2 border-violet-500'
										: 'text-violet-600 bg-gradient-to-r from-violet-100 to-transparent border-l-2 border-violet-500'
								)}>
									<CatIcon className={cn('w-4 h-4', isDark ? 'text-violet-400' : 'text-violet-500')} />
									<span>{catInfo?.label || categoryKey}</span>
								</div>

								{/* Section Items */}
								{sections.map((section) => {
									const SectionIcon = section.icon
									const isSelected = selectedSection === section.key

									return (
										<button
											key={section.key}
											onClick={() => { onSectionChange(section.key); setIsOpen(false) }}
											className={cn(
												'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
												'transition-all',
												isSelected
													? isDark
														? 'bg-violet-500/20 text-violet-300'
														: 'bg-violet-50 text-violet-700'
													: isDark
														? 'text-slate-300 hover:bg-slate-800/80'
														: 'text-slate-600 hover:bg-slate-50'
											)}
										>
											<SectionIcon className={cn(
												'w-4 h-4',
												isSelected
													? 'text-violet-500'
													: isDark ? 'text-slate-500' : 'text-slate-400'
											)} />
											<span className="flex-1 text-left">{section.label}</span>
											{isSelected && <Check className="w-4 h-4 text-violet-500" />}
										</button>
									)
								})}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

/**
 * Reusable filter bar for materials search and filtering
 * Style matching MaterialsPageClient FilterBar
 */
const MaterialsFilterBar = ({
	onSearchChange,
	onSectionChange,
	onLevelChange,
	onStatusChange,
	onClear,
	onViewChange,
	searchValue = '',
	selectedSection = null,
	selectedLevel = null,
	selectedStatus = null,
	currentView = 'card',
	showNotStudiedFilter = false,
	showStudiedFilter = true,
	showSectionFilter = false,
	translationNamespace = 'materials'
}) => {
	const t = useTranslations(translationNamespace)
	const { isDark } = useThemeMode()

	const levels = [
		{ key: 'beginner', icon: SignalLow, color: 'emerald', label: t('beginner') },
		{ key: 'intermediate', icon: SignalMedium, color: 'violet', label: t('intermediate') },
		{ key: 'advanced', icon: SignalHigh, color: 'amber', label: t('advanced') },
	]

	const statuses = [
		...(showNotStudiedFilter ? [{ key: 'not_studied', icon: CircleDashed, color: 'violet', label: t('not_studied') }] : []),
		{ key: 'is_being_studied', icon: Clock, color: 'amber', label: t('being_studied') },
		...(showStudiedFilter ? [{ key: 'is_studied', icon: CheckCircle2, color: 'emerald', label: t('studied') }] : []),
	]

	const sectionsByCategory = {
		'text & audio': [
			{ key: 'dialogues', icon: MessagesSquare, label: t('dialogues') },
			{ key: 'slices-of-life', icon: Sparkles, label: t('slices-of-life') },
			{ key: 'beautiful-places', icon: Mountain, label: t('beautiful-places') },
			{ key: 'legends', icon: ScrollText, label: t('legends') },
			{ key: 'culture', icon: Landmark, label: t('culture') },
			{ key: 'podcasts', icon: Mic, label: t('podcasts') },
			{ key: 'short-stories', icon: BookOpen, label: t('short-stories') },
			{ key: 'book-chapters', icon: Library, label: t('books') },
		],
		'video': [
			{ key: 'movie-trailers', icon: Clapperboard, label: t('movie-trailers') },
			{ key: 'movie-clips', icon: Theater, label: t('movie-clips') },
			{ key: 'cartoons', icon: Tv, label: t('cartoons') },
			{ key: 'various-materials', icon: Layers, label: t('various-materials') },
		],
		'music': [
			{ key: 'rock', icon: Guitar, label: t('rock') },
			{ key: 'pop', icon: Music, label: t('pop') },
			{ key: 'folk', icon: Music, label: t('folk') },
			{ key: 'variety', icon: Music, label: t('variety') },
			{ key: 'kids', icon: Baby, label: t('kids') },
		],
	}

	const colorClasses = {
		emerald: {
			active: 'from-emerald-500 to-teal-600 shadow-emerald-500/40 border-emerald-400/50',
			inactive: isDark ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-400/50 text-emerald-600',
		},
		violet: {
			active: 'from-violet-500 to-purple-600 shadow-violet-500/40 border-violet-400/50',
			inactive: isDark ? 'border-violet-500/30 text-violet-400' : 'border-violet-400/50 text-violet-600',
		},
		amber: {
			active: 'from-amber-500 to-orange-600 shadow-amber-500/40 border-amber-400/50',
			inactive: isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-400/50 text-amber-600',
		},
	}

	return (
		<div className={cn(
			'relative rounded-2xl p-4 mb-8 overflow-visible',
			'border-2',
			isDark ? 'border-violet-500/20 bg-slate-900/80' : 'border-violet-200/50 bg-white/90',
			'shadow-lg',
			isDark ? 'shadow-black/20' : 'shadow-slate-200/50'
		)}>
			<div className="space-y-4">
				{/* Search + View Toggle */}
				<div className="flex gap-3 items-center">
					<div className="relative flex-1">
						<Search className={cn(
							'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
							isDark ? 'text-amber-400' : 'text-amber-600'
						)} />
						<input
							type="text"
							placeholder={t('search')}
							value={searchValue}
							onChange={(e) => onSearchChange(e.target.value)}
							className={cn(
								'w-full pl-10 pr-4 py-2.5 rounded-xl',
								'border-2 transition-all',
								isDark
									? 'bg-slate-800/50 border-amber-500/20 text-white placeholder:text-slate-500'
									: 'bg-amber-50/50 border-amber-200 text-slate-800 placeholder:text-slate-400',
								'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500'
							)}
						/>
					</div>

					{/* View toggle */}
					<div className={cn(
						'flex gap-1 p-1 rounded-xl',
						isDark ? 'bg-slate-800/50' : 'bg-slate-100',
						'border-2',
						isDark ? 'border-violet-500/20' : 'border-violet-200/50'
					)}>
						<button
							onClick={() => onViewChange('card')}
							className={cn(
								'p-2 rounded-lg transition-all',
								currentView === 'card'
									? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
									: isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'
							)}
						>
							<Grid3X3 className="w-5 h-5" />
						</button>
						<button
							onClick={() => onViewChange('list')}
							className={cn(
								'p-2 rounded-lg transition-all',
								currentView === 'list'
									? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg'
									: isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'
							)}
						>
							<Table className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Filters row */}
				<div className="flex flex-wrap gap-2 items-center">
					{/* Section dropdown */}
					{showSectionFilter && (
						<SectionDropdown
							selectedSection={selectedSection}
							onSectionChange={onSectionChange}
							isDark={isDark}
							t={t}
							sectionsByCategory={sectionsByCategory}
						/>
					)}

					{/* Level filters */}
					{levels.map((level) => {
						const Icon = level.icon
						const isSelected = selectedLevel === level.key
						const colors = colorClasses[level.color]

						return (
							<button
								key={level.key}
								onClick={() => onLevelChange(selectedLevel === level.key ? null : level.key)}
								className={cn(
									'px-3 py-2 rounded-xl font-semibold text-sm',
									'border-2 transition-all',
									'flex items-center gap-1.5',
									isSelected
										? ['bg-gradient-to-br text-white shadow-lg', colors.active]
										: [isDark ? 'bg-slate-800/50' : 'bg-white', colors.inactive, 'hover:scale-105']
								)}
							>
								<Icon className="w-4 h-4" />
								<span className="hidden sm:inline">{level.label}</span>
							</button>
						)
					})}

					{/* Status filters */}
					{statuses.map((status) => {
						const Icon = status.icon
						const isSelected = selectedStatus === status.key
						const colors = colorClasses[status.color]

						return (
							<button
								key={status.key}
								onClick={() => onStatusChange(selectedStatus === status.key ? null : status.key)}
								className={cn(
									'px-3 py-2 rounded-xl font-semibold text-sm',
									'border-2 transition-all',
									'flex items-center gap-1.5',
									isSelected
										? ['bg-gradient-to-br text-white shadow-lg', colors.active]
										: [isDark ? 'bg-slate-800/50' : 'bg-white', colors.inactive, 'hover:scale-105']
								)}
							>
								<Icon className="w-4 h-4" />
								<span className="hidden sm:inline">{status.label}</span>
							</button>
						)
					})}

					{/* Reset button */}
					<button
						onClick={onClear}
						className={cn(
							'p-2 rounded-xl transition-all',
							'border-2',
							isDark
								? 'bg-slate-800/50 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
								: 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50',
							'hover:rotate-180 hover:scale-110'
						)}
					>
						<RotateCcw className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	)
}

export default MaterialsFilterBar
