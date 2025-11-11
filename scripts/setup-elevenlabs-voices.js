const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupVoicesTable() {
	console.log('🔧 Setting up ElevenLabs voices table...\n')

	try {
		// First, try to create the table
		const createTableSQL = `
			CREATE TABLE IF NOT EXISTS elevenlabs_voices (
				id SERIAL PRIMARY KEY,
				voice_name TEXT UNIQUE NOT NULL,
				voice_id TEXT NOT NULL,
				language TEXT,
				gender TEXT,
				created_at TIMESTAMP DEFAULT NOW()
			);
		`

		const { error: tableError } = await supabase.rpc('exec_sql', {
			sql: createTableSQL,
		})

		if (tableError) {
			console.log('⚠️  Could not create table via RPC, trying direct insert...')
		} else {
			console.log('✅ Table created successfully')
		}

		// Insert French voices
		// You'll need to replace these with actual ElevenLabs voice IDs
		const voices = [
			{
				voice_name: 'male_french',
				voice_id: 'PLACEHOLDER_MALE_FRENCH_ID', // Replace with actual ID
				language: 'fr',
				gender: 'male',
			},
			{
				voice_name: 'female_french',
				voice_id: 'PLACEHOLDER_FEMALE_FRENCH_ID', // Replace with actual ID
				language: 'fr',
				gender: 'female',
			},
		]

		console.log('\n📝 Voice IDs to configure:')
		console.log('You need to replace the placeholder IDs with actual ElevenLabs voice IDs')
		console.log('Visit https://api.elevenlabs.io/v1/voices to see available voices\n')

		for (const voice of voices) {
			const { error: insertError } = await supabase
				.from('elevenlabs_voices')
				.upsert(voice, {
					onConflict: 'voice_name',
				})

			if (insertError) {
				console.error(`❌ Error inserting ${voice.voice_name}:`, insertError.message)
			} else {
				console.log(`✅ Inserted/Updated ${voice.voice_name}`)
			}
		}

		console.log('\n✅ Setup complete!')
		console.log(
			'\n⚠️  IMPORTANT: Update the voice_id values with real ElevenLabs voice IDs before generating audio'
		)
	} catch (error) {
		console.error('❌ Error:', error.message)
		console.log('\n💡 Alternative: Create table manually in Supabase SQL Editor:')
		console.log(`
CREATE TABLE elevenlabs_voices (
	id SERIAL PRIMARY KEY,
	voice_name TEXT UNIQUE NOT NULL,
	voice_id TEXT NOT NULL,
	language TEXT,
	gender TEXT,
	created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO elevenlabs_voices (voice_name, voice_id, language, gender)
VALUES
	('male_french', 'YOUR_MALE_VOICE_ID', 'fr', 'male'),
	('female_french', 'YOUR_FEMALE_VOICE_ID', 'fr', 'female');
		`)
	}
}

setupVoicesTable()
