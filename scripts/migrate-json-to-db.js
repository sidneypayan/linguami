/**
 * Migrate training questions from JSON files to database
 * Run with: node scripts/migrate-json-to-db.js
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

// ALWAYS use PROD DB for training
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Missing Supabase credentials')
	process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Load all training questions from JSON files
 */
function loadAllQuestions() {
	const dataPath = path.join(__dirname, '../data/training')
	const languages = ['ru', 'fr']
	const levels = ['beginner', 'intermediate', 'advanced']
	const allQuestions = []

	for (const lang of languages) {
		for (const level of levels) {
			const levelPath = path.join(dataPath, lang, level)

			if (!fs.existsSync(levelPath)) continue

			const files = fs.readdirSync(levelPath)

			for (const file of files) {
				if (!file.endsWith('.json')) continue

				const themeKey = file.replace('.json', '')
				const filePath = path.join(levelPath, file)

				try {
					const fileContent = fs.readFileSync(filePath, 'utf-8')
					const questions = JSON.parse(fileContent)

					console.log(`📂 Loading ${lang}/${level}/${themeKey}: ${questions.length} questions`)

					allQuestions.push({
						lang,
						level,
						themeKey,
						questions
					})
				} catch (error) {
					console.error(`❌ Error reading ${filePath}:`, error)
				}
			}
		}
	}

	return allQuestions
}

/**
 * Get theme ID from database
 */
async function getThemeId(lang, level, key) {
	const { data, error } = await supabase
		.from('training_themes')
		.select('id')
		.eq('lang', lang)
		.eq('level', level)
		.eq('key', key)
		.single()

	if (error || !data) {
		console.error(`❌ Theme not found: ${lang}/${level}/${key}`)
		return null
	}

	return data.id
}

/**
 * Insert questions into database
 */
async function migrateToDatabase() {
	console.log('🚀 Starting migration from JSON to database...\n')

	const allData = loadAllQuestions()
	let totalInserted = 0
	let totalSkipped = 0

	for (const { lang, level, themeKey, questions } of allData) {
		const themeId = await getThemeId(lang, level, themeKey)

		if (!themeId) {
			console.error(`⚠️  Skipping ${lang}/${level}/${themeKey}: theme not found in DB`)
			totalSkipped += questions.length
			continue
		}

		// Prepare questions for insertion
		// NOTE: We don't include 'id' field - let DB auto-generate unique IDs
		const questionsToInsert = questions.map(q => ({
			theme_id: themeId,
			type: q.type,
			status: 'published', // All existing questions are published by default
			question_fr: q.question_fr || null,
			question_en: q.question_en || null,
			question_ru: q.question_ru || null,
			sentence: q.sentence || null,
			blank: q.blank || null,
			options: q.options,
			correct_answer: q.correct_answer !== undefined ? q.correct_answer : null,
			sentences: q.sentences || null, // For multi_fill questions
			explanation_fr: q.explanation_fr || null,
			explanation_en: q.explanation_en || null,
			explanation_ru: q.explanation_ru || null,
			difficulty: q.difficulty || 1,
			is_active: q.is_active !== undefined ? q.is_active : true
		}))

		// Debug: check for null correct_answer
		if (themeKey === 'greetings') {
			const nullAnswers = questionsToInsert.filter(q => q.correct_answer === null || q.correct_answer === undefined)
			console.log(`🔍 DEBUG greetings: ${nullAnswers.length} questions with null/undefined correct_answer`)
			if (nullAnswers.length > 0) {
				console.log('First null example:', JSON.stringify(nullAnswers[0], null, 2))
			}
		}

		// Insert questions (use insert, not upsert, since we're auto-generating IDs)
		const { data, error } = await supabase
			.from('training_questions')
			.insert(questionsToInsert)
			.select()

		if (error) {
			console.error(`❌ Error inserting ${lang}/${level}/${themeKey}:`, error.message)
			console.error('Error details:', error)
			totalSkipped += questions.length
		} else {
			console.log(`✅ Inserted ${data.length} questions for ${lang}/${level}/${themeKey}`)
			totalInserted += data.length
		}
	}

	console.log('\n📊 Migration Summary:')
	console.log(`   ✅ Total inserted: ${totalInserted}`)
	console.log(`   ⚠️  Total skipped: ${totalSkipped}`)
	console.log('\n✨ Migration completed!')
}

// Run migration
migrateToDatabase()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('💥 Migration failed:', error)
		process.exit(1)
	})
