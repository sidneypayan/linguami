'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { materials_ru, materials_fr, materials_en, materials_it } from '@/utils/constants'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useUserContext } from '@/context/user'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { logger } from '@/utils/logger'
import { getMaterialsByLanguageAction, getBooksByLanguageAction } from '@/app/actions/materials'
import { Link } from '@/i18n/navigation'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import {
	Search,
	GraduationCap,
	Landmark,
	BookOpen,
	LayoutGrid,
	List,
	Sparkles,
	ScrollText,
	Film,
	Music,
	Headphones,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	Grid3X3,
	Table,
	SignalLow,
	SignalMedium,
	SignalHigh,
	Play,
	Clock,
	CheckCircle2,
	Mic,
	Mountain,
	MessageCircle,
	Theater,
	Clapperboard,
	Tv,
	Library,
	Guitar,
	Baby,
	Layers,
	Sword,
	Shield,
	Crown,
	Gem,
	Flame,
	Wand2,
	Star,
	Scroll,
	Castle,
	Trophy,
	Zap,
	SlidersHorizontal,
	ListFilter,
	MessagesSquare,
	CircleDashed,
	ChevronDown,
	Check,
} from 'lucide-react'
import MaterialsCard from './MaterialsCard'
import SectionCard from './SectionCard'
import BookCard from './BookCard'
import MaterialsTable from './MaterialsTable'
import OnboardingModal from '@/components/onboarding/OnboardingModal'

// ============================================
// DECORATIVE CORNER ORNAMENT
// ============================================
const CornerOrnament = ({ position, isDark }) => {
	const positionClasses = {
		'top-left': 'top-0 left-0 rotate-0',
		'top-right': 'top-0 right-0 rotate-90',
		'bottom-left': 'bottom-0 left-0 -rotate-90',
		'bottom-right': 'bottom-0 right-0 rotate-180',
	}

	return (
		<div className={cn(
			'absolute w-5 h-5 pointer-events-none',
			positionClasses[position]
		)}>
			<svg viewBox="0 0 20 20" className={cn('w-full h-full', isDark ? 'text-amber-500/40' : 'text-amber-600/25')}>
				{/* Simple L-shape with rounded inner corner */}
				<path
					d="M0 0 L8 0 L8 3 L3 3 L3 8 L0 8 Z"
					fill="currentColor"
				/>
			</svg>
		</div>
	)
}

// ============================================
// ORNATE FRAME
// ============================================
const OrnateFrame = ({ children, className, isDark, hideCorners = false }) => {
	// Check if className contains overflow-visible to override default overflow-hidden
	const hasOverflowVisible = className?.includes('overflow-visible')

	return (
		<div className={cn(
			'relative rounded-2xl',
			!hasOverflowVisible && 'overflow-hidden',
			'border-2',
			isDark ? 'border-amber-500/20 bg-slate-900/80' : 'border-amber-600/10 bg-white/90',
			'shadow-lg',
			isDark ? 'shadow-black/20' : 'shadow-slate-200/50',
			className
		)}>
			{/* Inner glow border */}
			<div className={cn(
				'absolute inset-0 rounded-2xl pointer-events-none',
				'border',
				isDark ? 'border-amber-400/10' : 'border-amber-500/5'
			)} style={{ margin: '2px' }} />

			{/* Corner ornaments */}
			{!hideCorners && (
				<>
					<CornerOrnament position="top-left" isDark={isDark} />
					<CornerOrnament position="top-right" isDark={isDark} />
					<CornerOrnament position="bottom-left" isDark={isDark} />
					<CornerOrnament position="bottom-right" isDark={isDark} />
				</>
			)}

			{/* Top decorative bar */}
			<div className={cn(
				'absolute top-0 left-8 right-8 h-0.5',
				'bg-gradient-to-r from-transparent via-amber-500/50 to-transparent'
			)} />

			{/* Bottom decorative bar */}
			<div className={cn(
				'absolute bottom-0 left-8 right-8 h-0.5',
				'bg-gradient-to-r from-transparent via-amber-500/30 to-transparent'
			)} />

			{children}
		</div>
	)
}


// ============================================
// EPIC HEADER
// ============================================
const EpicHeader = ({ isDark, t }) => (
	<div className="text-center mb-8 md:mb-12 relative">
		{/* Main title */}
		<h1 className={cn(
			'text-4xl sm:text-5xl md:text-6xl font-black mb-3',
			isDark ? 'text-slate-100' : 'text-slate-800'
		)}>
			{t('pagetitle')}
		</h1>

		{/* Subtitle */}
		<div className="flex items-center justify-center gap-3 mb-2">
			<p className={cn(
				'text-sm md:text-base max-w-xl',
				isDark ? 'text-slate-400' : 'text-slate-600'
			)}>
				{t('description')}
			</p>
		</div>

		{/* Fantasy divider */}
		<div className="flex items-center justify-center gap-2 mt-6">
			<div className={cn(
				'h-0.5 w-12 sm:w-20 rounded-full',
				'bg-gradient-to-r from-transparent to-amber-500/60'
			)} />
			<div className={cn(
				'w-1.5 h-1.5 rotate-45 rounded-sm',
				isDark ? 'bg-amber-400/60' : 'bg-amber-500/50'
			)} />
			<div className={cn(
				'h-0.5 w-6 sm:w-10 rounded-full',
				isDark ? 'bg-amber-500/40' : 'bg-amber-500/30'
			)} />
			<div className={cn(
				'w-2 h-2 rotate-45 rounded-sm',
				'bg-gradient-to-br from-amber-400 to-amber-600',
				'shadow-sm shadow-amber-500/20'
			)} />
			<div className={cn(
				'h-0.5 w-6 sm:w-10 rounded-full',
				isDark ? 'bg-amber-500/40' : 'bg-amber-500/30'
			)} />
			<div className={cn(
				'w-1.5 h-1.5 rotate-45 rounded-sm',
				isDark ? 'bg-amber-400/60' : 'bg-amber-500/50'
			)} />
			<div className={cn(
				'h-0.5 w-12 sm:w-20 rounded-full',
				'bg-gradient-to-l from-transparent to-amber-500/60'
			)} />
		</div>
	</div>
)

// ============================================
// CATEGORY SECTION HEADER (BANNER STYLE)
// ============================================
const CategoryBanner = ({ icon: Icon, title, isDark, colorClass = 'violet' }) => {
	const colors = {
		violet: {
			iconBg: 'from-violet-500 via-purple-500 to-violet-600',
			text: isDark ? 'text-slate-100' : 'text-slate-800',
			lineBg: isDark ? 'from-violet-500/50 via-violet-400/30 to-transparent' : 'from-violet-400/40 via-violet-300/20 to-transparent',
		},
		amber: {
			iconBg: 'from-amber-500 via-yellow-500 to-orange-500',
			text: isDark ? 'text-slate-100' : 'text-slate-800',
			lineBg: isDark ? 'from-amber-500/50 via-amber-400/30 to-transparent' : 'from-amber-400/40 via-amber-300/20 to-transparent',
		},
		emerald: {
			iconBg: 'from-emerald-500 via-teal-500 to-emerald-600',
			text: isDark ? 'text-slate-100' : 'text-slate-800',
			lineBg: isDark ? 'from-emerald-500/50 via-emerald-400/30 to-transparent' : 'from-emerald-400/40 via-emerald-300/20 to-transparent',
		},
	}

	const c = colors[colorClass] || colors.violet

	return (
		<div className="relative mb-8 md:mb-10">
			{/* Banner background */}
			<div className={cn(
				'absolute inset-0 -mx-4 rounded-xl',
				isDark ? 'bg-slate-800/30' : 'bg-slate-100/50'
			)} />

			<div className="relative py-4 flex items-center gap-4">
				{/* Left ornament line */}
				<div className={cn('hidden sm:block flex-1 h-0.5 bg-gradient-to-r', c.lineBg)} />

				{/* Icon shield */}
				<div className={cn(
					'relative flex-shrink-0',
					'w-14 h-14 md:w-16 md:h-16 rounded-xl rotate-45',
					'bg-gradient-to-br',
					c.iconBg,
					'border border-white/20'
				)}>
					<div className="absolute inset-0 -rotate-45 flex items-center justify-center">
						<Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
					</div>
				</div>

				{/* Title */}
				<h2 className={cn(
					'text-2xl sm:text-3xl md:text-4xl font-black',
					c.text
				)}>
					{title}
				</h2>

				{/* Right ornament line */}
				<div className={cn('hidden sm:block flex-1 h-0.5 bg-gradient-to-l', c.lineBg)} />
			</div>
		</div>
	)
}

// ============================================
// MATERIALS GRID
// ============================================
const MaterialsGridComponent = ({ materials, isDark }) => {
	if (!materials || materials.length === 0) return null

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
			{materials.map((material, index) => (
				<div
					key={`${material.section}-${index}`}
					className="animate-in fade-in slide-in-from-bottom-4"
					style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
				>
					<MaterialsCard material={material} />
				</div>
			))}
		</div>
	)
}

// ============================================
// CATEGORY FILTER (GUILD SELECTOR STYLE)
// ============================================
const CategoryFilter = ({ selectedCategory, onCategoryChange, isDark, t }) => {
	const categories = [
		{ key: 'all', icon: Layers, color: 'amber', label: t('all') },
		{ key: 'text & audio', icon: Headphones, color: 'emerald', label: t('textAudio') },
		{ key: 'video', icon: Film, color: 'rose', label: t('video') },
		{ key: 'music', icon: Music, color: 'violet', label: t('music') },
	]

	return (
		<div className={cn(
			'relative rounded-2xl p-4 mb-8',
			'border-2',
			isDark ? 'border-amber-500/20 bg-slate-900/80' : 'border-amber-600/10 bg-white/90',
			'shadow-lg',
			isDark ? 'shadow-black/20' : 'shadow-slate-200/50'
		)}>
			<div className="hidden sm:flex items-center gap-2 mb-4">
				<SlidersHorizontal className={cn('w-5 h-5', isDark ? 'text-amber-400' : 'text-amber-600')} />
				<span className={cn(
					'font-bold text-sm uppercase tracking-wider',
					isDark ? 'text-amber-300' : 'text-amber-700'
				)}>
					{t('filterByCategory')}
				</span>
			</div>

			<div className="flex justify-center gap-1 sm:gap-2">
				{categories.map((cat) => {
					const Icon = cat.icon
					const isSelected = selectedCategory === cat.key

					const colorStyles = {
						amber: {
							active: 'from-amber-500 to-yellow-600 border-amber-400/50',
							inactive: isDark ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' : 'border-amber-400/30 text-amber-600 hover:bg-amber-50',
						},
						emerald: {
							active: 'from-emerald-500 to-teal-600 border-emerald-400/50',
							inactive: isDark ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'border-emerald-400/30 text-emerald-600 hover:bg-emerald-50',
						},
						rose: {
							active: 'from-rose-500 to-pink-600 border-rose-400/50',
							inactive: isDark ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10' : 'border-rose-400/30 text-rose-600 hover:bg-rose-50',
						},
						violet: {
							active: 'from-violet-500 to-purple-600 border-violet-400/50',
							inactive: isDark ? 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10' : 'border-violet-400/30 text-violet-600 hover:bg-violet-50',
						},
					}

					const styles = colorStyles[cat.color]

					return (
						<button
							key={cat.key}
							onClick={() => onCategoryChange(cat.key)}
							className={cn(
								'relative px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[0.7rem] sm:text-sm',
								'transition-all duration-300',
								'flex items-center gap-1 sm:gap-2',
								'border-2',
								isSelected
									? [
										'bg-gradient-to-br text-white',
										styles.active,
										'scale-105'
									]
									: [
										isDark ? 'bg-slate-800/50' : 'bg-white/80',
										styles.inactive,
									]
							)}
						>
							<Icon className="w-3 h-3 sm:w-4 sm:h-4" />
							<span>{cat.label}</span>
							{isSelected && (
								<Star className="hidden sm:block w-3 h-3 ml-1 animate-pulse" />
							)}
						</button>
					)
				})}
			</div>
		</div>
	)
}

// ============================================
// DISPLAY MODE TOGGLE (QUEST SELECTOR)
// ============================================
const DisplayModeToggle = ({ displayMode, setDisplayMode, isDark, t }) => {
	return (
		<div className="flex justify-center gap-2 sm:gap-3 mb-8">
			<button
				onClick={() => setDisplayMode('category')}
				className={cn(
					'group relative px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm',
					'transition-all duration-300',
					'flex items-center gap-1.5 sm:gap-2',
					'border-2',
					displayMode === 'category'
						? [
							'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-white',
							'border-amber-400/50'
						]
						: [
							isDark ? 'bg-slate-800/50 border-slate-600/50' : 'bg-white border-slate-200',
							isDark ? 'text-slate-300 hover:border-amber-500/50' : 'text-slate-600 hover:border-amber-400/50',
							'hover:scale-105'
						]
				)}
			>
				<LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
				<span>{t('categoryView')}</span>
			</button>

			<button
				onClick={() => setDisplayMode('list')}
				className={cn(
					'group relative px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm',
					'transition-all duration-300',
					'flex items-center gap-1.5 sm:gap-2',
					'border-2',
					displayMode === 'list'
						? [
							'bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 text-white',
							'border-violet-400/50'
						]
						: [
							isDark ? 'bg-slate-800/50 border-slate-600/50' : 'bg-white border-slate-200',
							isDark ? 'text-slate-300 hover:border-violet-500/50' : 'text-slate-600 hover:border-violet-400/50',
							'hover:scale-105'
						]
				)}
			>
				<ListFilter className="w-4 h-4 sm:w-5 sm:h-5" />
				<span>{t('listView')}</span>
			</button>
		</div>
	)
}

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

// ============================================
// FILTER BAR (ADVENTURER'S TOOLKIT)
// ============================================
const FilterBar = ({
	searchValue,
	onSearchChange,
	selectedSection,
	onSectionChange,
	selectedLevel,
	onLevelChange,
	selectedStatus,
	onStatusChange,
	viewMode,
	onViewChange,
	onClear,
	isDark,
	t,
	showSectionFilter = false,
	showNotStudiedFilter = false,
}) => {
	const levels = [
		{ key: 'beginner', icon: SignalLow, color: 'emerald', label: t('beginner') },
		{ key: 'intermediate', icon: SignalMedium, color: 'violet', label: t('intermediate') },
		{ key: 'advanced', icon: SignalHigh, color: 'amber', label: t('advanced') },
	]

	const statuses = [
		...(showNotStudiedFilter ? [{ key: 'not_studied', icon: CircleDashed, color: 'violet', label: t('not_studied') }] : []),
		{ key: 'is_being_studied', icon: Clock, color: 'amber', label: t('being_studied') },
		{ key: 'is_studied', icon: CheckCircle2, color: 'emerald', label: t('studied') },
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
								viewMode === 'card'
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
								viewMode === 'list'
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

// ============================================
// PAGINATION (QUEST PROGRESS)
// ============================================
const Pagination = ({ currentPage, totalPages, onPageChange, isDark }) => {
	if (totalPages <= 1) return null

	const getVisiblePages = () => {
		const pages = []
		const delta = 2
		const start = Math.max(1, currentPage - delta)
		const end = Math.min(totalPages, currentPage + delta)

		if (start > 1) {
			pages.push(1)
			if (start > 2) pages.push('...')
		}

		for (let i = start; i <= end; i++) {
			pages.push(i)
		}

		if (end < totalPages) {
			if (end < totalPages - 1) pages.push('...')
			pages.push(totalPages)
		}

		return pages
	}

	return (
		<div className="flex items-center justify-center gap-1.5 py-6 mt-4">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					'group relative w-8 h-8 rounded-lg flex items-center justify-center',
					'transition-all duration-300',
					'border overflow-hidden',
					currentPage === 1
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-105 hover:-translate-x-0.5',
					isDark
						? 'border-amber-500/30 bg-slate-800/80 text-amber-400'
						: 'border-amber-300 bg-white text-amber-600',
					currentPage !== 1 && (isDark
						? 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/20'
						: 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-300/30')
				)}
			>
				<ChevronLeft className="w-4 h-4 relative z-10" />
			</button>

			<div className="flex items-center gap-1">
				{getVisiblePages().map((page, index) => (
					page === '...' ? (
						<span
							key={`ellipsis-${index}`}
							className={cn(
								'w-6 text-center font-bold text-sm',
								isDark ? 'text-slate-500' : 'text-slate-400'
							)}
						>
							···
						</span>
					) : (
						<button
							key={page}
							onClick={() => onPageChange(page)}
							className={cn(
								'relative w-8 h-8 rounded-md font-bold text-sm transition-all duration-300',
								'overflow-hidden',
								page === currentPage
									? [
										'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-white',
										'shadow-md shadow-amber-500/40',
										'scale-105 z-10',
										'ring-1 ring-amber-300/30'
									]
									: [
										isDark ? 'text-slate-300' : 'text-slate-600',
										'hover:scale-105',
										isDark
											? 'hover:bg-amber-500/20 hover:text-amber-300'
											: 'hover:bg-amber-100 hover:text-amber-600'
									]
							)}
						>
							<span className="relative z-10">{page}</span>
						</button>
					)
				))}
			</div>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					'group relative w-8 h-8 rounded-lg flex items-center justify-center',
					'transition-all duration-300',
					'border overflow-hidden',
					currentPage === totalPages
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-105 hover:translate-x-0.5',
					isDark
						? 'border-amber-500/30 bg-slate-800/80 text-amber-400'
						: 'border-amber-300 bg-white text-amber-600',
					currentPage !== totalPages && (isDark
						? 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/20'
						: 'hover:border-amber-400 hover:shadow-md hover:shadow-amber-300/30')
				)}
			>
				<ChevronRight className="w-4 h-4 relative z-10" />
			</button>
		</div>
	)
}

// ============================================
// EMPTY STATE (TREASURE NOT FOUND)
// ============================================
const EmptyState = ({ isDark, t }) => (
	<OrnateFrame isDark={isDark} className="p-8 text-center">
		<div className={cn(
			'w-20 h-20 mx-auto mb-4 rounded-2xl rotate-45',
			'bg-gradient-to-br from-violet-500/20 to-cyan-500/20',
			'flex items-center justify-center',
			'border-2',
			isDark ? 'border-violet-500/30' : 'border-violet-300/50'
		)}>
			<Gem className={cn('w-10 h-10 -rotate-45', isDark ? 'text-violet-400' : 'text-violet-500')} />
		</div>
		<h3 className={cn(
			'text-xl font-bold mb-2',
			'bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent'
		)}>
			{t('noMaterialsFound')}
		</h3>
		<p className={cn(
			'text-sm',
			isDark ? 'text-slate-400' : 'text-slate-500'
		)}>
			{t('noMaterialsInCategory')}
		</p>
	</OrnateFrame>
)

// ============================================
// MAIN COMPONENT
// ============================================
const MaterialsPageClient = ({ initialMaterials = [], initialUserMaterialsStatus = [], learningLanguage = 'fr' }) => {
	const t = useTranslations('materials')
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const { userProfile, userLearningLanguage, changeLearningLanguage } = useUserContext()
	const { isDark } = useThemeMode()
	const prevPathnameRef = useRef(pathname)
	const prevLearningLanguageRef = useRef(userLearningLanguage)

	// Synchronize context with server language at mount
	useEffect(() => {
		if (learningLanguage && userLearningLanguage && learningLanguage !== userLearningLanguage) {
			changeLearningLanguage(learningLanguage)
		}
	}, [])

	// React Query: Fetch materials
	const { data: allLoadedMaterials = [], isLoading: materialsLoading } = useQuery({
		queryKey: ['allMaterials', userLearningLanguage],
		queryFn: () => getMaterialsByLanguageAction(userLearningLanguage),
		initialData: learningLanguage === userLearningLanguage ? initialMaterials : undefined,
		enabled: !!userLearningLanguage,
		staleTime: 5 * 60 * 1000,
	})

	// React Query: Fetch books
	const { data: allBooks = [] } = useQuery({
		queryKey: ['allBooks', userLearningLanguage],
		queryFn: () => getBooksByLanguageAction(userLearningLanguage),
		enabled: !!userLearningLanguage,
		staleTime: 5 * 60 * 1000,
	})

	// React Query: User materials status
	const { data: user_materials_status = [] } = useQuery({
		queryKey: ['userMaterialsStatus'],
		queryFn: () => initialUserMaterialsStatus,
		initialData: initialUserMaterialsStatus,
		staleTime: Infinity,
	})

	// Local state
	const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)
	const [materials, setMaterials] = useState([])
	const [practice, setPractice] = useState([])
	const [culture, setCulture] = useState([])
	const [literature, setLiterature] = useState([])
	const [displayMode, setDisplayMode] = useState('category')
	const [isDisplayModeLoaded, setIsDisplayModeLoaded] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState('all')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [selectedSection, setSelectedSection] = useState(null)
	const [viewMode, setViewMode] = useState('card')
	const [isMounted, setIsMounted] = useState(false)
	const [showOnboardingModal, setShowOnboardingModal] = useState(false)

	const currentPage = parseInt(searchParams.get('page') || '1', 10)
	const materialsPerPage = 10
	const userLevel = userProfile?.language_level || 'beginner'

	// Reset filters when learning language changes
	useEffect(() => {
		const prevLang = prevLearningLanguageRef.current
		if (prevLang && userLearningLanguage && prevLang !== userLearningLanguage && displayMode === 'list') {
			setSearchTerm('')
			setSelectedLevel(null)
			setSelectedStatus(null)
			setSelectedSection(null)
			updatePage(1)
		}
		prevLearningLanguageRef.current = userLearningLanguage
	}, [userLearningLanguage, displayMode])

	// Load display mode preference
	useEffect(() => {
		setIsMounted(true)
		const saved = localStorage.getItem('materialsDisplayMode')
		if (saved && (saved === 'category' || saved === 'list')) {
			setDisplayMode(saved)
		}
		setIsDisplayModeLoaded(true)

		// TEMPORAIRE: Onboarding désactivé car leçons de la méthode pas encore publiées
		// Check for first visit to show onboarding modal
		// const hasSeenOnboarding = localStorage.getItem('materials_onboarding_completed')
		// if (!hasSeenOnboarding) {
		// 	setShowOnboardingModal(true)
		// }
	}, [])

	// Save display mode preference
	useEffect(() => {
		if (isDisplayModeLoaded) {
			localStorage.setItem('materialsDisplayMode', displayMode)
		}
	}, [displayMode, isDisplayModeLoaded])

	// Load sections for category mode
	useEffect(() => {
		if (!userLearningLanguage) return
		let selectedMaterials = []
		if (userLearningLanguage === 'ru') selectedMaterials = materials_ru
		else if (userLearningLanguage === 'fr') selectedMaterials = materials_fr
		else if (userLearningLanguage === 'en') selectedMaterials = materials_en
		else if (userLearningLanguage === 'it') selectedMaterials = materials_it
		else selectedMaterials = materials_fr
		setMaterials(selectedMaterials)
	}, [userLearningLanguage])

	// Restore filters from localStorage
	useEffect(() => {
		if (displayMode !== 'list') return
		if (allLoadedMaterials.length === 0) return

		const isReturningToMaterials =
			prevPathnameRef.current &&
			prevPathnameRef.current.includes('/materials/') &&
			prevPathnameRef.current !== pathname &&
			(pathname === '/materials' || pathname.endsWith('/materials'))

		const shouldRestore = !hasAppliedDefaultFilter || isReturningToMaterials

		if (shouldRestore) {
			try {
				const savedFilters = localStorage.getItem('materials_list_filters')
				if (savedFilters) {
					const filters = JSON.parse(savedFilters)
					if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm)
					if (filters.selectedLevel !== undefined) setSelectedLevel(filters.selectedLevel)
					if (filters.selectedStatus !== undefined) setSelectedStatus(filters.selectedStatus)
					if (filters.selectedSection !== undefined) setSelectedSection(filters.selectedSection)
					if (filters.viewMode !== undefined) setViewMode(filters.viewMode)
				} else if (!hasAppliedDefaultFilter) {
					const isSameLevel = userLevel === selectedLevel
					const noFiltersApplied = !searchTerm && !selectedStatus && !selectedSection
					if (userLevel && !isSameLevel && noFiltersApplied) {
						setSelectedLevel(userLevel)
					}
				}
			} catch (error) {
				logger.error('Error parsing filters from localStorage:', error)
			}
			setHasAppliedDefaultFilter(true)
		}
		prevPathnameRef.current = pathname
	}, [displayMode, allLoadedMaterials.length, hasAppliedDefaultFilter, pathname, userLevel])

	// Save filters to localStorage
	useEffect(() => {
		if (displayMode !== 'list') return
		if (!hasAppliedDefaultFilter) return

		const filters = { searchTerm, selectedLevel, selectedStatus, selectedSection, viewMode }
		try {
			localStorage.setItem('materials_list_filters', JSON.stringify(filters))
		} catch (error) {
			logger.error('Error saving filters to localStorage:', error)
		}
	}, [displayMode, searchTerm, selectedLevel, selectedStatus, selectedSection, viewMode, hasAppliedDefaultFilter])

	const isBookFilter = selectedSection === 'book-chapters'

	// Filter materials for list mode
	const filteredMaterials = useMemo(() => {
		if (displayMode !== 'list') return []
		if (isBookFilter) return []

		let result = [...allLoadedMaterials]

		if (selectedSection) {
			result = result.filter(m => m.section === selectedSection)
		}
		if (selectedLevel && selectedLevel !== 'all') {
			result = result.filter(m => m.level === selectedLevel)
		}
		if (selectedStatus) {
			if (selectedStatus === 'not_studied') {
				const materialIdsWithStatus = user_materials_status
					.filter(um => um.is_being_studied || um.is_studied)
					.map(um => um.material_id)
				result = result.filter(m => !materialIdsWithStatus.includes(m.id))
			} else {
				const materialIdsWithStatus = user_materials_status
					.filter(um => um[selectedStatus])
					.map(um => um.material_id)
				result = result.filter(m => materialIdsWithStatus.includes(m.id))
			}
		}
		if (searchTerm) {
			result = result.filter(m =>
				m.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		return result
	}, [displayMode, allLoadedMaterials, selectedSection, selectedLevel, selectedStatus, searchTerm, user_materials_status, isBookFilter])

	// Filter books for list mode
	const filteredBooks = useMemo(() => {
		if (displayMode !== 'list') return []
		if (!isBookFilter) return []

		let result = [...allBooks]
		if (selectedLevel && selectedLevel !== 'all') {
			result = result.filter(b => b.level === selectedLevel)
		}
		if (searchTerm) {
			result = result.filter(b =>
				b.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}
		return result
	}, [displayMode, allBooks, selectedLevel, searchTerm, isBookFilter])

	// Filter sections by category (category mode)
	const filteredPractice = useMemo(() => {
		if (displayMode !== 'category') return []
		let filtered = practice
		if (selectedCategory && selectedCategory !== 'all') {
			filtered = practice.filter(material => material.category === selectedCategory)
		}
		return filtered
	}, [displayMode, practice, selectedCategory])

	const filteredCulture = useMemo(() => {
		if (displayMode !== 'category') return []
		let filtered = culture
		if (selectedCategory && selectedCategory !== 'all') {
			filtered = culture.filter(material => material.category === selectedCategory)
		}
		return filtered
	}, [displayMode, culture, selectedCategory])

	const filteredLiterature = useMemo(() => {
		if (displayMode !== 'category') return []
		let filtered = literature
		if (selectedCategory && selectedCategory !== 'all') {
			filtered = literature.filter(material => material.category === selectedCategory)
		}
		return filtered
	}, [displayMode, literature, selectedCategory])

	// Load practice/culture/literature for category mode
	useEffect(() => {
		if (displayMode !== 'category') return
		if (!materials || materials.length === 0) return

		setPractice(materials.filter(m => m.newCategory === 'practice'))
		setCulture(materials.filter(m => m.newCategory === 'culture'))
		setLiterature(materials.filter(m => m.newCategory === 'literature'))
	}, [materials, displayMode])

	// Pagination for list mode
	const itemsToDisplay = isBookFilter ? filteredBooks : filteredMaterials
	const numOfPages = Math.ceil(itemsToDisplay.length / materialsPerPage)
	const sliceStart = (currentPage - 1) * materialsPerPage
	const sliceEnd = sliceStart + materialsPerPage
	const paginatedItems = itemsToDisplay.slice(sliceStart, sliceEnd)

	const updatePage = (page) => {
		const params = new URLSearchParams(searchParams.toString())
		if (page === 1) params.delete('page')
		else params.set('page', page.toString())
		const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
		router.push(newUrl, { scroll: false })
	}

	const handleSearchChange = (value) => {
		setSearchTerm(value)
		updatePage(1)
	}

	const handleSectionChange = (section) => {
		setSelectedSection(section)
		updatePage(1)
	}

	const handleLevelChange = (level) => {
		setSelectedLevel(level)
		updatePage(1)
	}

	const handleStatusChange = (status) => {
		setSelectedStatus(status)
		updatePage(1)
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		setSelectedSection(null)
		updatePage(1)
	}

	const handleViewChange = (view) => {
		setViewMode(view)
		updatePage(1)
	}

	const checkIfUserMaterialIsInMaterials = (id) => {
		return user_materials_status.find(m => m.material_id === id)
	}

	// Onboarding modal handlers
	const handleOnboardingClose = () => {
		localStorage.setItem('materials_onboarding_completed', 'true')
		setShowOnboardingModal(false)
	}

	const handleChooseBeginner = () => {
		localStorage.setItem('materials_onboarding_completed', 'true')
		router.push('/method/beginner')
	}

	const handleChooseExplore = () => {
		localStorage.setItem('materials_onboarding_completed', 'true')
		setShowOnboardingModal(false)
	}

	// Loading state
	if (!isMounted || materialsLoading) {
		return <LoadingSpinner />
	}

	return (
		<div className={cn(
			'min-h-screen pt-20 md:pt-24 pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
				: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-violet-50/30 to-slate-50'
		)}>
			<div className="relative max-w-7xl mx-auto px-4">
				{/* Epic Header - Hidden on mobile, shown on md+ */}
				<div className="hidden md:block">
					<EpicHeader isDark={isDark} t={t} />
				</div>

				{/* Display Mode Toggle */}
				<div className="mt-8 md:mt-0">
					<DisplayModeToggle
						displayMode={displayMode}
						setDisplayMode={setDisplayMode}
						isDark={isDark}
						t={t}
					/>
				</div>

				{/* Content */}
				{displayMode === 'category' ? (
					<>
						<CategoryFilter
							selectedCategory={selectedCategory}
							onCategoryChange={setSelectedCategory}
							isDark={isDark}
							t={t}
						/>

						{filteredPractice.length === 0 && filteredCulture.length === 0 && filteredLiterature.length === 0 ? (
							<EmptyState isDark={isDark} t={t} />
						) : (
							<>
								{filteredPractice.length > 0 && (
									<div id="practice" className="scroll-mt-24 mb-10 md:mb-14">
										<CategoryBanner
											icon={GraduationCap}
											title={t('practiceCategory')}
											isDark={isDark}
											colorClass="violet"
										/>
										<MaterialsGridComponent materials={filteredPractice} isDark={isDark} />
									</div>
								)}

								{filteredCulture.length > 0 && (
									<div id="culture" className="scroll-mt-24 mb-10 md:mb-14">
										<CategoryBanner
											icon={Landmark}
											title={t('cultureCategory')}
											isDark={isDark}
											colorClass="amber"
										/>
										<MaterialsGridComponent materials={filteredCulture} isDark={isDark} />
									</div>
								)}

								{filteredLiterature.length > 0 && (
									<div id="literature" className="scroll-mt-24 mb-10 md:mb-14">
										<CategoryBanner
											icon={BookOpen}
											title={t('literatureCategory')}
											isDark={isDark}
											colorClass="emerald"
										/>
										<MaterialsGridComponent materials={filteredLiterature} isDark={isDark} />
									</div>
								)}
							</>
						)}
					</>
				) : (
					<>
						<FilterBar
							searchValue={searchTerm}
							onSearchChange={handleSearchChange}
							selectedSection={selectedSection}
							onSectionChange={handleSectionChange}
							selectedLevel={selectedLevel}
							onLevelChange={handleLevelChange}
							selectedStatus={selectedStatus}
							onStatusChange={handleStatusChange}
							viewMode={viewMode}
							onViewChange={handleViewChange}
							onClear={handleClear}
							isDark={isDark}
							t={t}
							showSectionFilter={true}
							showNotStudiedFilter={true}
						/>

						{itemsToDisplay.length === 0 ? (
							<EmptyState isDark={isDark} t={t} />
						) : isBookFilter ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
								{paginatedItems.map(book => (
									<BookCard
										key={book.id}
										book={book}
										checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(book.id)}
									/>
								))}
							</div>
						) : viewMode === 'card' ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
								{paginatedItems.map(material => (
									<SectionCard
										key={material.id}
										material={material}
										checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
									/>
								))}
							</div>
						) : (
							<MaterialsTable
								materials={paginatedItems}
								checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
							/>
						)}

						{itemsToDisplay.length > materialsPerPage && (
							<Pagination
								currentPage={currentPage}
								totalPages={numOfPages}
								onPageChange={updatePage}
								isDark={isDark}
							/>
						)}
					</>
				)}
			</div>

			{/* Onboarding Modal - shown on first visit */}
			<OnboardingModal
				open={showOnboardingModal}
				onClose={handleOnboardingClose}
				onChooseBeginner={handleChooseBeginner}
				onChooseExplore={handleChooseExplore}
			/>
		</div>
	)
}

export default MaterialsPageClient
