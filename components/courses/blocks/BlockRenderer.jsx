import DialogueBlock from './DialogueBlock'
import GrammarBlock from './GrammarBlock'
import CultureBlock from './CultureBlock'
import TipBlock from './TipBlock'
import VocabularyBlock from './VocabularyBlock'
import ConversationBlock from './ConversationBlock'
import SummaryBlock from './SummaryBlock'
import ExerciseInlineBlock from './ExerciseInlineBlock'
import { Box, Typography } from '@mui/material'

/**
 * BlockRenderer - Composant central qui rend le bon type de block
 * @param {Object} block - Le block à rendre
 * @param {number} index - Index du block
 */
const BlockRenderer = ({ block, index }) => {
	if (!block || !block.type) {
		return null
	}

	switch (block.type) {
		case 'dialogue':
			return <DialogueBlock block={block} key={index} />

		case 'grammar':
			return <GrammarBlock block={block} key={index} />

		case 'culture':
			return <CultureBlock block={block} key={index} />

		case 'tip':
			return <TipBlock block={block} key={index} />

		case 'vocabulary':
			return <VocabularyBlock block={block} key={index} />

		case 'conversation':
			return <ConversationBlock block={block} key={index} />

		case 'summary':
			return <SummaryBlock block={block} key={index} />

		case 'exerciseInline':
			return <ExerciseInlineBlock block={block} key={index} />

		// Types non encore implémentés
		case 'audio':
		case 'pronunciation':
		case 'review':
		case 'transition':
		case 'exerciseLink':
			return (
				<Box
					key={index}
					sx={{
						p: 2,
						mb: 2,
						borderRadius: 2,
						background: 'rgba(251, 146, 60, 0.1)',
						border: '1px dashed rgba(251, 146, 60, 0.5)',
					}}>
					<Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
						Type de block &ldquo;{block.type}&rdquo; à implémenter
					</Typography>
					{block.title && (
						<Typography sx={{ fontWeight: 600, mt: 0.5 }}>{block.title}</Typography>
					)}
				</Box>
			)

		default:
			console.warn(`Type de block inconnu: ${block.type}`)
			return (
				<Box
					key={index}
					sx={{
						p: 2,
						mb: 2,
						borderRadius: 2,
						background: 'rgba(239, 68, 68, 0.1)',
						border: '1px dashed rgba(239, 68, 68, 0.5)',
					}}>
					<Typography sx={{ color: 'error.main' }}>
						Type de block inconnu : &ldquo;{block.type}&rdquo;
					</Typography>
				</Box>
			)
	}
}

export default BlockRenderer
