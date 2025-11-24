import fs from 'fs'

const filePath = 'D:/linguami/app/actions/admin.js'
let content = fs.readFileSync(filePath, 'utf8')

// Remove the broken logs first
content = content.replace('logger.info()\n\t\t\t', '')
content = content.replace('(html.includes(\'errorScreen\') && logger.info(), false) ||\n\t\t\t\t', '')

// Now add proper logs
// 1. After getting HTML
const htmlLog = `const html = await embedResponse.text()
			logger.info(\`[Video Check] \${videoId}: Fetched HTML, length=\${html.length}\`)`

content = content.replace(
	'const html = await embedResponse.text()',
	htmlLog
)

// 2. Before the big if statement with all checks
const checksLog = `
			// Log what we're checking
			const hasErrorScreen = html.includes('errorScreen')
			const hasPlayerUnavailable = html.includes('player-unavailable')
			logger.info(\`[Video Check] \${videoId}: errorScreen=\${hasErrorScreen}, player-unavailable=\${hasPlayerUnavailable}\`)

			// Indicateurs de vidéo indisponible`

content = content.replace(
	'\n\t\t\t// Indicateurs de vidéo indisponible',
	checksLog
)

// 3. Inside the if block, log when returning broken
content = content.replace(
	/(\t\t\t\t)(html\.includes\('errorScreen'\))/,
	'$1hasErrorScreen'
)

// 4. Before returning broken
content = content.replace(
	/(\t\t\t) \{\n\t\t\t\treturn 'broken'\n\t\t\t\}\n\n\t\t\treturn 'working'/,
	` {
				logger.info(\`[Video Check] \${videoId}: ❌ BROKEN - Failed embed check\`)
				return 'broken'
			}

			logger.info(\`[Video Check] \${videoId}: ✅ WORKING\`)
			return 'working'`
)

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Added proper debug logging')
