import { useState, useEffect, useMemo, useCallback } from 'react'

/**
 * Custom hook to manage material filtering and display preferences
 * Centralizes localStorage management and filter logic
 *
 * @param {Array} allMaterials - All available materials
 * @param {Array} userMaterialsStatus - User's materials status (being_studied, studied)
 * @param {string} userLevel - User's language level
 * @returns {Object} Filter state and handlers
 */
export function useMaterialFilters(allMaterials = [], userMaterialsStatus = [], userLevel = 'beginner') {
	// Display mode: 'category' (sections view) or 'list' (filtered list view)
	const [displayMode, setDisplayMode] = useState('category')
	const [isDisplayModeLoaded, setIsDisplayModeLoaded] = useState(false)

	// List view filters
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [selectedSection, setSelectedSection] = useState(null)
	const [viewMode, setViewMode] = useState('card') // 'card' or 'table'
	const [currentPage, setCurrentPage] = useState(1)

	// Load display mode from localStorage (client-side only)
	useEffect(() => {
		const savedMode = localStorage.getItem('materialsDisplayMode')
		if (savedMode && (savedMode === 'category' || savedMode === 'list')) {
			setDisplayMode(savedMode)
		}
		setIsDisplayModeLoaded(true)
	}, [])

	// Save display mode to localStorage
	useEffect(() => {
		if (isDisplayModeLoaded) {
			localStorage.setItem('materialsDisplayMode', displayMode)
		}
	}, [displayMode, isDisplayModeLoaded])

	// Load filters from localStorage when entering list mode
	useEffect(() => {
		if (displayMode === 'list' && isDisplayModeLoaded) {
			const savedFilters = localStorage.getItem('materialsFilters')
			if (savedFilters) {
				try {
					const filters = JSON.parse(savedFilters)
					setSearchTerm(filters.searchTerm || '')
					setSelectedLevel(filters.selectedLevel || null)
					setSelectedStatus(filters.selectedStatus || null)
					setSelectedSection(filters.selectedSection || null)
					setViewMode(filters.viewMode || 'card')
					setCurrentPage(filters.currentPage || 1)
				} catch (error) {
					// Invalid JSON, ignore
				}
			}
		}
	}, [displayMode, isDisplayModeLoaded])

	// Save filters to localStorage
	useEffect(() => {
		if (displayMode === 'list' && isDisplayModeLoaded) {
			const filters = {
				searchTerm,
				selectedLevel,
				selectedStatus,
				selectedSection,
				viewMode,
				currentPage,
			}
			localStorage.setItem('materialsFilters', JSON.stringify(filters))
		}
	}, [searchTerm, selectedLevel, selectedStatus, selectedSection, viewMode, currentPage, displayMode, isDisplayModeLoaded])

	// Apply default filter (user's level) on first load in list mode
	useEffect(() => {
		const hasApplied = localStorage.getItem('materialsDefaultFilterApplied')
		if (displayMode === 'list' && !hasApplied && userLevel) {
			setSelectedLevel(userLevel)
			localStorage.setItem('materialsDefaultFilterApplied', 'true')
		}
	}, [displayMode, userLevel])

	// Filter materials
	const filteredMaterials = useMemo(() => {
		if (displayMode !== 'list') return []

		let filtered = [...allMaterials]

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
		if (selectedStatus && userMaterialsStatus.length > 0) {
			const statusMap = new Map(
				userMaterialsStatus.map(status => [status.material_id, status])
			)

			filtered = filtered.filter(material => {
				const status = statusMap.get(material.id)
				if (selectedStatus === 'being_studied') {
					return status?.is_being_studied === true
				}
				if (selectedStatus === 'studied') {
					return status?.is_studied === true
				}
				if (selectedStatus === 'not_studied') {
					return !status || (!status.is_being_studied && !status.is_studied)
				}
				return true
			})
		}

		return filtered
	}, [allMaterials, userMaterialsStatus, searchTerm, selectedLevel, selectedSection, selectedStatus, displayMode])

	// Handlers
	const handleSearchChange = useCallback((value) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}, [])

	const handleLevelChange = useCallback((level) => {
		setSelectedLevel(level)
		setCurrentPage(1)
	}, [])

	const handleStatusChange = useCallback((status) => {
		setSelectedStatus(status)
		setCurrentPage(1)
	}, [])

	const handleSectionChange = useCallback((section) => {
		setSelectedSection(section)
		setCurrentPage(1)
	}, [])

	const handleViewModeChange = useCallback((mode) => {
		setViewMode(mode)
	}, [])

	const handlePageChange = useCallback((page) => {
		setCurrentPage(page)
	}, [])

	const handleDisplayModeChange = useCallback((mode) => {
		setDisplayMode(mode)
		if (mode === 'category') {
			// Reset filters when switching back to category mode
			setSearchTerm('')
			setSelectedLevel(null)
			setSelectedStatus(null)
			setSelectedSection(null)
			setCurrentPage(1)
		}
	}, [])

	const clearFilters = useCallback(() => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		setSelectedSection(null)
		setCurrentPage(1)
		localStorage.removeItem('materialsFilters')
	}, [])

	return {
		// State
		displayMode,
		isDisplayModeLoaded,
		searchTerm,
		selectedLevel,
		selectedStatus,
		selectedSection,
		viewMode,
		currentPage,
		filteredMaterials,

		// Handlers
		handleSearchChange,
		handleLevelChange,
		handleStatusChange,
		handleSectionChange,
		handleViewModeChange,
		handlePageChange,
		handleDisplayModeChange,
		clearFilters,
	}
}
