'use client'

/**
 * Flashcards component - Refactored with React Query and hooks
 * Reduced from 837 lines to ~230 lines (-72%)
 */

import { useUserContext } from '@/context/user'
import { useState, useCallback, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useThemeMode } from '@/context/ThemeContext'
import { useFlashcards, SESSION_MODE } from '@/context/flashcards'
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


const Flashcards = () => {
	const locale = useLocale()
	const { isDark } = useThemeMode()
	const { closeFlashcards, sessionOptions } = useFlashcards()
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const { showAchievements } = useAchievementContext()

	// Settings hook (only for isReversed now)
	const { isReversed, toggleReversed } = useFlashcardSettings()
	const [isProcessingReview, setIsProcessingReview] = useState(false)
	const [showTimeUpMessage, setShowTimeUpMessage] = useState(false)

	// XP mutation
	const addXPMutation = useAddXP()

	// Get limits from session options
	const cardsLimit = sessionOptions.cardsLimit
	const timeLimit = sessionOptions.mode === SESSION_MODE.TIME ? sessionOptions.timeLimit : null
	const isCustomSession = sessionOptions.isCustomSession || false

	// Session hook
	const {
		sessionCards,
		currentCard,
		reviewedCount,
		sessionDuration,
		remainingTime,
		isSessionComplete,
		isTimeUp,
		sessionInitialized,
		filteredWords,
		resetSession,
		startRandomPractice,
		removeCurrentCard,
		endSessionNow,
		addCardToSession,
		requeueCurrentCard,
		incrementReviewedCount,
		setGuestWords
	} = useFlashcardSession({ cardsLimit, timeLimit, isCustomSession, locale })

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


		// Update stats first
		incrementReviewedCount()

		// If time is up, end the session immediately (clear all remaining cards)
		if (isTimeUp) {
			endSessionNow()
			setIsProcessingReview(false)
			return
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

		setIsProcessingReview(false)
	}, [currentCard, incrementReviewedCount, removeCurrentCard, endSessionNow, requeueCurrentCard, userLearningLanguage, locale, isReversed, showAchievements, isUserLoggedIn, addXPMutation, isTimeUp])

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

	// When time is up, show message and wait for user to finish current card
	useEffect(() => {
		if (isTimeUp && !showTimeUpMessage) {
			setShowTimeUpMessage(true)
			logger.log('[Flashcards] Time is up! Finishing current card...')
		}
	}, [isTimeUp, showTimeUpMessage])

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
			timeLimit={timeLimit}
			remainingTime={remainingTime}
			isTimeUp={isTimeUp}
			isReversed={isReversed}
			onReview={handleReviewWithButton}
			onSuspend={handleSuspendClick}
			onClose={handleClose}
			onToggleReversed={toggleReversed}
			isDark={isDark}
			userLearningLanguage={userLearningLanguage}
			locale={locale}
		/>
	)
}

export default Flashcards
