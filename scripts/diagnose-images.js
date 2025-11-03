/**
 * Script de diagnostic pour vérifier les URLs d'images
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Variables d\'environnement manquantes')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnoseImages() {
	console.log('🔍 Diagnostic des images...\n')
	console.log('📍 URL de base:', process.env.NEXT_PUBLIC_SUPABASE_IMAGE)
	console.log('')

	try {
		// 1. Vérifier les fichiers dans le storage
		console.log('📂 Fichiers dans le storage Supabase (dossier /image):')
		const { data: imageFiles, error: storageError } = await supabase
			.storage
			.from('linguami')
			.list('image', {
				limit: 10,
				sortBy: { column: 'name', order: 'asc' }
			})

		if (storageError) {
			console.error('❌ Erreur storage:', storageError)
		} else {
			console.log(`   Trouvé ${imageFiles.length} fichiers :`)
			imageFiles.forEach(file => {
				console.log(`   - ${file.name}`)
			})
		}

		// 2. Vérifier les enregistrements dans la BD
		console.log('\n📋 Enregistrements dans la table "materials" :')
		const { data: materials, error: materialsError } = await supabase
			.from('materials')
			.select('id, title, image, section')
			.limit(5)

		if (materialsError) {
			console.error('❌ Erreur BD:', materialsError)
		} else {
			materials.forEach(m => {
				const fullUrl = `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${m.image}`
				console.log(`\n   [${m.id}] ${m.title}`)
				console.log(`   Section: ${m.section}`)
				console.log(`   Champ image: ${m.image}`)
				console.log(`   URL complète: ${fullUrl}`)
			})
		}

		// 3. Vérifier si les URLs sont accessibles
		console.log('\n\n🌐 Test d\'accessibilité des URLs :')
		if (materials && materials.length > 0) {
			const testMaterial = materials[0]
			const testUrl = `${process.env.NEXT_PUBLIC_SUPABASE_IMAGE}${testMaterial.image}`

			console.log(`\n   Test de: ${testUrl}`)

			try {
				const response = await fetch(testUrl)
				if (response.ok) {
					console.log(`   ✅ Image accessible (Status: ${response.status})`)
					console.log(`   Type: ${response.headers.get('content-type')}`)
				} else {
					console.log(`   ❌ Image non accessible (Status: ${response.status})`)

					// Essayer avec .webp
					const webpUrl = testUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')
					console.log(`\n   Test avec .webp: ${webpUrl}`)
					const webpResponse = await fetch(webpUrl)
					if (webpResponse.ok) {
						console.log(`   ✅ Version WebP accessible (Status: ${webpResponse.status})`)
						console.log(`   ⚠️  PROBLÈME DÉTECTÉ: Les fichiers sont en .webp mais la BD référence .jpg`)
					}
				}
			} catch (fetchError) {
				console.error('   ❌ Erreur de fetch:', fetchError.message)
			}
		}

		console.log('\n\n💡 Recommandations :')
		console.log('   1. Vérifiez que les fichiers dans le storage correspondent aux noms dans la BD')
		console.log('   2. Si les fichiers sont en .webp mais la BD référence .jpg, mettez à jour la BD')
		console.log('   3. Si les fichiers sont en .jpg mais vous voyez .png, videz le cache du navigateur')

	} catch (error) {
		console.error('❌ Erreur générale:', error)
	}
}

diagnoseImages()
