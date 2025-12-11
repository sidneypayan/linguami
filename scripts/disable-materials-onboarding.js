const fs = require('fs');

const materialsClientPath = 'C:/Users/Sidney/Documents/linguami/components/materials/MaterialsPageClient.jsx';
let content = fs.readFileSync(materialsClientPath, 'utf8');

// Comment out the onboarding modal check
content = content.replace(
  /\/\/ Check for first visit to show onboarding modal\s*const hasSeenOnboarding = localStorage\.getItem\('materials_onboarding_completed'\)\s*if \(!hasSeenOnboarding\) \{\s*setShowOnboardingModal\(true\)\s*\}/,
  `// TEMPORAIRE: Onboarding désactivé car leçons de la méthode pas encore publiées
		// Check for first visit to show onboarding modal
		// const hasSeenOnboarding = localStorage.getItem('materials_onboarding_completed')
		// if (!hasSeenOnboarding) {
		// 	setShowOnboardingModal(true)
		// }`
);

fs.writeFileSync(materialsClientPath, content, 'utf8');
console.log('✅ Onboarding modal disabled on materials page');
