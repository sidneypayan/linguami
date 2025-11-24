import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

const testUrls = [
	'https://www.youtube.com/embed/Js11a9BuAe8',
	'https://www.youtube.com/watch?v=_mLAFrU9-VA'
]

console.log('🔍 Searching for these URLs in the database...\n')

for (const url of testUrls) {
	const { data, error } = await supabase
		.from('materials')
		.select('id, title, section, lang, video_url')
		.eq('video_url', url)
	
	if (error) {
		console.error(`❌ Error: ${error.message}`)
		continue
	}
	
	if (data && data.length > 0) {
		console.log(`✅ Found: ${url}`)
		console.log(`   Material ID: ${data[0].id}`)
		console.log(`   Title: ${data[0].title}`)
		console.log(`   Section: ${data[0].section}`)
		console.log(`   Lang: ${data[0].lang}\n`)
	} else {
		console.log(`⚠️  Not found in DB: ${url}\n`)
	}
}

// Also search for variations (different URL formats for same video ID)
console.log('🔍 Searching for partial matches by video ID...\n')

for (const id of ['Js11a9BuAe8', '_mLAFrU9-VA']) {
	const { data, error } = await supabase
		.from('materials')
		.select('id, title, section, lang, video_url')
		.like('video_url', `%${id}%`)
	
	if (data && data.length > 0) {
		console.log(`✅ Found videos containing ID: ${id}`)
		data.forEach(m => {
			console.log(`   - [${m.id}] ${m.title} (${m.lang})`)
			console.log(`     URL: ${m.video_url}`)
		})
		console.log('')
	} else {
		console.log(`⚠️  No videos found with ID: ${id}\n`)
	}
}
