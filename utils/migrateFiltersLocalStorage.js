/**
 * Migrate old localStorage filter keys to the new unified global filters system
 *
 * Old keys:
 * - materials_list_filters
 * - materials_section_{section}_filters (multiple keys, one per section)
 *
 * New key:
 * - materialsGlobalFilters
 *
 * This function should be called once on app initialization to migrate existing users
 */

export function migrateFiltersLocalStorage() {
  if (typeof window === 'undefined') return

  try {
    // Check if migration has already been done
    const migrationDone = localStorage.getItem('filtersLocalStorageMigrated')
    if (migrationDone === 'true') {
      return
    }

    console.log('[Migration] Starting localStorage filters migration...')

    // Check if new global filters already exist
    const existingGlobalFilters = localStorage.getItem('materialsGlobalFilters')

    if (!existingGlobalFilters) {
      // Try to migrate from materials_list_filters first (most recent/relevant)
      const listFilters = localStorage.getItem('materials_list_filters')

      if (listFilters) {
        try {
          const filters = JSON.parse(listFilters)

          // Create new global filters structure
          const globalFilters = {
            searchTerm: filters.searchTerm || '',
            selectedLevel: filters.selectedLevel || null,
            selectedStatus: filters.selectedStatus || null,
            viewMode: filters.viewMode || 'card',
            currentPage: 1, // Always reset to page 1 on migration
          }

          localStorage.setItem('materialsGlobalFilters', JSON.stringify(globalFilters))
          console.log('[Migration] Migrated from materials_list_filters')
        } catch (error) {
          console.error('[Migration] Error parsing materials_list_filters:', error)
        }
      } else {
        // If no list filters, try to find the most recent section filter
        const allKeys = Object.keys(localStorage)
        const sectionFilterKeys = allKeys.filter(key =>
          key.startsWith('materials_section_') && key.endsWith('_filters')
        )

        if (sectionFilterKeys.length > 0) {
          // Use the first section filter found
          const sectionFilters = localStorage.getItem(sectionFilterKeys[0])

          try {
            const filters = JSON.parse(sectionFilters)

            const globalFilters = {
              searchTerm: filters.search || '',
              selectedLevel: filters.level || null,
              selectedStatus: filters.status || null,
              viewMode: 'card',
              currentPage: 1,
            }

            localStorage.setItem('materialsGlobalFilters', JSON.stringify(globalFilters))
            console.log(`[Migration] Migrated from ${sectionFilterKeys[0]}`)
          } catch (error) {
            console.error(`[Migration] Error parsing ${sectionFilterKeys[0]}:`, error)
          }
        }
      }
    }

    // Clean up old filter keys
    const keysToRemove = []

    // Remove materials_list_filters
    if (localStorage.getItem('materials_list_filters')) {
      keysToRemove.push('materials_list_filters')
    }

    // Remove all materials_section_*_filters keys
    const allKeys = Object.keys(localStorage)
    const sectionFilterKeys = allKeys.filter(key =>
      key.startsWith('materials_section_') && key.endsWith('_filters')
    )
    keysToRemove.push(...sectionFilterKeys)

    // Remove old flag if it exists
    if (localStorage.getItem('materialsDefaultFilterApplied')) {
      keysToRemove.push('materialsDefaultFilterApplied')
    }

    // Perform cleanup
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`[Migration] Removed old key: ${key}`)
    })

    // Mark migration as complete
    localStorage.setItem('filtersLocalStorageMigrated', 'true')
    console.log('[Migration] ✅ localStorage filters migration complete')

    if (keysToRemove.length > 0) {
      console.log(`[Migration] Cleaned up ${keysToRemove.length} old filter key(s)`)
    }
  } catch (error) {
    console.error('[Migration] Error during localStorage migration:', error)
  }
}

/**
 * Reset filters migration (for testing purposes)
 */
export function resetFiltersMigration() {
  if (typeof window === 'undefined') return

  localStorage.removeItem('filtersLocalStorageMigrated')
  console.log('[Migration] Migration flag reset')
}
