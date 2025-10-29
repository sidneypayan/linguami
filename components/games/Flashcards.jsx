import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import styles from '../../styles/FlashCards.module.css'
import { useState, useEffect, useMemo } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import { updateWordReview, initializeWordSRS, suspendCard } from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'
import {
	getDueCards,
	getButtonIntervals,
	BUTTON_TYPES,
	CARD_STATES
} from '../../utils/spacedRepetition'

const FlashCards = () => {
	const { t } = useTranslation('words')
	const router = useRouter()
	const dispatch = useDispatch()
	const { user_material_words, user_words } = useSelector(store => store.words)
	const [showAnswer, setShowAnswer] = useState(false)
	const [reviewedCount, setReviewedCount] = useState(0)
	const [sessionStartTime] = useState(Date.now())
	const [sessionCards, setSessionCards] = useState([])
	const [sessionInitialized, setSessionInitialized] = useState(false)
	const [isReversed, setIsReversed] = useState(() => {
		// Charger la préférence depuis localStorage
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('flashcards_reversed')
			return saved === 'true'
		}
		return false
	})
	const [cardsLimit, setCardsLimit] = useState(() => {
		// Charger la limite depuis localStorage
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('flashcards_limit')
			return saved ? parseInt(saved, 10) : 20 // Par défaut 20 cartes
		}
		return 20
	})
	const [showSettings, setShowSettings] = useState(false)
	const [showPracticeOptions, setShowPracticeOptions] = useState(false)
	const [practiceCount, setPracticeCount] = useState(20)

	// Get appropriate word array based on current page
	const wordsArray =
		router.pathname === '/dictionary' ? user_words : user_material_words

	// Toggle reversed mode and save to localStorage
	const toggleReversed = () => {
		const newValue = !isReversed
		setIsReversed(newValue)
		if (typeof window !== 'undefined') {
			localStorage.setItem('flashcards_reversed', newValue.toString())
		}
	}

	// Update cards limit and save to localStorage
	const updateCardsLimit = (newLimit) => {
		setCardsLimit(newLimit)
		if (typeof window !== 'undefined') {
			localStorage.setItem('flashcards_limit', newLimit.toString())
		}

		// Réappliquer la limite à la session en cours
		if (wordsArray && wordsArray.length > 0) {
			// Initialiser les cartes avec les valeurs SRS si nécessaires
			const initializedCards = wordsArray.map(card => {
				if (!card.card_state) {
					return {
						...card,
						card_state: CARD_STATES.NEW,
						ease_factor: 2.5,
						interval: 0,
						learning_step: null,
						next_review_date: null,
						last_review_date: null,
						reviews_count: 0,
						lapses: 0,
						is_suspended: false
					}
				}
				return { ...card }
			})

			// Filtrer les cartes dues et appliquer la nouvelle limite
			const dueCards = getDueCards(initializedCards)
			const limitedCards = dueCards.slice(0, newLimit)

			// Mettre à jour la session avec les nouvelles cartes
			setSessionCards(limitedCards)
		}
	}

	// Start a random practice session
	const startRandomPractice = () => {
		if (wordsArray && wordsArray.length > 0) {
			// Initialize cards with SRS values if needed
			const initializedCards = wordsArray.map(card => {
				if (!card.card_state) {
					return {
						...card,
						card_state: CARD_STATES.NEW,
						ease_factor: 2.5,
						interval: 0,
						learning_step: null,
						next_review_date: null,
						last_review_date: null,
						reviews_count: 0,
						lapses: 0,
						is_suspended: false
					}
				}
				return { ...card }
			})

			// Filter out suspended cards
			const activeCards = initializedCards.filter(card => !card.is_suspended)

			// Shuffle and take the requested number
			const shuffled = [...activeCards].sort(() => Math.random() - 0.5)
			const selectedCards = shuffled.slice(0, Math.min(practiceCount, shuffled.length))

			setSessionCards(selectedCards)
			setShowPracticeOptions(false)
		}
	}

	// Initialize session cards ONLY on first mount
	useEffect(() => {
		if (sessionInitialized) return // Don't reinitialize during session

		// Wait for words to be loaded (check if we're still loading)
		// If wordsArray is undefined or null, we're still loading
		if (!wordsArray) return

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
					lapses: 0,
					is_suspended: false
				}
			}
			// Create a copy to avoid Redux reference issues
			return { ...card }
		})

		// Filter for due cards and limit according to user preference
		const dueCards = getDueCards(initializedCards)
		const limitedCards = dueCards.slice(0, cardsLimit)

		// Always mark as initialized after first attempt, even if no cards
		setSessionInitialized(true)

		if (limitedCards.length > 0) {
			setSessionCards(limitedCards)
		}
	}, [wordsArray, dispatch, sessionInitialized, cardsLimit])

	// Get current card (first in session queue)
	const currentCard = sessionCards[0]

	// Determine which words to show based on reversed mode
	const frontWord = isReversed ? currentCard?.word_fr : currentCard?.word_ru
	const backWord = isReversed ? currentCard?.word_ru : currentCard?.word_fr

	// Get button intervals for current card
	const buttonIntervals = useMemo(() => {
		if (!currentCard) return null

		const intervals = getButtonIntervals(currentCard)

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

		// Check for errors
		if (result.error) {
			toast.error(t('review_error'))
			return
		}

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

	// Handle card suspension
	const handleSuspend = async () => {
		if (!currentCard) return

		// Confirm with user
		if (!window.confirm(t('suspend_confirm'))) {
			return
		}

		// Dispatch suspend action
		const result = await dispatch(suspendCard(currentCard.id))

		// Check for errors
		if (result.error) {
			toast.error(t('suspend_error'))
			return
		}

		// Show success message
		toast.success(t('card_suspended'))

		// Remove card from session
		setSessionCards(prevCards => prevCards.slice(1))
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
				<h3 className={styles.flashcardsTitle}>{t('session_congrats')}</h3>
				<div className={styles.wordsContainer}>
					<div className={styles.statsContainer}>
						<p className={styles.statsText}>
							{t('session_complete')}
						</p>
						{reviewedCount > 0 && (
							<div className={styles.sessionStats}>
								<p><strong>{reviewedCount}</strong> {reviewedCount > 1 ? t('cards_reviewed_plural') : t('cards_reviewed')}</p>
								{sessionDuration > 0 && (
									<p><strong>{sessionDuration}</strong> {sessionDuration > 1 ? t('session_duration_plural') : t('session_duration')}</p>
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
						className={styles.closeBtn}>
						{t('close_btn')}
					</button>
				</div>
			</div>
		)
	}

	// If not initialized yet, show loading
	if (!sessionInitialized) {
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
				<div className={styles.wordsContainer}>
					<p className={styles.statsText}>{t('loading')}</p>
				</div>
			</div>
		)
	}

	// If no words at all in the array
	if (!wordsArray || wordsArray.length === 0) {
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
				<div className={styles.wordsContainer}>
					<p className={styles.statsText}>{t('no_words_in_dictionary')}</p>
					<p>{t('add_words_to_review')}</p>
					<button
						onClick={() => {
							dispatch(toggleFlashcardsContainer(false))
							setSessionInitialized(false)
						}}
						className={styles.closeBtn}>
						{t('close_btn')}
					</button>
				</div>
			</div>
		)
	}

	// If no current card (no cards due)
	if (!currentCard) {
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
				<div className={styles.wordsContainer}>
					<p className={styles.statsText}>{t('no_cards_due')}</p>

					{!showPracticeOptions ? (
						<div className={styles.buttonsGroup}>
							<button
								onClick={() => setShowPracticeOptions(true)}
								className={styles.practiceBtn}>
								{t('practice_anyway')}
							</button>
							<button
								onClick={() => {
									dispatch(toggleFlashcardsContainer(false))
									setSessionInitialized(false)
								}}
								className={styles.closeBtn}>
								{t('close_btn')}
							</button>
						</div>
					) : (
						<>
							<p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('choose_cards_count')}</p>
							<div className={styles.limitOptions} style={{ marginBottom: '1.5rem' }}>
								{[10, 20, 30, 50].map(count => (
									<button
										key={count}
										className={`${styles.limitOption} ${practiceCount === count ? styles.limitOptionActive : ''}`}
										onClick={() => setPracticeCount(count)}>
										{count}
									</button>
								))}
							</div>
							<div className={styles.buttonsGroup}>
								<button
									onClick={startRandomPractice}
									className={styles.practiceBtn}>
									{t('start_practice')}
								</button>
								<button
									onClick={() => setShowPracticeOptions(false)}
									className={styles.closeBtn}>
									{t('close_btn')}
								</button>
							</div>
						</>
					)}
				</div>
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
				<div className={styles.progressInfo}>
					<span className={styles.cardsRemaining}>
						{sessionCards.length} {sessionCards.length > 1 ? t('cards_remaining_plural') : t('cards_remaining')}
						{cardsLimit < 9999 && (
							<span className={styles.limitIndicator}> ({t('limit_indicator')}: {cardsLimit})</span>
						)}
					</span>
					{currentCard.card_state === CARD_STATES.NEW && (
						<span className={styles.newBadge}>{t('new_badge')}</span>
					)}
					{currentCard.card_state === CARD_STATES.RELEARNING && (
						<span className={styles.relearningBadge}>{t('relearning_badge')}</span>
					)}
				</div>
				<div className={styles.controlsContainer}>
					<button
						className={styles.reverseBtn}
						onClick={toggleReversed}
						title={t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}>
						⇄ {t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
					</button>
					<button
						className={styles.settingsBtn}
						onClick={() => setShowSettings(!showSettings)}
						title={t('settings_btn')}>
						⚙️ {t('settings_btn')}
					</button>
				</div>

				{/* Settings panel */}
				{showSettings && (
					<div className={styles.settingsPanel}>
						<h4 className={styles.settingsPanelTitle}>{t('settings_title')}</h4>
						<div className={styles.limitOptions}>
							{[10, 20, 30, 50, 100].map(limit => (
								<button
									key={limit}
									className={`${styles.limitOption} ${cardsLimit === limit ? styles.limitOptionActive : ''}`}
									onClick={() => {
										updateCardsLimit(limit)
										setShowSettings(false)
									}}>
									{limit}
								</button>
							))}
							<button
								className={`${styles.limitOption} ${cardsLimit === 9999 ? styles.limitOptionActive : ''}`}
								onClick={() => {
									updateCardsLimit(9999)
									setShowSettings(false)
								}}>
								{t('settings_all')}
							</button>
						</div>
					</div>
				)}
			</div>

			<div className={styles.wordsContainer}>
				{/* Front of card (language being tested) */}
				<div className={styles.originalWord}>
					{frontWord}
				</div>

				{/* Show context sentence if available */}
				{currentCard.word_sentence && (
					<div className={styles.contextSentence}>
						<em>{currentCard.word_sentence}</em>
					</div>
				)}

				{showAnswer ? (
					<>
						{/* Back of card (answer) */}
						<div className={styles.translatedWord}>
							{backWord}
						</div>

						{/* 4 Anki-style buttons */}
						<div className={styles.btnsContainer}>
							<button
								className={styles.againBtn}
								onClick={() => handleReview(BUTTON_TYPES.AGAIN)}
								title={t('again_btn')}>
								<span className={styles.btnLabel}>{t('again_btn')}</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.again || '<1min'}
								</span>
							</button>

							<button
								className={styles.hardBtn}
								onClick={() => handleReview(BUTTON_TYPES.HARD)}
								title={t('hard_btn')}>
								<span className={styles.btnLabel}>{t('hard_btn')}</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.hard || '6min'}
								</span>
							</button>

							<button
								className={styles.goodBtn}
								onClick={() => handleReview(BUTTON_TYPES.GOOD)}
								title={t('good_btn')}>
								<span className={styles.btnLabel}>{t('good_btn')}</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.good || '10min'}
								</span>
							</button>

							<button
								className={styles.easyBtn}
								onClick={() => handleReview(BUTTON_TYPES.EASY)}
								title={t('easy_btn')}>
								<span className={styles.btnLabel}>{t('easy_btn')}</span>
								<span className={styles.btnInterval}>
									{buttonIntervals?.easy || '4j'}
								</span>
							</button>
						</div>

						{/* Suspend button */}
						<button
							className={styles.suspendBtn}
							onClick={handleSuspend}
							title={t('suspend_btn')}>
							🚫 {t('suspend_btn')}
						</button>
					</>
				) : (
					<button
						className={styles.showAnswerBtn}
						onClick={() => setShowAnswer(true)}>
						{t('show_answer')}
					</button>
				)}
			</div>
		</div>
	)
}

export default FlashCards
