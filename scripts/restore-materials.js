/**
 * Script de restauration de la table materials
 * Restaure les données depuis un fichier de backup JSON
 *
 * Usage: node scripts/restore-materials.js <nom-du-fichier-backup>
 * Exemple: node scripts/restore-materials.js materials_backup_2025-11-04T11-42-21.json
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Erreur: Variables d\'environnement manquantes')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function restoreMaterials(backupFilename) {
	try {
		// Vérifier que le fichier existe
		const backupPath = path.join(__dirname, '../backups', backupFilename)

		if (!fs.existsSync(backupPath)) {
			console.error(`❌ Erreur: Le fichier ${backupFilename} n'existe pas dans le dossier backups/`)
			console.log('\n📁 Fichiers disponibles :')
			const backupDir = path.join(__dirname, '../backups')
			if (fs.existsSync(backupDir)) {
				const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'))
				files.forEach(f => console.log(`   - ${f}`))
			}
			process.exit(1)
		}

		console.log('⚠️  ATTENTION: Cette opération va ÉCRASER toutes les données actuelles!\n')
		console.log(`📁 Fichier de backup: ${backupFilename}\n`)

		// Lire le backup
		const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
		const materials = backupData.data

		console.log(`📊 Backup du ${backupData.backup_date}`)
		console.log(`📊 ${materials.length} enregistrements à restaurer\n`)

		console.log('🔄 Début de la restauration...\n')

		// Restaurer chaque material
		let successCount = 0
		let errorCount = 0

		for (const material of materials) {
			const { error } = await supabase
				.from('materials')
				.upsert(material, { onConflict: 'id' })

			if (error) {
				console.error(`❌ Erreur pour material ID ${material.id}:`, error.message)
				errorCount++
			} else {
				successCount++
			}

			// Afficher la progression tous les 50 items
			if (successCount % 50 === 0) {
				console.log(`   Progression: ${successCount}/${materials.length}`)
			}
		}

		console.log('\n✅ Restauration terminée!')
		console.log(`   ✅ Succès: ${successCount}`)
		if (errorCount > 0) {
			console.log(`   ❌ Erreurs: ${errorCount}`)
		}

	} catch (error) {
		console.error('❌ Erreur lors de la restauration:', error.message)
		process.exit(1)
	}
}

// Vérifier les arguments
const backupFilename = process.argv[2]

if (!backupFilename) {
	console.error('❌ Usage: node scripts/restore-materials.js <nom-du-fichier-backup>')
	console.error('   Exemple: node scripts/restore-materials.js materials_backup_2025-11-04T11-42-21.json')
	console.log('\n📁 Fichiers de backup disponibles :')
	const backupDir = path.join(__dirname, '../backups')
	if (fs.existsSync(backupDir)) {
		const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'))
		files.forEach(f => console.log(`   - ${f}`))
	}
	process.exit(1)
}

// Exécuter la restauration
restoreMaterials(backupFilename)
