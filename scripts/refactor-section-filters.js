const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../components/materials/SectionPageClient.jsx')
let content = fs.readFileSync(filePath, 'utf8')

console.log('Refactoring SectionPageClient.jsx...')

// Step 1: Add import for the new hook
const importStatement = "import { useMaterialsGlobalFilters } from '@/hooks/materials/useMaterialsGlobalFilters'"
const importPosition = content.indexOf("import { getToastMessage } from '@/utils/toastMessages'")
if (importPosition !== -1 && !content.includes(importStatement)) {
  const lineEnd = content.indexOf('\n', importPosition)
  content = content.slice(0, lineEnd + 1) + importStatement + '\n' + content.slice(lineEnd + 1)
  console.log('✓ Added import for useMaterialsGlobalFilters')
}

// Step 2: Replace filter state declarations with the hook
const oldStateDeclarations = `  // Local UI state
  const [viewMode, setViewMode] = useState('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const prevPathnameRef = useRef(pathname)`

const newStateDeclarations = `  // Global filters hook (shared across all materials pages)
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
  })`

content = content.replace(oldStateDeclarations, newStateDeclarations)
console.log('✓ Replaced state declarations with useMaterialsGlobalFilters hook')

// Step 3: Remove old filter save/restore useEffects
// Remove restore filters effect
const restoreEffect = /  \/\/ Restore filters from localStorage on mount[\s\S]*?prevPathnameRef\.current = pathname\n  }\, \[section, pathname, hasAppliedDefaultFilter\]\)/
content = content.replace(restoreEffect, '')
console.log('✓ Removed restore filters useEffect (now handled by hook)')

// Remove save filters effect
const saveEffect = /  \/\/ Save filters to localStorage[\s\S]*?  }\, \[section, selectedLevel, selectedStatus, searchTerm, hasAppliedDefaultFilter\]\)/
content = content.replace(saveEffect, '')
console.log('✓ Removed save filters useEffect (now handled by hook)')

// Remove auto-update filters effect
const autoUpdateEffect = /  \/\/ Auto-update filters when user changes their language_level[\s\S]*?  }\, \[userProfile\?\.language_level, section\]\)/
content = content.replace(autoUpdateEffect, '')
console.log('✓ Removed auto-update useEffect (now handled by hook)')

// Remove default filters effect
const defaultFiltersEffect = /  \/\/ Apply default filters for authenticated users[\s\S]*?  }\, \[userProfile\?\.language_level, section, hasAppliedDefaultFilter\]\)/
content = content.replace(defaultFiltersEffect, '')
console.log('✓ Removed default filters useEffect (now handled by hook)')

// Step 4: Update handler functions
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

const newHandlers = `  // Handler for view mode change
  const handleViewChange = (view) => handleViewModeChange(view)

  // Handle clear to use hook's clearFilters
  const handleClearFilters = () => clearFilters()`

content = content.replace(oldHandlers, newHandlers)
console.log('✓ Updated handler functions to use hook handlers')

// Step 5: Update onClear prop in MaterialsFilterBar
content = content.replace('onClear={handleClear}', 'onClear={handleClearFilters}')
console.log('✓ Updated MaterialsFilterBar onClear prop')

// Write the updated content
fs.writeFileSync(filePath, content, 'utf8')
console.log('\n✅ Successfully refactored SectionPageClient.jsx')
console.log('   Now using useMaterialsGlobalFilters hook for unified filter management')
