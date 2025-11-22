const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'context', 'user.js')
let content = fs.readFileSync(filePath, 'utf8')

// Vérifier si la validation existe déjà
if (content.includes('🛡️ VALIDATION: Bloquer si learning_language === spoken_language')) {
  console.log('✅ La validation est déjà présente dans le fichier')
  process.exit(0)
}

const lines = content.split('\n')
let modified = false

for (let i = 0; i < lines.length; i++) {
  // Chercher la ligne où commence changeLearningLanguage
  if (lines[i].includes('const changeLearningLanguage = useCallback(')) {
    // Chercher "if (user) {" dans les lignes suivantes
    for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
      if (lines[j].includes('if (user) {') && !lines[j - 1].includes('VALIDATION')) {
        // Insérer le code de validation avant cette ligne
        const indent = '\t\t\t\t'
        const validationLines = [
          `${indent}// 🛡️ VALIDATION: Bloquer si learning_language === spoken_language`,
          `${indent}const spokenLang = user`,
          `${indent}\t? userProfile?.spoken_language`,
          `${indent}\t: (typeof window !== 'undefined' ? localStorage.getItem('spoken_language') : null) || router?.locale`,
          ``,
          `${indent}if (learningLanguage === spokenLang) {`,
          `${indent}\tconst errorMessage = router?.locale === 'fr'`,
          `${indent}\t\t? 'Vous ne pouvez pas apprendre votre langue maternelle'`,
          `${indent}\t\t: router?.locale === 'ru'`,
          `${indent}\t\t? 'Вы не можете учить свой родной язык'`,
          `${indent}\t\t: 'You cannot learn your native language'`,
          `${indent}\ttoast.error(errorMessage)`,
          `${indent}\treturn // Bloquer silencieusement`,
          `${indent}}`,
          ``
        ]

        lines.splice(j, 0, ...validationLines)
        modified = true
        console.log(`✅ Validation insérée à la ligne ${j}`)
        break
      }
    }

    if (modified) {
      // Chercher et mettre à jour les dépendances
      for (let k = i; k < Math.min(i + 50, lines.length); k++) {
        if (lines[k].trim() === '[user]' && lines[k - 1].includes(',')) {
          lines[k] = lines[k].replace('[user]', '[user, userProfile?.spoken_language, router?.locale]')
          console.log(`✅ Dépendances mises à jour à la ligne ${k}`)
          break
        }
      }
      break
    }
  }
}

if (modified) {
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
  console.log('✅ Fichier sauvegardé: context/user.js')
  console.log('🛡️ La fonction bloquera maintenant toute tentative de définir learning_language === spoken_language')
} else {
  console.log('❌ Impossible de trouver l\'emplacement d\'insertion')
  console.log('Le fichier nécessite une modification manuelle')
}
