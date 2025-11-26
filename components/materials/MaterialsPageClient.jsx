'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import MaterialsGrid from '@/components/materials/MaterialsGrid'
import MaterialsFilter from '@/components/materials/MaterialsFilter'
import MaterialsFilterBar from '@/components/materials/MaterialsFilterBar'
import SectionCard from '@/components/materials/SectionCard'
import MaterialsTable from '@/components/materials/MaterialsTable'
import Pagination from '@/components/layouts/Pagination'
import { materials_ru, materials_fr, materials_en } from '@/utils/constants'
import { Box, Typography, Container, useTheme, Button } from '@mui/material'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useUserContext } from '@/context/user'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { School, Museum, MenuBook, ViewModule, ViewList as ViewListIcon } from '@mui/icons-material'
import { logger } from '@/utils/logger'
import { getMaterialsByLanguageAction, getBooksByLanguageAction } from '@/app/actions/materials'
import BookCard from '@/components/materials/BookCard'

const Material = ({ initialMaterials = [], initialUserMaterialsStatus = [], learningLanguage = 'fr' }) => {
	const t = useTranslations('materials')
	const locale = useLocale()
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const { userProfile, isUserAdmin, userLearningLanguage, changeLearningLanguage } = useUserContext()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const prevPathnameRef = useRef(pathname)
	const prevLearningLanguageRef = useRef(userLearningLanguage)

	// Synchronize context with server language at mount to avoid double fetch
	useEffect(() => {
		// If server fetched with a different language than context has, sync context to match server
		// This ensures initialData is used and prevents unnecessary refetch
		if (learningLanguage && userLearningLanguage && learningLanguage !== userLearningLanguage) {
			changeLearningLanguage(learningLanguage)
		}
	}, []) // Only run once at mount

	// React Query: Fetch materials based on user's learning language
	// When userLearningLanguage changes, React Query will automatically refetch
	const { data: allLoadedMaterials = [] } = useQuery({
		queryKey: ['allMaterials', userLearningLanguage],
		queryFn: () => getMaterialsByLanguageAction(userLearningLanguage),
		// Always use SSR data - React Query will invalidate cache if queryKey changes
		initialData: learningLanguage === userLearningLanguage ? initialMaterials : undefined,
		enabled: !!userLearningLanguage,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// React Query: Fetch books for the audiobooks filter
	const { data: allBooks = [] } = useQuery({
		queryKey: ['allBooks', userLearningLanguage],
		queryFn: () => getBooksByLanguageAction(userLearningLanguage),
		enabled: !!userLearningLanguage,
		staleTime: 5 * 60 * 1000, // 5 minutes
	})

	// React Query: Hydrate user materials status
	const { data: user_materials_status = [] } = useQuery({
		queryKey: ['userMaterialsStatus'],
		queryFn: () => initialUserMaterialsStatus,
		initialData: initialUserMaterialsStatus,
		staleTime: Infinity,
	})

	// État local
	const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)
	const [materials, setMaterials] = useState([])
	const [practice, setPractice] = useState([])
	const [culture, setCulture] = useState([])
	const [literature, setLiterature] = useState([])

	// Mode d'affichage principal : 'category' (actuel) ou 'list' (filtres avancés)
	const [displayMode, setDisplayMode] = useState('category')
	const [isDisplayModeLoaded, setIsDisplayModeLoaded] = useState(false)

	// État pour le filtre de catégorie (mode category)
	const [selectedCategory, setSelectedCategory] = useState('all')

	// États pour le mode liste
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [selectedSection, setSelectedSection] = useState(null)
	const [viewMode, setViewMode] = useState('card')

	// Read page from URL query params
	const currentPage = parseInt(searchParams.get('page') || '1', 10)

	// Pagination
	const materialsPerPage = 8

	// Niveau de l'utilisateur
	const userLevel = userProfile?.language_level || 'beginner'

	// Réinitialiser les filtres quand la langue d'apprentissage change
	useEffect(() => {
		const prevLang = prevLearningLanguageRef.current

		// Only reset filters if language actually changed (not on initial load)
		if (prevLang && userLearningLanguage && prevLang !== userLearningLanguage && displayMode === 'list') {
			// Clear filters to avoid showing empty results with filters from another language
			setSearchTerm('')
			setSelectedLevel(null)
			setSelectedStatus(null)
			setSelectedSection(null)
			updatePage(1)
		}

		prevLearningLanguageRef.current = userLearningLanguage
	}, [userLearningLanguage, displayMode])

	// Charger la préférence depuis localStorage après l'hydratation
	useEffect(() => {
		const saved = localStorage.getItem('materialsDisplayMode')
		if (saved && (saved === 'category' || saved === 'list')) {
			setDisplayMode(saved)
		}
		setIsDisplayModeLoaded(true)
	}, [])

	// Sauvegarder la préférence de mode d'affichage dans le localStorage
	useEffect(() => {
		if (isDisplayModeLoaded) {
			localStorage.setItem('materialsDisplayMode', displayMode)
		}
	}, [displayMode, isDisplayModeLoaded])

	// Charger les sections (pour le mode catégorie)
	useEffect(() => {
		if (!userLearningLanguage) return

		let selectedMaterials = []
		if (userLearningLanguage === 'ru') {
			selectedMaterials = materials_ru
		} else if (userLearningLanguage === 'fr') {
			selectedMaterials = materials_fr
		} else if (userLearningLanguage === 'en') {
			selectedMaterials = materials_en
		} else {
			selectedMaterials = materials_fr
		}

		setMaterials(selectedMaterials)
	}, [userLearningLanguage])

	// Restaurer les filtres depuis localStorage quand on revient sur la page en mode liste
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
			const storageKey = 'materials_list_filters'

			try {
				const savedFilters = localStorage.getItem(storageKey)
				if (savedFilters) {
					const filters = JSON.parse(savedFilters)

					if (filters.searchTerm !== undefined) setSearchTerm(filters.searchTerm)
					if (filters.selectedLevel !== undefined) setSelectedLevel(filters.selectedLevel)
					if (filters.selectedStatus !== undefined) setSelectedStatus(filters.selectedStatus)
					if (filters.selectedSection !== undefined) setSelectedSection(filters.selectedSection)
					if (filters.viewMode !== undefined) setViewMode(filters.viewMode)
					// Note: currentPage is now persisted in URL params, not localStorage
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

	// Sauvegarder les filtres dans localStorage à chaque changement
	useEffect(() => {
		if (displayMode !== 'list') return
		if (!hasAppliedDefaultFilter) return

		const storageKey = 'materials_list_filters'
		const filters = {
			searchTerm,
			selectedLevel,
			selectedStatus,
			selectedSection,
			viewMode,
			// Note: currentPage is now persisted in URL params, not localStorage
		}

		try {
			localStorage.setItem(storageKey, JSON.stringify(filters))
		} catch (error) {
			logger.error('Error saving filters to localStorage:', error)
		}
	}, [
		displayMode,
		searchTerm,
		selectedLevel,
		selectedStatus,
		selectedSection,
		viewMode,
		hasAppliedDefaultFilter,
	])

	// Check if we're filtering on books (audiobooks)
	const isBookFilter = selectedSection === 'book-chapters'

	// Filtrage des matériaux pour le mode liste
	const filteredMaterials = useMemo(() => {
		if (displayMode !== 'list') return []
		// Skip materials filtering when showing books
		if (isBookFilter) return []

		let result = [...allLoadedMaterials]

		// Filtre par section
		if (selectedSection) {
			result = result.filter(m => m.section === selectedSection)
		}

		// Filtre par niveau
		if (selectedLevel && selectedLevel !== 'all') {
			result = result.filter(m => m.level === selectedLevel)
		}

		// Filtre par statut
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

		// Filtre par recherche
		if (searchTerm) {
			result = result.filter(m =>
				m.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		return result
	}, [displayMode, allLoadedMaterials, selectedSection, selectedLevel, selectedStatus, searchTerm, user_materials_status, isBookFilter])

	// Filtrage des livres pour le mode liste (quand on filtre sur audiobooks)
	const filteredBooks = useMemo(() => {
		if (displayMode !== 'list') return []
		if (!isBookFilter) return []

		let result = [...allBooks]

		// Filtre par niveau
		if (selectedLevel && selectedLevel !== 'all') {
			result = result.filter(b => b.level === selectedLevel)
		}

		// Filtre par recherche
		if (searchTerm) {
			result = result.filter(b =>
				b.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		return result
	}, [displayMode, allBooks, selectedLevel, searchTerm, isBookFilter])

	// Filtrer les sections par catégorie de média (mode category)
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

	// Charger practice/culture/literature pour le mode catégorie
	useEffect(() => {
		if (displayMode !== 'category') return
		if (!materials || materials.length === 0) return

		const practiceList = materials.filter(m => m.newCategory === 'practice')
		const cultureList = materials.filter(m => m.newCategory === 'culture')
		const literatureList = materials.filter(m => m.newCategory === 'literature')

		setPractice(practiceList)
		setCulture(cultureList)
		setLiterature(literatureList)
	}, [materials, displayMode])

	// Pagination pour le mode liste (handles both materials and books)
	const itemsToDisplay = isBookFilter ? filteredBooks : filteredMaterials
	const numOfPages = Math.ceil(itemsToDisplay.length / materialsPerPage)
	const sliceStart = (currentPage - 1) * materialsPerPage
	const sliceEnd = sliceStart + materialsPerPage
	const paginatedItems = itemsToDisplay.slice(sliceStart, sliceEnd)

	// Helper to update URL with page number
	const updatePage = (page) => {
		const params = new URLSearchParams(searchParams.toString())
		if (page === 1) {
			params.delete('page')
		} else {
			params.set('page', page.toString())
		}
		const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
		router.push(newUrl, { scroll: false })
	}

	// Handlers
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

	// Determine content based on display mode
	const renderContent = () => {
		if (displayMode === 'category') {
			// Mode catégorie - affichage par sections
			return (
				<>
					{/* Filtre par catégorie de média */}
					<MaterialsFilter
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
					/>

					{/* Message si aucun matériau trouvé */}
					{filteredPractice.length === 0 && filteredCulture.length === 0 && filteredLiterature.length === 0 && (
						<Box
							sx={{
								py: 8,
								textAlign: 'center',
							}}>
							<Typography
								variant="h6"
								sx={{
									color: isDark ? '#94a3b8' : '#64748b',
									fontWeight: 600,
									mb: 1,
								}}>
								{t('noMaterialsFound')}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: isDark ? '#64748b' : '#94a3b8',
								}}>
								{t('noMaterialsInCategory')}
							</Typography>
						</Box>
					)}

					{/* Section Practice */}
					{filteredPractice.length > 0 && (
						<Box id='practice' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 8 } }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: { xs: 1.5, md: 2 },
									mb: { xs: 3, md: 4 },
									pb: 2,
									borderBottom: '2px solid',
									borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
								}}>
								<Box
									sx={{
										width: { xs: 48, md: 56 },
										height: { xs: 48, md: 56 },
										borderRadius: 3,
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
									}}>
									<School sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, color: '#8b5cf6' }} />
								</Box>
								<Typography
									variant='h3'
									sx={{
										fontWeight: 800,
										fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
										background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}>
									{t('practiceCategory')}
								</Typography>
							</Box>
							<MaterialsGrid materials={filteredPractice} />
						</Box>
					)}

					{/* Section Culture */}
					{filteredCulture.length > 0 && (
						<Box id='culture' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 8 } }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: { xs: 1.5, md: 2 },
									mb: { xs: 3, md: 4 },
									pb: 2,
									borderBottom: '2px solid',
									borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
								}}>
								<Box
									sx={{
										width: { xs: 48, md: 56 },
										height: { xs: 48, md: 56 },
										borderRadius: 3,
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
									}}>
									<Museum sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, color: '#8b5cf6' }} />
								</Box>
								<Typography
									variant='h3'
									sx={{
										fontWeight: 800,
										fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
										background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}>
									{t('cultureCategory')}
								</Typography>
							</Box>
							<MaterialsGrid materials={filteredCulture} />
						</Box>
					)}

					{/* Section Literature */}
					{filteredLiterature.length > 0 && (
						<Box id='literature' sx={{ scrollMarginTop: '100px', mb: { xs: 4, md: 8 } }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: { xs: 1.5, md: 2 },
									mb: { xs: 3, md: 4 },
									pb: 2,
									borderBottom: '2px solid',
									borderImage: 'linear-gradient(90deg, rgba(139, 92, 246, 0.5) 0%, transparent 100%) 1',
								}}>
								<Box
									sx={{
										width: { xs: 48, md: 56 },
										height: { xs: 48, md: 56 },
										borderRadius: 3,
										background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
										backdropFilter: 'blur(10px)',
										border: '1px solid rgba(139, 92, 246, 0.3)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)',
									}}>
									<MenuBook sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, color: '#8b5cf6' }} />
								</Box>
								<Typography
									variant='h3'
									sx={{
										fontWeight: 800,
										fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
										background: 'linear-gradient(135deg, #1e1b4b 0%, #8b5cf6 60%, #06b6d4 100%)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
									}}>
									{t('literatureCategory')}
								</Typography>
							</Box>
							<MaterialsGrid materials={filteredLiterature} />
						</Box>
					)}
				</>
			)
		} else {
			// Mode liste avec filtres avancés
			return (
				<>
					<MaterialsFilterBar
						onSearchChange={handleSearchChange}
						onSectionChange={handleSectionChange}
						onLevelChange={handleLevelChange}
						onStatusChange={handleStatusChange}
						onClear={handleClear}
						onViewChange={handleViewChange}
						searchValue={searchTerm}
						selectedSection={selectedSection}
						selectedLevel={selectedLevel}
						selectedStatus={selectedStatus}
						currentView={viewMode}
						showNotStudiedFilter={true}
						showSectionFilter={true}
						translationNamespace='materials'
					/>

					{itemsToDisplay.length === 0 ? (
						<Box
							sx={{
								textAlign: 'center',
								py: 8,
								px: 2,
							}}>
							<Typography
								variant='h5'
								sx={{
									color: '#718096',
									mb: 2,
									fontWeight: 600,
								}}>
								{t('noMaterialsFound')}
							</Typography>
							<Typography
								variant='body1'
								sx={{
									color: '#a0aec0',
								}}>
								{t('noMaterialsInCategory')}
							</Typography>
						</Box>
					) : isBookFilter ? (
						/* Display books when filtering on audiobooks */
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: {
									xs: 'repeat(2, 1fr)',
									sm: 'repeat(3, 1fr)',
									md: 'repeat(4, 1fr)',
									lg: 'repeat(5, 1fr)',
								},
								rowGap: { xs: 1.5, md: 3 },
								columnGap: { xs: 1.5, md: 3 },
								mx: { xs: -0.5, sm: 0 },
							}}>
							{paginatedItems.map(book => (
								<BookCard
									key={book.id}
									book={book}
									checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(book.id)}
								/>
							))}
						</Box>
					) : viewMode === 'card' ? (
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: {
									xs: 'repeat(2, 1fr)',
									sm: 'repeat(3, 1fr)',
									md: 'repeat(4, 1fr)',
									lg: 'repeat(5, 1fr)',
								},
								rowGap: { xs: 1.5, md: 3 },
								columnGap: { xs: 1.5, md: 3 },
								mx: { xs: -0.5, sm: 0 },
							}}>
							{paginatedItems.map(material => (
								<SectionCard
									key={material.id}
									material={material}
									checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials(material.id)}
								/>
							))}
						</Box>
					) : (
						<MaterialsTable
							materials={paginatedItems}
							checkIfUserMaterialIsInMaterials={checkIfUserMaterialIsInMaterials}
						/>
					)}

					{/* Pagination */}
					{itemsToDisplay.length > materialsPerPage && (
						<Pagination
							currentPage={currentPage}
							numOfPages={numOfPages}
							onPageChange={updatePage}
						/>
					)}
				</>
			)
		}
	}

	return (
		<Container sx={{ pt: { xs: '3.75rem', lg: '6rem' }, pb: { xs: 2.5, md: 4 } }}>
			{/* Header */}
			<Box sx={{ mb: { xs: 2, md: 4 }, textAlign: 'center' }}>
				{/* Title - Hidden on mobile */}
				<Typography
					variant='h3'
					sx={{
						display: { xs: 'none', sm: 'block' },
						fontWeight: 700,
						fontSize: { sm: '2.5rem', md: '3rem' },
						background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						mb: 1.5,
					}}>
					{t('pagetitle')}
				</Typography>
				{/* Description - Hidden on mobile */}
				<Typography
					variant='body1'
					sx={{
						display: { xs: 'none', sm: 'block' },
						color: isDark ? '#cbd5e1' : '#64748b',
						fontSize: { sm: '1rem' },
						maxWidth: '600px',
						mx: 'auto',
						mb: 3,
					}}>
					{t('description')}
				</Typography>

				{/* Toggle button */}
				<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
					<Button
						onClick={() => setDisplayMode('category')}
						variant={displayMode === 'category' ? 'contained' : 'outlined'}
						startIcon={<ViewModule />}
						sx={{
							borderRadius: '10px',
							textTransform: 'none',
							px: 2.5,
							py: 1,
							...(displayMode === 'category'
								? {
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									color: 'white',
									border: 'none',
								}
								: {
									color: isDark ? '#cbd5e1' : '#475569',
									borderColor: 'rgba(139, 92, 246, 0.3)',
								}),
						}}>
						{t('categoryView')}
					</Button>
					<Button
						onClick={() => setDisplayMode('list')}
						variant={displayMode === 'list' ? 'contained' : 'outlined'}
						startIcon={<ViewListIcon />}
						sx={{
							borderRadius: '10px',
							textTransform: 'none',
							px: 2.5,
							py: 1,
							...(displayMode === 'list'
								? {
									background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
									color: 'white',
									border: 'none',
								}
								: {
									color: isDark ? '#cbd5e1' : '#475569',
									borderColor: 'rgba(139, 92, 246, 0.3)',
								}),
						}}>
						{t('listView')}
					</Button>
				</Box>
			</Box>

			{/* Content */}
			{renderContent()}
		</Container>
	)
}

export default Material
