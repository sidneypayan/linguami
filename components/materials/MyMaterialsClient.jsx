'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useQuery } from '@tanstack/react-query'
import SectionCard from '@/components/materials/SectionCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import MaterialsFilterBar from '@/components/materials/MaterialsFilterBar'
import { getUserMaterialsByLanguageAction } from '@/app/actions/materials'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { ArrowLeft, Gem, Sword, Shield } from 'lucide-react'

// ============================================
// EMPTY STATE
// ============================================
const EmptyState = ({ isDark, t }) => (
	<div className={cn(
		'relative rounded-2xl overflow-hidden p-8 text-center',
		'border-2',
		isDark ? 'border-amber-500/30 bg-slate-900/80' : 'border-amber-300/50 bg-white/90',
		!isDark && 'shadow-xl shadow-amber-300/30'
	)}>
		{/* Rotating gem icon */}
		<div className="relative w-20 h-20 mx-auto mb-4">
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
	</div>
)

const UserMaterials = ({ initialMaterials = [], learningLanguage }) => {
	const t = useTranslations('materials')
	const locale = useLocale()
	const router = useRouter()
	const { isDark } = useThemeMode()

	// React Query: Fetch user materials with refetching capability
	const { data: userMaterials = [], isLoading } = useQuery({
		queryKey: ['userMaterials', learningLanguage],
		queryFn: () => getUserMaterialsByLanguageAction(learningLanguage),
		initialData: initialMaterials,
		staleTime: 1000 * 60 * 5, // 5 minutes
	})

	// Local filter state
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [selectedSection, setSelectedSection] = useState(null)
	const [viewMode, setViewMode] = useState('card')

	// Filter materials (exclude books and book-chapters)
	const filteredMaterials = useMemo(() => {
		let filtered = userMaterials.filter(material =>
			material.section !== 'books' && material.section !== 'book-chapters'
		)

		// Search filter
		if (searchTerm) {
			const term = searchTerm.toLowerCase()
			filtered = filtered.filter(material =>
				material.title?.toLowerCase().includes(term)
			)
		}

		// Level filter
		if (selectedLevel) {
			filtered = filtered.filter(material => material.level === selectedLevel)
		}

		// Section filter
		if (selectedSection) {
			filtered = filtered.filter(material => material.section === selectedSection)
		}

		// Status filter
		if (selectedStatus) {
			if (selectedStatus === 'is_being_studied') {
				filtered = filtered.filter(material => material.is_being_studied === true)
			} else if (selectedStatus === 'is_studied') {
				filtered = filtered.filter(material => material.is_studied === true)
			}
		}

		return filtered
	}, [userMaterials, searchTerm, selectedLevel, selectedSection, selectedStatus])

	// Handlers
	const handleSearchChange = useCallback((value) => {
		setSearchTerm(value)
	}, [])

	const handleLevelChange = useCallback((level) => {
		setSelectedLevel(level)
	}, [])

	const handleStatusChange = useCallback((status) => {
		setSelectedStatus(status)
	}, [])

	const handleSectionChange = useCallback((section) => {
		setSelectedSection(section)
	}, [])

	const handleViewModeChange = useCallback((mode) => {
		setViewMode(mode)
	}, [])

	const clearFilters = useCallback(() => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		setSelectedSection(null)
	}, [])

	const checkIfUserMaterialIsInMaterials = id => {
		return userMaterials.find(material => material.id === id)
	}

	return (
		<div className={cn(
			'min-h-screen pt-16 md:pt-24 pb-24',
			isDark
				? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-violet-950/30 to-slate-950'
				: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-violet-50/30 to-slate-50'
		)}>
			<div className="relative max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="relative mb-6 md:mb-8">
					<div className="flex items-center gap-3 md:gap-4">
						{/* Back button */}
						<button
							onClick={() => router.back()}
							aria-label="back"
							className={cn(
								'p-2.5 md:p-3 rounded-xl transition-all duration-300',
								'border',
								isDark
									? 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/30'
									: 'bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border-violet-500/20',
								'text-violet-500',
								'hover:scale-105 hover:shadow-lg',
								isDark
									? 'hover:bg-gradient-to-br hover:from-violet-500/20 hover:to-cyan-500/20'
									: 'hover:bg-gradient-to-br hover:from-violet-500/10 hover:to-cyan-500/10'
							)}
						>
							<ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
						</button>

						{/* Title */}
						<div>
							<h1 className={cn(
								'text-2xl sm:text-3xl md:text-4xl font-bold',
								'bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent'
							)}>
								{t('myMaterialsTitle')}
							</h1>
							<p className={cn(
								'text-sm',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}>
								{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
							</p>
						</div>
					</div>
				</div>

				{/* Filter Bar */}
				<MaterialsFilterBar
					onSearchChange={handleSearchChange}
					onSectionChange={handleSectionChange}
					onLevelChange={handleLevelChange}
					onStatusChange={handleStatusChange}
					onClear={clearFilters}
					onViewChange={handleViewModeChange}
					searchValue={searchTerm}
					selectedSection={selectedSection}
					selectedLevel={selectedLevel}
					selectedStatus={selectedStatus}
					currentView={viewMode}
					showNotStudiedFilter={false}
					showSectionFilter={true}
					translationNamespace="materials"
				/>

				{/* Materials display */}
				{filteredMaterials.length === 0 ? (
					<EmptyState isDark={isDark} t={t} />
				) : viewMode === 'card' ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
						{filteredMaterials.map((material, index) => (
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
						))}
					</div>
				) : (
					<MaterialsTable
						materials={filteredMaterials}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}
			</div>
		</div>
	)
}

export default UserMaterials
