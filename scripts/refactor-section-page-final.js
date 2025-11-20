const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../components/materials/SectionPageClient.jsx')
let content = fs.readFileSync(filePath, 'utf8')

console.log('Refactoring SectionPageClient.jsx...\n')

// 1. Add import
if (!content.includes('useMaterialsGlobalFilters')) {
  content = content.replace(
    "import { logger } from '@/utils/logger'",
    "import { logger } from '@/utils/logger'\nimport { useMaterialsGlobalFilters } from '@/hooks/materials/useMaterialsGlobalFilters'"
  )
  console.log('✓ Added import for useMaterialsGlobalFilters')
}

// 2. Replace filter state with hook
const hookCode = `  // Global filters hook (shared across all materials pages)
  const {
    searchTerm,
    selectedLevel,
    selectedStatus,
    viewMode,
    currentPage,
    isLoaded: areFiltersLoaded,
    handleSearchChange,
    handleLevelChange,
    handleStatusChange,
    handleViewModeChange,
    handlePageChange,
    clearFilters,
  } = useMaterialsGlobalFilters({
    userLevel: userProfile?.language_level,
    applyDefaultLevel: section !== 'books', // Don't apply default level for books
  })
`

// Find and replace old state declarations
const oldState = `  // Local UI state
  const [viewMode, setViewMode] = useState('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const prevPathnameRef = useRef(pathname)`

content = content.replace(oldState, hookCode)
console.log('✓ Replaced local state with useMaterialsGlobalFilters hook')

// 3. Remove all filter-related useEffects
// Remove restore filters effect
let restoreStart = content.indexOf('  // Restore filters from localStorage')
if (restoreStart !== -1) {
  let restoreEnd = content.indexOf('  }, [section, pathname, hasAppliedDefaultFilter])', restoreStart)
  if (restoreEnd !== -1) {
    restoreEnd += '  }, [section, pathname, hasAppliedDefaultFilter])'.length + 1
    content = content.slice(0, restoreStart) + content.slice(restoreEnd)
    console.log('✓ Removed restore filters useEffect (handled by hook)')
  }
}

// Remove save filters effect
let saveStart = content.indexOf('  // Save filters to localStorage')
if (saveStart !== -1) {
  let saveEnd = content.indexOf('  }, [section, selectedLevel, selectedStatus, searchTerm, hasAppliedDefaultFilter])', saveStart)
  if (saveEnd !== -1) {
    saveEnd += '  }, [section, selectedLevel, selectedStatus, searchTerm, hasAppliedDefaultFilter])'.length + 1
    content = content.slice(0, saveStart) + content.slice(saveEnd)
    console.log('✓ Removed save filters useEffect (handled by hook)')
  }
}

// Remove auto-update effect
let autoUpdateStart = content.indexOf('  // Auto-update filters when user changes')
if (autoUpdateStart !== -1) {
  let autoUpdateEnd = content.indexOf('  }, [userProfile?.language_level, section])', autoUpdateStart)
  if (autoUpdateEnd !== -1) {
    autoUpdateEnd += '  }, [userProfile?.language_level, section])'.length + 1
    content = content.slice(0, autoUpdateStart) + content.slice(autoUpdateEnd)
    console.log('✓ Removed auto-update useEffect (handled by hook)')
  }
}

// Remove apply default filters effect
let defaultStart = content.indexOf('  // Apply default filters for authenticated users')
if (defaultStart !== -1) {
  let defaultEnd = content.indexOf('  }, [userProfile?.language_level, section, hasAppliedDefaultFilter])', defaultStart)
  if (defaultEnd !== -1) {
    defaultEnd += '  }, [userProfile?.language_level, section, hasAppliedDefaultFilter])'.length + 1
    content = content.slice(0, defaultStart) + content.slice(defaultEnd)
    console.log('✓ Removed apply default filters useEffect (handled by hook)')
  }
}

// 4. Update handlers
const oldHandlers = `  // Handlers
  const handleViewChange = view => setViewMode(view)
  const handleSearchChange = value => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to page 1 on search
  }
  const handleLevelChange = level => {
    setSelectedLevel(level)
    setCurrentPage(1)
  }
  const handleStatusChange = status => {
    setSelectedStatus(status)
    setCurrentPage(1)
  }
  const handleClear = () => {
    setSearchTerm('')
    setSelectedLevel(null)
    setSelectedStatus(null)
    setCurrentPage(1)
  }`

const newHandlers = `  // Handlers (using global filters from useMaterialsGlobalFilters hook)
  const handleViewChange = (view) => handleViewModeChange(view)

  const handleClearFilters = () => clearFilters()`

content = content.replace(oldHandlers, newHandlers)
console.log('✓ Updated handlers to use hook methods')

// 5. Update onClear prop
content = content.replace('onClear={handleClear}', 'onClear={handleClearFilters}')
console.log('✓ Updated MaterialsFilterBar onClear prop')

fs.writeFileSync(filePath, content, 'utf8')
console.log('\n✅ Successfully refactored SectionPageClient.jsx')
console.log('   Now using global filters with useMaterialsGlobalFilters hook\n')
