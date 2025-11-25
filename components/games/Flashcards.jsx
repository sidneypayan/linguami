'use client'

/**
 * Flashcards component - Refactored with React Query and hooks
 * Reduced from 837 lines to ~230 lines (-72%)
 */

import { useUserContext } from '@/context/user'
import { useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useTheme } from '@mui/material'
import { useFlashcards } from '@/context/flashcards'
import { useAchievementContext } from '../gamification/AchievementProvider'
import { CARD_STATES } from '@/utils/spacedRepetition'
import { logger } from '@/utils/logger'

// Hooks
import { useFlashcardSettings } from '@/hooks/flashcards/useFlashcardSettings'
import { useFlashcardSession } from '@/hooks/flashcards/useFlashcardSession'
import { useFlashcardReview } from '@/hooks/flashcards/useFlashcardReview'
import { useAddXP } from '@/hooks/gamification/useAddXP'

// UI Components
import { LoadingState } from '@/components/flashcards/LoadingState'
import { SessionComplete } from '@/components/flashcards/SessionComplete'
import { NoCardsState } from '@/components/flashcards/NoCardsState'
import { FlashcardReviewCard } from '@/components/flashcards/FlashcardReviewCard'
import { ReviewSettings } from '@/components/flashcards/ReviewSettings'

const Flashcards = () => {
	const locale = useLocale()
	const theme = useTheme()
	const { closeFlashcards } = useFlashcards()
	const isDark = theme.palette.mode === 'dark'
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const { showAchievements } = useAchievementContext()

	// Settings hook
	const { isReversed, cardsLimit, toggleReversed, updateCardsLimit } = useFlashcardSettings()
	const [showSettings, setShowSettings] = useState(false)
	const [isProcessingReview, setIsProcessingReview] = useState(false)

	// XP mutation
	const addXPMutation = useAddXP()

	// Session hook
	const {
		sessionCards,
		currentCard,
		reviewedCount,
		sessionDuration,
		isSessionComplete,
		sessionInitialized,
		filteredWords,
		resetSession,
		startRandomPractice,
		removeCurrentCard,
		addCardToSession,
		requeueCurrentCard,
		incrementReviewedCount,
		setGuestWords
	} = useFlashcardSession({ cardsLimit, locale })

	// Handle close and cleanup
	const handleClose = useCallback(() => {
		closeFlashcards()
		resetSession()
	}, [closeFlashcards, resetSession])

	// Review completion callback
	const handleReviewComplete = useCallback((updatedCard, buttonType) => {
		// Note: isProcessingReview is already true (set in handleReviewWithButton before async call)

		// Add XP for the review (except for "again" button)
		// Add XP only for logged-in users (async, don't block user flow)
		if (isUserLoggedIn && buttonType !== 'again') {
			// Get front word for XP description
			const sourceWord = currentCard?.[`word_${userLearningLanguage}`]
			const translationWord = currentCard?.[`word_${locale}`]
			const frontWord = isReversed ? translationWord : sourceWord

			addXPMutation.mutate({
				actionType: `flashcard_${buttonType}`,
				sourceId: currentCard.id.toString(),
				description: `Reviewed: ${frontWord}`
			}, {
				onSuccess: (data) => {
					if (data.achievements && data.achievements.length > 0) {
						showAchievements(data.achievements)
					}
				},
				onError: (error) => {
					logger.error('[Flashcards] Error adding XP:', error)
				}
			})
		}


		// Determine if card should stay in session
		// RELEARNING_STEPS[0] is 10 minutes, so we use <= 10
		const shouldStayInSession =
			(updatedCard.card_state === CARD_STATES.LEARNING ||
			updatedCard.card_state === CARD_STATES.RELEARNING) &&
			updatedCard.interval <= 10

		// Create snapshot to isolate from future updates
		const cardSnapshot = { ...updatedCard }

		if (shouldStayInSession) {
			// Atomically remove from front and add to back (prevents "session complete" flash)
			requeueCurrentCard(cardSnapshot)
		} else {
			// Just remove the card from queue
			removeCurrentCard()
		}

		// Update stats AFTER queue operations to prevent "session complete" flash
		incrementReviewedCount()

		setIsProcessingReview(false)
	}, [currentCard, incrementReviewedCount, removeCurrentCard, requeueCurrentCard, userLearningLanguage, locale, isReversed, showAchievements, isUserLoggedIn, addXPMutation])

	// Suspend completion callback
	const handleSuspendComplete = useCallback(() => {
		removeCurrentCard()
	}, [removeCurrentCard])

	// Review hook with mutations
	const { handleReview, handleSuspend } = useFlashcardReview({
		onReviewComplete: handleReviewComplete,
		onSuspendComplete: handleSuspendComplete,
		setGuestWords
	})

	// Wrap review handler to pass button type
	const handleReviewWithButton = useCallback(async (buttonType) => {
		// Set processing flag BEFORE the async operation to prevent "session complete" flash
		setIsProcessingReview(true)
		await handleReview(currentCard, buttonType)
	}, [handleReview, currentCard])

	// Wrap suspend handler
	const handleSuspendClick = useCallback(async () => {
		await handleSuspend(currentCard)
	}, [handleSuspend, currentCard])

	// Handle start random practice
	const handleStartPractice = useCallback((practiceCount) => {
		startRandomPractice(practiceCount)
	}, [startRandomPractice])

	// Render loading state
	if (!sessionInitialized) {
		return <LoadingState onClose={handleClose} isDark={isDark} />
	}

	// Render session complete (but not if we're still processing a review)
	if (isSessionComplete && !isProcessingReview) {
		return (
			<SessionComplete
				reviewedCount={reviewedCount}
				sessionDuration={sessionDuration}
				onClose={handleClose}
				isDark={isDark}
			/>
		)
	}

	// Render no cards state (no words or no cards due)
	if (!currentCard) {
		const hasWords = filteredWords && filteredWords.length > 0

		return (
			<NoCardsState
				hasWords={hasWords}
				onClose={handleClose}
				onStartPractice={handleStartPractice}
				isDark={isDark}
			/>
		)
	}

	// Render review card
	return (
		<FlashcardReviewCard
			currentCard={currentCard}
			sessionCards={sessionCards}
			cardsLimit={cardsLimit}
			isReversed={isReversed}
			onReview={handleReviewWithButton}
			onSuspend={handleSuspendClick}
			onClose={handleClose}
			onToggleReversed={toggleReversed}
			onToggleSettings={() => setShowSettings(prev => !prev)}
			showSettings={showSettings}
			settings={
				<ReviewSettings
					cardsLimit={cardsLimit}
					onUpdateLimit={updateCardsLimit}
					onClose={() => setShowSettings(false)}
				/>
			}
			isDark={isDark}
			userLearningLanguage={userLearningLanguage}
			locale={locale}
		/>
	)
}

export default Flashcards
