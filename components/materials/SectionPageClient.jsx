'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { getMaterialsBySectionAction } from '@/app/actions/materials'
import SectionCard from '@/components/materials/SectionCard'
import BookCard from '@/components/materials/BookCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import { logger } from '@/utils/logger'
import {
	ArrowLeft,
	Search,
	Grid3X3,
	Table,
	RotateCcw,
	ChevronLeft,
	ChevronRight,
	ScrollText,
	Sparkles,
	Star,
	Sword,
	Shield,
	Crown,
	Gem,
	Flame,
	Trophy,
	Wand2,
	Castle,
	Scroll,
	BookOpen,
	Film,
	Music,
} from 'lucide-react'

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
		<div className={cn('absolute w-8 h-8 pointer-events-none', positionClasses[position])}>
			<svg viewBox="0 0 32 32" className={cn('w-full h-full', isDark ? 'text-amber-500/30' : 'text-amber-600/20')}>
				<path d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z" fill="currentColor" />
				<path d="M6 0 L8 0 L8 6 L6 6 Z M0 6 L6 6 L6 8 L0 8 Z" fill="currentColor" opacity="0.5" />
			</svg>
		</div>
	)
}

// ============================================
// ORNATE FRAME
// ============================================
const OrnateFrame = ({ children, className, isDark, glowColor = 'violet' }) => {
	const glowColors = {
		violet: isDark ? 'shadow-violet-500/20' : 'shadow-violet-300/30',
		amber: isDark ? 'shadow-amber-500/20' : 'shadow-amber-300/30',
		cyan: isDark ? 'shadow-cyan-500/20' : 'shadow-cyan-300/30',
	}

	const borderColors = {
		violet: isDark ? 'border-violet-500/30' : 'border-violet-300/50',
		amber: isDark ? 'border-amber-500/30' : 'border-amber-300/50',
		cyan: isDark ? 'border-cyan-500/30' : 'border-cyan-300/50',
	}

	return (
		<div className={cn(
			'relative rounded-2xl overflow-hidden',
			'border-2',
			borderColors[glowColor],
			'shadow-xl',
			glowColors[glowColor],
			className
		)}>
			{/* Corner ornaments */}
			<CornerOrnament position="top-left" isDark={isDark} />
			<CornerOrnament position="top-right" isDark={isDark} />
			<CornerOrnament position="bottom-left" isDark={isDark} />
			<CornerOrnament position="bottom-right" isDark={isDark} />

			{/* Top decorative bar */}
			<div className="absolute top-0 left-8 right-8 h-0.5">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
				{/* Center gem */}
				<div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 bg-gradient-to-br from-amber-400 to-amber-600" />
			</div>

			{/* Bottom decorative bar */}
			<div className="absolute bottom-0 left-8 right-8 h-0.5">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
			</div>

			{/* Inner glow border */}
			<div className={cn(
				'absolute inset-[2px] rounded-xl pointer-events-none',
				'border',
				isDark ? 'border-white/5' : 'border-white/50'
			)} />

			{children}
		</div>
	)
}

// ============================================
// MAGICAL PARTICLES BACKGROUND
// ============================================
const MagicalParticles = ({ isDark }) => (
	<div className="fixed inset-0 pointer-events-none overflow-hidden">
		{/* Floating orbs */}
		<div className={cn(
			'absolute top-32 left-10 w-3 h-3 rounded-full animate-pulse',
			isDark ? 'bg-violet-400/20' : 'bg-violet-300/40'
		)} style={{ animationDuration: '3s' }} />
		<div className={cn(
			'absolute top-48 right-20 w-2 h-2 rounded-full animate-pulse',
			isDark ? 'bg-cyan-400/20' : 'bg-cyan-300/40'
		)} style={{ animationDuration: '4s' }} />
		<div className={cn(
			'absolute top-64 left-1/4 w-2.5 h-2.5 rounded-full animate-pulse',
			isDark ? 'bg-amber-400/20' : 'bg-amber-300/40'
		)} style={{ animationDuration: '2.5s' }} />
		<div className={cn(
			'absolute bottom-48 right-1/4 w-2 h-2 rounded-full animate-pulse',
			isDark ? 'bg-emerald-400/20' : 'bg-emerald-300/40'
		)} style={{ animationDuration: '3.5s' }} />
		<div className={cn(
			'absolute bottom-32 left-20 w-1.5 h-1.5 rounded-full animate-pulse',
			isDark ? 'bg-purple-400/20' : 'bg-purple-300/40'
		)} style={{ animationDuration: '4.5s' }} />

		{/* Sparkle effects */}
		<div className={cn(
			'absolute top-40 right-1/3 w-1 h-1 rounded-full animate-ping',
			isDark ? 'bg-white/10' : 'bg-violet-400/30'
		)} style={{ animationDuration: '2s' }} />
		<div className={cn(
			'absolute bottom-60 left-1/3 w-1 h-1 rounded-full animate-ping',
			isDark ? 'bg-white/10' : 'bg-amber-400/30'
		)} style={{ animationDuration: '2.5s' }} />

		{/* Ambient glows */}
		<div className={cn(
			'absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl',
			isDark ? 'bg-violet-900/20' : 'bg-violet-200/30'
		)} />
		<div className={cn(
			'absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl',
			isDark ? 'bg-cyan-900/20' : 'bg-cyan-200/30'
		)} />
	</div>
)

// ============================================
// SECTION ICON MAPPING
// ============================================
const getSectionIcon = (section) => {
	const iconMap = {
		texts: ScrollText,
		audio: Music,
		video: Film,
		books: BookOpen,
	}
	return iconMap[section] || ScrollText
}

// ============================================
// EPIC SECTION HEADER
// ============================================
const EpicHeader = ({ isDark, section, t, onBack }) => {
	const SectionIcon = getSectionIcon(section)

	return (
		<div className="relative mb-8 md:mb-10">
			{/* Back button with shield style */}
			<div className="flex items-center gap-4 md:gap-6">
				<button
					onClick={onBack}
					className={cn(
						'group relative w-12 h-12 md:w-14 md:h-14',
						'flex items-center justify-center',
						'transition-all duration-300',
						'hover:scale-110'
					)}
				>
					{/* Shield background */}
					<div className={cn(
						'absolute inset-0 rounded-xl rotate-45',
						'bg-gradient-to-br',
						isDark
							? 'from-slate-700 to-slate-800 border-2 border-violet-500/30'
							: 'from-white to-slate-100 border-2 border-violet-300/50',
						'shadow-lg',
						isDark ? 'shadow-violet-500/20' : 'shadow-violet-300/30',
						'group-hover:border-violet-400 transition-colors'
					)} />
					{/* Sword icon (or arrow) */}
					<ArrowLeft className={cn(
						'relative z-10 w-5 h-5 md:w-6 md:h-6',
						isDark ? 'text-violet-400' : 'text-violet-600',
						'group-hover:text-violet-500 transition-colors',
						'group-hover:-translate-x-1 transition-transform'
					)} />
					{/* Glow on hover */}
					<div className={cn(
						'absolute inset-0 rounded-xl rotate-45',
						'bg-gradient-to-br from-violet-500/0 to-cyan-500/0',
						'group-hover:from-violet-500/20 group-hover:to-cyan-500/20',
						'transition-all duration-300'
					)} />
				</button>

				{/* Main title area */}
				<div className="flex items-center gap-4">
					{/* Section emblem */}
					<div className="relative">
						{/* Glow behind emblem */}
						<div className={cn(
							'absolute inset-0 blur-xl rounded-full',
							isDark ? 'bg-violet-500/30' : 'bg-violet-400/40'
						)} />
						{/* Rotated frame */}
						<div className={cn(
							'relative w-14 h-14 md:w-16 md:h-16 rotate-45',
							'bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500',
							'rounded-xl',
							'shadow-lg shadow-violet-500/40',
							'flex items-center justify-center'
						)}>
							<div className="-rotate-45">
								<SectionIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
							</div>
						</div>
						{/* Decorative dots */}
						<div className={cn(
							'absolute -top-1 -right-1 w-2 h-2 rounded-full',
							'bg-amber-400 animate-pulse'
						)} />
					</div>

					{/* Title with decorations */}
					<div className="relative">
						{/* Crown decoration above */}
						<div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
							<div className={cn('w-6 h-0.5 bg-gradient-to-r from-transparent to-amber-500/50')} />
							<Crown className={cn('w-4 h-4', isDark ? 'text-amber-400/60' : 'text-amber-500/50')} />
							<div className={cn('w-6 h-0.5 bg-gradient-to-l from-transparent to-amber-500/50')} />
						</div>

						<h1 className={cn(
							'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight',
							'bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent',
							'[text-shadow:0_4px_12px_rgba(139,92,246,0.3)]'
						)}>
							{section && t(section)}
						</h1>

						{/* Decorative underline */}
						<div className="mt-1 flex items-center gap-2">
							<div className={cn('flex-1 h-0.5 bg-gradient-to-r from-violet-500 to-transparent')} />
							<Gem className={cn('w-3 h-3', isDark ? 'text-cyan-400' : 'text-cyan-500')} />
							<div className={cn('flex-1 h-0.5 bg-gradient-to-l from-cyan-500 to-transparent')} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// ============================================
// FILTER BAR - Gaming Style
// ============================================
const FilterBar = ({
	searchValue,
	onSearchChange,
	selectedLevel,
	onLevelChange,
	selectedStatus,
	onStatusChange,
	viewMode,
	onViewChange,
	onClear,
	isDark,
	t,
	showNotStudiedFilter = false,
	showStudiedFilter = true,
}) => {
	const levels = [
		{ key: 'beginner', icon: Shield, color: 'emerald', label: t('beginner') },
		{ key: 'intermediate', icon: Sword, color: 'violet', label: t('intermediate') },
		{ key: 'advanced', icon: Crown, color: 'amber', label: t('advanced') },
	]

	const statuses = [
		...(showNotStudiedFilter ? [{ key: 'not_studied', icon: Gem, color: 'violet', label: t('not_studied') }] : []),
		{ key: 'is_being_studied', icon: Flame, color: 'amber', label: t('being_studied') },
		...(showStudiedFilter ? [{ key: 'is_studied', icon: Trophy, color: 'emerald', label: t('studied') }] : []),
	]

	const colorClasses = {
		emerald: {
			active: 'from-emerald-500 to-teal-600 shadow-emerald-500/40 border-transparent',
			inactive: isDark ? 'border-emerald-500/30 text-emerald-400' : 'border-emerald-400/50 text-emerald-600',
		},
		violet: {
			active: 'from-violet-500 to-purple-600 shadow-violet-500/40 border-transparent',
			inactive: isDark ? 'border-violet-500/30 text-violet-400' : 'border-violet-400/50 text-violet-600',
		},
		amber: {
			active: 'from-amber-500 to-orange-600 shadow-amber-500/40 border-transparent',
			inactive: isDark ? 'border-amber-500/30 text-amber-400' : 'border-amber-400/50 text-amber-600',
		},
	}

	return (
		<OrnateFrame isDark={isDark} glowColor="violet" className={cn(
			'p-4 mb-6',
			isDark
				? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90'
				: 'bg-gradient-to-br from-white to-slate-50'
		)}>
			{/* Adventurer's toolkit label */}
			<div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider">
				<Wand2 className="w-3 h-3" />
				<span>Filtres</span>
			</div>

			<div className="space-y-4 pt-2">
				{/* Search + View Toggle */}
				<div className="flex gap-3 items-center">
					<div className="relative flex-1">
						<Search className={cn(
							'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
							isDark ? 'text-violet-400' : 'text-violet-500'
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
									? 'bg-slate-900/50 border-violet-500/20 text-white placeholder:text-slate-500'
									: 'bg-slate-50 border-violet-200 text-slate-800 placeholder:text-slate-400',
								'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500'
							)}
						/>
					</div>

					{/* View toggle - Gaming style */}
					<div className={cn(
						'flex gap-1 p-1 rounded-xl',
						isDark ? 'bg-slate-900/50' : 'bg-slate-100',
						'border',
						isDark ? 'border-violet-500/20' : 'border-violet-200/50'
					)}>
						<button
							onClick={() => onViewChange('card')}
							className={cn(
								'relative p-2 rounded-lg transition-all overflow-hidden',
								viewMode === 'card'
									? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg'
									: isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'
							)}
						>
							<Castle className="w-5 h-5" />
							{viewMode === 'card' && (
								<Flame className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 animate-pulse" />
							)}
						</button>
						<button
							onClick={() => onViewChange('list')}
							className={cn(
								'relative p-2 rounded-lg transition-all overflow-hidden',
								viewMode === 'list'
									? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white shadow-lg'
									: isDark ? 'text-slate-400 hover:text-violet-400' : 'text-slate-500 hover:text-violet-600'
							)}
						>
							<Scroll className="w-5 h-5" />
							{viewMode === 'list' && (
								<Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 animate-pulse" />
							)}
						</button>
					</div>
				</div>

				{/* Filters row */}
				<div className="flex flex-wrap gap-2 items-center">
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
									'relative px-3 py-2 rounded-xl font-semibold text-sm',
									'border-2 transition-all',
									'flex items-center gap-1.5',
									isSelected
										? ['bg-gradient-to-br text-white shadow-lg', colors.active]
										: [isDark ? 'bg-slate-800/50' : 'bg-white', colors.inactive, 'hover:scale-105']
								)}
							>
								<Icon className="w-4 h-4" />
								<span className="hidden sm:inline">{level.label}</span>
								{isSelected && (
									<Star className="absolute -top-1.5 -right-1.5 w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
								)}
							</button>
						)
					})}

					{/* Divider */}
					<div className={cn(
						'w-px h-8 mx-1',
						isDark ? 'bg-gradient-to-b from-transparent via-amber-500/30 to-transparent' : 'bg-gradient-to-b from-transparent via-amber-400/40 to-transparent'
					)} />

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
									'relative px-3 py-2 rounded-xl font-semibold text-sm',
									'border-2 transition-all',
									'flex items-center gap-1.5',
									isSelected
										? ['bg-gradient-to-br text-white shadow-lg', colors.active]
										: [isDark ? 'bg-slate-800/50' : 'bg-white', colors.inactive, 'hover:scale-105']
								)}
							>
								<Icon className="w-4 h-4" />
								<span className="hidden sm:inline">{status.label}</span>
								{isSelected && (
									<Star className="absolute -top-1.5 -right-1.5 w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
								)}
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
								? 'bg-slate-800/50 border-violet-500/30 text-violet-400 hover:bg-violet-500/20'
								: 'bg-white border-violet-200 text-violet-600 hover:bg-violet-50',
							'hover:rotate-180 hover:scale-110'
						)}
					>
						<RotateCcw className="w-5 h-5" />
					</button>
				</div>
			</div>
		</OrnateFrame>
	)
}

// ============================================
// PAGINATION - Gaming Style
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
		<div className="flex items-center justify-center gap-2 py-8 mt-6">
			{/* Previous button */}
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={cn(
					'group relative w-11 h-11 rounded-xl flex items-center justify-center',
					'transition-all duration-300',
					'border-2 overflow-hidden',
					currentPage === 1
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 hover:-translate-x-0.5',
					isDark
						? 'border-violet-500/30 bg-slate-800/80 text-violet-300'
						: 'border-violet-200 bg-white text-violet-600',
					currentPage !== 1 && (isDark
						? 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20'
						: 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-300/30')
				)}
			>
				<div className={cn(
					'absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent',
					'opacity-0 group-hover:opacity-100 transition-opacity'
				)} />
				<ChevronLeft className="w-5 h-5 relative z-10" />
			</button>

			{/* Page numbers in ornate frame */}
			<OrnateFrame isDark={isDark} glowColor="violet" className={cn(
				'px-3 py-1.5',
				isDark ? 'bg-slate-800/50' : 'bg-slate-50/80'
			)}>
				<div className="flex items-center gap-1.5">
					{getVisiblePages().map((page, index) => (
						page === '...' ? (
							<span
								key={`ellipsis-${index}`}
								className={cn(
									'w-8 text-center font-bold',
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
									'relative w-10 h-10 rounded-lg font-bold transition-all duration-300',
									'overflow-hidden',
									page === currentPage
										? [
											'bg-gradient-to-br from-violet-500 to-cyan-500 text-white',
											'shadow-lg shadow-violet-500/40',
											'scale-110 z-10',
											'ring-2 ring-white/20'
										]
										: [
											isDark ? 'text-slate-300' : 'text-slate-600',
											'hover:scale-105',
											isDark
												? 'hover:bg-violet-500/20 hover:text-violet-300'
												: 'hover:bg-violet-100 hover:text-violet-600'
										]
								)}
							>
								{page === currentPage && (
									<>
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
										<Star className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
									</>
								)}
								<span className="relative z-10">{page}</span>
							</button>
						)
					))}
				</div>
			</OrnateFrame>

			{/* Next button */}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={cn(
					'group relative w-11 h-11 rounded-xl flex items-center justify-center',
					'transition-all duration-300',
					'border-2 overflow-hidden',
					currentPage === totalPages
						? 'opacity-40 cursor-not-allowed'
						: 'hover:scale-110 hover:translate-x-0.5',
					isDark
						? 'border-violet-500/30 bg-slate-800/80 text-violet-300'
						: 'border-violet-200 bg-white text-violet-600',
					currentPage !== totalPages && (isDark
						? 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20'
						: 'hover:border-violet-400 hover:shadow-lg hover:shadow-violet-300/30')
				)}
			>
				<div className={cn(
					'absolute inset-0 bg-gradient-to-l from-violet-500/20 to-transparent',
					'opacity-0 group-hover:opacity-100 transition-opacity'
				)} />
				<ChevronRight className="w-5 h-5 relative z-10" />
			</button>
		</div>
	)
}

// ============================================
// EMPTY STATE - Gaming Style
// ============================================
const EmptyState = ({ isDark, t }) => (
	<OrnateFrame isDark={isDark} glowColor="amber" className={cn(
		'p-8 text-center',
		isDark
			? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90'
			: 'bg-gradient-to-br from-white to-slate-50'
	)}>
		{/* Rotating gem icon */}
		<div className={cn(
			'relative w-20 h-20 mx-auto mb-4',
		)}>
			<div className={cn(
				'absolute inset-0 rounded-2xl rotate-45',
				'bg-gradient-to-br from-violet-500/20 to-cyan-500/20',
				'animate-pulse'
			)} />
			<div className="absolute inset-2 rounded-xl rotate-45 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />
			<div className="absolute inset-0 flex items-center justify-center">
				<Gem className={cn('w-10 h-10', isDark ? 'text-violet-400' : 'text-violet-500')} />
			</div>
		</div>

		<h3 className={cn(
			'text-2xl font-black mb-2',
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

		{/* Decorative swords */}
		<div className="flex items-center justify-center gap-4 mt-4">
			<Sword className={cn('w-5 h-5 rotate-[-45deg]', isDark ? 'text-amber-500/30' : 'text-amber-400/40')} />
			<Shield className={cn('w-6 h-6', isDark ? 'text-amber-500/30' : 'text-amber-400/40')} />
			<Sword className={cn('w-5 h-5 rotate-45', isDark ? 'text-amber-500/30' : 'text-amber-400/40')} />
		</div>
	</OrnateFrame>
)

// ============================================
// MAIN COMPONENT
// ============================================
export default function SectionPageClient({
	initialMaterials = [],
	initialUserMaterialsStatus = [],
	section,
	learningLanguage,
}) {
	const t = useTranslations('materials')
	const locale = useLocale()
	const { userProfile, isUserAdmin, userLearningLanguage, changeLearningLanguage } = useUserContext()
	const { isDark } = useThemeMode()
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Local UI state
	const [viewMode, setViewMode] = useState('card')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)
	const [isMounted, setIsMounted] = useState(false)

	const currentPage = parseInt(searchParams.get('page') || '1', 10)
	const prevPathnameRef = useRef(pathname)

	// Synchronize context with server language at mount
	useEffect(() => {
		setIsMounted(true)
		if (learningLanguage && userLearningLanguage && learningLanguage !== userLearningLanguage) {
			changeLearningLanguage(learningLanguage)
		}
	}, [])

	// React Query: Fetch materials
	const { data: materials = [] } = useQuery({
		queryKey: ['materials', section, userLearningLanguage],
		queryFn: () => getMaterialsBySectionAction(userLearningLanguage, section),
		initialData: initialMaterials,
		enabled: !!userLearningLanguage,
		staleTime: 5 * 60 * 1000,
	})

	// React Query: User materials status
	const { data: userMaterialsStatus = [] } = useQuery({
		queryKey: ['userMaterialsStatus'],
		queryFn: () => initialUserMaterialsStatus,
		initialData: initialUserMaterialsStatus,
		staleTime: Infinity,
	})

	// Local filtering logic
	const filteredMaterials = useMemo(() => {
		let result = [...materials]

		if (selectedLevel && selectedLevel !== 'all') {
			result = result.filter(m => m.level === selectedLevel)
		}

		if (selectedStatus) {
			if (selectedStatus === 'not_studied') {
				const materialIdsWithStatus = userMaterialsStatus
					.filter(um => um.is_being_studied || um.is_studied)
					.map(um => um.material_id)
				result = result.filter(m => !materialIdsWithStatus.includes(m.id))
			} else {
				const materialIdsWithStatus = userMaterialsStatus
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
	}, [materials, selectedLevel, selectedStatus, searchTerm, userMaterialsStatus])

	// Pagination
	const itemsPerPage = viewMode === 'card' ? 10 : 10
	const numOfPages = Math.ceil(filteredMaterials.length / itemsPerPage)
	const safePage = Math.min(currentPage, Math.max(1, numOfPages)) || 1
	const sliceStart = (safePage - 1) * itemsPerPage
	const sliceEnd = safePage * itemsPerPage
	const displayedMaterials = filteredMaterials.slice(sliceStart, sliceEnd)

	const checkIfUserMaterialIsInMaterials = id => {
		return userMaterialsStatus.find(um => um.material_id === id)
	}

	const updatePage = (page) => {
		const params = new URLSearchParams(searchParams.toString())
		if (page === 1) params.delete('page')
		else params.set('page', page.toString())
		const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
		router.push(newUrl, { scroll: false })
	}

	const handleViewChange = view => setViewMode(view)
	const handleSearchChange = value => {
		setSearchTerm(value)
		updatePage(1)
	}
	const handleLevelChange = level => {
		setSelectedLevel(level)
		updatePage(1)
	}
	const handleStatusChange = status => {
		setSelectedStatus(status)
		updatePage(1)
	}
	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		updatePage(1)
	}

	// Restore filters from localStorage
	useEffect(() => {
		if (!section || section === 'books') return

		const prevPath = prevPathnameRef.current || ''
		const isReturningFromMaterial =
			prevPath.includes(`/materials/${section}/`) &&
			prevPath !== pathname &&
			pathname.includes(`/materials/${section}`) &&
			!pathname.includes(`/materials/${section}/`)

		const shouldRestore = !hasAppliedDefaultFilter || isReturningFromMaterial

		if (shouldRestore) {
			const storageKey = `materials_section_${section}_filters`
			const savedFilters = localStorage.getItem(storageKey)

			if (savedFilters) {
				try {
					const { level, status, search } = JSON.parse(savedFilters)
					setSelectedLevel(level ?? null)
					setSelectedStatus(status ?? null)
					setSearchTerm(search ?? '')
					setHasAppliedDefaultFilter(true)
				} catch (error) {
					logger.error('Error restoring filters:', error)
				}
			} else if (!hasAppliedDefaultFilter) {
				setHasAppliedDefaultFilter(true)
			}
		}

		prevPathnameRef.current = pathname
	}, [section, pathname, hasAppliedDefaultFilter])

	// Save filters to localStorage
	useEffect(() => {
		if (!section || section === 'books' || !hasAppliedDefaultFilter) return

		const storageKey = `materials_section_${section}_filters`
		const filtersToSave = {
			level: selectedLevel,
			status: selectedStatus,
			search: searchTerm,
		}
		localStorage.setItem(storageKey, JSON.stringify(filtersToSave))
	}, [section, selectedLevel, selectedStatus, searchTerm, hasAppliedDefaultFilter])

	// Apply default filters for authenticated users
	useEffect(() => {
		if (
			userProfile?.language_level &&
			section &&
			section !== 'books' &&
			!hasAppliedDefaultFilter
		) {
			const storageKey = `materials_section_${section}_filters`
			const savedFilters = localStorage.getItem(storageKey)

			if (!savedFilters) {
				const userLevel = userProfile.language_level
				setSelectedLevel(userLevel)
				setSelectedStatus('not_studied')
				setHasAppliedDefaultFilter(true)
			}
		}
	}, [userProfile?.language_level, section, hasAppliedDefaultFilter])

	if (!isMounted) return null

	return (
		<div className={cn(
			'min-h-screen pt-16 md:pt-24 pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
				: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-amber-50/30 to-slate-50'
		)}>
			{/* Magical particles background */}
			<MagicalParticles isDark={isDark} />

			<div className="relative max-w-7xl mx-auto px-4">
				{/* Epic Header */}
				<EpicHeader
					isDark={isDark}
					section={section}
					t={t}
					onBack={() => router.back()}
				/>

				{/* Filter Bar */}
				<FilterBar
					searchValue={searchTerm}
					onSearchChange={handleSearchChange}
					selectedLevel={selectedLevel}
					onLevelChange={handleLevelChange}
					selectedStatus={selectedStatus}
					onStatusChange={handleStatusChange}
					viewMode={viewMode}
					onViewChange={handleViewChange}
					onClear={handleClear}
					isDark={isDark}
					t={t}
					showNotStudiedFilter={true}
					showStudiedFilter={isUserAdmin}
				/>

				{/* Content */}
				{displayedMaterials.length === 0 ? (
					<EmptyState isDark={isDark} t={t} />
				) : viewMode === 'card' ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
						{displayedMaterials.map((material, index) => {
							if (section === 'books') {
								return (
									<div
										key={material.id}
										className="animate-in fade-in slide-in-from-bottom-4"
										style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
									>
										<BookCard
											book={material}
											checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
										/>
									</div>
								)
							}
							return (
								<div
									key={material.id}
									className="animate-in fade-in slide-in-from-bottom-4"
									style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
								>
									<SectionCard
										material={material}
										checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
									/>
								</div>
							)
						})}
					</div>
				) : (
					<MaterialsTable
						materials={displayedMaterials}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
						section={section}
					/>
				)}

				{/* Pagination */}
				{numOfPages > 1 && (
					<Pagination
						currentPage={safePage}
						totalPages={numOfPages}
						onPageChange={updatePage}
						isDark={isDark}
					/>
				)}
			</div>
		</div>
	)
}
