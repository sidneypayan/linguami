/**
 * Script to remove all IPA (International Phonetic Alphabet) references from method lessons
 * Works on PROD database
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env.local file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROD_URL
const supabaseKey = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PROD_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('❌ Missing PROD Supabase credentials')
	process.exit(1)
}

const keyType = process.env.SUPABASE_PROD_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'
console.log(`🔗 Connecting to: ${supabaseUrl}`)
console.log(`   Database: ${supabaseUrl.includes('psomseputtsdizmmqugy') ? 'PROD' : 'DEV'}`)
console.log(`   Key type: ${keyType} (bypasses RLS: ${keyType === 'SERVICE_ROLE' ? 'YES ✅' : 'NO'})\n`)

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Check if a block contains IPA references
 */
function hasIPAContent(block) {
	const blockStr = JSON.stringify(block).toLowerCase()
	return (
		blockStr.includes('phonétique') ||
		blockStr.includes('phonetic') ||
		blockStr.includes('фонетический') ||
		blockStr.includes('ipa') ||
		blockStr.includes('api') ||
		blockStr.includes('/') && blockStr.includes('[') // IPA notation patterns
	)
}

/**
 * Remove IPA content from a block
 */
function cleanIPAFromBlock(block) {
	// If the entire block is about IPA, return null to remove it
	if (block.type === 'ipa' || block.type === 'phonetic') {
		return null
	}

	// Create a copy of the block
	const cleanBlock = { ...block }

	// For vocabulary blocks, remove pronunciation from words
	if (cleanBlock.type === 'vocabulary' && Array.isArray(cleanBlock.words)) {
		cleanBlock.words = cleanBlock.words.map(word => {
			const { pronunciation, ipa, phonetic, ...cleanWord } = word
			return cleanWord
		})
	}

	// For text blocks, remove IPA notation patterns
	if (cleanBlock.content) {
		cleanBlock.content = cleanBlock.content
			.replace(/\[[\p{L}\p{M}\p{S}]+\]/gu, '') // Remove [IPA] brackets
			.replace(/\/[\p{L}\p{M}\p{S}]+\//gu, '') // Remove /IPA/ slashes
			.replace(/\s+/g, ' ') // Clean up extra spaces
			.trim()
	}

	// For dialogue blocks, remove pronunciation field if it exists
	if (cleanBlock.lines) {
		cleanBlock.lines = cleanBlock.lines.map(line => {
			const { pronunciation, ipa, phonetic, ...rest } = line
			return rest
		})
	}

	// Remove IPA-related properties from block itself
	const { pronunciation, ipa, phonetic, ...finalBlock } = cleanBlock

	return finalBlock
}

/**
 * Clean IPA from blocks array
 */
function cleanIPAFromBlocks(blocks) {
	if (!Array.isArray(blocks)) return blocks

	return blocks
		.map(block => cleanIPAFromBlock(block))
		.filter(block => block !== null) // Remove null blocks (IPA-only blocks)
}

async function main() {
	console.log('🔍 Fetching all lessons from PROD database...\n')

	const { data: lessons, error } = await supabase
		.from('course_lessons')
		.select('id, slug, title_fr, title_en, title_ru, blocks_fr, blocks_en, blocks_ru')

	if (error) {
		console.error('❌ Error fetching lessons:', error)
		process.exit(1)
	}

	console.log(`📚 Found ${lessons.length} lessons\n`)

	let updatedCount = 0
	const updates = []

	for (const lesson of lessons) {
		let hasIPA = false
		const update = {
			id: lesson.id,
			slug: lesson.slug,
			title: lesson.title_fr || lesson.title_en || lesson.title_ru,
		}

		// Check and clean French blocks
		if (lesson.blocks_fr && hasIPAContent(lesson.blocks_fr)) {
			hasIPA = true
			update.blocks_fr = cleanIPAFromBlocks(lesson.blocks_fr)

			// Debug: check if pronunciation still exists
			const stillHasIPA = JSON.stringify(update.blocks_fr).includes('pronunciation')
			if (stillHasIPA) {
				console.log(`⚠️  WARNING: ${update.title} - blocks_fr still has pronunciation after cleaning!`)
			}
		}

		// Check and clean English blocks
		if (lesson.blocks_en && hasIPAContent(lesson.blocks_en)) {
			hasIPA = true
			update.blocks_en = cleanIPAFromBlocks(lesson.blocks_en)
		}

		// Check and clean Russian blocks
		if (lesson.blocks_ru && hasIPAContent(lesson.blocks_ru)) {
			hasIPA = true
			update.blocks_ru = cleanIPAFromBlocks(lesson.blocks_ru)
		}

		if (hasIPA) {
			updates.push(update)
			updatedCount++
		}
	}

	if (updates.length === 0) {
		console.log('✅ No IPA content found in any lessons!')
		return
	}

	console.log(`\n📝 Found IPA content in ${updatedCount} lesson(s):\n`)
	updates.forEach(u => console.log(`  - ${u.title} (${u.slug})`))

	console.log('\n⚠️  Ready to update these lessons in PROD database.')
	console.log('Press Ctrl+C to cancel, or continue to apply updates...\n')

	// Wait a bit to allow user to cancel
	await new Promise(resolve => setTimeout(resolve, 3000))

	// Apply updates
	for (const update of updates) {
		const updateData = {}
		if (update.blocks_fr) updateData.blocks_fr = update.blocks_fr
		if (update.blocks_en) updateData.blocks_en = update.blocks_en
		if (update.blocks_ru) updateData.blocks_ru = update.blocks_ru

		console.log(`\n🔄 Updating ${update.title}...`)
		console.log(`   Fields to update: ${Object.keys(updateData).join(', ')}`)

		const { data, error: updateError } = await supabase
			.from('course_lessons')
			.update(updateData)
			.eq('id', update.id)
			.select()

		if (updateError) {
			console.error(`❌ Error updating lesson ${update.slug}:`, updateError)
		} else {
			console.log(`✅ Updated: ${update.title}`)

			// Verify the update
			if (data && data[0]) {
				const hasIpaAfter = hasIPAContent(data[0].blocks_fr || data[0].blocks_en || data[0].blocks_ru)
				console.log(`   Verification: IPA still present? ${hasIpaAfter ? '❌ YES' : '✅ NO'}`)
			}
		}
	}

	console.log(`\n🎉 Successfully cleaned IPA content from ${updatedCount} lesson(s)!`)
}

main().catch(console.error)
