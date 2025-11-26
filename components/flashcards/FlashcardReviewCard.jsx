/**
 * Flashcard review card component - displays the card and review buttons
 */

import { useState, useEffect } from 'react'
import { IconButton } from '@mui/material'
import {
	CloseRounded,
	SwapHorizRounded,
	PauseCircleRounded,
	ThumbDownRounded,
	ThumbUpRounded,
	SentimentSatisfiedAltRounded,
	SentimentVeryDissatisfiedRounded,
} from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { BUTTON_TYPES, CARD_STATES } from '@/utils/spacedRepetition'
import styles from '@/styles/FlashCards.module.css'

export function FlashcardReviewCard({
	currentCard,
	sessionCards,
	cardsLimit,
	timeLimit,
	remainingTime,
	isTimeUp,
	isReversed,
	onReview,
	onSuspend,
	onClose,
	onToggleReversed,
	isDark,
	userLearningLanguage,
	locale
}) {
	const t = useTranslations('words')
	const [showAnswer, setShowAnswer] = useState(false)

	// Format remaining time as MM:SS
	const formatTime = (seconds) => {
		if (seconds === null || seconds === undefined) return null
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

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

			{/* Time up banner */}
			{isTimeUp && (
				<div className={styles.timeUpBanner}>
					{t('time_up_last_card')}
				</div>
			)}

			{/* Header with stats and controls */}
			<div className={styles.header}>
				<div className={styles.progressInfo}>
					{/* Timer display for time-based sessions */}
					{timeLimit && remainingTime !== null && !isTimeUp && (
						<span className={`${styles.timerDisplay} ${remainingTime <= 30 ? styles.timerWarning : ''}`}>
							{formatTime(remainingTime)}
						</span>
					)}
					{/* Show cards remaining only for card-based sessions (not time-based) */}
					{!timeLimit && (
						<span className={styles.cardsRemaining}>
							{sessionCards.length}{' '}
							{sessionCards.length > 1 ? t('cards_remaining_plural') : t('cards_remaining')}
						</span>
					)}
					{/* Show "last card" message when time is up */}
					{isTimeUp && (
						<span className={styles.cardsRemaining}>
							{t('last_card')}
						</span>
					)}
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
				</div>
			</div>

			{/* Card content */}
			<div className={styles.wordsContainer}>
				{/* Front of card */}
				<div className={styles.originalWord}>{frontWord}</div>

				{showAnswer ? (
					<>
						{/* Back of card (answer) */}
						<div className={styles.translatedWord}>{backWord}</div>

						{/* Context sentence - shown between answer and buttons */}
						{currentCard?.word_sentence && (
							<div className={styles.contextSentence}>
								{currentCard.word_sentence}
							</div>
						)}

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
