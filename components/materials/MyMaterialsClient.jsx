'use client'

import { useState, useMemo, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import SectionCard from '@/components/materials/SectionCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import MaterialsFilterBar from '@/components/materials/MaterialsFilterBar'
import { getUserMaterialsByLanguageAction } from '@/app/actions/materials'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

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
		<>
			{/* Header Section - Desktop only */}
			<div
				className={cn(
					'hidden lg:block',
					'pt-16 md:pt-24 pb-3 md:pb-4',
					'border-b border-violet-500/15',
					isDark ? 'bg-slate-900' : 'bg-white'
				)}
			>
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
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
						<div>
							<h1
								className={cn(
									'text-2xl sm:text-3xl font-bold mb-1',
									'bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent'
								)}
							>
								{t('myMaterialsTitle')}
							</h1>
							<p className="text-slate-500 text-sm sm:text-[0.9375rem]">
								{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 pt-16 lg:pt-4 pb-4 md:pb-8">
				{/* Mobile Title - Hidden on desktop */}
				<div
					className={cn(
						'flex lg:hidden items-center justify-between',
						'mb-4 pb-3 border-b border-violet-500/15'
					)}
				>
					<div>
						<h1
							className={cn(
								'text-2xl font-bold mb-1',
								'bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent'
							)}
						>
							{t('myMaterialsTitle')}
						</h1>
						<p className="text-slate-500 text-sm">
							{filteredMaterials.length} {filteredMaterials.length <= 1 ? t('material') : t('materials')}
						</p>
					</div>
				</div>

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
					<div className="text-center py-12 px-4">
						<h2
							className={cn(
								'text-xl font-semibold mb-3',
								isDark ? 'text-slate-400' : 'text-slate-500'
							)}
						>
							{t('noMaterialsFound')}
						</h2>
						<p className={cn(
							'text-base',
							isDark ? 'text-slate-500' : 'text-slate-400'
						)}>
							{t('noMaterialsInCategory')}
						</p>
					</div>
				) : viewMode === 'card' ? (
					<div
						className={cn(
							'grid gap-4 md:gap-6',
							'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
						)}
					>
						{filteredMaterials.map(material => (
							<SectionCard
								key={material.id}
								material={material}
								checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
							/>
						))}
					</div>
				) : (
					<MaterialsTable
						materials={filteredMaterials}
						checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
					/>
				)}
			</div>
		</>
	)
}

export default UserMaterials
