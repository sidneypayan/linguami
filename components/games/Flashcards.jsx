import { useSelector, useDispatch } from 'react-redux'
import styles from '../../styles/FlashCards.module.css'
import { useState, useEffect, useMemo } from 'react'
import { toggleFlashcardsContainer } from '../../features/cards/cardsSlice'
import { updateWordReview, initializeWordSRS, suspendCard } from '../../features/words/wordsSlice'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { toast } from 'react-toastify'
import { useUserContext } from '../../context/user'
import { getGuestWordsByLanguage, updateGuestWord } from '../../utils/guestDictionary'
import {
	getDueCards,
	getButtonIntervals,
	calculateNextReview,
	BUTTON_TYPES,
	CARD_STATES
} from '../../utils/spacedRepetition'
import {
	CloseRounded,
	SwapHorizRounded,
	SettingsRounded,
	PauseCircleRounded,
	CelebrationRounded,
	CheckCircleRounded,
	ThumbDownRounded,
	ThumbUpRounded,
	SentimentSatisfiedAltRounded,
	SentimentVeryDissatisfiedRounded,
} from '@mui/icons-material'
import { IconButton, useTheme } from '@mui/material'

const FlashCards = () => {
	const { t, lang } = useTranslation('words')
	const router = useRouter()
	const dispatch = useDispatch()
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'
	const { userLearningLanguage, isUserLoggedIn } = useUserContext()
	const { user_material_words, user_words } = useSelector(store => store.words)
	const [guestWords, setGuestWords] = useState([])
	const [showAnswer, setShowAnswer] = useState(false)

	// Style réutilisable pour les boutons de fermeture
	const closeButtonStyle = {
		position: 'absolute',
		top: '1rem',
		right: '1rem',
		color: isDark ? '#a78bfa' : '#667eea',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(102, 126, 234, 0.1)',
			transform: 'rotate(90deg) scale(1.1)',
		},
	}
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

	// Charger les mots invités si non connecté
	useEffect(() => {
		if (!isUserLoggedIn && userLearningLanguage) {
			const allWords = getGuestWordsByLanguage(userLearningLanguage)

			// Si on est sur une page material, filtrer par materialId
			const materialId = router.query.material

			if (materialId && router.pathname !== '/dictionary') {
				const materialWords = allWords.filter(word =>
					String(word.material_id) === String(materialId)
				)
				setGuestWords(materialWords)
			} else {
				// Sinon (page dictionary ou pas de materialId), charger tous les mots
				setGuestWords(allWords)
			}
		}
	}, [isUserLoggedIn, userLearningLanguage, router.query.material, router.pathname])

	// Get appropriate word array based on current page and user status
	const baseWordsArray = isUserLoggedIn
		? (router.pathname === '/dictionary' ? user_words : user_material_words)
		: guestWords

	// Filter to only show words that have both source and translation in current context
	const wordsArray = useMemo(() => {
		if (!baseWordsArray || !userLearningLanguage || !lang) return []

		// Ne pas afficher de mots si la langue d'apprentissage est la même que la langue d'interface
		if (userLearningLanguage === lang) return []

		return baseWordsArray.filter(word => {
			const sourceWord = word[`word_${userLearningLanguage}`]
			const translation = word[`word_${lang}`]
			return sourceWord && translation
		})
	}, [baseWordsArray, userLearningLanguage, lang])

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
		if (wordsArray && wordsArray.length > 0 && userLearningLanguage && lang) {
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
		if (wordsArray && wordsArray.length > 0 && userLearningLanguage && lang) {
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

		// Don't initialize if we don't have language data yet
		// This prevents marking as initialized when wordsArray is empty due to missing language context
		if (!userLearningLanguage || !lang) return

		// For guest users, wait until guestWords are loaded before initializing
		// This prevents initializing with an empty array due to race condition
		if (!isUserLoggedIn && guestWords.length === 0 && wordsArray.length === 0) return

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

		// Mark as initialized only when we have the language context loaded
		setSessionInitialized(true)

		if (limitedCards.length > 0) {
			setSessionCards(limitedCards)
		}
	}, [wordsArray, dispatch, sessionInitialized, cardsLimit, userLearningLanguage, lang, isUserLoggedIn, guestWords])

	// Get current card (first in session queue)
	const currentCard = sessionCards[0]

	// Determine which words to show based on languages and reversed mode
	const sourceWord = currentCard?.[`word_${userLearningLanguage}`]
	const translationWord = currentCard?.[`word_${lang}`]
	const frontWord = isReversed ? translationWord : sourceWord
	const backWord = isReversed ? sourceWord : translationWord

	// Function to mask word in sentence with "..."
	const getMaskedSentence = (sentence, wordToMask) => {
		if (!sentence || !wordToMask) return sentence

		// Normalize both strings (trim and lowercase)
		const normalizedSentence = sentence.toLowerCase()
		const normalizedWord = wordToMask.toLowerCase().trim()

		// Find the position of the word (case insensitive)
		const index = normalizedSentence.indexOf(normalizedWord)

		if (index !== -1) {
			// Replace the word at the exact position with "..."
			return sentence.substring(0, index) + '...' + sentence.substring(index + wordToMask.length)
		}

		// If exact match not found, try to find the stem for declined/conjugated forms
		if (normalizedWord.length > 4) {
			const stem = normalizedWord.substring(0, normalizedWord.length - 2)
			const stemIndex = normalizedSentence.indexOf(stem)

			if (stemIndex !== -1) {
				// Find the end of the word by looking for next space or punctuation
				let endIndex = stemIndex
				while (
					endIndex < sentence.length &&
					/[а-яА-ЯёЁa-zA-Z]/.test(sentence[endIndex])
				) {
					endIndex++
				}
				return sentence.substring(0, stemIndex) + '...' + sentence.substring(endIndex)
			}
		}

		return sentence
	}

	// Determine which sentence to show based on reversed mode and showAnswer state
	const displayedSentence = useMemo(() => {
		if (!currentCard?.word_sentence) return null

		// If normal mode (source word on front) and answer not shown, mask the word
		// This prevents seeing the word you're supposed to guess in the example sentence
		if (!isReversed && !showAnswer) {
			return getMaskedSentence(currentCard.word_sentence, sourceWord)
		}

		// Otherwise show the full sentence
		return currentCard.word_sentence
	}, [currentCard, isReversed, showAnswer, sourceWord])

	// Get button intervals for current card
	const buttonIntervals = useMemo(() => {
		if (!currentCard) return null

		const intervals = getButtonIntervals(currentCard)

		return intervals
	}, [currentCard])

	// Handle card review
	const handleReview = async (buttonType) => {
		if (!currentCard) return

		let updatedCard

		if (isUserLoggedIn) {
			// Utilisateur connecté : utiliser Redux/Supabase
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
			updatedCard = result.payload
		} else {
			// Invité : calculer et sauvegarder dans localStorage
			updatedCard = calculateNextReview(currentCard, buttonType)

			const savedCard = updateGuestWord(currentCard.id, updatedCard)
			if (!savedCard) {
				toast.error(t('review_error'))
				return
			}

			// Mettre à jour l'état local
			setGuestWords(prev => prev.map(w => w.id === currentCard.id ? savedCard : w))
		}

		// Update stats
		setReviewedCount(prev => prev + 1)

		// Add XP for the review (except for "again" button)
		if (buttonType !== BUTTON_TYPES.AGAIN) {
			try {
				const xpResponse = await fetch('/api/xp/add', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						actionType: `flashcard_${buttonType}`,
						sourceId: currentCard.id.toString(),
						description: `Reviewed: ${frontWord}`
					})
				})

				if (xpResponse.ok) {
					const xpData = await xpResponse.json()

					// Show level up notification
					if (xpData.leveledUp) {
						toast.success(`🎉 ${t('level_up')} ${xpData.currentLevel}!`, {
							position: 'top-center',
							autoClose: 3000
						})
					}

					// Check for streak achievements
					if (xpData.achievements && xpData.achievements.length > 0) {
						xpData.achievements.forEach(achievement => {
							if (achievement.type.includes('streak')) {
								toast.success(`🔥 ${achievement.streak} ${t('days_streak')}!`, {
									position: 'top-center'
								})
							}
						})
					}
				}
			} catch (error) {
				// Silent fail - don't block user flow for XP errors
				console.error('Error adding XP:', error)
			}
		}

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
			<div className={isDark ? styles.containerDark : styles.container}>
				<IconButton
					onClick={() => {
						dispatch(toggleFlashcardsContainer(false))
						setSessionInitialized(false)
					}}
					className={styles.closeIcon}
					sx={closeButtonStyle}>
					<CloseRounded sx={{ fontSize: '2rem' }} />
				</IconButton>
				<h3 className={styles.flashcardsTitle}>
					<CelebrationRounded sx={{ fontSize: '2.5rem', mb: 1, color: '#667eea' }} />
					<br />
					{t('session_congrats')}
				</h3>
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
			<div className={isDark ? styles.containerDark : styles.container}>
				<IconButton
					onClick={() => {
						dispatch(toggleFlashcardsContainer(false))
						setSessionInitialized(false)
					}}
					className={styles.closeIcon}
					sx={closeButtonStyle}>
					<CloseRounded sx={{ fontSize: '2rem' }} />
				</IconButton>
				<div className={styles.wordsContainer}>
					<p className={styles.statsText}>{t('loading')}</p>
				</div>
			</div>
		)
	}

	// If no words at all in the array
	if (!wordsArray || wordsArray.length === 0) {
		return (
			<div className={isDark ? styles.containerDark : styles.container}>
				<IconButton
					onClick={() => {
						dispatch(toggleFlashcardsContainer(false))
						setSessionInitialized(false)
					}}
					className={styles.closeIcon}
					sx={closeButtonStyle}>
					<CloseRounded sx={{ fontSize: '2rem' }} />
				</IconButton>
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
			<div className={isDark ? styles.containerDark : styles.container}>
				<IconButton
					onClick={() => {
						dispatch(toggleFlashcardsContainer(false))
						setSessionInitialized(false)
					}}
					className={styles.closeIcon}
					sx={closeButtonStyle}>
					<CloseRounded sx={{ fontSize: '2rem' }} />
				</IconButton>
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
		<div className={isDark ? styles.containerDark : styles.container}>
			<IconButton
				onClick={() => {
					dispatch(toggleFlashcardsContainer(false))
					setSessionInitialized(false)
				}}
				className={styles.closeIcon}
				sx={closeButtonStyle}>
				<CloseRounded sx={{ fontSize: '2rem' }} />
			</IconButton>

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
						<SwapHorizRounded sx={{ fontSize: '1.2rem', mr: 0.5 }} />
						{t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
					</button>
					<button
						className={styles.settingsBtn}
						onClick={() => setShowSettings(!showSettings)}
						title={t('settings_btn')}>
						<SettingsRounded sx={{ fontSize: '1.2rem', mr: 0.5 }} />
						{t('settings_btn')}
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
				{displayedSentence && (
					<div className={styles.contextSentence}>
						<em>{displayedSentence}</em>
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
								<SentimentVeryDissatisfiedRounded sx={{ fontSize: '1.5rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('again_btn')}</span>
							</button>

							<button
								className={styles.hardBtn}
								onClick={() => handleReview(BUTTON_TYPES.HARD)}
								title={t('hard_btn')}>
								<ThumbDownRounded sx={{ fontSize: '1.4rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('hard_btn')}</span>
							</button>

							<button
								className={styles.goodBtn}
								onClick={() => handleReview(BUTTON_TYPES.GOOD)}
								title={t('good_btn')}>
								<ThumbUpRounded sx={{ fontSize: '1.4rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('good_btn')}</span>
							</button>

							<button
								className={styles.easyBtn}
								onClick={() => handleReview(BUTTON_TYPES.EASY)}
								title={t('easy_btn')}>
								<SentimentSatisfiedAltRounded sx={{ fontSize: '1.5rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('easy_btn')}</span>
							</button>
						</div>

						{/* Suspend button */}
						<button
							className={styles.suspendBtn}
							onClick={handleSuspend}
							title={t('suspend_btn')}>
							<PauseCircleRounded sx={{ fontSize: '1.2rem', mr: 0.5 }} />
							{t('suspend_btn')}
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
