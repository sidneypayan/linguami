const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../components/materials/MaterialsPageClient.jsx')
let content = fs.readFileSync(filePath, 'utf8')

console.log('Refactoring MaterialsPageClient.jsx...')

// Step 1: Add import for the new hook
const importStatement = "import { useMaterialsGlobalFilters } from '@/hooks/materials/useMaterialsGlobalFilters'"
const importPosition = content.indexOf("import { getMaterialsByLanguageAction } from '@/app/actions/materials'")
if (importPosition !== -1 && !content.includes(importStatement)) {
  const lineEnd = content.indexOf('\n', importPosition)
  content = content.slice(0, lineEnd + 1) + importStatement + '\n' + content.slice(lineEnd + 1)
  console.log('✓ Added import for useMaterialsGlobalFilters')
}

// Step 2: Replace filter state declarations with the hook
const oldStateDeclarations = `	// État local
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
	const [currentPage, setCurrentPage] = useState(1)`

const newStateDeclarations = `	// Global filters hook (shared across all materials pages)
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
		applyDefaultLevel: true,
	})

	// État local
	const [materials, setMaterials] = useState([])
	const [practice, setPractice] = useState([])
	const [culture, setCulture] = useState([])
	const [literature, setLiterature] = useState([])

	// Mode d'affichage principal : 'category' (actuel) ou 'list' (filtres avancés)
	const [displayMode, setDisplayMode] = useState('category')
	const [isDisplayModeLoaded, setIsDisplayModeLoaded] = useState(false)

	// État pour le filtre de catégorie (mode category)
	const [selectedCategory, setSelectedCategory] = useState('all')

	// Section filter (derived from URL, not part of global filters)
	const [selectedSection, setSelectedSection] = useState(null)`

content = content.replace(oldStateDeclarations, newStateDeclarations)
console.log('✓ Replaced state declarations with useMaterialsGlobalFilters hook')

// Step 3: Remove old filter save/restore useEffects
// Remove the auto-update useEffect
const autoUpdateEffect = /\/\/ Auto-update selectedLevel[\s\S]*?\}\, \[userLevel, displayMode\]\)/
content = content.replace(autoUpdateEffect, '')
console.log('✓ Removed auto-update useEffect (now handled by hook)')

// Remove language change reset effect
const langResetEffect = /\/\/ Réinitialiser les filtres quand la langue[\s\S]*?\}\, \[userLearningLanguage, displayMode\]\)/
content = content.replace(langResetEffect, '')
console.log('✓ Removed language reset useEffect')

// Remove restore filters effect
const restoreEffect = /\/\/ Restaurer les filtres depuis localStorage[\s\S]*?prevPathnameRef\.current = pathname\n\t}\, \[displayMode, allLoadedMaterials\.length, hasAppliedDefaultFilter, pathname, userLevel\]\)/
content = content.replace(restoreEffect, '')
console.log('✓ Removed restore filters useEffect (now handled by hook)')

// Remove save filters effect
const saveEffect = /\/\/ Sauvegarder les filtres dans localStorage[\s\S]*?hasAppliedDefaultFilter,\n\t\]\)/
content = content.replace(saveEffect, '')
console.log('✓ Removed save filters useEffect (now handled by hook)')

// Step 4: Update handler functions
const oldHandlers = `	// Handlers
	const handleSearchChange = (value) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}

	const handleSectionChange = (section) => {
		setSelectedSection(section)
		setCurrentPage(1)
	}

	const handleLevelChange = (level) => {
		setSelectedLevel(level)
		setCurrentPage(1)
	}

	const handleStatusChange = (status) => {
		setSelectedStatus(status)
		setCurrentPage(1)
	}

	const handleClear = () => {
		setSearchTerm('')
		setSelectedLevel(null)
		setSelectedStatus(null)
		setSelectedSection(null)
		setCurrentPage(1)
	}

	const handleViewChange = (view) => {
		setViewMode(view)
		setCurrentPage(1)
	}

	const handlePageChange = (page) => {
		setCurrentPage(page)
	}`

const newHandlers = `	// Handlers for section filter (not part of global filters)
	const handleSectionChange = (section) => {
		setSelectedSection(section)
		handlePageChange(1)
	}

	const handleClear = () => {
		clearFilters()
		setSelectedSection(null)
	}

	const handleViewChange = (view) => {
		handleViewModeChange(view)
	}`

content = content.replace(oldHandlers, newHandlers)
console.log('✓ Updated handler functions to use hook handlers')

// Write the updated content
fs.writeFileSync(filePath, content, 'utf8')
console.log('\n✅ Successfully refactored MaterialsPageClient.jsx')
console.log('   Now using useMaterialsGlobalFilters hook for unified filter management')
