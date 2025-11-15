const fs = require('fs')
const path = require('path')

/**
 * Automatically fix common App Router migration issues
 */

function findPageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findPageFiles(filePath, fileList)
    } else if (file === 'page.js' || file === 'page.jsx') {
      fileList.push(filePath)
    }
  })

  return fileList
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  const originalContent = content
  const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/')
  const fixes = []

  // Fix 1: Remove Head import from next/head
  if (content.includes("import Head from 'next/head'")) {
    content = content.replace(
      /import Head from ['"]next\/head['"]\n?/g,
      "// Head removed - use metadata in App Router\n"
    )
    fixes.push('Removed Head import from next/head')
  }

  // Fix 2: Remove <Head>...</Head> JSX blocks
  // This regex matches <Head> opening tag, content, and </Head> closing tag
  const headRegex = /<Head>\s*[\s\S]*?<\/Head>\s*\n*/g
  if (headRegex.test(content)) {
    content = content.replace(headRegex, '')
    fixes.push('Removed <Head> component from JSX')
  }

  // Fix 3: Replace useRouter from next/router with next/navigation (only in 'use client' components)
  if (content.includes("'use client'") && content.includes("from 'next/router'")) {
    // Note: This is a simple replacement. The APIs are different, so manual review may be needed
    content = content.replace(
      /import\s*{\s*useRouter\s*}\s*from\s*['"]next\/router['"]/g,
      "import { useRouter } from 'next/navigation'"
    )
    fixes.push('Replaced next/router with next/navigation')
  }

  // Fix 4: Replace next-translate with next-intl (basic replacement)
  if (content.includes("from 'next-translate/useTranslation'")) {
    content = content.replace(
      /import useTranslation from ['"]next-translate\/useTranslation['"]/g,
      "import { useTranslations, useLocale } from 'next-intl'"
    )

    // Replace hook usage: const { t, lang } = useTranslation(...)
    // → const t = useTranslations(...) + const locale = useLocale()
    content = content.replace(
      /const\s*{\s*t\s*,\s*lang\s*}\s*=\s*useTranslation\s*\(\s*(['"]([^'"]+)['"])\s*\)/g,
      (match, namespace) => {
        return `const t = useTranslations(${namespace})\n\tconst locale = useLocale()`
      }
    )

    // Replace hook usage: const { t } = useTranslation(...)
    // → const t = useTranslations(...)
    content = content.replace(
      /const\s*{\s*t\s*}\s*=\s*useTranslation\s*\(\s*(['"]([^'"]+)['"])\s*\)/g,
      (match, namespace) => {
        return `const t = useTranslations(${namespace})`
      }
    )

    fixes.push('Replaced next-translate with next-intl')
  }

  // Only write if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8')
    return { fixed: true, file: relativePath, fixes }
  }

  return { fixed: false, file: relativePath, fixes: [] }
}

function main() {
  console.log('🔧 Fixing App Router issues automatically...\n')

  const appDir = path.join(process.cwd(), 'app')

  if (!fs.existsSync(appDir)) {
    console.error('❌ No app directory found')
    process.exit(1)
  }

  const files = findPageFiles(appDir)
  console.log(`Found ${files.length} page files\n`)

  let fixedCount = 0
  const results = []

  files.forEach(file => {
    const result = fixFile(file)
    if (result.fixed) {
      fixedCount++
      results.push(result)
    }
  })

  if (results.length === 0) {
    console.log('✅ No issues to fix! All pages are already App Router compatible.')
    return
  }

  console.log(`✅ Fixed ${fixedCount} file(s):\n`)

  results.forEach(({ file, fixes }) => {
    console.log(`📄 ${file}`)
    fixes.forEach(fix => {
      console.log(`   ✓ ${fix}`)
    })
    console.log('')
  })

  console.log('=' .repeat(60))
  console.log(`Total: ${fixedCount} file(s) fixed`)
  console.log('=' .repeat(60))
  console.log('\n💡 Tip: Run "node scripts/check-app-router-issues.js" to verify')
}

main()
