const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../components/materials/MaterialsPageClient.jsx')
let content = fs.readFileSync(filePath, 'utf8')

console.log('Refactoring MaterialsPageClient.jsx...\n')

// 1. Add import
if (!content.includes('useMaterialsGlobalFilters')) {
  content = content.replace(
    "import { getMaterialsByLanguageAction } from '@/app/actions/materials'",
    "import { getMaterialsByLanguageAction } from '@/app/actions/materials'\nimport { useMaterialsGlobalFilters } from '@/hooks/materials/useMaterialsGlobalFilters'"
  )
  console.log('✓ Added import for useMaterialsGlobalFilters')
}

// 2. Replace filter state with hook (after the user_materials_status query)
const hookCode = `
\t// Global filters hook (shared across all materials pages)
\tconst {
\t\tsearchTerm,
\t\tselectedLevel,
\t\tselectedStatus,
\t\tviewMode,
\t\tcurrentPage,
\t\tisLoaded: areFiltersLoaded,
\t\thandleSearchChange,
\t\thandleLevelChange,
\t\thandleStatusChange,
\t\thandleViewModeChange,
\t\thandlePageChange,
\t\tclearFilters,
\t} = useMaterialsGlobalFilters({
\t\tuserLevel: userProfile?.language_level,
\t\tapplyDefaultLevel: displayMode === 'list',
\t})
`

// Find position after user_materials_status query
const insertPos = content.indexOf('\t// État local')
if (insertPos !== -1 && !content.includes('useMaterialsGlobalFilters({')) {
  content = content.slice(0, insertPos) + hookCode + '\n' + content.slice(insertPos)
  console.log('✓ Added useMaterialsGlobalFilters hook')
}

// 3. Remove old filter states from "État local" section
const statesToRemove = [
  '\tconst [hasAppliedDefaultFilter, setHasAppliedDefaultFilter] = useState(false)',
  '\tconst [searchTerm, setSearchTerm] = useState(\'\')',
  '\tconst [selectedLevel, setSelectedLevel] = useState(null)',
  '\tconst [selectedStatus, setSelectedStatus] = useState(null)',
  '\tconst [selectedSection, setSelectedSection] = useState(null)',
  '\tconst [viewMode, setViewMode] = useState(\'card\')',
  '\tconst [currentPage, setCurrentPage] = useState(1)',
]

statesToRemove.forEach(state => {
  content = content.replace(state + '\n', '')
})

// Add selectedSection back (it's local to this page, not global)
if (!content.includes('const [selectedSection, setSelectedSection]')) {
  content = content.replace(
    '\tconst [selectedCategory, setSelectedCategory] = useState(\'all\')',
    '\tconst [selectedCategory, setSelectedCategory] = useState(\'all\')\n\t// Section filter (local - derived from filters, not global)\n\tconst [selectedSection, setSelectedSection] = useState(null)'
  )
}

console.log('✓ Removed old filter states and kept selectedSection as local')

// 4. Remove userLevel constant (now comes from userProfile)
content = content.replace('\tconst userLevel = userProfile?.language_level || \'beginner\'\n\n', '')
console.log('✓ Removed userLevel constant')

// 5. Remove auto-update useEffect
const autoUpdateStart = content.indexOf('\t// Auto-update selectedLevel when user changes')
if (autoUpdateStart !== -1) {
  const autoUpdateEnd = content.indexOf('\t}, [userLevel, displayMode])', autoUpdateStart) + '\t}, [userLevel, displayMode])'.length + 1
  content = content.slice(0, autoUpdateStart) + content.slice(autoUpdateEnd)
  console.log('✓ Removed auto-update useEffect (handled by hook)')
}

// 6. Remove language change reset useEffect
const langResetStart = content.indexOf('\t// Réinitialiser les filtres quand la langue')
if (langResetStart !== -1) {
  const langResetEnd = content.indexOf('\t}, [userLearningLanguage, displayMode])', langResetStart) + '\t}, [userLearningLanguage, displayMode])'.length + 1
  content = content.slice(0, langResetStart) + content.slice(langResetEnd)
  console.log('✓ Removed language change reset useEffect')
}

// 7. Remove restore filters useEffect
const restoreStart = content.indexOf('\t// Restaurer les filtres depuis localStorage')
if (restoreStart !== -1) {
  const restoreEnd = content.indexOf('\tprevPathnameRef.current = pathname', restoreStart) + '\tprevPathnameRef.current = pathname'.length + 1
  const fullEnd = content.indexOf('\t}, [', restoreEnd) + content.slice(restoreEnd).indexOf('])') + 3
  content = content.slice(0, restoreStart) + content.slice(fullEnd)
  console.log('✓ Removed restore filters useEffect (handled by hook)')
}

// 8. Remove save filters useEffect
const saveStart = content.indexOf('\t// Sauvegarder les filtres dans localStorage')
if (saveStart !== -1) {
  const saveEnd = content.indexOf('\t])', saveStart) + 3
  content = content.slice(0, saveStart) + content.slice(saveEnd)
  console.log('✓ Removed save filters useEffect (handled by hook)')
}

// 9. Update handlers - replace the entire handlers section
const oldHandlersStart = content.indexOf('\t// Handlers\n\tconst handleSearchChange')
if (oldHandlersStart !== -1) {
  const oldHandlersEnd = content.indexOf('\tconst checkIfUserMaterialIsInMaterials', oldHandlersStart)

  const newHandlers = `\t// Handlers
\tconst handleSectionChange = (section) => {
\t\tsetSelectedSection(section)
\t\thandlePageChange(1)
\t}

\tconst handleClear = () => {
\t\tclearFilters()
\t\tsetSelectedSection(null)
\t}

\tconst handleViewChange = (view) => {
\t\thandleViewModeChange(view)
\t}

\t`

  content = content.slice(0, oldHandlersStart) + newHandlers + content.slice(oldHandlersEnd)
  console.log('✓ Updated handlers to use hook methods')
}

fs.writeFileSync(filePath, content, 'utf8')
console.log('\n✅ Successfully refactored MaterialsPageClient.jsx')
console.log('   Now using global filters with useMaterialsGlobalFilters hook\n')
