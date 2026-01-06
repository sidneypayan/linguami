/**
 * Analyze a specific lesson from course_lessons table
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function analyzeLesson(slug) {
	console.log(`🔍 Analyzing lesson: ${slug}\n`)

	const { data: lesson, error } = await supabase
		.from('course_lessons')
		.select('*')
		.eq('slug', slug)
		.single()

	if (error) {
		console.error('❌ Error:', error)
		return
	}

	if (!lesson) {
		console.log('❌ Lesson not found')
		return
	}

	console.log('📖 Lesson found!')
	console.log('Title FR:', lesson.title_fr)
	console.log('Title EN:', lesson.title_en)
	console.log('Title RU:', lesson.title_ru)
	console.log('Course ID:', lesson.course_id)
	console.log('Order:', lesson.order_index)
	console.log('')

	// Analyze blocks structure
	const blocksFr = lesson.blocks_fr || []
	const blocksEn = lesson.blocks_en || []
	const blocksRu = lesson.blocks_ru || []

	console.log('📊 Blocks structure:')
	console.log(`- blocks_fr: ${blocksFr.length} blocks`)
	console.log(`- blocks_en: ${blocksEn.length} blocks`)
	console.log(`- blocks_ru: ${blocksRu.length} blocks`)
	console.log('')

	// List block types in blocks_fr
	if (blocksFr.length > 0) {
		console.log('🇫🇷 blocks_fr content:')
		blocksFr.forEach((block, index) => {
			console.log(`  ${index + 1}. ${block.type} - "${block.title || 'No title'}"`)

			// Show dialogue structure if it's a dialogue block
			if (block.type === 'dialogue' && block.lines) {
				console.log(`     → ${block.lines.length} dialogue lines`)
				block.lines.slice(0, 2).forEach((line, i) => {
					console.log(`       ${i + 1}. ${line.speaker}: "${line.text?.substring(0, 50)}..."`)
					if (line.vocab) {
						console.log(`          vocab: ${line.vocab.length} words`)
					}
					if (line.audioUrl) {
						console.log(`          audioUrl: ${line.audioUrl}`)
					}
				})
			}
		})
	}

	// Show first dialogue block in detail
	if (blocksFr.length > 0 && blocksFr[0].type === 'dialogue') {
		console.log('\n🔍 First dialogue block detailed structure:')
		console.log(JSON.stringify(blocksFr[0], null, 2))
	}
}

const slug = process.argv[2] || 'bonjour-saluer-prendre-conge'
analyzeLesson(slug)
