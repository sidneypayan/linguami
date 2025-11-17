/**
 * Script to replace console.* calls with logger.* throughout the codebase
 *
 * Usage: node scripts/replace-console-logs.js
 *
 * This script:
 * 1. Finds all .js/.jsx files with console.* calls
 * 2. Adds logger import if not present
 * 3. Replaces console.log → logger.log
 * 4. Replaces console.error → logger.error
 * 5. Replaces console.warn → logger.warn
 * 6. Replaces console.info → logger.info
 * 7. Creates a backup of modified files
 */

const fs = require('fs')
const path = require('path')

// Directories to process
const DIRS_TO_PROCESS = ['components', 'pages', 'app', 'lib', 'features']

// Recursively find all JS/JSX files
function findJsFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList
  }

  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        findJsFiles(filePath, fileList)
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Check if file has console calls
function hasConsoleCalls(content) {
  return /console\.(log|error|warn|info)\(/.test(content)
}

// Check if file already imports logger
function hasLoggerImport(content) {
  return /import\s+\{\s*logger\s*\}\s+from\s+['"]@\/utils\/logger['"]/.test(content) ||
         /const\s+\{\s*logger\s*\}\s*=\s*require\(['"]@\/utils\/logger['"]\)/.test(content)
}

// Add logger import at the top of the file (after other imports)
function addLoggerImport(content) {
  // Find the last import statement
  const lines = content.split('\n')
  let lastImportIndex = -1

  for (let i = 0; i < lines.length; i++) {
    if (/^import\s+.*?from\s+['"].*?['"];?\s*$/.test(lines[i])) {
      lastImportIndex = i
    }
  }

  if (lastImportIndex !== -1) {
    // Insert after the last import
    lines.splice(lastImportIndex + 1, 0, "import { logger } from '@/utils/logger'")
    return lines.join('\n')
  } else {
    // No imports found, add at the very top (after 'use client'/'use server' if present)
    if (lines[0] && (lines[0].includes("'use client'") || lines[0].includes('"use client"') ||
                     lines[0].includes("'use server'") || lines[0].includes('"use server"'))) {
      lines.splice(1, 0, "import { logger } from '@/utils/logger'")
      return lines.join('\n')
    } else {
      return "import { logger } from '@/utils/logger'\n\n" + content
    }
  }
}

// Replace console.* with logger.*
function replaceConsoleCalls(content) {
  return content
    .replace(/console\.log\(/g, 'logger.log(')
    .replace(/console\.error\(/g, 'logger.error(')
    .replace(/console\.warn\(/g, 'logger.warn(')
    .replace(/console\.info\(/g, 'logger.info(')
}

// Process a single file
function processFile(filePath) {
  // Read file
  const content = fs.readFileSync(filePath, 'utf-8')

  // Check if it has console calls
  if (!hasConsoleCalls(content)) {
    return { processed: false }
  }

  console.log(`Processing: ${filePath}`)

  // Backup original
  const backupPath = filePath + '.backup'
  fs.writeFileSync(backupPath, content)

  let newContent = content

  // Add logger import if needed
  if (!hasLoggerImport(newContent)) {
    newContent = addLoggerImport(newContent)
  }

  // Replace console calls
  const beforeReplace = newContent
  newContent = replaceConsoleCalls(newContent)

  // Count replacements
  const consoleMatches = beforeReplace.match(/console\.(log|error|warn|info)\(/g) || []
  const replacements = consoleMatches.length

  // Write modified file
  fs.writeFileSync(filePath, newContent)

  console.log(`  ✅ Modified (${replacements} replacements)`)
  return { processed: true, replacements }
}

// Main execution
function main() {
  console.log('🔍 Finding all JS/JSX files...\n')

  // Find all files
  let allFiles = []
  DIRS_TO_PROCESS.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles = allFiles.concat(findJsFiles(dir))
    }
  })

  console.log(`Found ${allFiles.length} JS/JSX files`)
  console.log(`Checking for console.* calls...\n`)

  let totalProcessed = 0
  let totalReplacements = 0
  let processedFiles = []

  allFiles.forEach(file => {
    const result = processFile(file)
    if (result.processed) {
      totalProcessed++
      totalReplacements += result.replacements || 0
      processedFiles.push(file)
    }
  })

  console.log(`\n📊 Summary:`)
  console.log(`   Total files scanned: ${allFiles.length}`)
  console.log(`   Files with console calls: ${totalProcessed}`)
  console.log(`   Total replacements: ${totalReplacements}`)

  if (totalProcessed > 0) {
    console.log(`\n📝 Modified files:`)
    processedFiles.forEach(f => console.log(`   - ${f}`))
    console.log(`\n💾 Backups saved with .backup extension`)
    console.log(`\n✅ Done! Review changes and delete .backup files if satisfied.`)
    console.log(`\n🗑️  To remove all backups: node -e "require('fs').readdirSync('.').filter(f=>f.endsWith('.backup')).forEach(f=>require('fs').unlinkSync(f))"`)
  } else {
    console.log(`\n✅ No files to process!`)
  }
}

// Run script
main()
