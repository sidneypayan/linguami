/**
 * Hook to manage flashcard review operations
 * Handles review mutations with React Query for logged-in users
 * and localStorage for guests
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserContext } from '@/context/user'
import { updateCardReview, suspendCard } from '@/lib/flashcards-client'
import { calculateNextReview, CARD_STATES, BUTTON_TYPES } from '@/utils/spacedRepetition'
import { updateGuestWord } from '@/utils/guestDictionary'
import toast from '@/utils/toast'
import { useTranslations } from 'next-intl'
import { logger } from '@/utils/logger'

export function useFlashcardReview({
	onReviewComplete,
	onSuspendComplete,
	setGuestWords
}) {
	const t = useTranslations('words')
	const queryClient = useQueryClient()
	const { user, isUserLoggedIn, userLearningLanguage } = useUserContext()
	const userId = user?.id

	// Mutation for updating card review (logged-in users)
	const reviewMutation = useMutation({
		mutationFn: updateCardReview,
		onSuccess: (updatedCard, variables) => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['userWords', userId, userLearningLanguage] })
			queryClient.invalidateQueries({ queryKey: ['materialWords'] })

			logger.log('[useFlashcardReview] Card updated:', updatedCard.id)

			// Call success callback with buttonType
			if (onReviewComplete) {
				onReviewComplete(updatedCard, variables.buttonType)
			}
		},
		onError: (error) => {
			logger.error('[useFlashcardReview] Review error:', error)
			toast.error(t('review_error') || 'Erreur lors de la révision')
		}
	})

	// Mutation for suspending card (logged-in users only)
	const suspendMutation = useMutation({
		mutationFn: suspendCard,
		onSuccess: (suspendedCard) => {
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['userWords', userId, userLearningLanguage] })
			queryClient.invalidateQueries({ queryKey: ['materialWords'] })

			toast.success(t('card_suspended') || 'Carte suspendue')
			logger.log('[useFlashcardReview] Card suspended:', suspendedCard.id)

			// Call success callback
			if (onSuspendComplete) {
				onSuspendComplete()
			}
		},
		onError: (error) => {
			logger.error('[useFlashcardReview] Suspend error:', error)
			toast.error(t('suspend_error') || 'Erreur lors de la suspension')
		}
	})

	/**
	 * Handle card review (works for both logged-in users and guests)
	 * @param {Object} currentCard - The card being reviewed
	 * @param {string} buttonType - Button pressed (again, hard, good, easy)
	 * @returns {Promise<Object>} Updated card
	 */
	const handleReview = async (currentCard, buttonType) => {
		if (!currentCard) return null

		let updatedCard

		if (isUserLoggedIn) {
			// Logged-in users: use React Query mutation
			const result = await reviewMutation.mutateAsync({
				wordId: currentCard.id,
				buttonType,
				currentCard
			})
			updatedCard = result
		} else {
			// Guests: calculate and save to localStorage
			updatedCard = calculateNextReview(currentCard, buttonType)
			const savedCard = updateGuestWord(currentCard.id, updatedCard)

			if (!savedCard) {
				toast.error(t('review_error') || 'Erreur lors de la révision')
				return null
			}

			// Update local guest words state
			if (setGuestWords) {
				setGuestWords(prev => prev.map(w => w.id === currentCard.id ? savedCard : w))
			}

			logger.log('[useFlashcardReview] Guest card updated:', savedCard.id)

			// Call success callback with buttonType
			if (onReviewComplete) {
				onReviewComplete(savedCard, buttonType)
			}

			updatedCard = savedCard
		}

		return updatedCard
	}

	/**
	 * Handle card suspension (logged-in users only)
	 * @param {Object} currentCard - The card to suspend
	 * @returns {Promise<void>}
	 */
	const handleSuspend = async (currentCard) => {
		if (!currentCard) return

		if (!isUserLoggedIn) {
			toast.error('La suspension n\'est disponible que pour les utilisateurs connectés')
			return
		}

		// Confirm with user
		if (!window.confirm(t('suspend_confirm') || 'Êtes-vous sûr de vouloir suspendre cette carte ?')) {
			return
		}

		await suspendMutation.mutateAsync(currentCard.id)
	}

	/**
	 * Determine if card should stay in session after review
	 * Cards in LEARNING/RELEARNING with short intervals stay in session
	 * @param {Object} updatedCard - The card after review
	 * @returns {boolean} True if card should stay in session
	 */
	const shouldStayInSession = (updatedCard) => {
		return (
			(updatedCard.card_state === CARD_STATES.LEARNING ||
			updatedCard.card_state === CARD_STATES.RELEARNING) &&
			updatedCard.interval < 10 // Less than 10 minutes stays in session
		)
	}

	return {
		handleReview,
		handleSuspend,
		shouldStayInSession,
		isReviewing: reviewMutation.isPending,
		isSuspending: suspendMutation.isPending
	}
}
