import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })
const prodEnv = dotenv.config({ path: '.env.production' })

const supabase = createClient(
	prodEnv.parsed.NEXT_PUBLIC_SUPABASE_URL,
	prodEnv.parsed.SUPABASE_SERVICE_ROLE_KEY
)

async function applyFixes() {
	console.log('🚀 Applying audio filename fixes to PRODUCTION...\n')
	console.log('⚠️  WARNING: This will modify the PRODUCTION database!\n')

	// Load fix data
	const fixData = JSON.parse(fs.readFileSync('D:/linguami/scripts/prod-audio-fixes.json', 'utf8'))

	const { needsCleaning, needsNull } = fixData

	console.log('📊 Changes to apply:')
	console.log('  🧹 Files to clean: ' + needsCleaning.length)
	console.log('  ❌ Files to set NULL: ' + needsNull.length)
	console.log('')

	if (process.env.APPLY !== 'true') {
		console.log('⚠️  DRY RUN MODE - No changes will be applied')
		console.log('Set APPLY=true to apply changes to production\n')
		return
	}

	console.log('🔧 Applying changes...\n')

	// Apply cleaning
	for (const item of needsCleaning) {
		const { error } = await supabase
			.from('materials')
			.update({ audio_filename: item.new })
			.eq('id', item.id)
		
		if (error) {
			console.log('❌ Error updating #' + item.id + ': ' + error.message)
		} else {
			console.log('✅ Updated #' + item.id + ': ' + item.old + ' → ' + item.new)
		}
	}

	// Set to NULL
	for (const item of needsNull) {
		const { error } = await supabase
			.from('materials')
			.update({ audio_filename: null })
			.eq('id', item.id)
		
		if (error) {
			console.log('❌ Error updating #' + item.id + ': ' + error.message)
		} else {
			console.log('✅ Set NULL for #' + item.id + ': ' + item.title)
		}
	}

	console.log('\n✅ All changes applied to PRODUCTION!')
}

applyFixes()
