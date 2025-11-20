import { useTranslations, useLocale } from 'next-intl'
import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/context/translation'
import { useUserContext } from '@/context/user'
import { addWordAction } from '@/app/actions/words'
import { addGuestWord, GUEST_DICTIONARY_CONFIG } from '@/utils/guestDictionary'
import { buildWordData, getOriginalWord } from '@/utils/wordMapping'
import toast from '@/utils/toast'
import { Paper, Fade, useTheme, Box, Typography } from '@mui/material'
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
	const theme = useTheme()
	const isDark = theme.palette.mode === 'dark'

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

	const { isUserLoggedIn, userLearningLanguage } = useUserContext()

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
				locale,
			})
			// Modal will close in onSuccess callback
		} else {
			// For guests, use localStorage with utility function
			const wordData = buildWordData(originalWord, translatedWord, userLearningLanguage, locale)
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
	const hasTranslation = translation?.word && translation?.definitions

	return (
		<Fade in={isTranslationOpen}>
			<Paper
				ref={ref}
				elevation={8}
				sx={{
					position: 'fixed',
					...position,
					width: { xs: 'calc(100vw - 40px)', sm: '380px' },
					maxWidth: '380px',
					maxHeight: '500px',
					borderRadius: 4,
					overflow: 'hidden',
					overflowX: 'hidden',
					background: isDark
						? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
						: 'linear-gradient(135deg, #fdfbfb 0%, #f7f7f7 100%)',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
					zIndex: 1300,
					display: 'flex',
					flexDirection: 'column',
				}}>

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

						{/* Custom translation form (logged-in users only) */}
						{isUserLoggedIn && (
							<CustomTranslationForm onSubmit={handleCustomTranslationSubmit} />
						)}

						{/* Guest message (guests only) */}
						{!isUserLoggedIn && (
							<GuestLimitMessage hasReachedLimit={hasDictionaryLimit} />
						)}
					</>
				) : (
				/* No translation found - still show guest limit message if applicable */
				!isUserLoggedIn && hasDictionaryLimit && (
					<Box sx={{ p: 2 }}>
						<Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', textAlign: 'center' }}>
							Aucune traduction trouvée
						</Typography>
						<GuestLimitMessage hasReachedLimit={true} />
					</Box>
				)
			)}
			</Paper>
		</Fade>
	)
}

export default Translation
