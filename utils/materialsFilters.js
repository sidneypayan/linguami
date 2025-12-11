/**
 * Centralized materials filters management
 * Single source of truth for all materials filtering across the app
 */

const FILTERS_KEY = 'materials_filters'

/**
 * Get the current filters from localStorage
 * @returns {Object} Filters object with level, status, search, viewMode, section
 */
export function getMaterialsFilters() {
	try {
		const saved = localStorage.getItem(FILTERS_KEY)
		if (saved) {
			return JSON.parse(saved)
		}
	} catch (error) {
		console.error('Error reading materials filters:', error)
	}

	// Default filters
	return {
		level: null,
		status: null,
		search: '',
		viewMode: 'card',
		section: null,
	}
}

/**
 * Save filters to localStorage
 * @param {Object} filters - Filters to save
 */
export function saveMaterialsFilters(filters) {
	try {
		const current = getMaterialsFilters()
		const updated = { ...current, ...filters }
		localStorage.setItem(FILTERS_KEY, JSON.stringify(updated))
	} catch (error) {
		console.error('Error saving materials filters:', error)
	}
}

/**
 * Clear all filters (reset to defaults)
 */
export function clearMaterialsFilters() {
	try {
		localStorage.removeItem(FILTERS_KEY)
	} catch (error) {
		console.error('Error clearing materials filters:', error)
	}
}

/**
 * Migrate old filter keys to new unified structure
 * This runs once to consolidate old localStorage keys
 */
export function migrateLegacyFilters() {
	try {
		// Check if already migrated
		const newFilters = localStorage.getItem(FILTERS_KEY)
		if (newFilters) {
			return // Already using new structure
		}

		// Migrate from old keys
		const legacy = {
			displayMode: localStorage.getItem('materialsDisplayMode'),
			listFilters: localStorage.getItem('materials_list_filters'),
		}

		const migrated = {
			level: null,
			status: null,
			search: '',
			viewMode: 'card',
			section: null,
		}

		// Migrate display mode
		if (legacy.displayMode && (legacy.displayMode === 'category' || legacy.displayMode === 'list')) {
			migrated.viewMode = legacy.displayMode
		}

		// Migrate list filters
		if (legacy.listFilters) {
			try {
				const parsed = JSON.parse(legacy.listFilters)
				if (parsed.selectedLevel) migrated.level = parsed.selectedLevel
				if (parsed.selectedStatus) migrated.status = parsed.selectedStatus
				if (parsed.searchTerm) migrated.search = parsed.searchTerm
				if (parsed.selectedSection) migrated.section = parsed.selectedSection
				if (parsed.viewMode) migrated.viewMode = parsed.viewMode
			} catch (e) {
				console.error('Error parsing legacy filters:', e)
			}
		}

		// Save migrated filters
		localStorage.setItem(FILTERS_KEY, JSON.stringify(migrated))

		// Clean up old keys
		localStorage.removeItem('materialsDisplayMode')
		localStorage.removeItem('materials_list_filters')

		// Remove old section-specific keys
		const allKeys = Object.keys(localStorage)
		allKeys.forEach(key => {
			if (key.startsWith('materials_section_') && key.endsWith('_filters')) {
				localStorage.removeItem(key)
			}
		})

		console.log('✅ Migrated legacy materials filters to unified structure')
	} catch (error) {
		console.error('Error migrating legacy filters:', error)
	}
}
