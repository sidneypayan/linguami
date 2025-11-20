const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../components/materials/MaterialsPageClient.jsx')
let content = fs.readFileSync(filePath, 'utf8')

console.log('Fixing handlers in MaterialsPageClient.jsx...\n')

// Remove old handlers and replace with new ones
const oldHandlers = `\t// Handlers
\tconst handleSearchChange = (value) => {
\t\tsetSearchTerm(value)
\t\tsetCurrentPage(1)
\t}

\tconst handleSectionChange = (section) => {
\t\tsetSelectedSection(section)
\t\tsetCurrentPage(1)
\t}

\tconst handleLevelChange = (level) => {
\t\tsetSelectedLevel(level)
\t\tsetCurrentPage(1)
\t}

\tconst handleStatusChange = (status) => {
\t\tsetSelectedStatus(status)
\t\tsetCurrentPage(1)
\t}

\tconst handleClear = () => {
\t\tsetSearchTerm('')
\t\tsetSelectedLevel(null)
\t\tsetSelectedStatus(null)
\t\tsetSelectedSection(null)
\t\tsetCurrentPage(1)
\t}

\tconst handleViewChange = (view) => {
\t\tsetViewMode(view)
\t\tsetCurrentPage(1)
\t}

\tconst handlePageChange = (page) => {
\t\tsetCurrentPage(page)
\t}`

const newHandlers = `\t// Handlers (using hook handlers from useMaterialsGlobalFilters)
\t// Only handleSectionChange is local since selectedSection is page-specific
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
\t}`

content = content.replace(oldHandlers, newHandlers)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Successfully updated handlers in MaterialsPageClient.jsx')
console.log('   - handleSearchChange, handleLevelChange, handleStatusChange, handlePageChange: from hook')
console.log('   - handleSectionChange: local (page-specific)')
console.log('   - handleClear: uses clearFilters() from hook')
console.log('   - handleViewChange: uses handleViewModeChange() from hook\n')
