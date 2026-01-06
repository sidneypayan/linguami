'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useThemeMode } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'
import { triggerCelebration } from '@/components/shared/CelebrationOverlay'
import toast from '@/utils/toast'
import FillInTheBlankSequential from '@/components/exercises/FillInTheBlankSequential'
import DragAndDropSequential from '@/components/exercises/DragAndDropSequential'

/**
 * ExerciseInlineBlock - Wrapper pour exercices inline dans les leçons
 * Utilise les composants d'exercices existants pour éviter la duplication
 * Supporte: fillInBlank, dragAndDrop
 */
const ExerciseInlineBlock = ({ block }) => {
	const t = useTranslations('common')
	const { isDark } = useThemeMode()
	const params = useParams()
	const locale = params?.locale || 'fr'

	const { title, questions, xpReward, exerciseType, pairs } = block

	// Detecter le type d'exercice
	const isDragAndDrop = exerciseType === 'dragAndDrop' || pairs

	// Convertir les données du bloc en format compatible avec les composants d'exercices
	const exerciseData = useMemo(() => {
		if (isDragAndDrop) {
			// Drag and Drop: convertir les pairs multilingues
			return {
				id: `inline-${block.type}-${Date.now()}`,
				type: 'drag_and_drop',
				title: title || '',
				xp_reward: xpReward || 10,
				data: {
					pairs: pairs?.map((pair, index) => ({
						id: pair.id || index,
						left: pair.left?.[locale] || pair.left?.fr || pair.left || '',
						right: pair.right?.[locale] || pair.right?.fr || pair.right || ''
					})) || []
				}
			}
		} else {
			// Fill in the blank: convertir questions en sentences
			return {
				id: `inline-${block.type}-${Date.now()}`,
				type: 'fill_in_blank',
				title: title || '',
				xp_reward: xpReward || 10,
				data: {
					sentences: questions?.map((q, index) => ({
						id: index,
						question: q.question || '',
						answer: q.answer || '',
						acceptableAnswers: q.acceptableAnswers || [q.answer],
						hint: q.hint || ''
					})) || []
				}
			}
		}
	}, [isDragAndDrop, block.type, title, xpReward, pairs, questions, locale])

	// Callback quand l'exercice est complété
	const handleComplete = async ({ score }) => {
		if (score === 100) {
			toast.success(t('methode_exercise_perfect_score'))
			// Trigger celebration animation
			setTimeout(() => {
				triggerCelebration({
					type: 'lesson',
					xpGained: xpReward || 10,
					goldGained: 0
				})
			}, 500)
		}

		return { isFirstCompletion: true }
	}

	// Container avec style gaming
	return (
		<div className={cn(
			'relative rounded-2xl border-2 overflow-hidden',
			isDark
				? 'bg-gradient-to-br from-purple-950/50 via-slate-900 to-pink-950/30 border-purple-500/30'
				: 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-200'
		)}>
			{/* Effet de brillance */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

			{/* Title */}
			{title && (
				<div className={cn(
					'relative p-3 sm:p-4 border-b',
					isDark ? 'border-purple-500/20' : 'border-purple-200'
				)}>
					<h4 className={cn(
						'font-bold text-lg',
						isDark ? 'text-white' : 'text-slate-900'
					)}>
						{title}
					</h4>
				</div>
			)}

			{/* Exercise Component */}
			<div className="relative p-2">
				{isDragAndDrop ? (
					<DragAndDropSequential
						exercise={exerciseData}
						onComplete={handleComplete}
					/>
				) : (
					<FillInTheBlankSequential
						exercise={exerciseData}
						onComplete={handleComplete}
					/>
				)}
			</div>
		</div>
	)
}

export default ExerciseInlineBlock
