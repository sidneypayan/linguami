import DialogueBlock from './DialogueBlock'
import GrammarBlock from './GrammarBlock'
import CultureBlock from './CultureBlock'
import TipBlock from './TipBlock'
import VocabularyBlock from './VocabularyBlock'
import ConversationBlock from './ConversationBlock'
import SummaryBlock from './SummaryBlock'
import ExerciseInlineBlock from './ExerciseInlineBlock'
import ExerciseLinkBlock from './ExerciseLinkBlock'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { logger } from '@/utils/logger'
import { AlertTriangle, HelpCircle } from 'lucide-react'

/**
 * BlockRenderer - Composant central qui rend le bon type de block
 * Style gaming/fantasy
 */
const BlockRenderer = ({ block, index }) => {
	const { isDark } = useThemeMode()

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

		case 'exerciseLink':
			return <ExerciseLinkBlock block={block} key={index} />

		// Types non encore implementes
		case 'audio':
		case 'pronunciation':
		case 'review':
		case 'transition':
			return (
				<div
					key={index}
					className={cn(
						'p-4 mb-4 rounded-xl border-2 border-dashed',
						isDark
							? 'bg-amber-500/10 border-amber-500/30'
							: 'bg-amber-50 border-amber-300'
					)}
				>
					<div className="flex items-start gap-3">
						<div className={cn(
							'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
							'bg-gradient-to-br from-amber-400 to-orange-500'
						)}>
							<AlertTriangle className="w-5 h-5 text-white" />
						</div>
						<div>
							<p className={cn(
								'font-semibold',
								isDark ? 'text-amber-400' : 'text-amber-700'
							)}>
								Type de bloc &ldquo;{block.type}&rdquo; a implementer
							</p>
							{block.title && (
								<p className={cn(
									'mt-1 font-medium',
									isDark ? 'text-slate-300' : 'text-slate-700'
								)}>
									{block.title}
								</p>
							)}
						</div>
					</div>
				</div>
			)

		default:
			logger.warn(`Type de block inconnu: ${block.type}`)
			return (
				<div
					key={index}
					className={cn(
						'p-4 mb-4 rounded-xl border-2 border-dashed',
						isDark
							? 'bg-red-500/10 border-red-500/30'
							: 'bg-red-50 border-red-300'
					)}
				>
					<div className="flex items-start gap-3">
						<div className={cn(
							'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
							'bg-gradient-to-br from-red-400 to-rose-500'
						)}>
							<HelpCircle className="w-5 h-5 text-white" />
						</div>
						<p className={cn(
							'font-semibold',
							isDark ? 'text-red-400' : 'text-red-700'
						)}>
							Type de bloc inconnu : &ldquo;{block.type}&rdquo;
						</p>
					</div>
				</div>
			)
	}
}

export default BlockRenderer
