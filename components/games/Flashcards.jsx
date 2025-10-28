import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../styles/FlashCards.module.css'
import { useState, useEffect, useMemo } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import { updateWordReview, initializeWordSRS } from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import {
	getDueCards,
	getButtonIntervals,
	BUTTON_TYPES,
	CARD_STATES
} from '../../utils/spacedRepetition'

const FlashCards = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { user_material_words, user_words } = useSelector(store => store.words)
	const [showAnswer, setShowAnswer] = useState(false)
	const [reviewedCount, setReviewedCount] = useState(0)
	const [sessionStartTime] = useState(Date.now())
	const [sessionCards, setSessionCards] = useState([])
	const [sessionInitialized, setSessionInitialized] = useState(false)

	// Get appropriate word array based on current page
	const wordsArray =
		router.pathname === '/dictionary' ? user_words : user_material_words

	// Initialize session cards ONLY on first mount
	useEffect(() => {
		if (sessionInitialized) return // Don't reinitialize during session

		// Initialize any cards that don't have SRS fields
		// Create deep copies to avoid reference issues
		const initializedCards = wordsArray.map(card => {
			if (!card.card_state) {
				// DON'T dispatch initialization during session to avoid async conflicts
				// Cards will be initialized in DB when they're actually reviewed
				// Return card with temporary initialized values for session use
				return {
					...card,
					card_state: CARD_STATES.NEW,
					ease_factor: 2.5,
					interval: 0,
					learning_step: null,
					next_review_date: null,
					last_review_date: null,
					reviews_count: 0,
					lapses: 0
				}
			}
			// Create a copy to avoid Redux reference issues
			return { ...card }
		})

		// Filter for due cards and set as session cards
		const dueCards = getDueCards(initializedCards)
		if (dueCards.length > 0) {
			setSessionCards(dueCards)
			setSessionInitialized(true) // Mark as initialized
		}
	}, [wordsArray, dispatch, sessionInitialized])

	// Get current card (first in session queue)
	const currentCard = sessionCards[0]

	// Get button intervals for current card
	const buttonIntervals = useMemo(() => {
		if (!currentCard) return null

		// Debug: log current card state
		console.log('🎴 Current card:', {
			id: currentCard.id,
			word: currentCard.word_ru,
			state: currentCard.card_state,
			interval: currentCard.interval,
			learning_step: currentCard.learning_step
		})

		const intervals = getButtonIntervals(currentCard)
		console.log('⏱️ Button intervals:', intervals)

		return intervals
	}, [currentCard])

	// Handle card review
	const handleReview = async (buttonType) => {
		if (!currentCard) return

		// Dispatch review update
		const result = await dispatch(updateWordReview({
			wordId: currentCard.id,
			buttonType,
			currentCard
		}))

		// Get the updated card from the result
		const updatedCard = result.payload

		// Update stats
		setReviewedCount(prev => prev + 1)

		// Determine if card should stay in session or be removed
		// Cards in LEARNING/RELEARNING with short intervals stay in session
		// This allows "Encore" and "Difficile" to cycle back, but "Bien" graduates out
		const shouldStayInSession =
			(updatedCard.card_state === CARD_STATES.LEARNING ||
			updatedCard.card_state === CARD_STATES.RELEARNING) &&
			updatedCard.interval < 10 // Less than 10 minutes stays in session

		setSessionCards(prevCards => {
			// Remove the current card from the front
			const remainingCards = prevCards.slice(1)

			if (shouldStayInSession) {
				// Create a deep copy to isolate from future Redux updates
				const cardSnapshot = {
					...updatedCard,
					// Ensure nested objects are also copied
					id: updatedCard.id,
					word_ru: updatedCard.word_ru,
					word_fr: updatedCard.word_fr,
					card_state: updatedCard.card_state,
					ease_factor: updatedCard.ease_factor,
					interval: updatedCard.interval,
					learning_step: updatedCard.learning_step,
				}
				// Put the card back at the end of the queue
				return [...remainingCards, cardSnapshot]
			} else {
				// Card has longer interval or graduated to REVIEW, remove it from session
				return remainingCards
			}
		})

		setShowAnswer(false)
	}

	// Check if session is complete (no more cards in session)
	const isSessionComplete = sessionCards.length === 0 && reviewedCount > 0

	// If no cards in session, show completion message
	if (isSessionComplete) {
		const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 60000) // minutes

		return (
			<div className={styles.container}>
				<FontAwesomeIcon
					onClick={() => {
						dispatch(toggleFlashcardsContainer(false))
						setSessionInitialized(false)
					}}
					className={styles.closeIcon}
					icon={faXmark}
					size='2xl'
				/>
				<h3 className={styles.flashcardsTitle}>Bravo !</h3>
				<div className={styles.wordsContainer}>
					<div className={styles.statsContainer}>
						<p className={styles.statsText}>
							Vous avez terminé la révision !
						</p>
						{reviewedCount > 0 && (
							<div className={styles.sessionStats}>
								<p><strong>{reviewedCount}</strong> carte{reviewedCount > 1 ? 's' : ''} révisée{reviewedCount > 1 ? 's' : ''}</p>
								{sessionDuration > 0 && (
									<p><strong>{sessionDuration}</strong> minute{sessionDuration > 1 ? 's' : ''}</p>
								)}
							</div>
						)}
					</div>
					<button
						onClick={() => {
							dispatch(toggleFlashcardsContainer(false))
							setReviewedCount(0)
							setSessionInitialized(false) // Reset for next session
						}}
						className='mainBtn'>
						Fermer
					</button>
				</div>
			</div>
		)
	}

	// If no current card, show loading
	if (!currentCard) {
		return (
			<div className={styles.container}>
				<p>Chargement...</p>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<FontAwesomeIcon
				onClick={() => {
					dispatch(toggleFlashcardsContainer(false))
					setSessionInitialized(false)
				}}
				className={styles.closeIcon}
				icon={faXmark}
				size='2xl'
			/>

			{/* Header with stats */}
			<div className={styles.header}>
				<h3 className={styles.flashcardsTitle}>
					Essayez de vous souvenir de la traduction en français
				</h3>
				<div className={styles.progressInfo}>
					<span className={styles.cardsRemaining}>
						{sessionCards.length} carte{sessionCards.length > 1 ? 's' : ''} à réviser
					</span>
					{currentCard.card_state === CARD_STATES.NEW && (
						<span className={styles.newBadge}>Nouveau</span>
					)}
					{currentCard.card_state === CARD_STATES.RELEARNING && (
						<span className={styles.relearningBadge}>Réapprentissage</span>
					)}
				</div>
			</div>

			<div className={styles.wordsContainer}>
				{/* Russian word */}
				<div className={styles.originalWord}>
					{currentCard.word_ru}
				</div>

				{/* Show context sentence if available */}
				{currentCard.word_sentence && (
					<div className={styles.contextSentence}>
						<em>{currentCard.word_sentence}</em>
					</div>
				)}

				{showAnswer ? (
					<>
						{/* French translation */}
						<div className={styles.translatedWord}>
							{currentCard.word_fr}
						</div>

						{/* 4 Anki-style buttons */}
						<div className={styles.btnsContainer}>
							<button
								className={styles.againBtn}
								onClick={() => handleReview(BUTTON_TYPES.AGAIN)}
								title="Carte complètement oubliée">
								<span className={styles.btnLabel}>Encore</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.again || '<1min'}
								</span>
							</button>

							<button
								className={styles.hardBtn}
								onClick={() => handleReview(BUTTON_TYPES.HARD)}
								title="Correct mais avec beaucoup d'effort">
								<span className={styles.btnLabel}>Difficile</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.hard || '6min'}
								</span>
							</button>

							<button
								className={styles.goodBtn}
								onClick={() => handleReview(BUTTON_TYPES.GOOD)}
								title="Correct avec un effort normal">
								<span className={styles.btnLabel}>Bien</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.good || '10min'}
								</span>
							</button>

							<button
								className={styles.easyBtn}
								onClick={() => handleReview(BUTTON_TYPES.EASY)}
								title="Correct instantanément, très facile">
								<span className={styles.btnLabel}>Facile</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.easy || '4j'}
								</span>
							</button>
						</div>
					</>
				) : (
					<button
						className={styles.showAnswerBtn}
						onClick={() => setShowAnswer(true)}>
						Montrer la réponse
					</button>
				)}
			</div>
		</div>
	)
}

export default FlashCards
