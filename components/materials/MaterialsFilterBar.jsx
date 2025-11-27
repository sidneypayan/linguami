'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import {
	Search,
	RefreshCw,
	LayoutGrid,
	List,
	Signal,
	Clock,
	PlayCircle,
	CheckCircle2,
	MonitorPlay,
	Mic,
	Music,
	BookOpen,
	Film,
	Video,
	Tv,
	Landmark,
	MapPin,
	BookText,
	ChevronDown,
	Layers,
} from 'lucide-react'

/**
 * Reusable filter bar for materials search and filtering
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
	const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false)
	const dropdownRef = useRef(null)

	// Close dropdown on click outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setSectionDropdownOpen(false)
			}
		}
		if (sectionDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [sectionDropdownOpen])

	const handleSearchSubmit = (e) => {
		e.preventDefault()
	}

	// Sections organized by category
	const sectionsByCategory = {
		'text & audio': [
			{ label: t('dialogues'), key: 'dialogues', color: 'cyan' },
			{ label: t('slices-of-life'), key: 'slices-of-life', color: 'emerald' },
			{ label: t('beautiful-places'), key: 'beautiful-places', color: 'emerald' },
			{ label: t('legends'), key: 'legends', color: 'violet' },
			{ label: t('culture'), key: 'culture', color: 'violet' },
			{ label: t('podcasts'), key: 'podcasts', color: 'violet' },
			{ label: t('short-stories'), key: 'short-stories', color: 'amber' },
			{ label: t('books'), key: 'book-chapters', color: 'pink' },
		],
		'video': [
			{ label: t('movie-trailers'), key: 'movie-trailers', color: 'red' },
			{ label: t('movie-clips'), key: 'movie-clips', color: 'red' },
			{ label: t('cartoons'), key: 'cartoons', color: 'cyan' },
			{ label: t('various-materials'), key: 'various-materials', color: 'slate' },
		],
		'music': [
			{ label: t('rock'), key: 'rock', color: 'pink' },
			{ label: t('pop'), key: 'pop', color: 'pink' },
			{ label: t('folk'), key: 'folk', color: 'pink' },
			{ label: t('variety'), key: 'variety', color: 'pink' },
			{ label: t('kids'), key: 'kids', color: 'pink' },
		]
	}

	const levels = [
		{ label: t('beginner'), key: 'beginner', color: 'emerald', colorHex: '#10b981' },
		{ label: t('intermediate'), key: 'intermediate', color: 'violet', colorHex: '#a855f7' },
		{ label: t('advanced'), key: 'advanced', color: 'amber', colorHex: '#fbbf24' },
	]

	const statuses = [
		...(showNotStudiedFilter ? [
			{ label: t('not_studied'), key: 'not_studied', tooltipKey: 'notStudiedTooltip', color: 'violet', colorHex: '#8b5cf6', Icon: PlayCircle }
		] : []),
		{ label: t('being_studied'), key: 'is_being_studied', tooltipKey: 'beingStudiedTooltip', color: 'amber', colorHex: '#f59e0b', Icon: Clock },
		...(showStudiedFilter ? [
			{ label: t('studied'), key: 'is_studied', tooltipKey: 'studiedTooltip', color: 'emerald', colorHex: '#10b981', Icon: CheckCircle2 }
		] : []),
	]

	const getLevelIcon = (level) => {
		switch (level) {
			case 'beginner': return <Signal className="w-4 h-4" style={{ clipPath: 'inset(50% 50% 0 0)' }} />
			case 'intermediate': return <Signal className="w-4 h-4" style={{ clipPath: 'inset(25% 25% 0 0)' }} />
			case 'advanced': return <Signal className="w-4 h-4" />
			default: return <Signal className="w-4 h-4" />
		}
	}

	const getSelectedSectionLabel = () => {
		if (!selectedSection) return t('allMaterials')
		for (const category of Object.values(sectionsByCategory)) {
			const found = category.find(s => s.key === selectedSection)
			if (found) return found.label
		}
		return selectedSection
	}

	return (
		<div
			className={cn(
				'flex flex-col gap-3 mb-6 p-3 md:p-4',
				'rounded-none md:rounded-2xl',
				'md:border',
				isDark
					? 'md:bg-gradient-to-br md:from-slate-800/95 md:to-slate-900/90 md:border-violet-500/30'
					: 'md:bg-gradient-to-br md:from-white/95 md:to-white/90 md:border-violet-500/20',
				isDark
					? 'md:shadow-[0_4px_20px_rgba(139,92,246,0.2)]'
					: 'md:shadow-[0_4px_20px_rgba(139,92,246,0.1)]'
			)}
		>
			{/* First row: Search bar and view toggle */}
			<div className="flex gap-2 items-center justify-between">
				<form onSubmit={handleSearchSubmit} className="flex-1 max-w-full md:max-w-[calc(100%-48px)]">
					<div className="relative">
						<input
							type="text"
							placeholder={t('search')}
							value={searchValue}
							onChange={(e) => onSearchChange(e.target.value)}
							className={cn(
								'w-full px-4 py-2.5 pr-12 rounded-xl',
								'border-2 transition-all duration-300',
								'text-sm sm:text-base font-medium',
								isDark
									? 'bg-slate-800/80 text-slate-100 border-violet-500/20 placeholder:text-slate-500'
									: 'bg-white text-slate-900 border-violet-500/20 placeholder:text-slate-400',
								'focus:outline-none focus:border-violet-500',
								'hover:border-violet-500/50'
							)}
						/>
						<button
							type="submit"
							className={cn(
								'absolute right-2 top-1/2 -translate-y-1/2',
								'p-2 rounded-lg transition-all duration-300',
								'text-violet-500 hover:text-cyan-500 hover:scale-110'
							)}
						>
							<Search className="w-5 h-5" />
						</button>
					</div>
				</form>

				{/* View toggle */}
				<div
					className={cn(
						'flex gap-1 p-1 rounded-lg flex-shrink-0',
						'border-2 border-violet-500/20',
						isDark ? 'bg-slate-800/95' : 'bg-white/95',
						'shadow-sm'
					)}
				>
					<button
						onClick={() => onViewChange('card')}
						title="Vue en grille"
						className={cn(
							'p-2 rounded-md transition-all duration-300',
							currentView === 'card'
								? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
								: 'text-violet-500 hover:bg-violet-500/10'
						)}
					>
						<LayoutGrid className="w-4 sm:w-5 h-4 sm:h-5" />
					</button>
					<button
						onClick={() => onViewChange('list')}
						title="Vue en liste"
						className={cn(
							'p-2 rounded-md transition-all duration-300',
							currentView === 'list'
								? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white'
								: 'text-violet-500 hover:bg-violet-500/10'
						)}
					>
						<List className="w-4 sm:w-5 h-4 sm:h-5" />
					</button>
				</div>
			</div>

			{/* Second row: Filters */}
			<div className="flex gap-2 items-center flex-wrap">
				{/* Section dropdown filter */}
				{showSectionFilter && (
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
							className={cn(
								'flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl',
								'text-sm sm:text-[0.95rem] font-semibold',
								'border-2 transition-all duration-300',
								'min-w-[140px] sm:min-w-[180px]',
								selectedSection
									? 'border-violet-500 shadow-[0_4px_15px_rgba(139,92,246,0.3)]'
									: 'border-violet-500/20',
								isDark ? 'bg-slate-800/80' : 'bg-white',
								selectedSection
									? 'text-violet-500'
									: isDark ? 'text-slate-300' : 'text-slate-600',
								'hover:border-violet-500 hover:shadow-[0_4px_15px_rgba(139,92,246,0.2)]'
							)}
						>
							<Layers className="w-4 h-4 text-violet-500" />
							<span className="flex-1 text-left truncate">{getSelectedSectionLabel()}</span>
							<ChevronDown className={cn(
								'w-4 h-4 transition-transform duration-200',
								sectionDropdownOpen && 'rotate-180'
							)} />
						</button>

						{/* Dropdown menu */}
						{sectionDropdownOpen && (
							<div
								className={cn(
									'absolute top-full left-0 mt-2 z-50',
									'w-[280px] max-h-[400px] overflow-y-auto',
									'rounded-xl border py-2',
									isDark
										? 'bg-slate-900/98 border-violet-500/20 shadow-[0_8px_32px_rgba(139,92,246,0.3)]'
										: 'bg-white/98 border-violet-500/10 shadow-[0_8px_32px_rgba(139,92,246,0.15)]'
								)}
							>
								{/* All materials option */}
								<button
									onClick={() => {
										onSectionChange(null)
										setSectionDropdownOpen(false)
									}}
									className={cn(
										'w-full flex items-center gap-2 px-4 py-2.5 text-left',
										'transition-all duration-200',
										!selectedSection
											? isDark ? 'bg-violet-500/20' : 'bg-violet-100'
											: isDark ? 'hover:bg-violet-500/10' : 'hover:bg-violet-50'
									)}
								>
									<Layers className="w-4 h-4 text-violet-500" />
									<span className={cn(
										'font-semibold',
										isDark ? 'text-slate-200' : 'text-slate-700'
									)}>
										{t('allMaterials')}
									</span>
								</button>

								{/* Text & Audio category */}
								<div className={cn(
									'px-4 py-2 mt-2 text-xs font-bold uppercase tracking-wider',
									isDark ? 'bg-violet-500/15 text-violet-400' : 'bg-violet-100/50 text-violet-600'
								)}>
									{t('textAudio') || 'Text & Audio'}
								</div>
								{sectionsByCategory['text & audio'].map(section => (
									<button
										key={section.key}
										onClick={() => {
											onSectionChange(section.key)
											setSectionDropdownOpen(false)
										}}
										className={cn(
											'w-full flex items-center gap-2 px-6 py-2 text-left',
											'transition-all duration-200',
											selectedSection === section.key
												? isDark ? 'bg-violet-500/20' : 'bg-violet-100'
												: isDark ? 'hover:bg-violet-500/10' : 'hover:bg-violet-50'
										)}
									>
										<span className={cn(
											'text-sm',
											isDark ? 'text-slate-300' : 'text-slate-600'
										)}>
											{section.label}
										</span>
									</button>
								))}

								{/* Video category */}
								<div className={cn(
									'px-4 py-2 mt-2 text-xs font-bold uppercase tracking-wider',
									isDark ? 'bg-red-500/15 text-red-400' : 'bg-red-100/50 text-red-600'
								)}>
									{t('video') || 'Video'}
								</div>
								{sectionsByCategory['video'].map(section => (
									<button
										key={section.key}
										onClick={() => {
											onSectionChange(section.key)
											setSectionDropdownOpen(false)
										}}
										className={cn(
											'w-full flex items-center gap-2 px-6 py-2 text-left',
											'transition-all duration-200',
											selectedSection === section.key
												? isDark ? 'bg-violet-500/20' : 'bg-violet-100'
												: isDark ? 'hover:bg-violet-500/10' : 'hover:bg-violet-50'
										)}
									>
										<span className={cn(
											'text-sm',
											isDark ? 'text-slate-300' : 'text-slate-600'
										)}>
											{section.label}
										</span>
									</button>
								))}

								{/* Music category */}
								<div className={cn(
									'px-4 py-2 mt-2 text-xs font-bold uppercase tracking-wider',
									isDark ? 'bg-pink-500/15 text-pink-400' : 'bg-pink-100/50 text-pink-600'
								)}>
									{t('music') || 'Music'}
								</div>
								{sectionsByCategory['music'].map(section => (
									<button
										key={section.key}
										onClick={() => {
											onSectionChange(section.key)
											setSectionDropdownOpen(false)
										}}
										className={cn(
											'w-full flex items-center gap-2 px-6 py-2 text-left',
											'transition-all duration-200',
											selectedSection === section.key
												? isDark ? 'bg-violet-500/20' : 'bg-violet-100'
												: isDark ? 'hover:bg-violet-500/10' : 'hover:bg-violet-50'
										)}
									>
										<span className={cn(
											'text-sm',
											isDark ? 'text-slate-300' : 'text-slate-600'
										)}>
											{section.label}
										</span>
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* Level filters */}
				{levels.map(level => {
					const isSelected = selectedLevel === level.key
					return (
						<button
							key={level.key}
							onClick={() => onLevelChange(selectedLevel === level.key ? null : level.key)}
							title={t(`${level.key}Tooltip`) || level.label}
							className={cn(
								'flex items-center gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl',
								'text-sm font-semibold',
								'border-2 transition-all duration-300',
								'min-w-[40px] sm:min-w-0',
								isSelected
									? [
										level.color === 'emerald' && 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_6px_24px_rgba(16,185,129,0.4)]',
										level.color === 'violet' && 'border-violet-500 bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-[0_6px_24px_rgba(168,85,247,0.4)]',
										level.color === 'amber' && 'border-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[0_6px_24px_rgba(251,191,36,0.4)]',
									]
									: [
										isDark ? 'bg-slate-800/80' : 'bg-white/90',
										isDark ? 'text-slate-300' : 'text-slate-600',
										level.color === 'emerald' && 'border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/20',
										level.color === 'violet' && 'border-violet-500/50 hover:border-violet-500 hover:bg-violet-500/20',
										level.color === 'amber' && 'border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/20',
									],
								'hover:-translate-y-0.5 hover:scale-105',
								'active:scale-100'
							)}
						>
							<Signal
								className={cn(
									'w-4 h-4',
									isSelected ? 'text-white' : `text-${level.color}-500`
								)}
								style={{ color: isSelected ? 'white' : level.colorHex }}
							/>
							<span className="hidden sm:inline">{level.label}</span>
						</button>
					)
				})}

				{/* Status filters */}
				{statuses.map((status, index) => {
					const isSelected = selectedStatus === status.key
					const StatusIcon = status.Icon
					return (
						<button
							key={status.key}
							onClick={() => onStatusChange(selectedStatus === status.key ? null : status.key)}
							title={t(status.tooltipKey) || status.label}
							className={cn(
								'flex items-center gap-1.5 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl',
								'text-sm font-semibold',
								'border-2 transition-all duration-300',
								'min-w-[40px] sm:min-w-0',
								index === 0 && 'ml-2 sm:ml-0',
								isSelected
									? [
										status.color === 'emerald' && 'border-emerald-500 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_6px_24px_rgba(16,185,129,0.4)]',
										status.color === 'violet' && 'border-violet-500 bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-[0_6px_24px_rgba(139,92,246,0.4)]',
										status.color === 'amber' && 'border-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[0_6px_24px_rgba(245,158,11,0.4)]',
									]
									: [
										isDark ? 'bg-slate-800/80' : 'bg-white/90',
										isDark ? 'text-slate-300' : 'text-slate-600',
										status.color === 'emerald' && 'border-emerald-500/50 hover:border-emerald-500 hover:bg-emerald-500/20',
										status.color === 'violet' && 'border-violet-500/50 hover:border-violet-500 hover:bg-violet-500/20',
										status.color === 'amber' && 'border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/20',
									],
								'hover:-translate-y-0.5 hover:scale-105',
								'active:scale-100'
							)}
						>
							<StatusIcon
								className="w-4 h-4"
								style={{ color: isSelected ? 'white' : status.colorHex }}
							/>
							<span className="hidden sm:inline">{status.label}</span>
						</button>
					)
				})}

				{/* Reset button */}
				<button
					onClick={onClear}
					title={t('showall')}
					className={cn(
						'p-2.5 rounded-xl transition-all duration-300',
						'border-2 border-violet-500/20',
						isDark ? 'bg-slate-800/95' : 'bg-white/95',
						'text-violet-500',
						'hover:bg-gradient-to-r hover:from-violet-500 hover:to-cyan-500',
						'hover:text-white hover:border-transparent',
						'hover:rotate-180 hover:scale-110',
						'hover:shadow-[0_4px_20px_rgba(139,92,246,0.4)]'
					)}
				>
					<RefreshCw className="w-4 sm:w-5 h-4 sm:h-5" />
				</button>
			</div>
		</div>
	)
}

export default MaterialsFilterBar
