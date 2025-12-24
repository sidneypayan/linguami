/**
 * Script to update the vowel section in cyrillic-alphabet-sounds lesson
 * - Better explanation of hard vs soft vowels
 * - Separate tables for hard and soft vowels
 * - Correspondence table showing pairs
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const LESSON_ID = 34

// New French blocks for vowel section
const newBlocksFr = [
	{
		type: 'paragraph',
		content: "En russe, les voyelles se divisent en deux groupes : les voyelles **dures** et les voyelles **molles**. Cette distinction est fondamentale car elle affecte la prononciation de la consonne qui précède. Quand une voyelle molle suit une consonne, celle-ci est \"palatalisée\" (prononcée plus vers l'avant de la bouche, comme si on ajoutait un petit \"y\")."
	},
	{
		type: 'title',
		content: 'Les voyelles dures'
	},
	{
		type: 'paragraph',
		content: 'Les 5 voyelles dures gardent la consonne précédente "dure" (prononciation normale) :'
	},
	{
		type: 'conjugationTable',
		title: 'Voyelles dures (твёрдые гласные)',
		rows: [
			{ pronoun: 'А а', form: 'comme "a" dans papa', translation: 'мама - maman' },
			{ pronoun: 'О о', form: 'comme "o" dans vol', translation: 'кот - chat' },
			{ pronoun: 'У у', form: 'comme "ou" dans cou', translation: 'ум - esprit' },
			{ pronoun: 'Ы ы', form: '⚠️ Son unique ! Entre "i" et "eu"', translation: 'ты - tu' },
			{ pronoun: 'Э э', form: 'comme "è" dans mère', translation: 'это - ceci' }
		]
	},
	{
		type: 'title',
		content: 'Les voyelles molles'
	},
	{
		type: 'paragraph',
		content: 'Les 5 voyelles molles "adoucissent" (palatalisent) la consonne qui les précède. Elles contiennent souvent un son "y" au début du mot ou après une autre voyelle :'
	},
	{
		type: 'conjugationTable',
		title: 'Voyelles molles (мягкие гласные)',
		rows: [
			{ pronoun: 'Я я', form: 'comme "ya" dans yaourt', translation: 'я - je' },
			{ pronoun: 'Ё ё', form: 'comme "yo" dans yoga', translation: 'ёжик - hérisson' },
			{ pronoun: 'Ю ю', form: 'comme "you" en anglais', translation: 'юг - sud' },
			{ pronoun: 'И и', form: 'comme "i" dans lit', translation: 'мир - monde/paix' },
			{ pronoun: 'Е е', form: '"yé" au début, "é" après consonne', translation: 'ель - sapin' }
		]
	},
	{
		type: 'title',
		content: 'Correspondance dure ↔ molle'
	},
	{
		type: 'paragraph',
		content: 'Chaque voyelle dure a sa correspondante molle. Elles représentent le même son de base, mais la molle adoucit la consonne précédente :'
	},
	{
		type: 'conjugationTable',
		title: 'Paires de voyelles',
		rows: [
			{ pronoun: 'А (dure)', form: '↔', translation: 'Я (molle)' },
			{ pronoun: 'О (dure)', form: '↔', translation: 'Ё (molle)' },
			{ pronoun: 'У (dure)', form: '↔', translation: 'Ю (molle)' },
			{ pronoun: 'Ы (dure)', form: '↔', translation: 'И (molle)' },
			{ pronoun: 'Э (dure)', form: '↔', translation: 'Е (molle)' }
		]
	},
	{
		type: 'importantNote',
		title: 'Exemple concret',
		content: 'Comparez : **мат** (mat - gros mot) vs **мят** (myat - froissé). La seule différence est А vs Я, mais le М se prononce différemment ! Dans "мят", le М est palatalisé (adouci).'
	}
]

// New English blocks for vowel section
const newBlocksEn = [
	{
		type: 'paragraph',
		content: 'In Russian, vowels are divided into two groups: **hard** vowels and **soft** vowels. This distinction is fundamental because it affects how the preceding consonant is pronounced. When a soft vowel follows a consonant, that consonant becomes "palatalized" (pronounced more towards the front of the mouth, as if adding a small "y" sound).'
	},
	{
		type: 'title',
		content: 'Hard Vowels'
	},
	{
		type: 'paragraph',
		content: 'The 5 hard vowels keep the preceding consonant "hard" (normal pronunciation):'
	},
	{
		type: 'conjugationTable',
		title: 'Hard Vowels (твёрдые гласные)',
		rows: [
			{ pronoun: 'А а', form: 'like "a" in father', translation: 'мама - mom' },
			{ pronoun: 'О о', form: 'like "o" in more', translation: 'кот - cat' },
			{ pronoun: 'У у', form: 'like "oo" in moon', translation: 'ум - mind' },
			{ pronoun: 'Ы ы', form: '⚠️ Unique sound! Between "i" and "u"', translation: 'ты - you' },
			{ pronoun: 'Э э', form: 'like "e" in met', translation: 'это - this' }
		]
	},
	{
		type: 'title',
		content: 'Soft Vowels'
	},
	{
		type: 'paragraph',
		content: 'The 5 soft vowels "soften" (palatalize) the consonant that precedes them. They often contain a "y" sound at the beginning of a word or after another vowel:'
	},
	{
		type: 'conjugationTable',
		title: 'Soft Vowels (мягкие гласные)',
		rows: [
			{ pronoun: 'Я я', form: 'like "ya" in yard', translation: 'я - I' },
			{ pronoun: 'Ё ё', form: 'like "yo" in yoga', translation: 'ёжик - hedgehog' },
			{ pronoun: 'Ю ю', form: 'like "you"', translation: 'юг - south' },
			{ pronoun: 'И и', form: 'like "ee" in see', translation: 'мир - world/peace' },
			{ pronoun: 'Е е', form: '"ye" at start, "e" after consonant', translation: 'ель - fir tree' }
		]
	},
	{
		type: 'title',
		content: 'Hard ↔ Soft Correspondence'
	},
	{
		type: 'paragraph',
		content: 'Each hard vowel has a soft counterpart. They represent the same basic sound, but the soft one softens the preceding consonant:'
	},
	{
		type: 'conjugationTable',
		title: 'Vowel Pairs',
		rows: [
			{ pronoun: 'А (hard)', form: '↔', translation: 'Я (soft)' },
			{ pronoun: 'О (hard)', form: '↔', translation: 'Ё (soft)' },
			{ pronoun: 'У (hard)', form: '↔', translation: 'Ю (soft)' },
			{ pronoun: 'Ы (hard)', form: '↔', translation: 'И (soft)' },
			{ pronoun: 'Э (hard)', form: '↔', translation: 'Е (soft)' }
		]
	},
	{
		type: 'importantNote',
		title: 'Concrete Example',
		content: 'Compare: **мат** (mat - swear word) vs **мят** (myat - crumpled). The only difference is А vs Я, but the М is pronounced differently! In "мят", the М is palatalized (softened).'
	}
]

async function updateVowelSection() {
	console.log('Updating vowel section in lesson 34...\n')

	// Fetch current lesson
	const { data: lesson, error: fetchError } = await supabase
		.from('lessons')
		.select('blocks_fr, blocks_en')
		.eq('id', LESSON_ID)
		.single()

	if (fetchError) {
		console.error('Error fetching lesson:', fetchError)
		return
	}

	console.log('Current structure:')
	console.log('Blocks FR:', lesson.blocks_fr.length, 'blocks')
	console.log('Blocks EN:', lesson.blocks_en.length, 'blocks')

	// Show current blocks 7-10
	console.log('\nBlocks to replace (7-10):')
	for (let i = 7; i <= 10; i++) {
		if (lesson.blocks_fr[i]) {
			console.log(`  [${i}] ${lesson.blocks_fr[i].type} - ${lesson.blocks_fr[i].title || lesson.blocks_fr[i].content?.slice(0, 50) || ''}`)
		}
	}

	// Build new blocks arrays
	// Keep blocks 0-6, add new section title, add new vowel content, keep rest from 11+
	const blocks_fr_updated = [
		...lesson.blocks_fr.slice(0, 7),  // Keep 0-6 (mainTitle through conjugationTable vowels/consonants)
		{ type: 'title', content: 'Le système vocalique russe' },  // New section title
		...newBlocksFr,
		...lesson.blocks_fr.slice(11)  // Skip old 7-10, keep rest
	]

	const blocks_en_updated = [
		...lesson.blocks_en.slice(0, 7),
		{ type: 'title', content: 'The Russian Vowel System' },
		...newBlocksEn,
		...lesson.blocks_en.slice(11)
	]

	console.log('\nNew structure:')
	console.log('Blocks FR:', blocks_fr_updated.length, 'blocks')
	console.log('Blocks EN:', blocks_en_updated.length, 'blocks')

	// Update lesson
	const { error: updateError } = await supabase
		.from('lessons')
		.update({
			blocks_fr: blocks_fr_updated,
			blocks_en: blocks_en_updated
		})
		.eq('id', LESSON_ID)

	if (updateError) {
		console.error('Error updating lesson:', updateError)
		return
	}

	console.log('\n✅ Vowel section updated successfully!')
	console.log('\nNew vowel section includes:')
	console.log('  - Explanation of hard vs soft vowels concept')
	console.log('  - Table of 5 hard vowels (А, О, У, Ы, Э)')
	console.log('  - Table of 5 soft vowels (Я, Ё, Ю, И, Е)')
	console.log('  - Correspondence table showing pairs')
	console.log('  - Concrete example with мат vs мят')
}

updateVowelSection().catch(console.error)
