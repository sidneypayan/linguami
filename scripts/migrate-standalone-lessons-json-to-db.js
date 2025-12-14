/**
 * Migrate standalone lessons from JSON files to database
 * Run with: node scripts/migrate-standalone-lessons-json-to-db.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// ALWAYS use PROD DB for lessons
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Using production database:', supabaseUrl, '\n')

/**
 * Load all standalone lesson JSON files
 */
function loadAllLessons() {
	const dataPath = path.join(__dirname, '../data/lessons')
	const languages = ['ru', 'fr', 'en']
	const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
	const allLessons = []

	for (const lang of languages) {
		for (const level of levels) {
			const levelPath = path.join(dataPath, lang, level)

			if (!fs.existsSync(levelPath)) continue

			const files = fs.readdirSync(levelPath)

			for (const file of files) {
				if (!file.endsWith('.json')) continue

				const filePath = path.join(levelPath, file)

				try {
					const fileContent = fs.readFileSync(filePath, 'utf-8')
					const lessonData = JSON.parse(fileContent)

					console.log(`📂 Loading ${lang}/${level}/${lessonData.slug}`)

					allLessons.push({
						lang,
						level,
						data: lessonData
					})
				} catch (error) {
					console.error(`❌ Error reading ${filePath}:`, error.message)
				}
			}
		}
	}

	return allLessons
}

/**
 * Update lesson content in database
 */
async function migrateToDB() {
	console.log('🚀 Starting migration from JSON to database...\n')

	const allLessons = loadAllLessons()
	let totalUpdated = 0
	let totalSkipped = 0

	for (const { lang, level, data } of allLessons) {
		const slug = data.slug

		// Check if lesson exists in DB
		const { data: existing, error: findError } = await supabase
			.from('lessons')
			.select('id')
			.eq('slug', slug)
			.single()

		if (findError || !existing) {
			console.log(`⚠️  Creating new lesson: ${slug}`)

			// Create new lesson
			const { error: insertError } = await supabase
				.from('lessons')
				.insert({
					slug: data.slug,
					target_language: data.target_language,
					level: data.level,
					order: data.order || 0,
					title_fr: data.title_fr,
					title_en: data.title_en,
					title_ru: data.title_ru,
					blocks_fr: data.blocks_fr || [],
					blocks_en: data.blocks_en || [],
					blocks_ru: data.blocks_ru || [],
					difficulty: data.difficulty,
					estimated_read_time: data.estimatedReadTime,
					keywords: data.keywords || [],
					status: 'published'
				})

			if (insertError) {
				console.error(`❌ Error creating ${slug}:`, insertError.message)
				totalSkipped++
			} else {
				console.log(`✅ Created ${lang}/${level}/${slug}`)
				totalUpdated++
			}
			continue
		}

		const lessonId = existing.id

		// Update existing lesson with content
		const updateData = {
			blocks_fr: data.blocks_fr || [],
			blocks_en: data.blocks_en || [],
			blocks_ru: data.blocks_ru || [],
			difficulty: data.difficulty,
			estimated_read_time: data.estimatedReadTime,
			keywords: data.keywords || [],
			status: 'published' // Set all existing lessons as published
		}

		const { error } = await supabase
			.from('lessons')
			.update(updateData)
			.eq('id', lessonId)

		if (error) {
			console.error(`❌ Error updating ${lang}/${level}/${slug}:`, error.message)
			totalSkipped++
		} else {
			console.log(`✅ Updated ${lang}/${level}/${slug} (ID: ${lessonId})`)
			totalUpdated++
		}
	}

	console.log('\n📊 Migration Summary:')
	console.log(`   ✅ Total updated: ${totalUpdated}`)
	console.log(`   ⚠️  Total skipped: ${totalSkipped}`)
	console.log('\n✨ Migration completed!')
}

// Run migration
migrateToDB()
