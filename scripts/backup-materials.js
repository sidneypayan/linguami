/**
 * Script de backup de la table materials
 * Exporte toutes les données dans un fichier JSON horodaté
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
	console.error('   Assurez-vous que .env.local contient :')
	console.error('   - NEXT_PUBLIC_SUPABASE_URL')
	console.error('   - SUPABASE_SERVICE_ROLE_KEY')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function backupMaterials() {
	try {
		console.log('🔄 Début du backup de la table materials...\n')

		// Récupérer toutes les données
		const { data: materials, error } = await supabase
			.from('materials')
			.select('*')
			.order('id', { ascending: true })

		if (error) {
			throw error
		}

		console.log(`✅ ${materials.length} materials récupérés\n`)

		// Créer le dossier backups s'il n'existe pas
		const backupDir = path.join(__dirname, '../backups')
		if (!fs.existsSync(backupDir)) {
			fs.mkdirSync(backupDir, { recursive: true })
		}

		// Créer le nom du fichier avec timestamp
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
		const filename = `materials_backup_${timestamp}.json`
		const filepath = path.join(backupDir, filename)

		// Sauvegarder avec une belle indentation
		const backupData = {
			backup_date: new Date().toISOString(),
			table_name: 'materials',
			total_records: materials.length,
			data: materials,
		}

		fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), 'utf8')

		console.log('✅ Backup créé avec succès !\n')
		console.log(`📁 Fichier: ${filename}`)
		console.log(`📍 Emplacement: ${filepath}`)
		console.log(`📊 Nombre d'enregistrements: ${materials.length}`)

		// Statistiques sur les <br>
		const materialsWithBr = materials.filter(m =>
			(m.body && m.body.includes('<br')) ||
			(m.body_accents && m.body_accents.includes('<br'))
		)

		console.log(`\n📈 Statistiques:`)
		console.log(`   - Materials avec <br> dans body ou body_accents: ${materialsWithBr.length}`)
		console.log(`   - Materials sans <br>: ${materials.length - materialsWithBr.length}`)

		// Taille du fichier
		const stats = fs.statSync(filepath)
		const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
		console.log(`   - Taille du fichier: ${fileSizeInMB} MB`)

		console.log('\n✅ Backup terminé avec succès!')
		console.log('💡 Vous pouvez maintenant exécuter la migration en toute sécurité.\n')

	} catch (error) {
		console.error('❌ Erreur lors du backup:', error.message)
		process.exit(1)
	}
}

// Exécuter le backup
backupMaterials()
