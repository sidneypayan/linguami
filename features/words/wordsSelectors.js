import { createSelector } from '@reduxjs/toolkit'

// Sélecteur de base pour accéder au slice words
const selectWordsState = state => state.words

// Sélecteurs mémoïsés pour les mots
export const selectUserWords = createSelector(
	[selectWordsState],
	words => words.user_words
)

export const selectUserWordsLoading = createSelector(
	[selectWordsState],
	words => words.user_words_loading
)

export const selectUserWordsPending = createSelector(
	[selectWordsState],
	words => words.user_words_pending
)

export const selectUserMaterialWords = createSelector(
	[selectWordsState],
	words => words.user_material_words
)

export const selectUserMaterialWordsPending = createSelector(
	[selectWordsState],
	words => words.user_material_words_pending
)

// Sélecteurs pour la traduction
export const selectTranslation = createSelector(
	[selectWordsState],
	words => words.translation
)

export const selectTranslationLoading = createSelector(
	[selectWordsState],
	words => words.translation_loading
)

export const selectTranslationError = createSelector(
	[selectWordsState],
	words => words.translation_error
)

export const selectIsTranslationOpen = createSelector(
	[selectWordsState],
	words => words.isTranslationOpen
)

export const selectWordSentence = createSelector(
	[selectWordsState],
	words => words.word_sentence
)

// Sélecteur combiné pour toutes les données de traduction
export const selectTranslationData = createSelector(
	[
		selectTranslation,
		selectTranslationLoading,
		selectTranslationError,
		selectIsTranslationOpen,
		selectWordSentence,
	],
	(translation, loading, error, isOpen, sentence) => ({
		translation,
		translation_loading: loading,
		translation_error: error,
		isTranslationOpen: isOpen,
		word_sentence: sentence,
	})
)

// Sélecteur pour compter les mots de l'utilisateur
export const selectUserWordsCount = createSelector(
	[selectUserWords],
	userWords => userWords.length
)

// Sélecteur pour compter les mots d'un matériel
export const selectUserMaterialWordsCount = createSelector(
	[selectUserMaterialWords],
	userMaterialWords => userMaterialWords.length
)
