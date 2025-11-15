const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'app', '[locale]', 'materials', '[section]', 'page.js')

let content = fs.readFileSync(filePath, 'utf-8')

// 1. Remplacer l'import next-translate par next-intl
content = content.replace(
	/import useTranslation from ["']next-translate\/useTranslation["'];?/,
	'import { useTranslations, useLocale } from "next-intl";'
)

// 2. Remplacer l'import useRouter de next/router par next/navigation
content = content.replace(
	/import \{ useRouter \} from ["']next\/router["'];?/,
	'import { useRouter, useParams } from "next/navigation";'
)

// 3. Remplacer la déclaration du router et des params
content = content.replace(
	/const router = useRouterCompat\(\);?\s*const \{ section \} = router\.query;?/,
	'const router = useRouter();\n  const params = useParams();\n  const section = params.section;'
)

// Fallback si le pattern ci-dessus ne marche pas
if (content.includes('useRouterCompat')) {
	content = content.replace(/useRouterCompat/g, 'useRouter')
	content = content.replace(/const \{ section \} = router\.query;?/, 'const params = useParams();\n  const section = params.section;')
}

// 4. Ajouter l'import useParams s'il n'existe pas déjà et qu'on utilise params
if (content.includes('params.section') && !content.includes('useParams')) {
	content = content.replace(
		/import \{ useRouter \} from ["']next\/navigation["'];?/,
		'import { useRouter, useParams } from "next/navigation";'
	)
}

// 5. Corriger la déclaration de locale si elle utilise encore l'ancien format
content = content.replace(
	/const locale = useLocale\(\);/,
	'const locale = useLocale();'
)

fs.writeFileSync(filePath, content, 'utf-8')

console.log('✅ Section page fixed!')
