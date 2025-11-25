/**
 * Flashcard review card component - displays the card and review buttons
 */

import { useState, useMemo, useEffect } from 'react'
import { IconButton } from '@mui/material'
import {
	CloseRounded,
	SwapHorizRounded,
	SettingsRounded,
	PauseCircleRounded,
	ThumbDownRounded,
	ThumbUpRounded,
	SentimentSatisfiedAltRounded,
	SentimentVeryDissatisfiedRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { BUTTON_TYPES, CARD_STATES } from '@/utils/spacedRepetition'
import styles from '@/styles/FlashCards.module.css'

/**
 * Mask word in sentence with "..."
 */
function getMaskedSentence(sentence, wordToMask) {
	if (!sentence || !wordToMask) return sentence

	const normalizedSentence = sentence.toLowerCase()
	const normalizedWord = wordToMask.toLowerCase().trim()

	// Try exact match first
	const index = normalizedSentence.indexOf(normalizedWord)
	if (index !== -1) {
		return sentence.substring(0, index) + '...' + sentence.substring(index + wordToMask.length)
	}

	// Try stem match for declined/conjugated forms
	if (normalizedWord.length > 4) {
		const stem = normalizedWord.substring(0, normalizedWord.length - 2)
		const stemIndex = normalizedSentence.indexOf(stem)

		if (stemIndex !== -1) {
			let endIndex = stemIndex
			while (endIndex < sentence.length && /[а-яА-ЯёЁa-zA-Z]/.test(sentence[endIndex])) {
				endIndex++
			}
			return sentence.substring(0, stemIndex) + '...' + sentence.substring(endIndex)
		}
	}

	return sentence
}

export function FlashcardReviewCard({
	currentCard,
	sessionCards,
	cardsLimit,
	isReversed,
	onReview,
	onSuspend,
	onClose,
	onToggleReversed,
	onToggleSettings,
	showSettings,
	settings,
	isDark,
	userLearningLanguage,
	locale
}) {
	const t = useTranslations('words')
	const [showAnswer, setShowAnswer] = useState(false)

	// Reset showAnswer when card changes (e.g., after suspend)
	useEffect(() => {
		setShowAnswer(false)
	}, [currentCard?.id])

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

	// Get source and translation words
	const sourceWord = currentCard?.[`word_${userLearningLanguage}`]
	const translationWord = currentCard?.[`word_${locale}`]
	const frontWord = isReversed ? translationWord : sourceWord
	const backWord = isReversed ? sourceWord : translationWord

	// Determine displayed sentence (masked if answer not shown)
	const displayedSentence = useMemo(() => {
		if (!currentCard?.word_sentence) return null

		if (isReversed && !showAnswer) {
			return getMaskedSentence(currentCard.word_sentence, sourceWord)
		}

		return currentCard.word_sentence
	}, [currentCard, isReversed, showAnswer, sourceWord])

	// Handle review button click
	const handleReviewClick = async (buttonType) => {
		await onReview(buttonType)
		setShowAnswer(false)
	}

	if (!currentCard) return null

	return (
		<div className={isDark ? styles.containerDark : styles.container}>
			{/* Close button */}
			<IconButton
				onClick={onClose}
				className={styles.closeIcon}
				sx={closeButtonStyle}>
				<CloseRounded sx={{ fontSize: '2rem' }} />
			</IconButton>

			{/* Header with stats and controls */}
			<div className={styles.header}>
				<div className={styles.progressInfo}>
					<span className={styles.cardsRemaining}>
						{sessionCards.length}{' '}
						{sessionCards.length > 1 ? t('cards_remaining_plural') : t('cards_remaining')}
						{cardsLimit < 9999 && (
							<span className={styles.limitIndicator}>
								{' '}({t('limit_indicator')}: {cardsLimit})
							</span>
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
						onClick={onToggleReversed}
						title={t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}>
						<SwapHorizRounded sx={{ fontSize: '1.2rem', mr: 0.5 }} />
						{t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
					</button>
					<button
						className={styles.settingsBtn}
						onClick={onToggleSettings}
						title={t('settings_btn')}>
						<SettingsRounded sx={{ fontSize: '1.2rem', mr: 0.5 }} />
						{t('settings_btn')}
					</button>
				</div>

				{/* Settings panel */}
				{showSettings && settings}
			</div>

			{/* Card content */}
			<div className={styles.wordsContainer}>
				{/* Front of card */}
				<div className={styles.originalWord}>{frontWord}</div>

				{/* Context sentence */}
				{displayedSentence && (
					<div className={styles.contextSentence}>
						<em>{displayedSentence}</em>
					</div>
				)}

				{showAnswer ? (
					<>
						{/* Back of card (answer) */}
						<div className={styles.translatedWord}>{backWord}</div>

						{/* 4 Anki-style review buttons */}
						<div className={styles.btnsContainer}>
							<button
								className={styles.againBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.AGAIN)}
								title={t('again_btn')}>
								<SentimentVeryDissatisfiedRounded sx={{ fontSize: '1.5rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('again_btn')}</span>
							</button>

							<button
								className={styles.hardBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.HARD)}
								title={t('hard_btn')}>
								<ThumbDownRounded sx={{ fontSize: '1.4rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('hard_btn')}</span>
							</button>

							<button
								className={styles.goodBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.GOOD)}
								title={t('good_btn')}>
								<ThumbUpRounded sx={{ fontSize: '1.4rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('good_btn')}</span>
							</button>

							<button
								className={styles.easyBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.EASY)}
								title={t('easy_btn')}>
								<SentimentSatisfiedAltRounded sx={{ fontSize: '1.5rem', mb: 0.5 }} />
								<span className={styles.btnLabel}>{t('easy_btn')}</span>
							</button>
						</div>

						{/* Suspend button */}
						<button
							className={styles.suspendBtn}
							onClick={onSuspend}
							title={t('suspend_btn')}>
							<PauseCircleRounded sx={{ fontSize: '1.2rem', mr: 0.5 }} />
							{t('suspend_btn')}
						</button>
					</>
				) : (
					// Show answer button
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
