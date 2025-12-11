/**
 * Flashcard review card component - displays the card and review buttons
 */

import { useState, useEffect } from 'react'
import {
	X,
	ArrowLeftRight,
	PauseCircle,
	ThumbsDown,
	ThumbsUp,
	Smile,
	Frown,
	Quote,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { BUTTON_TYPES, CARD_STATES } from '@/utils/spacedRepetition'
import { cn } from '@/lib/utils'
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
			{/* Top left: Badges + Language switch */}
			<div className={styles.topLeftControls}>
				{/* Badges */}
				{currentCard.card_state === CARD_STATES.NEW && (
					<span className={styles.newBadge}>{t('new_badge')}</span>
				)}
				{currentCard.card_state === CARD_STATES.RELEARNING && (
					<span className={styles.relearningBadge}>{t('relearning_badge')}</span>
				)}

				{/* Language switch button */}
				<button
					className={styles.reverseBtn}
					onClick={onToggleReversed}
					title={t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}>
					<ArrowLeftRight className="w-5 h-5 mr-1" />
					{t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
				</button>
			</div>

			{/* Close button - Top right */}
			<button
				onClick={onClose}
				className={cn(
					"absolute top-4 right-4 z-50 p-2 rounded-lg transition-all duration-200",
					isDark
						? "text-violet-400 hover:bg-violet-500/20"
						: "text-violet-600 hover:bg-violet-500/10",
					"hover:rotate-90 hover:scale-110"
				)}
			>
				<X className="w-8 h-8" />
			</button>

			{/* Time up banner */}
			{isTimeUp && (
				<div className={styles.timeUpBanner}>
					{t('time_up_last_card')}
				</div>
			)}

			{/* Cards counter - Centered */}
			<div className={styles.centerInfo}>
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
							<div className={cn(
								'pl-3 py-2 rounded-r-lg mb-6',
								'border-l-2 border-violet-500/40',
								isDark ? 'bg-violet-500/5' : 'bg-violet-50/50'
							)}>
								<div className="flex items-start gap-2">
									<Quote className={cn(
										'w-4 h-4 flex-shrink-0 mt-0.5',
										isDark ? 'text-violet-400/60' : 'text-violet-400'
									)} />
									<p
										className="text-sm"
										style={{ color: isDark ? '#94a3b8' : '#64748b' }}
									>
										{currentCard.word_sentence}
									</p>
								</div>
							</div>
						)}

						{/* 4 Anki-style review buttons */}
						<div className={styles.btnsContainer}>
							<button
								className={styles.againBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.AGAIN)}
								title={t('again_btn')}>
								<Frown className="w-6 h-6 mb-1" />
								<span className={styles.btnLabel}>{t('again_btn')}</span>
							</button>

							<button
								className={styles.hardBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.HARD)}
								title={t('hard_btn')}>
								<ThumbsDown className="w-5 h-5 mb-1" />
								<span className={styles.btnLabel}>{t('hard_btn')}</span>
							</button>

							<button
								className={styles.goodBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.GOOD)}
								title={t('good_btn')}>
								<ThumbsUp className="w-5 h-5 mb-1" />
								<span className={styles.btnLabel}>{t('good_btn')}</span>
							</button>

							<button
								className={styles.easyBtn}
								onClick={() => handleReviewClick(BUTTON_TYPES.EASY)}
								title={t('easy_btn')}>
								<Smile className="w-6 h-6 mb-1" />
								<span className={styles.btnLabel}>{t('easy_btn')}</span>
							</button>
						</div>

						{/* Suspend button */}
						<button
							className={styles.suspendBtn}
							onClick={onSuspend}
							title={t('suspend_btn')}>
							<PauseCircle className="w-5 h-5 mr-1" />
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
