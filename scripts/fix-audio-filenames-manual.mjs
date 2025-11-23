import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Manual mapping based on investigation
const MANUAL_MAPPING = {
	128: 'au-restaurant.mp3',          // Au restaurant (fr)
	142: 'au_restaurant.m4a',          // В ресторане (ru)
	150: 'ilya_mouromets.m4a',         // Илья Муромец (ru)
	192: 'ville-ys-fr.mp3',            // La Ville d'Ys (fr)
}

// Materials to set to NULL (audio doesn't exist)
const SET_TO_NULL = [129, 130, 132, 134, 136, 143, 144, 146, 147, 149]

async function fixAudioFilenames(applyChanges = false) {
	console.log('🔧 Fixing audio_filename values with manual mapping...\n')

	// Get all materials
	const { data: materials, error } = await supabase
		.from('materials')
		.select('id, title, lang, audio_filename')
		.not('audio_filename', 'is', null)
		.order('id')

	if (error) {
		console.error('Error:', error)
		return
	}

	console.log('Found ' + materials.length + ' materials with audio_filename\n')
	console.log('═══════════════════════════════════════════════════════════\n')

	// Show updates
	console.log('✏️  UPDATES TO APPLY:\n')
	for (const [id, newFilename] of Object.entries(MANUAL_MAPPING)) {
		const material = materials.find(m => m.id === parseInt(id))
		if (material) {
			console.log('Material #' + id + ': ' + material.title)
			console.log('  Old: ' + material.audio_filename)
			console.log('  New: ' + newFilename)
			console.log('  Path: audios/' + material.lang + '/materials/' + newFilename)
			console.log('')
		}
	}

	console.log('❌ SET TO NULL:\n')
	for (const id of SET_TO_NULL) {
		const material = materials.find(m => m.id === id)
		if (material) {
			console.log('Material #' + id + ': ' + material.title)
			console.log('  Old: ' + material.audio_filename)
			console.log('')
		}
	}

	console.log('═══════════════════════════════════════════════════════════')
	console.log('📊 SUMMARY:')
	console.log('  ✅ Files to update: ' + Object.keys(MANUAL_MAPPING).length)
	console.log('  ❌ Files to set NULL: ' + SET_TO_NULL.length)
	console.log('═══════════════════════════════════════════════════════════\n')

	if (applyChanges) {
		console.log('🚀 Applying changes...\n')
		
		// Apply manual mappings
		for (const [id, newFilename] of Object.entries(MANUAL_MAPPING)) {
			const { error } = await supabase
				.from('materials')
				.update({ audio_filename: newFilename })
				.eq('id', parseInt(id))
			
			if (error) {
				console.log('❌ Error updating #' + id + ': ' + error.message)
			} else {
				console.log('✅ Updated #' + id + ' → ' + newFilename)
			}
		}
		
		// Set to NULL
		for (const id of SET_TO_NULL) {
			const { error } = await supabase
				.from('materials')
				.update({ audio_filename: null })
				.eq('id', id)
			
			if (error) {
				console.log('❌ Error updating #' + id + ': ' + error.message)
			} else {
				console.log('✅ Set NULL for #' + id)
			}
		}
		
		console.log('\n✅ All changes applied successfully!')
	} else {
		console.log('⚠️  DRY RUN - No changes applied')
		console.log('Run with: APPLY=true node /d/linguami/scripts/fix-audio-filenames-manual.mjs\n')
	}
}

const applyChanges = process.env.APPLY === 'true'
fixAudioFilenames(applyChanges)
