/**
 * Migrate method lessons from JSON files to database
 * Run with: node scripts/migrate-lessons-json-to-db.js
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
 * Load all lesson JSON files
 */
function loadAllLessons() {
	const dataPath = path.join(__dirname, '../data/method')
	const languages = ['ru', 'fr']
	const levels = ['beginner', 'intermediate', 'advanced']
	const allLessons = []

	for (const lang of languages) {
		for (const level of levels) {
			const levelPath = path.join(dataPath, lang, level)

			if (!fs.existsSync(levelPath)) continue

			const files = fs.readdirSync(levelPath)

			for (const file of files) {
				if (!file.endsWith('.json')) continue

				const slug = file.replace('.json', '')
				const filePath = path.join(levelPath, file)

				try {
					const fileContent = fs.readFileSync(filePath, 'utf-8')
					const lessonData = JSON.parse(fileContent)

					console.log(`📂 Loading ${lang}/${level}/${slug}`)

					allLessons.push({
						lang,
						level,
						slug,
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
 * Get lesson ID from database by slug
 */
async function getLessonBySlug(slug) {
	// Simply get the lesson by slug (it's unique)
	const { data, error } = await supabase
		.from('course_lessons')
		.select('id')
		.eq('slug', slug)
		.single()

	if (error) {
		console.error(`⚠️  Lesson not found: ${slug}`, error.message)
		return null
	}

	return data.id
}

/**
 * Update lesson content in database
 */
async function migrateToDB() {
	console.log('🚀 Starting migration from JSON to database...\n')

	const allLessons = loadAllLessons()
	let totalUpdated = 0
	let totalSkipped = 0

	for (const { lang, level, slug, data } of allLessons) {
		const lessonId = await getLessonBySlug(slug)

		if (!lessonId) {
			console.error(`❌ Skipping ${lang}/${level}/${slug}: lesson not found in DB`)
			totalSkipped++
			continue
		}

		// Prepare update data
		const updateData = {
			blocks_fr: data.blocks_fr || [],
			blocks_en: data.blocks_en || [],
			blocks_ru: data.blocks_ru || [],
			objectives_fr: data.objectives_fr || [],
			objectives_en: data.objectives_en || [],
			objectives_ru: data.objectives_ru || [],
			status: 'published' // Set all existing lessons as published
		}

		// Update lesson
		const { error } = await supabase
			.from('course_lessons')
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
