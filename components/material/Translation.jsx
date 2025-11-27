import { useTranslations, useLocale } from 'next-intl'
import { useRef, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/context/translation'
import { useUserContext } from '@/context/user'
import { useThemeMode } from '@/context/ThemeContext'
import { addWordAction } from '@/app/actions/words'
import { addGuestWord, GUEST_DICTIONARY_CONFIG } from '@/utils/guestDictionary'
import { buildWordData, getOriginalWord } from '@/utils/wordMapping'
import toast from '@/utils/toast'
import { cn } from '@/lib/utils'
import { TranslationHeader } from '@/components/translation/TranslationHeader'
import { TranslationContent } from '@/components/translation/TranslationContent'
import { CustomTranslationForm } from '@/components/translation/CustomTranslationForm'
import { GuestLimitMessage } from '@/components/translation/GuestLimitMessage'
import { TranslationError } from '@/components/translation/TranslationError'
import { useClickOutside } from '@/hooks/shared/useClickOutside'
import { useGuestWordsCount } from '@/hooks/translation/useGuestWordsCount'
import { useTranslationPosition } from '@/hooks/translation/useTranslationPosition'

const Translation = ({ materialId, userId }) => {
	const t = useTranslations('words')
	const locale = useLocale()

	const queryClient = useQueryClient()
	const ref = useRef()
	const { isDark } = useThemeMode()

	const {
		translationData: translation,
		isTranslationOpen,
		translationLoading: translation_loading,
		translationError: translation_error,
		wordSentence: word_sentence,
		coordinates,
		closeTranslation,
		cleanTranslation,
	} = useTranslation()

	const { isUserLoggedIn, userLearningLanguage, userProfile } = useUserContext()

	// Get spoken language: DB for logged-in users, localStorage or locale for guests
	const spokenLanguage = useMemo(() => {
		if (userProfile?.spoken_language) {
			return userProfile.spoken_language
		}
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('spoken_language')
			if (stored) return stored
		}
		return locale
	}, [userProfile?.spoken_language, locale])

	// Use custom hooks
	const guestWordsCount = useGuestWordsCount(isUserLoggedIn)
	const position = useTranslationPosition(coordinates, isTranslationOpen)

	// React Query mutation for adding words (logged-in users)
	const addWordMutation = useMutation({
		mutationFn: addWordAction,
		onSuccess: async () => {
			// Normalize materialId to string for consistent queryKey
			const normalizedMaterialId = materialId ? String(materialId) : null

			// Invalidate and refetch immediately
			await queryClient.invalidateQueries({
				queryKey: ['materialWords', normalizedMaterialId, userId],
				refetchType: 'active'
			})

			toast.success(t('word_added_success') || 'Mot ajouté au dictionnaire')
			// Close modal after successful add
			handleClose()
		},
		onError: (error) => {
			if (error.message === 'duplicate_translation') {
				toast.error(t('duplicate_translation') || 'Ce mot existe déjà dans votre dictionnaire')
			} else {
				toast.error(t('unexpected_error') || "Erreur lors de l'ajout du mot")
			}
		},
	})

	// Close handler
	const handleClose = () => {
		closeTranslation()
		cleanTranslation()
	}

	// Click outside to close
	useClickOutside(ref, handleClose)

	// Add word to dictionary (handles both click on translation and custom form)
	const handleAddWord = (translatedWord) => {
		const originalWord = getOriginalWord(translation)

		// For logged-in users, use React Query mutation
		if (isUserLoggedIn) {
			addWordMutation.mutate({
				originalWord,
				translatedWord,
				userId,
				materialId,
				word_sentence,
				userLearningLanguage,
				locale: spokenLanguage,
			})
			// Modal will close in onSuccess callback
		} else {
			// For guests, use localStorage with utility function
			const wordData = buildWordData(originalWord, translatedWord, userLearningLanguage, spokenLanguage)
			wordData.word_sentence = word_sentence || ''
			wordData.material_id = materialId
			wordData.word_lang = userLearningLanguage

			const result = addGuestWord(wordData)

			if (result.success) {
				toast.success(t('word_added_success') || 'Mot ajouté au dictionnaire')

				// Emit event to notify other components
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new CustomEvent('guestDictionaryUpdated'))
				}
			} else if (result.error === 'limit_reached') {
				return // Handled in UI
			} else if (result.error === 'duplicate') {
				toast.error(t('duplicate_translation') || 'Ce mot existe déjà dans votre dictionnaire')
			} else {
				toast.error(t('unexpected_error') || "Erreur lors de l'ajout du mot")
			}

			// Close modal for guests (synchronous operation)
			handleClose()
		}
	}

	// Handle click on translation suggestion
	const handleTranslationClick = (e) => {
		e.preventDefault()
		const translatedWord = e.target.textContent
		if (translatedWord) {
			handleAddWord(translatedWord)
		}
	}

	// Handle custom translation form submit
	const handleCustomTranslationSubmit = (translatedWord) => {
		handleAddWord(translatedWord)
	}

	// Don't render if not open or still loading
	if (!isTranslationOpen || translation_loading) {
		return null
	}

	// Determine UI states
	const hasDictionaryLimit = !isUserLoggedIn && guestWordsCount >= GUEST_DICTIONARY_CONFIG.MAX_WORDS
	const isTranslationLimitError = translation_error?.includes('Limite de traductions atteinte')
	const hasTranslation = translation?.word && translation?.definitions && translation.definitions.length > 0


	return (
		<div
			className={cn(
				'fixed z-[1300]',
				'transition-opacity duration-200',
				isTranslationOpen ? 'opacity-100' : 'opacity-0'
			)}
			style={position}
		>
			<div
				ref={ref}
				className={cn(
					'w-[calc(100vw-40px)] sm:w-[380px] max-w-[380px] max-h-[500px]',
					'rounded-2xl overflow-hidden',
					'flex flex-col',
					'shadow-[0_20px_60px_rgba(0,0,0,0.3)]',
					isDark
						? 'bg-gradient-to-br from-slate-800/98 to-slate-900/98'
						: 'bg-gradient-to-br from-white to-slate-50'
				)}
			>
				{/* Header */}
				<TranslationHeader onClose={handleClose} />

				{/* Error state */}
				{translation_error ? (
					<TranslationError
						error={translation_error}
						word={translation?.word}
						isTranslationLimitError={isTranslationLimitError}
					/>
				) : hasTranslation ? (
					/* Translation display */
					<>
						<TranslationContent
							translation={translation}
							onTranslationClick={handleTranslationClick}
							disabled={hasDictionaryLimit}
						/>

						{/* Custom translation form (for all users if not at limit) */}
						{(isUserLoggedIn || !hasDictionaryLimit) && (
							<CustomTranslationForm onSubmit={handleCustomTranslationSubmit} />
						)}

						{/* Guest message (only if at limit) */}
						{!isUserLoggedIn && hasDictionaryLimit && (
							<GuestLimitMessage hasReachedLimit={true} />
						)}
					</>
				) : (
				/* No translation found - show message and allow custom translation */
				<>
					<div className="p-4 text-center">
						<p className={cn(
							'mb-4 text-sm',
							isDark ? 'text-slate-400' : 'text-slate-500'
						)}>
							{t('no_translation_found') || 'Aucune traduction trouvée'}
						</p>
					</div>

					{/* Custom translation form (for all users if not at limit) */}
					{(isUserLoggedIn || !hasDictionaryLimit) && (
						<CustomTranslationForm onSubmit={handleCustomTranslationSubmit} />
					)}

					{/* Guest message (only if at limit) */}
					{!isUserLoggedIn && hasDictionaryLimit && (
						<GuestLimitMessage hasReachedLimit={true} />
					)}
				</>
			)}
			</div>
		</div>
	)
}

export default Translation
