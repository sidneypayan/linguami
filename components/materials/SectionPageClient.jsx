'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useQuery } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { getMaterialsBySectionAction } from '@/app/actions/materials'
import SectionCard from '@/components/materials/SectionCard'
import BookCard from '@/components/materials/BookCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import MaterialsFilterBar from '@/components/materials/MaterialsFilterBar'
import { logger } from '@/utils/logger'
import { getMaterialsFilters, saveMaterialsFilters } from '@/utils/materialsFilters'
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Star,
	Sword,
	Shield,
	Gem,
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
		violet: isDark ? '' : 'shadow-violet-300/30',
		amber: isDark ? '' : 'shadow-amber-300/30',
		cyan: isDark ? '' : 'shadow-cyan-300/30',
	}

	const borderColors = {
		violet: isDark ? 'border-violet-500/30' : 'border-violet-300/50',
		amber: isDark ? 'border-amber-500/30' : 'border-amber-300/50',
		cyan: isDark ? 'border-cyan-500/30' : 'border-cyan-300/50',
	}

	return (
		<div className={cn(
			'relative rounded-2xl overflow-visible',
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
// EPIC HEADER - Unified with material page
// ============================================
const EpicHeader = ({ isDark, title, onBack }) => {
	return (
		<div className={cn(
			'pt-20 md:pt-24 pb-4 md:pb-6',
			'border-b',
			isDark ? 'border-violet-500/20 bg-slate-950' : 'border-violet-200/50 bg-white'
		)}>
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex items-center gap-4 md:gap-6">
					{/* Back button with shield style */}
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
							!isDark && 'shadow-lg shadow-violet-300/30',
							'group-hover:border-violet-400 transition-colors'
						)} />
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

					{/* Title */}
					<div className="flex-1">
						<h1 className={cn(
							'text-xl sm:text-2xl md:text-3xl font-black',
							'bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent',
							'[text-shadow:0_4px_12px_rgba(139,92,246,0.3)]'
						)}>
							{title}
						</h1>
					</div>
				</div>
			</div>
		</div>
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

			{/* Page numbers */}
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
		// Remove locale from pathname to avoid duplication when using i18n router
		const pathnameWithoutLocale = pathname.replace(`/${locale}`, '')
		const newUrl = params.toString() ? `${pathnameWithoutLocale}?${params.toString()}` : pathnameWithoutLocale
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

	// Restore filters from localStorage (global filters)
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
			try {
				const filters = getMaterialsFilters()
				if (filters) {
					setSelectedLevel(filters.level ?? null)
					setSelectedStatus(filters.status ?? null)
					setSearchTerm(filters.search ?? '')
					setHasAppliedDefaultFilter(true)
				} else if (!hasAppliedDefaultFilter) {
					setHasAppliedDefaultFilter(true)
				}
			} catch (error) {
				logger.error('Error restoring filters:', error)
			}
		}

		prevPathnameRef.current = pathname
	}, [section, pathname, hasAppliedDefaultFilter])

	// Save filters to localStorage (global filters)
	useEffect(() => {
		if (!section || section === 'books' || !hasAppliedDefaultFilter) return

		saveMaterialsFilters({
			level: selectedLevel,
			status: selectedStatus,
			search: searchTerm,
		})
	}, [section, selectedLevel, selectedStatus, searchTerm, hasAppliedDefaultFilter])

	// Apply default filters for authenticated users
	useEffect(() => {
		if (
			userProfile?.language_level &&
			section &&
			section !== 'books' &&
			!hasAppliedDefaultFilter
		) {
			const filters = getMaterialsFilters()

			// Only apply defaults if no filters are saved yet
			if (!filters.level && !filters.status) {
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
			'min-h-screen pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
				: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-amber-50/30 to-slate-50'
		)}>
			{/* Epic Header */}
			<EpicHeader
				isDark={isDark}
				title={section && t(section)}
				onBack={() => router.back()}
			/>

			<div className="relative max-w-7xl mx-auto px-4 pt-6 md:pt-8">
				{/* Filter Bar */}
				<MaterialsFilterBar
					searchValue={searchTerm}
					onSearchChange={handleSearchChange}
					selectedLevel={selectedLevel}
					onLevelChange={handleLevelChange}
					selectedStatus={selectedStatus}
					onStatusChange={handleStatusChange}
					currentView={viewMode}
					onViewChange={handleViewChange}
					onClear={handleClear}
					showNotStudiedFilter={true}
					showStudiedFilter={isUserAdmin}
					showSectionFilter={false}
					translationNamespace="materials"
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
