const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// Ajouter un console.log dans le useMemo de filteredMaterialsForList
content = content.replace(
  /(const filteredMaterialsForList = useMemo\(\(\) => \{)/,
  `$1
		console.log('🔍 DEBUG filteredMaterialsForList:', {
			displayMode,
			selectedSection,
			allLoadedMaterials_count: allLoadedMaterials.length,
			materials_from_redux_count: materials_from_redux.length,
			searchTerm,
			selectedLevel,
			selectedStatus,
			userLearningLanguage
		});`
)

// Ajouter un console.log avant le return pour voir le résultat du filtre
content = content.replace(
  /(return filtered[\s]*}\), \[materials_from_redux, allLoadedMaterials)/,
  `console.log('🔍 DEBUG filtered count:', filtered.length);
		$1`
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Debug ajouté sur page materials!')
