'use client'

import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { useFlashcards } from '@/context/flashcards'
import { deleteWord } from '@/lib/words-client'
import { deleteGuestWord } from '@/utils/guestDictionary'
import { filterWordsByLanguage } from '@/utils/wordMapping'
import { useMaterialWords } from '@/hooks/words/useMaterialWords'
import { EmptyWordsState } from '@/components/words/EmptyWordsState'
import { WordCard } from '@/components/words/WordCard'
import toast from '@/utils/toast'
import { Box, Button } from '@mui/material'
import { FlashOnRounded } from '@mui/icons-material'

const WordsContainer = ({ sx = {} }) => {
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
		mutationFn: deleteWord,
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
			<Box sx={sx}>
				<EmptyWordsState isGuest={!isUserLoggedIn} />
			</Box>
		)
	}

	return (
		<Box sx={sx}>
			{/* Review button */}
			<Button
				fullWidth
				variant="contained"
				size="large"
				startIcon={<FlashOnRounded />}
				onClick={() => openFlashcards()}
				sx={{
					py: 2.5,
					borderRadius: 3,
					background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
					border: '1px solid rgba(139, 92, 246, 0.3)',
					fontWeight: 700,
					fontSize: { xs: '1rem', sm: '1.0625rem' },
					textTransform: 'none',
					boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
					transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
					mb: 3,
					'&:hover': {
						background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
						transform: 'translateY(-3px)',
						boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
						borderColor: 'rgba(139, 92, 246, 0.5)',
					},
					'&:active': {
						transform: 'translateY(0)',
					},
				}}>
				{t('repeatwords')}
			</Button>

			{/* Words list */}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
				{filteredWords.map((word, index) => (
					<WordCard
						key={word.id || index}
						word={word}
						onDelete={handleDelete}
						userLearningLanguage={userLearningLanguage}
						locale={locale}
					/>
				))}
			</Box>
		</Box>
	)
}

// Memoize component to avoid re-renders
export default React.memo(WordsContainer)
