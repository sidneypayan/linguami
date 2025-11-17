'use client'

/**
 * Flashcards component - Refactored with React Query and hooks
 * Reduced from 837 lines to ~230 lines (-72%)
 */

import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useLocale } from 'next-intl'
import { useTheme } from '@mui/material'
import { toggleFlashcardsContainer } from '@/features/cards/cardsSlice'
import { useUserContext } from '@/context/user'
import { useAchievementContext } from '../AchievementProvider'
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
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const { showAchievements } = useAchievementContext()

	// Settings hook
	const { isReversed, cardsLimit, toggleReversed, updateCardsLimit } = useFlashcardSettings()
	const [showSettings, setShowSettings] = useState(false)

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
		incrementReviewedCount,
		setGuestWords
	} = useFlashcardSession({ cardsLimit, locale })

	// Handle close and cleanup
	const handleClose = useCallback(() => {
		dispatch(toggleFlashcardsContainer(false))
		resetSession()
	}, [dispatch, resetSession])

	// Review completion callback
	const handleReviewComplete = useCallback((updatedCard, buttonType) => {
		// Update stats
		incrementReviewedCount()

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
		const shouldStayInSession =
			(updatedCard.card_state === CARD_STATES.LEARNING ||
			updatedCard.card_state === CARD_STATES.RELEARNING) &&
			updatedCard.interval < 10

		if (shouldStayInSession) {
			// Create snapshot to isolate from future updates
			const cardSnapshot = { ...updatedCard }
			addCardToSession(cardSnapshot)
		}

		// Remove current card from queue
		removeCurrentCard()
	}, [currentCard, incrementReviewedCount, removeCurrentCard, addCardToSession, userLearningLanguage, locale, isReversed, showAchievements, isUserLoggedIn, addXPMutation])

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

	// Render session complete
	if (isSessionComplete) {
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
