const fs = require('fs')
const path = require('path')

/**
 * Check for common App Router migration issues
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

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const issues = []
  const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/')

  // Check 1: Head from next/head (doesn't work in App Router)
  if (content.includes("from 'next/head'") || content.includes('from "next/head"')) {
    issues.push({
      type: 'ERROR',
      message: 'Uses Head from next/head (not compatible with App Router)',
      suggestion: 'Remove Head component or use generateMetadata()'
    })
  }

  // Check 2: useRouter from next/router (wrong import for App Router)
  if (content.includes("from 'next/router'") || content.includes('from "next/router"')) {
    if (!content.includes("'use client'")) {
      issues.push({
        type: 'ERROR',
        message: 'Uses next/router without "use client" directive',
        suggestion: 'Add "use client" or use next/navigation'
      })
    } else {
      issues.push({
        type: 'WARNING',
        message: 'Uses next/router (should use next/navigation in App Router)',
        suggestion: 'Replace with useRouter from next/navigation'
      })
    }
  }

  // Check 3: getServerSideProps or getStaticProps (Pages Router only)
  if (content.includes('getServerSideProps') || content.includes('getStaticProps')) {
    issues.push({
      type: 'ERROR',
      message: 'Contains getServerSideProps/getStaticProps (Pages Router only)',
      suggestion: 'Convert to Server Component or use API routes'
    })
  }

  // Check 4: next-translate usage (should be next-intl in App Router)
  if (content.includes("from 'next-translate") || content.includes('from "next-translate')) {
    issues.push({
      type: 'WARNING',
      message: 'Uses next-translate (should use next-intl in App Router)',
      suggestion: 'Replace with useTranslations from next-intl'
    })
  }

  // Check 5: Document access in non-client component
  if (!content.includes("'use client'") && (content.includes('document.') || content.includes('window.'))) {
    issues.push({
      type: 'ERROR',
      message: 'Accesses document/window without "use client"',
      suggestion: 'Add "use client" directive at the top'
    })
  }

  return { file: relativePath, issues }
}

function main() {
  console.log('🔍 Checking App Router pages for common issues...\n')

  const appDir = path.join(process.cwd(), 'app')

  if (!fs.existsSync(appDir)) {
    console.error('❌ No app directory found')
    process.exit(1)
  }

  const files = findPageFiles(appDir)
  console.log(`Found ${files.length} page files\n`)

  let totalIssues = 0
  const fileIssues = []

  files.forEach(file => {
    const result = checkFile(file)
    if (result.issues.length > 0) {
      fileIssues.push(result)
      totalIssues += result.issues.length
    }
  })

  if (fileIssues.length === 0) {
    console.log('✅ No issues found! All pages look good.')
    return
  }

  console.log(`⚠️  Found ${totalIssues} issue(s) in ${fileIssues.length} file(s):\n`)

  fileIssues.forEach(({ file, issues }) => {
    console.log(`📄 ${file}`)
    issues.forEach(issue => {
      const icon = issue.type === 'ERROR' ? '❌' : '⚠️ '
      console.log(`   ${icon} ${issue.type}: ${issue.message}`)
      console.log(`      💡 ${issue.suggestion}`)
    })
    console.log('')
  })

  console.log('=' .repeat(60))
  console.log(`Total: ${totalIssues} issue(s) in ${fileIssues.length} file(s)`)
  console.log('=' .repeat(60))
}

main()
