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
	Swords,
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
					"absolute top-3 sm:top-4 right-3 sm:right-4 z-50 px-3.5 py-2 sm:p-2.5 rounded-xl transition-all duration-300",
					"bg-gradient-to-br from-violet-500/10 to-cyan-500/5",
					"border border-violet-500/30",
					!isDark && "shadow-[0_0_10px_rgba(139,92,246,0.1)]",
					isDark
						? "text-violet-400 hover:from-violet-500/30 hover:to-cyan-500/20"
						: "text-violet-600 hover:from-violet-500/20 hover:to-cyan-500/10 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]",
					"hover:scale-110 hover:border-violet-500/50"
				)}
			>
				<X className="w-6 h-6" />
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
					<div className={cn(
						'inline-flex items-center gap-2 px-4 py-2 rounded-full',
						'bg-gradient-to-r from-violet-500/15 to-cyan-500/10',
						'border border-violet-500/30',
						!isDark && 'shadow-[0_0_15px_rgba(139,92,246,0.15)]'
					)}>
						<Swords className={cn(
							'w-5 h-5',
							isDark ? 'text-violet-400' : 'text-violet-500'
						)} />
						<span className={cn(
							'text-lg font-bold',
							isDark ? 'text-violet-300' : 'text-violet-600'
						)}>
							{sessionCards.length}
						</span>
						<span className={cn(
							'text-sm font-medium',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{sessionCards.length > 1 ? t('cards_remaining_plural') : t('cards_remaining')}
						</span>
					</div>
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
								'relative px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-6',
								'bg-gradient-to-r from-violet-500/10 to-cyan-500/5',
								'border border-violet-500/20',
								!isDark && 'shadow-[0_0_15px_rgba(139,92,246,0.08)]'
							)}>
								{/* Decorative quote marks */}
								<span className={cn(
									'absolute -top-2 left-3 text-2xl font-serif',
									isDark ? 'text-violet-500/30' : 'text-violet-400/40'
								)}>&ldquo;</span>
								<p className={cn(
									'text-sm sm:text-base text-center italic',
									isDark ? 'text-slate-400' : 'text-slate-500'
								)}>
									{currentCard.word_sentence}
								</p>
								<span className={cn(
									'absolute -bottom-3 right-3 text-2xl font-serif',
									isDark ? 'text-violet-500/30' : 'text-violet-400/40'
								)}>&rdquo;</span>
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
