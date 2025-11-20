import { useState, useEffect, useCallback } from 'react'
import { logger } from '@/utils/logger'

/**
 * Global filters hook for all materials pages
 * Uses a single localStorage key for consistent filtering across the entire site
 *
 * Storage key: 'materialsGlobalFilters'
 * Structure: {
 *   searchTerm: string,
 *   selectedLevel: string | null,
 *   selectedStatus: string | null,
 *   viewMode: 'card' | 'table',
 *   currentPage: number
 * }
 */

const STORAGE_KEY = 'materialsGlobalFilters'

const DEFAULT_FILTERS = {
	searchTerm: '',
	selectedLevel: null,
	selectedStatus: null,
	viewMode: 'card',
	currentPage: 1,
}

export function useMaterialsGlobalFilters(options = {}) {
	const { userLevel = null, applyDefaultLevel = false } = options

	// State
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedLevel, setSelectedLevel] = useState(null)
	const [selectedStatus, setSelectedStatus] = useState(null)
	const [viewMode, setViewMode] = useState('card')
	const [currentPage, setCurrentPage] = useState(1)
	const [isLoaded, setIsLoaded] = useState(false)

	// Load filters from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY)
			if (saved) {
				const filters = JSON.parse(saved)
				setSearchTerm(filters.searchTerm ?? DEFAULT_FILTERS.searchTerm)
				setSelectedLevel(filters.selectedLevel ?? DEFAULT_FILTERS.selectedLevel)
				setSelectedStatus(filters.selectedStatus ?? DEFAULT_FILTERS.selectedStatus)
				setViewMode(filters.viewMode ?? DEFAULT_FILTERS.viewMode)
				setCurrentPage(filters.currentPage ?? DEFAULT_FILTERS.currentPage)
			} else if (applyDefaultLevel && userLevel) {
				// Apply default level filter for new users
				setSelectedLevel(userLevel)
			}
		} catch (error) {
			logger.error('[useMaterialsGlobalFilters] Error loading filters:', error)
		} finally {
			setIsLoaded(true)
		}
	}, []) // Only run once on mount

	// Auto-update level filter when user changes their level in settings
	useEffect(() => {
		if (isLoaded && userLevel && selectedLevel !== userLevel) {
			// Only auto-update if no other filters are active
			const hasOtherFilters = searchTerm || selectedStatus
			if (!hasOtherFilters) {
				setSelectedLevel(userLevel)
			}
		}
	}, [userLevel, isLoaded])

	// Save filters to localStorage whenever they change
	useEffect(() => {
		if (!isLoaded) return

		const filters = {
			searchTerm,
			selectedLevel,
			selectedStatus,
			viewMode,
			currentPage,
		}

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
		} catch (error) {
			logger.error('[useMaterialsGlobalFilters] Error saving filters:', error)
		}
	}, [searchTerm, selectedLevel, selectedStatus, viewMode, currentPage, isLoaded])

	// Handlers with page reset
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

	const handleViewModeChange = useCallback((mode) => {
		setViewMode(mode)
		setCurrentPage(1)
	}, [])

	const handlePageChange = useCallback((page) => {
		setCurrentPage(page)
	}, [])

	const clearFilters = useCallback(() => {
		setSearchTerm(DEFAULT_FILTERS.searchTerm)
		setSelectedLevel(DEFAULT_FILTERS.selectedLevel)
		setSelectedStatus(DEFAULT_FILTERS.selectedStatus)
		setCurrentPage(DEFAULT_FILTERS.currentPage)
		// Keep viewMode as is (user preference)
	}, [])

	const resetToDefaults = useCallback(() => {
		setSearchTerm(DEFAULT_FILTERS.searchTerm)
		setSelectedLevel(DEFAULT_FILTERS.selectedLevel)
		setSelectedStatus(DEFAULT_FILTERS.selectedStatus)
		setViewMode(DEFAULT_FILTERS.viewMode)
		setCurrentPage(DEFAULT_FILTERS.currentPage)
		localStorage.removeItem(STORAGE_KEY)
	}, [])

	return {
		// State
		searchTerm,
		selectedLevel,
		selectedStatus,
		viewMode,
		currentPage,
		isLoaded,

		// Setters (for direct control if needed)
		setSearchTerm,
		setSelectedLevel,
		setSelectedStatus,
		setViewMode,
		setCurrentPage,

		// Handlers (recommended - includes page reset)
		handleSearchChange,
		handleLevelChange,
		handleStatusChange,
		handleViewModeChange,
		handlePageChange,
		clearFilters,
		resetToDefaults,
	}
}
