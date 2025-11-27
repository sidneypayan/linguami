'use client'

import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Zap } from 'lucide-react'
import { useUserContext } from '@/context/user'
import { useFlashcards } from '@/context/flashcards'
import { deleteWordAction } from '@/app/actions/words'
import { deleteGuestWord } from '@/utils/guestDictionary'
import { filterWordsByLanguage } from '@/utils/wordMapping'
import { useMaterialWords } from '@/hooks/words/useMaterialWords'
import { EmptyWordsState } from '@/components/words/EmptyWordsState'
import { WordCard } from '@/components/words/WordCard'
import toast from '@/utils/toast'
import { cn } from '@/lib/utils'

const WordsContainer = ({ className }) => {
	const t = useTranslations('words')
	const locale = useLocale()
	const params = useParams()
	const { openFlashcards } = useFlashcards()
	const queryClient = useQueryClient()
	const { user, isUserLoggedIn, userLearningLanguage } = useUserContext()

	const materialId = params?.material
	const userId = user?.id

	// Get material words (React Query for logged-in, localStorage for guests)
	const { words, isLoading } = useMaterialWords({ materialId, userId, isUserLoggedIn })

	// Filter words by language pair
	const filteredWords = useMemo(() => {
		return filterWordsByLanguage(words, userLearningLanguage, locale)
	}, [words, userLearningLanguage, locale])

	// Delete word mutation (for logged-in users)
	const deleteMutation = useMutation({
		mutationFn: deleteWordAction,
		onSuccess: () => {
			// Normalize materialId to string for consistent queryKey
			const normalizedMaterialId = materialId ? String(materialId) : null
			queryClient.invalidateQueries({ queryKey: ['materialWords', normalizedMaterialId, userId] })
			toast.success(t('word_deleted') || 'Mot supprimé')
		},
		onError: () => {
			toast.error(t('delete_error') || 'Erreur lors de la suppression')
		},
	})

	// Handle delete (works for both logged-in users and guests)
	const handleDelete = (id) => {
		if (isUserLoggedIn) {
			deleteMutation.mutate(id)
		} else {
			// Delete guest word
			const success = deleteGuestWord(id)
			if (success) {
				toast.success(t('word_deleted') || 'Mot supprimé')
				// Emit event to notify other components
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event('guestWordDeleted'))
				}
			} else {
				toast.error(t('delete_error') || 'Erreur lors de la suppression')
			}
		}
	}

	// Show empty state if no words
	if (filteredWords.length === 0) {
		return (
			<div className={className}>
				<EmptyWordsState isGuest={!isUserLoggedIn} />
			</div>
		)
	}

	return (
		<div className={className}>
			{/* Review button */}
			<button
				onClick={() => openFlashcards()}
				className={cn(
					'group w-full py-4 px-6 rounded-xl mb-6',
					'bg-gradient-to-r from-violet-500 to-cyan-500',
					'border border-violet-500/30',
					'font-bold text-base sm:text-lg text-white',
					'shadow-[0_8px_32px_rgba(139,92,246,0.4)]',
					'transition-all duration-400 ease-out',
					'hover:from-cyan-500 hover:to-violet-500',
					'hover:-translate-y-1',
					'hover:shadow-[0_12px_40px_rgba(139,92,246,0.5)]',
					'active:translate-y-0',
					'flex items-center justify-center gap-2'
				)}
			>
				<Zap className="w-5 h-5 transition-transform group-hover:scale-110" />
				{t('repeatwords')}
			</button>

			{/* Words list */}
			<div className="flex flex-col gap-3">
				{filteredWords.map((word, index) => (
					<WordCard
						key={word.id || index}
						word={word}
						onDelete={handleDelete}
						userLearningLanguage={userLearningLanguage}
						locale={locale}
					/>
				))}
			</div>
		</div>
	)
}

// Memoize component to avoid re-renders
export default React.memo(WordsContainer)
