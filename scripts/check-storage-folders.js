/**
 * Script pour vérifier tous les dossiers du storage Supabase
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllFolders() {
	console.log('🔍 Vérification de tous les dossiers du storage Supabase...\n')

	const folders = ['image', 'thumbnails', 'small', 'medium', 'large', 'audio', 'video']

	for (const folder of folders) {
		console.log(`📂 Dossier: /${folder}`)

		try {
			const { data: files, error } = await supabase
				.storage
				.from('linguami')
				.list(folder, {
					limit: 100,
					sortBy: { column: 'name', order: 'asc' }
				})

			if (error) {
				console.log(`   ❌ Erreur: ${error.message}`)
			} else {
				console.log(`   Fichiers trouvés: ${files.length}`)
				if (files.length > 0) {
					console.log(`   Premiers fichiers:`)
					files.slice(0, 5).forEach(file => {
						console.log(`      - ${file.name}`)
					})
				}
			}
		} catch (err) {
			console.log(`   ❌ Erreur: ${err.message}`)
		}

		console.log('')
	}
}

checkAllFolders()
