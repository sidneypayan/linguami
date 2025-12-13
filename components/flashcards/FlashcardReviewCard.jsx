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
	Pencil,
	Swords,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWordAction } from '@/app/actions/update-word-action'
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
	const queryClient = useQueryClient()
	const [showAnswer, setShowAnswer] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editedWord, setEditedWord] = useState('')
	const [editedTranslation, setEditedTranslation] = useState('')
	// Local state for current displayed values (updated after save)
	const [displayedWord, setDisplayedWord] = useState('')
	const [displayedTranslation, setDisplayedTranslation] = useState('')

	// Mutation for updating word
	const updateWordMutation = useMutation({
		mutationFn: async ({ wordId, originalWord, translatedWord }) => {
			const result = await updateWordAction({
				wordId,
				originalWord,
				translatedWord,
				word_sentence: currentCard.word_sentence || '',
				userLearningLanguage,
				locale
			})
			if (!result.success) {
				throw new Error(result.error || 'Erreur lors de la mise à jour')
			}
			return result.data
		},
		onSuccess: (updatedCard) => {
			// Update displayed values immediately
			setDisplayedWord(editedWord)
			setDisplayedTranslation(editedTranslation)
			// Update currentCard with new values locally
			if (updatedCard) {
				// Optimistically update the current card in the component
				Object.assign(currentCard, updatedCard)
			}
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ['user-words'] })
			setIsEditing(false)
		},
		onError: (error) => {
			console.error('Erreur lors de la sauvegarde:', error)
			alert('Erreur lors de la sauvegarde du mot')
		}
	})

	// Format remaining time as MM:SS
	const formatTime = (seconds) => {
		if (seconds === null || seconds === undefined) return null
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	// Reset showAnswer and editing when card changes (e.g., after suspend)
	useEffect(() => {
		setShowAnswer(false)
		setIsEditing(false)
		// Initialize edit values and displayed values
		if (currentCard) {
			const word = currentCard[`word_${userLearningLanguage}`] || ''
			const translation = currentCard[`word_${locale}`] || ''
			setEditedWord(word)
			setEditedTranslation(translation)
			setDisplayedWord(word)
			setDisplayedTranslation(translation)
		}
	}, [currentCard?.id, userLearningLanguage, locale])

	// Handle edit mode
	const handleEditClick = () => {
		setIsEditing(true)
		setEditedWord(currentCard[`word_${userLearningLanguage}`] || '')
		setEditedTranslation(currentCard[`word_${locale}`] || '')
	}

	// Handle cancel edit
	const handleCancelEdit = () => {
		setIsEditing(false)
		setEditedWord(currentCard[`word_${userLearningLanguage}`] || '')
		setEditedTranslation(currentCard[`word_${locale}`] || '')
	}

	// Handle save edit
	const handleSaveEdit = async () => {
		// Validate that both fields have content
		if (!editedWord.trim() || !editedTranslation.trim()) {
			alert('Veuillez remplir tous les champs')
			return
		}

		// Call the mutation
		updateWordMutation.mutate({
			wordId: currentCard.id,
			originalWord: editedWord.trim(),
			translatedWord: editedTranslation.trim()
		})
	}

	// Get source and translation words (use displayed values for immediate UI update)
	const sourceWord = displayedWord || currentCard?.[`word_${userLearningLanguage}`]
	const translationWord = displayedTranslation || currentCard?.[`word_${locale}`]
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
			{/* Language switch button - Always fixed at top left */}
			<button
				className={styles.reverseBtn}
				onClick={onToggleReversed}
				title={t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}>
				<ArrowLeftRight className="w-5 h-5 mr-1" />
				{t(isReversed ? 'reverse_btn_fr_ru' : 'reverse_btn_ru_fr')}
			</button>

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
				{isEditing && showAnswer ? (
					<input
						type="text"
						value={isReversed ? editedTranslation : editedWord}
						onChange={(e) => isReversed ? setEditedTranslation(e.target.value) : setEditedWord(e.target.value)}
						className={cn(
							styles.originalWord,
							"border-2 border-violet-400 rounded-lg px-3 py-2 text-center bg-transparent outline-none focus:border-violet-500"
						)}
						placeholder={isReversed ? t('translation') : t('word')}
					/>
				) : (
					<div className={styles.originalWord}>{frontWord}</div>
				)}

				{showAnswer ? (
					<>
						{/* Back of card (answer) */}
						{isEditing ? (
							<input
								type="text"
								value={isReversed ? editedWord : editedTranslation}
								onChange={(e) => isReversed ? setEditedWord(e.target.value) : setEditedTranslation(e.target.value)}
								className={cn(
									styles.translatedWord,
									"border-2 border-green-400 rounded-lg px-3 py-2 text-center bg-transparent outline-none focus:border-green-500"
								)}
								placeholder={isReversed ? t('word') : t('translation')}
							/>
						) : (
							<div className={styles.translatedWord}>{backWord}</div>
						)}

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

						{/* Edit mode buttons or Review buttons */}
						{isEditing ? (
							<div className={cn("flex gap-3 justify-center mt-4")}>
								<button
									className={cn(
										styles.suspendBtn,
										"bg-green-50 border-green-300 text-green-600",
										"hover:bg-green-500 hover:border-green-500",
										updateWordMutation.isPending && "opacity-50 cursor-not-allowed"
									)}
									onClick={handleSaveEdit}
									disabled={updateWordMutation.isPending}
									title={t('save')}>
									<ThumbsUp className="w-5 h-5 mr-1" />
									{updateWordMutation.isPending ? (t('saving') || 'Sauvegarde...') : (t('save') || 'Sauvegarder')}
								</button>
								<button
									className={styles.suspendBtn}
									onClick={handleCancelEdit}
									disabled={updateWordMutation.isPending}
									title={t('cancel')}>
									<X className="w-5 h-5 mr-1" />
									{t('cancel') || 'Annuler'}
								</button>
							</div>
						) : (
							<>
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

								{/* Suspend and Edit buttons */}
								<div className="flex gap-3 justify-center flex-wrap">
									<button
										className={styles.suspendBtn}
										onClick={onSuspend}
										title={t('suspend_btn')}>
										<PauseCircle className="w-5 h-5 mr-1" />
										{t('suspend_btn')}
									</button>
									<button
										className={styles.suspendBtn}
										onClick={handleEditClick}
										title={t('edit_word') || 'Modifier'}>
										<Pencil className="w-5 h-5 mr-1" />
										{t('edit_word') || 'Modifier'}
									</button>
								</div>
							</>
						)}
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
