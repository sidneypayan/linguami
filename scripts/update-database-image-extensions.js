/**
 * Script pour mettre à jour les extensions d'images .png en .webp
 * dans la base de données Supabase
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Variables d\'environnement manquantes :')
	console.error('   - NEXT_PUBLIC_SUPABASE_URL')
	console.error('   - SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateImageExtensions() {
	console.log('🔄 Mise à jour des extensions d\'images dans la base de données...\n')

	try {
		// 1. Mettre à jour la table materials
		console.log('📋 Mise à jour de la table "materials"...')

		// Récupérer tous les matériaux avec des images .jpg, .jpeg ou .png
		const { data: materials, error: materialsError } = await supabase
			.from('materials')
			.select('id, image')
			.or('image.like.%.jpg,image.like.%.jpeg,image.like.%.png,image.like.%.JPG,image.like.%.JPEG,image.like.%.PNG')

		if (materialsError) {
			console.error('❌ Erreur lors de la lecture de materials:', materialsError)
		} else if (materials && materials.length > 0) {
			console.log(`   Trouvé ${materials.length} enregistrement(s) à mettre à jour`)

			// Mettre à jour chaque matériau
			for (const material of materials) {
				const newImage = material.image.replace(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/i, '.webp')
				const { error: updateError } = await supabase
					.from('materials')
					.update({ image: newImage })
					.eq('id', material.id)

				if (updateError) {
					console.error(`   ❌ Erreur pour ID ${material.id}:`, updateError.message)
				} else {
					console.log(`   ✅ ID ${material.id}: ${material.image} → ${newImage}`)
				}
			}
		} else {
			console.log('   ✓ Aucun enregistrement à mettre à jour')
		}

		// 2. Mettre à jour la table books
		console.log('\n📚 Mise à jour de la table "books"...')

		const { data: books, error: booksError } = await supabase
			.from('books')
			.select('id, image')
			.or('image.like.%.jpg,image.like.%.jpeg,image.like.%.png,image.like.%.JPG,image.like.%.JPEG,image.like.%.PNG')

		if (booksError) {
			console.error('❌ Erreur lors de la lecture de books:', booksError)
		} else if (books && books.length > 0) {
			console.log(`   Trouvé ${books.length} enregistrement(s) à mettre à jour`)

			for (const book of books) {
				const newImage = book.image.replace(/\.(png|jpg|jpeg|PNG|JPG|JPEG)$/i, '.webp')
				const { error: updateError } = await supabase
					.from('books')
					.update({ image: newImage })
					.eq('id', book.id)

				if (updateError) {
					console.error(`   ❌ Erreur pour ID ${book.id}:`, updateError.message)
				} else {
					console.log(`   ✅ ID ${book.id}: ${book.image} → ${newImage}`)
				}
			}
		} else {
			console.log('   ✓ Aucun enregistrement à mettre à jour')
		}

		console.log('\n🎉 Mise à jour terminée !')

		// Vérification
		console.log('\n🔍 Vérification des résultats :')

		const { data: verifyMaterials, error: verifyMaterialsError } = await supabase
			.from('materials')
			.select('id, image')
			.limit(5)

		if (!verifyMaterialsError && verifyMaterials) {
			console.log('\n📋 Premiers enregistrements de "materials" :')
			verifyMaterials.forEach(m => console.log(`   - ${m.image}`))
		}

		const { data: verifyBooks, error: verifyBooksError } = await supabase
			.from('books')
			.select('id, image')
			.limit(5)

		if (!verifyBooksError && verifyBooks) {
			console.log('\n📚 Premiers enregistrements de "books" :')
			verifyBooks.forEach(b => console.log(`   - ${b.image}`))
		}

	} catch (error) {
		console.error('❌ Erreur générale:', error)
		process.exit(1)
	}
}

// Exécuter le script
updateImageExtensions()
